/**
 * Autentikasi admin (/pereman) — Web Crypto API murni.
 * Berjalan di Edge/Workers (tanpa node:crypto maupun Buffer).
 */

const COOKIE_NAME = "pereman_session";

function secret(): string {
  return process.env.PEREMAN_SECRET ?? "default-secret-ganti-di-env";
}

const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function utf8ToBase64Url(str: string): string {
  return bytesToBase64Url(encoder.encode(str));
}

async function hmac(data: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return bytesToBase64Url(new Uint8Array(sig));
}

/** Verifikasi credential admin (server-only). */
export async function verifyCredentials(user: string, pass: string): Promise<boolean> {
  const u = process.env.PEREMAN_USER ?? "";
  const p = process.env.PEREMAN_PASS ?? "";
  if (!u || !p) return false;
  const [hu, hpu] = await Promise.all([hmac(user, "tokono-compare"), hmac(u, "tokono-compare")]);
  const [hp, hpp] = await Promise.all([hmac(pass, "tokono-compare"), hmac(p, "tokono-compare")]);
  return hu === hpu && hp === hpp && user.length === u.length && pass.length === p.length;
}

/** Token sesi: payload.signature (HMAC-SHA256). */
export async function signSession(): Promise<string> {
  const payload = utf8ToBase64Url(
    JSON.stringify({ sub: "pereman-admin", iat: Date.now() }),
  );
  const sig = await hmac(payload, secret());
  return `${payload}.${sig}`;
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(payload, secret());
  return expected === sig;
}

export function sessionCookieName(): string {
  return COOKIE_NAME;
}
