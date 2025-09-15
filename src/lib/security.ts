import { cookies } from "next/headers";

export function getRequestOrigin(req: Request): string | null {
  return (
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    null
  );
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // allow server-side or tools without origin
  try {
    const allowed = new URL(process.env.NEXT_PUBLIC_SITE_URL || origin);
    const incoming = new URL(origin);
    return allowed.host === incoming.host;
  } catch {
    return false;
  }
}

export function assertOriginAllowed(req: Request): void {
  const origin = getRequestOrigin(req);
  if (!isAllowedOrigin(origin)) {
    throw new Error("Origin not allowed");
  }
}

export async function getAuthToken(cookieName: string): Promise<string | undefined> {
  try {
    const store = await cookies();
    return store.get(cookieName)?.value;
  } catch {
    return undefined;
  }
}


