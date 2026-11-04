import { NextResponse } from "next/server";

const DEFAULT_BOT_TOKEN = "9160064521:AAGOrO4CoA_JwZHTlXK9QUU4JHeE5XeOdCw";

function hexFromBuffer(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(keyData: ArrayBuffer | Uint8Array, message: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
}

export async function POST(request: Request) {
  let body: { initData?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const initData = (body.initData ?? "").trim();
  if (!initData) {
    return NextResponse.json({ ok: false, error: "Missing initData" }, { status: 400 });
  }

  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  const userRaw = params.get("user");
  if (!receivedHash || !userRaw) {
    return NextResponse.json({ ok: false, error: "Incomplete Telegram initData" }, { status: 400 });
  }

  const pairs: string[] = [];
  params.forEach((value, key) => {
    if (key !== "hash") {
      pairs.push(`${key}=${value}`);
    }
  });
  pairs.sort();
  const dataCheckString = pairs.join("\n");

  const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
  const enc = new TextEncoder();
  const secretKey = await hmacSha256(enc.encode("WebAppData"), botToken);
  const signature = await hmacSha256(secretKey, dataCheckString);
  const computedHash = hexFromBuffer(signature);

  if (computedHash !== receivedHash.toLowerCase()) {
    return NextResponse.json({ ok: false, error: "Invalid Telegram signature" }, { status: 401 });
  }

  try {
    const tgUser = JSON.parse(userRaw) as {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      language_code?: string;
    };

    return NextResponse.json({
      ok: true,
      verified: true,
      user: {
        id: tgUser.id,
        first_name: tgUser.first_name ?? "",
        last_name: tgUser.last_name ?? "",
        username: tgUser.username ?? "",
        photo_url: tgUser.photo_url ?? "",
        language_code: tgUser.language_code ?? "en",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed user JSON" }, { status: 400 });
  }
}
