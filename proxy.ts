import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, sessionCookieName } from "@/lib/pereman-auth";

/**
 * Penjaga area admin (/pereman): setiap request tanpa sesi valid
 * diarahkan ke halaman masuk. Validasi berjalan di server (proxy),
 * bukan hanya di client — browser tidak bisa mem-bypass.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Halaman masuk & API login bebas diakses.
  if (pathname === "/pereman/masuk" || pathname.startsWith("/api/pereman")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/pereman")) {
    const token = request.cookies.get(sessionCookieName())?.value;
    if (!verifySession(token)) {
      const url = new URL("/pereman/masuk", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pereman/:path*", "/pereman"],
};