import { NextResponse } from "next/server";
import { verifySession, sessionCookieName } from "@/lib/pereman-auth";

/** Verifikasi sesi admin di sisi server (dipanggil dari guard client). */
export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${sessionCookieName()}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const ok = await verifySession(token);
  return NextResponse.json({ ok });
}
