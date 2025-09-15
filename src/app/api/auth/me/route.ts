import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, graphqlEndpoint } from "@/lib/auth";

const ME_QUERY = `
  query Me {
    me { id email }
  }
`;

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: ME_QUERY }),
  }).then((r) => r.json());

  const me = res?.data?.me;
  if (!me) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, user: me });
}
