import { createHmac, timingSafeEqual } from "node:crypto";

/** Verifikasi credential admin (server-only). */
export function verifyCredentials(user: string, pass: string): boolean {
  const u = process.env.PEREMAN_USER ?? "";
  const p = process.env.PEREMAN_PASS ?? "";
  if (!u || !p) return false;
  return safeEqual(user, u) && safeEqual(pass, p);
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "tokono-compare").update(a).digest();
  const hb = createHmac("sha256", "tokono-compare").update(b).digest();
  return timingSafeEqual(ha, hb) && a.length === b.length;
}

const COOKIE_NAME = "pereman_session";

function secret(): string {
  return process.env.PEREMAN_SECRET ?? "default-secret-ganti-di-env";
}

/** Token sesi: payload.signature (HMAC-SHA256). */
export function signSession(): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: "pereman-admin", iat: Date.now() }),
  ).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function sessionCookieName(): string {
  return COOKIE_NAME;
}
