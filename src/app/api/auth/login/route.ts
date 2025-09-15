import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, graphqlEndpoint, isValidEmail } from "@/lib/auth";
import { assertOriginAllowed } from "@/lib/security";
import { MUTATION_LOGIN } from "@/graphql/mutations";

const LOGIN_MUTATION = MUTATION_LOGIN;

export async function POST(req: Request) {
  try {
    assertOriginAllowed(req);
  } catch {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 400 });
  }
  const { email, password } = await req.json().catch(() => ({}));
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 5) {
    return NextResponse.json(
      { error: "Password must be at least 5 chars" },
      { status: 400 }
    );
  }

  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: { email, password },
    }),
  }).then((r) => r.json());

  const token = res?.data?.tokenCreate?.token as string | undefined;
  const err = res?.data?.tokenCreate?.errors?.[0]?.message as
    | string
    | undefined;
  if (!token) {
    return NextResponse.json({ error: err || "Login failed" }, { status: 401 });
  }

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
