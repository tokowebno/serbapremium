import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host") || request.nextUrl.host;

  // Jika diakses via HTTP di domain live (bukan localhost), redirect 301 permanen ke HTTPS
  if (proto === "http" && !host.includes("localhost") && !host.includes("127.0.0.1") && !host.includes("192.168.")) {
    const httpsUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${host}`);
    return NextResponse.redirect(httpsUrl, 301);
  }

  const response = NextResponse.next();
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon.png).*)",
  ],
};
