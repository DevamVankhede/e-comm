import { NextResponse, NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.toLowerCase() === "/cart") {
    const isAuthenticated = Boolean(req.cookies.get(AUTH_COOKIE_NAME)?.value);
    if (!isAuthenticated) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/Login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
}

export const config = {
  matcher: ["/((?!_next|.*.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)"],
};
