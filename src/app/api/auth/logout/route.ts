import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { assertOriginAllowed } from "@/lib/security";

export async function POST(req: Request) {
  try { assertOriginAllowed(req); } catch { return NextResponse.json({ error: "Origin not allowed" }, { status: 400 }); }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
