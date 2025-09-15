import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  graphqlEndpoint,
  isStrongPassword,
  isValidEmail,
} from "@/lib/auth";
import { assertOriginAllowed } from "@/lib/security";
import { MUTATION_LOGIN, MUTATION_REGISTER } from "@/graphql/mutations";

const REGISTER_MUTATION = MUTATION_REGISTER;
const LOGIN_MUTATION = MUTATION_LOGIN;

export async function POST(req: Request) {
  try {
    assertOriginAllowed(req);
  } catch {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 400 });
  }
  const { email, password } = await req.json().catch(() => ({}));
  const origin =
    req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";
  const redirectUrl = origin ? `${origin}` : "https://saleor.kombee.co.in/";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!isStrongPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 5 chars" },
      { status: 400 }
    );
  }

  const reg = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: REGISTER_MUTATION,
      variables: {
        input: { email, password, channel: "online-inr", redirectUrl },
      },
    }),
  }).then((r) => r.json());

  const regErr = reg?.data?.accountRegister?.errors?.[0]?.message as
    | string
    | undefined;
  // Note: requiresConfirmation is ignored for this demo; we attempt login immediately
  if (regErr) return NextResponse.json({ error: regErr }, { status: 400 });

  // For this demo, proceed to tokenCreate even if confirmation is indicated

  const login = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: { email, password },
    }),
  }).then((r) => r.json());

  const token = login?.data?.tokenCreate?.token as string | undefined;
  const loginErr = login?.data?.tokenCreate?.errors?.[0]?.message as
    | string
    | undefined;
  if (!token)
    return NextResponse.json(
      { error: loginErr || "Signup failed" },
      { status: 400 }
    );

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
