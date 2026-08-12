import type { App, AppIconConfig, Platform } from "@/types";

/**
 * Produk Tokono — lisensi digital & akun premium.
 * Format baris: [nama, harga IDR, stok, kategori, glyph, indeks warna brand]
 * Harga sudah dikonversi dari USDT (rate 16.500).
 */

const P: Record<string, { from: string; to: string }> = {
  chatgpt: { from: "#10a37f", to: "#0b6e55" },
  claude: { from: "#d97757", to: "#9c4a2f" },
  gemini: { from: "#4285f4", to: "#1a56c4" },
  google: { from: "#4285f4", to: "#1a56c4" },
  disney: { from: "#113ccf", to: "#0a1f6b" },
  netflix: { from: "#e50914", to: "#8f0a10" },
  spotify: { from: "#1db954", to: "#0e7a36" },
  nord: { from: "#2f8dff", to: "#1356a8" },
  surfshark: { from: "#38d1c1", to: "#1e7a72" },
  notion: { from: "#2b2b2b", to: "#111111" },
  cursor: { from: "#3d3d3d", to: "#171717" },
  robux: { from: "#e2231a", to: "#8f120c" },
  instagram: { from: "#c13584", to: "#7a2353" },
  tiktok: { from: "#222222", to: "#0c0c0c" },
  microsoft: { from: "#0078d4", to: "#004e8c" },
  youtube: { from: "#cc0000", to: "#800000" },
  gmail: { from: "#ea4335", to: "#a52a20" },
  linkedin: { from: "#0a66c2", to: "#06407a" },
  canva: { from: "#00c4cc", to: "#00787d" },
  elevenlabs: { from: "#3d3d3d", to: "#1a1a1a" },
  perplexity: { from: "#20808d", to: "#0f4a54" },
  figma: { from: "#7c4dff", to: "#4a2d99" },
  discord: { from: "#5865f2", to: "#333d99" },
  steam: { from: "#1b2838", to: "#0b1118" },
  paypal: { from: "#003087", to: "#001a4d" },
  prime: { from: "#00a8e1", to: "#00628a" },
  zoom: { from: "#0d5bff", to: "#07338f" },
  warp: { from: "#1a1d24", to: "#0a0c11" },
  lovable: { from: "#6d28d9", to: "#3b1474" },
  manus: { from: "#4f46e5", to: "#28218c" },
  runway: { from: "#4338ca", to: "#201a66" },
  n8n: { from: "#ea4b71", to: "#9c2545" },
  replit: { from: "#f26207", to: "#96400a" },
  railway: { from: "#7b3f00", to: "#4a2600" },
  supabase: { from: "#3ecf8e", to: "#1e7a52" },
  linear: { from: "#5e6ad2", to: "#333a7a" },
  posthog: { from: "#d9a03c", to: "#8a611c" },
  apple: { from: "#3a3a3a", to: "#1c1c1c" },
  crunchyroll: { from: "#f47521", to: "#9c4710" },
  paramount: { from: "#0064ff", to: "#003d99" },
  duolingo: { from: "#58cc02", to: "#2e7d00" },
  coursera: { from: "#0056d2", to: "#00306e" },
  camscanner: { from: "#00a5df", to: "#005f82" },
  grammarly: { from: "#15c39a", to: "#0b7d60" },
  quillbot: { from: "#7c3aed", to: "#4a1d94" },
  hotmail: { from: "#0078d4", to: "#004e8c" },
  outlook: { from: "#0078d4", to: "#004e8c" },
  grok: { from: "#1e1e1e", to: "#000000" },
  heygen: { from: "#7c3aed", to: "#48238a" },
  leonardo: { from: "#5b3f8c", to: "#33204f" },
  capcut: { from: "#1e1e1e", to: "#0a0a0a" },
  lovable2: { from: "#6d28d9", to: "#3b1474" },
};

const G: Record<string, string[]> = {
  ai: ["bot", "message-square", "sparkles", "cpu", "zap"],
  streaming: ["film", "tv", "play", "music-2", "video"],
  vpn: ["shield-check", "lock", "globe"],
  akun: ["mail", "at-sign", "key-round", "user"],
  sosial: ["heart", "thumb-up", "users"],
  developer: ["terminal", "code-2", "server", "database", "rocket"],
  kreatif: ["pen-tool", "camera", "layers", "video"],
  tools: ["zap", "box", "wifi", "monitor"],
  lisensi: ["gift", "credit-card", "key-round"],
  pendidikan: ["book-open", "sparkles"],
};

const C: Record<string, string> = {
  "AI & Chatbot": "ai",
  "Streaming": "streaming",
  "VPN & Keamanan": "vpn",
  "Akun & Email": "akun",
  "Sosial Media": "sosial",
  "Developer & Cloud": "developer",
  "Desain & Kreatif": "kreatif",
  "Produktivitas": "tools",
  "Lisensi & Kredit": "lisensi",
  "Pendidikan": "pendidikan",
};

type Row = [name: string, price: number, stock: number, cat: string, glyph?: string, color?: keyof typeof P | string];

const rows: Row[] = [
  // ── AI & Chatbot ─────────────────────────────────────────────
  ["ChatGPT Plus 1M (Vietnamese Trial) (NW)", 113850, 334, "AI & Chatbot", "bot", "chatgpt"],
  ["Chatgpt Plus 1M (NW) (UPI)", 66000, 0, "AI & Chatbot", "bot", "chatgpt"],
  ["ChatGPT Plus 1M -", 235950, 0, "AI & Chatbot", "bot", "chatgpt"],
  ["Claude 20x Max (NW)", 160875, 0, "AI & Chatbot", "sparkles", "claude"],
  ["Claude AI PRO", 128700, 0, "AI & Chatbot", "bot", "claude"],
  ["Claude Max 20x Plan 1m", 65175, 0, "AI & Chatbot", "zap", "claude"],
  ["Claude API 10M Tokens 24H", 45375, 0, "AI & Chatbot", "database", "claude"],
  ["Claude API 100M Tokens", 122925, 0, "AI & Chatbot", "database", "claude"],
  ["Gemini AI Pro 18m", 26400, 1659, "AI & Chatbot", "sparkles", "gemini"],
  ["Gemini 18M Links", 40425, 0, "AI & Chatbot", "link", "gemini"],
  ["Google AI Pro 12m", 278850, 23, "AI & Chatbot", "sparkles", "google"],
  ["Grok Super 3M", 172425, 0, "AI & Chatbot", "bot", "grok"],
  ["Grok Super 7D", 28050, 0, "AI & Chatbot", "bot", "grok"],
  ["Perplexity AI Pro 6-12M", 1136850, 0, "AI & Chatbot", "sparkles", "perplexity"],
  ["Perplexity Pro 8 Months", 1381050, 0, "AI & Chatbot", "sparkles", "perplexity"],
  ["Max Plan Basic", 41250, 0, "AI & Chatbot", "zap", "gemini"],
  ["Max Plan Standar", 44550, 0, "AI & Chatbot", "zap", "gemini"],
  ["ChatPRD 6-12M", 66000, 91, "AI & Chatbot", "message-square", "manus"],
  ["Cursor Pro 1M", 413325, 0, "AI & Chatbot", "code-2", "cursor"],
  ["Cursor Pro 6-12m", 1136850, 6, "AI & Chatbot", "code-2", "cursor"],
  ["Cursor Pro 6-12M", 1592250, 6, "AI & Chatbot", "code-2", "cursor"],
  ["Cursor Ultra 1M", 3764475, 0, "AI & Chatbot", "code-2", "cursor"],
  ["Lovable Lite 12m", 248325, 0, "AI & Chatbot", "rocket", "lovable"],
  ["Lovable Lite Pro 6-12M", 84150, 0, "AI & Chatbot", "rocket", "lovable"],
  ["Lovable Lite Pro 6-12M", 171600, 0, "AI & Chatbot", "rocket", "lovable"],
  ["Lovable Pro 6-12M", 750750, 36, "AI & Chatbot", "rocket", "lovable"],
  ["Lovable Pro 6-12M", 536250, 35, "AI & Chatbot", "rocket", "lovable"],
  ["Lovable Unlimited", 16500, 0, "AI & Chatbot", "rocket", "lovable"],
  ["Manus Pro 6-12M", 750750, 19, "AI & Chatbot", "bot", "manus"],
  ["Manus Pro 6-12M", 975975, 19, "AI & Chatbot", "bot", "manus"],
  ["Genie AI 30D", 107250, 0, "AI & Chatbot", "sparkles", "google"],
  ["Granola Business 6-12M", 66000, 99, "AI & Chatbot", "file-text", "notion"],
  ["Wispr Flow Pro 6-12M", 300300, 68, "AI & Chatbot", "zap", "elevenlabs"],
  ["Wispr Flow Pro 6-12M", 391050, 68, "AI & Chatbot", "zap", "elevenlabs"],
  ["Runway Pro 6-12M", 750750, 22, "AI & Chatbot", "video", "runway"],
  ["Runway Pro 12m", 938850, 22, "AI & Chatbot", "video", "runway"],
  ["Higgsfield Pro 6-12m", 1179750, 7, "AI & Chatbot", "video", "runway"],
  ["Higgsfield Pro 12m", 1533675, 8, "AI & Chatbot", "video", "runway"],
  ["Higgsfield Seedance 2.0 4K (NW)", 49500, 0, "AI & Chatbot", "video", "runway"],
  ["Higgsfield unlimited", 66000, 0, "AI & Chatbot", "video", "runway"],
  ["Leonardo AI 8500 Credits", 57750, 2, "AI & Chatbot", "camera", "leonardo"],
  ["Leonardo AI 8500 Credits 1 Month", 37950, 0, "AI & Chatbot", "camera", "leonardo"],
  ["ElevenLabs 131K Credits 1 Month", 144375, 0, "AI & Chatbot", "music-2", "elevenlabs"],
  ["ElevenLabs 131K Credits 30D", 171600, 0, "AI & Chatbot", "music-2", "elevenlabs"],
  ["ElevenLabs Creator 3m", 343200, 1, "AI & Chatbot", "music-2", "elevenlabs"],
  ["ElevenLabs Creator 6-12m", 858000, 15, "AI & Chatbot", "music-2", "elevenlabs"],
  ["ElevenLabs Creator 12m", 1115400, 15, "AI & Chatbot", "music-2", "elevenlabs"],
  ["Magic Patterns Starter 6-12M", 107250, 97, "AI & Chatbot", "sparkles", "lovable"],

  // ── Streaming ────────────────────────────────────────────────
  ["Disney Premium + Hulu Bundle", 107250, 365, "Streaming", "film", "disney"],
  ["Disney Premium 7 ESPN", 171600, 0, "Streaming", "film", "disney"],
  ["Link Disney Premium 7ESPN Nuplin", 321750, 517, "Streaming", "film", "disney"],
  ["Link Disney Standard", 163350, 195, "Streaming", "film", "disney"],
  ["Link Disney Standard Claro Br", 85800, 100, "Streaming", "film", "disney"],
  ["Netflix Premium 4K", 66000, 0, "Streaming", "tv", "netflix"],
  ["Netflix Premium 4K Profile 30D", 85800, 0, "Streaming", "tv", "netflix"],
  ["Spotify Premium 3-6M", 235950, 0, "Streaming", "music-2", "spotify"],
  ["Spotify Premium 3-6M NW", 139425, 0, "Streaming", "music-2", "spotify"],
  ["Spotify Premium 90D", 66000, 0, "Streaming", "music-2", "spotify"],
  ["Code Spotify Premium 3M", 41250, 105, "Streaming", "music-2", "spotify"],
  ["Prime Video 3-6M", 64350, 7, "Streaming", "play", "prime"],
  ["Prime Video 30D", 30525, 0, "Streaming", "play", "prime"],
  ["Link Prime Video", 49500, 0, "Streaming", "play", "prime"],
  ["Crunchyroll Mega Fan", 28050, 0, "Streaming", "play", "crunchyroll"],
  ["Link Crunchyroll Plan FAN", 57750, 0, "Streaming", "play", "crunchyroll"],
  ["Link Apple Tv", 49500, 0, "Streaming", "tv", "apple"],
  ["Paramount Plan Premium Prov CC", 85800, 0, "Streaming", "tv", "paramount"],
  ["Youtube Premium 30D", 39600, 2, "Streaming", "play", "youtube"],
  ["YouTube Premium 6-12M", 536250, 0, "Streaming", "play", "youtube"],
  ["Youtube Premium 3M Link", 58575, 0, "Streaming", "play", "youtube"],
  ["Link Youtube Premium 3M", 48675, 0, "Streaming", "play", "youtube"],

  // ── VPN & Keamanan ───────────────────────────────────────────
  ["Nord VPN 3m", 47850, 147, "VPN & Keamanan", "shield-check", "nord"],
  ["Nord Vpn 3M Link", 58575, 0, "VPN & Keamanan", "shield-check", "nord"],
  ["Link Nord VPN Basic 3M", 75075, 0, "VPN & Keamanan", "shield-check", "nord"],
  ["Surfshark Vpn 2M Code", 41250, 361, "VPN & Keamanan", "shield-check", "surfshark"],
  ["SurfShark Vpn 2M Coupon", 59400, 0, "VPN & Keamanan", "shield-check", "surfshark"],
  ["VPN Surfshark 60D", 64350, 9, "VPN & Keamanan", "shield-check", "surfshark"],
  ["VPN Surfshark 7D", 23100, 0, "VPN & Keamanan", "shield-check", "surfshark"],
  ["Warp Build 6-12M", 150150, 46, "VPN & Keamanan", "zap", "warp"],
  ["Warp Build 12m", 195525, 47, "VPN & Keamanan", "zap", "warp"],

  // ── Akun & Email ─────────────────────────────────────────────
  ["Gmail Account", 42900, 0, "Akun & Email", "mail", "gmail"],
  ["Google Email Account", 21450, 0, "Akun & Email", "mail", "gmail"],
  ["Gmail US 2006-2012 + OTP", 50325, 0, "Akun & Email", "mail", "gmail"],
  ["Gmail Random Ip Trial Youtube", 42075, 0, "Akun & Email", "mail", "gmail"],
  ["Hotmail Outlook", 18150, 256, "Akun & Email", "mail", "hotmail"],
  ["Outlook Readymade Email", 17325, 0, "Akun & Email", "mail", "outlook"],
  ["Microsoft 365 Family 6-12M", 669900, 0, "Akun & Email", "monitor", "microsoft"],
  ["Microsoft 365 Personal 6-12M", 41250, 71, "Akun & Email", "monitor", "microsoft"],
  ["Microsoft Azura 6-12M", 212850, 1, "Akun & Email", "cloud", "microsoft"],
  ["Microsoft Office Professional Plus 2021 KEY", 49500, 0, "Akun & Email", "key-round", "microsoft"],
  ["Paypal Account Verfied", 33000, 0, "Akun & Email", "credit-card", "paypal"],
  ["Steam Account", 57750, 999, "Akun & Email", "gamepad", "steam"],
  ["Linkedin 2M New User", 52800, 32, "Akun & Email", "briefcase", "linkedin"],
  ["Linkedin Career 2M New User", 57750, 17, "Akun & Email", "briefcase", "linkedin"],
  ["Linkedin Career 2m", 70125, 0, "Akun & Email", "briefcase", "linkedin"],
  ["Linkedin Career 3m", 44550, 0, "Akun & Email", "briefcase", "linkedin"],
  ["Linkedin Career 6m", 1287000, 0, "Akun & Email", "briefcase", "linkedin"],
  ["Linkedin Career Premium 6-12M", 471900, 0, "Akun & Email", "briefcase", "linkedin"],
  ["Linkedin Sales Navigator 2M New User", 57750, 13, "Akun & Email", "briefcase", "linkedin"],
  ["Sales Navigator 1m Old User", 321750, 0, "Akun & Email", "briefcase", "linkedin"],
  ["Sales Navigator Core 1m", 471900, 0, "Akun & Email", "briefcase", "linkedin"],
  ["Linkedin Business Premium 6-12M", 729300, 0, "Akun & Email", "briefcase", "linkedin"],
  ["Linkedin Business Redeem Link 12m", 1394250, 0, "Akun & Email", "briefcase", "linkedin"],
  ["Career 3-6m Any User", 1072500, 0, "Akun & Email", "briefcase", "linkedin"],

  // ── Sosial Media ─────────────────────────────────────────────
  ["Social Instagram - 1K Followers HQ", 66000, 996, "Sosial Media", "heart", "instagram"],
  ["Social Instagram - 5K Followers HQ", 107250, 998, "Sosial Media", "heart", "instagram"],
  ["Social Instagram - 10K Followers HQ", 193050, 999, "Sosial Media", "heart", "instagram"],
  ["Social Instagram - 20K Followers HQ", 343200, 999, "Sosial Media", "heart", "instagram"],
  ["Social Instagram - 50K Followers HQ", 750750, 999, "Sosial Media", "heart", "instagram"],
  ["Social Instagram - 100K Followers HQ", 1394250, 999, "Sosial Media", "heart", "instagram"],
  ["Social Instagram - 5K Likes", 49500, 999, "Sosial Media", "thumb-up", "instagram"],
  ["Social Instagram - 10K Likes", 66000, 999, "Sosial Media", "thumb-up", "instagram"],
  ["Social Instagram - 100K Likes", 321750, 999, "Sosial Media", "thumb-up", "instagram"],
  ["Social Instagram - 100K Views", 49500, 999, "Sosial Media", "eye", "instagram"],
  ["Social TikTok - 1K Followers", 171600, 999, "Sosial Media", "heart", "tiktok"],
  ["Social TikTok - 2K Followers", 321750, 999, "Sosial Media", "heart", "tiktok"],
  ["Social TikTok - 5K Followers", 750750, 999, "Sosial Media", "heart", "tiktok"],
  ["Social TikTok - 1K Likes", 49500, 999, "Sosial Media", "thumb-up", "tiktok"],
  ["Social TikTok - 5K Likes", 171600, 999, "Sosial Media", "thumb-up", "tiktok"],
  ["Social TikTok - 10K Likes", 321750, 999, "Sosial Media", "thumb-up", "tiktok"],
  ["Social TikTok - 10K Views", 49500, 999, "Sosial Media", "eye", "tiktok"],
  ["Social TikTok - 100K Views", 321750, 999, "Sosial Media", "eye", "tiktok"],

  // ── Developer & Cloud ────────────────────────────────────────
  ["N8N Starter 6-12M", 257400, 36, "Developer & Cloud", "workflow", "n8n"],
  ["N8N Starter 6-12M", 334950, 36, "Developer & Cloud", "workflow", "n8n"],
  ["Replit Core 6-12M", 300300, 51, "Developer & Cloud", "code-2", "replit"],
  ["Replit Core 6-12M", 391050, 51, "Developer & Cloud", "code-2", "replit"],
  ["Railway Hobby 6-12M", 171600, 75, "Developer & Cloud", "server", "railway"],
  ["Supabase Pro", 600600, 17, "Developer & Cloud", "database", "supabase"],
  ["Supabase Pro 6-12M", 948750, 0, "Developer & Cloud", "database", "supabase"],
  ["Linear Business 6-12M", 321750, 5, "Developer & Cloud", "workflow", "linear"],
  ["PostHog Scale 6-12M", 321750, 67, "Developer & Cloud", "server", "posthog"],
  ["Factory 6-12m", 321750, 0, "Developer & Cloud", "workflow", "linear"],
  ["Factory 12m", 418275, 0, "Developer & Cloud", "workflow", "linear"],
  ["Factory Pro 6-12M", 530475, 0, "Developer & Cloud", "workflow", "linear"],
  ["Mobbin 10x Seat 6-12M", 150150, 66, "Developer & Cloud", "layers", "figma"],
  ["Jam Team 10 Seat 6-12M", 429000, 21, "Developer & Cloud", "message-square", "linear"],
  ["Gumloop Pro 6-12M", 85800, 59, "Developer & Cloud", "workflow", "linear"],
  ["Gumloop Pro 6-12M", 112200, 59, "Developer & Cloud", "workflow", "linear"],
  ["Supercut Pro 10 Seat 6-12M", 214500, 30, "Developer & Cloud", "video", "runway"],

  // ── Desain & Kreatif ─────────────────────────────────────────
  ["Figma Pro (Edu) 6-12M", 128700, 0, "Desain & Kreatif", "pen-tool", "figma"],
  ["Framer Pro 6-12M", 107250, 34, "Desain & Kreatif", "layers", "figma"],
  ["Framer Pro 6-12M", 139425, 34, "Desain & Kreatif", "layers", "figma"],
  ["Gamma Pro 6-12M", 536250, 44, "Desain & Kreatif", "layers", "figma"],
  ["Gamma Pro 6-12M", 697125, 44, "Desain & Kreatif", "layers", "figma"],
  ["Canva Business 6-12m", 643500, 0, "Desain & Kreatif", "pen-tool", "canva"],
  ["Capcut Pro Family 7 Seats 30D", 235950, 1, "Desain & Kreatif", "video", "capcut"],
  ["Method Capcut Team Pro", 858000, 1, "Desain & Kreatif", "video", "capcut"],
  ["Heygen Creator 1M", 214500, 1, "Desain & Kreatif", "video", "heygen"],
  ["HeyGen Pro 3m", 28050, 0, "Desain & Kreatif", "video", "heygen"],
  ["Code Heygen Creator 3M", 24750, 0, "Desain & Kreatif", "video", "heygen"],
  ["Method Generator Heygen codes 3M", 1072500, 0, "Desain & Kreatif", "video", "heygen"],

  // ── Produktivitas ────────────────────────────────────────────
  ["Notion Business 3M code", 57750, 7, "Produktivitas", "file-text", "notion"],
  ["Notion Business 3m", 33000, 0, "Produktivitas", "file-text", "notion"],
  ["Notion Business 3-6M", 41250, 0, "Produktivitas", "file-text", "notion"],
  ["Notion Business 6-12M", 257400, 15, "Produktivitas", "file-text", "notion"],
  ["Notion Business 6-12M", 334950, 16, "Produktivitas", "file-text", "notion"],
  ["Method Notion Bussines 6M", 643500, 0, "Produktivitas", "file-text", "notion"],
  ["QuillBot Premium 1m", 32175, 13, "Produktivitas", "sparkles", "quillbot"],
  ["Zoom Pro 14 Days", 48675, 0, "Produktivitas", "video", "zoom"],
  ["CamScanner Edu 1 Month", 8250, 0, "Produktivitas", "camera", "camscanner"],
  ["Global eSIM Card 30D Unlimited", 321750, 0, "Produktivitas", "wifi", "warp"],
  ["Links Shop de Ccs", 429000, 7, "Produktivitas", "link", "linear"],

  // ── Lisensi & Kredit ─────────────────────────────────────────
  ["1,000 Robux GiftCard", 343200, 116, "Lisensi & Kredit", "gift", "robux"],
  ["2,000 Robux GiftCard", 643500, 3, "Lisensi & Kredit", "gift", "robux"],
  ["4,500 Robux GiftCard", 1287000, 6, "Lisensi & Kredit", "gift", "robux"],
  ["Nitro Discord 3M Code", 41250, 8, "Lisensi & Kredit", "gift", "discord"],
  ["API 10M Token Claude 1D", 48675, 0, "Lisensi & Kredit", "database", "claude"],
  ["API 50M Token Claude 1D", 69300, 0, "Lisensi & Kredit", "database", "claude"],
  ["API 100M Token Claude 1D", 151800, 0, "Lisensi & Kredit", "database", "claude"],
  ["API 10M Token Codex 1 Day", 44550, 0, "Lisensi & Kredit", "database", "cursor"],
  ["API 50M Token Codex 1D", 67650, 0, "Lisensi & Kredit", "database", "cursor"],
  ["API 100M Token Codex 1D", 94050, 0, "Lisensi & Kredit", "database", "cursor"],
  ["API 200M Token Codex 7D", 128700, 0, "Lisensi & Kredit", "database", "cursor"],
  ["API 300M Token Codex 15D", 173250, 0, "Lisensi & Kredit", "database", "cursor"],
  ["API 500M Token Codex 30D", 405075, 0, "Lisensi & Kredit", "database", "cursor"],
  ["Link Claude AI PRO", 49500, 0, "Lisensi & Kredit", "link", "claude"],

  // ── Pendidikan ───────────────────────────────────────────────
  ["Coursera Premium 6-12m", 31350, 700, "Pendidikan", "book-open", "coursera"],
  ["Coursera Premium 6-12M", 43725, 703, "Pendidikan", "book-open", "coursera"],
  ["Coursera Premium On Personal Mail", 46200, 0, "Pendidikan", "book-open", "coursera"],
  ["Super Duolingo 30D", 18150, 298, "Pendidikan", "book-open", "duolingo"],
];

// ── Builder: ubah baris → App lengkap ──────────────────────────

const slugMap = new Map<string, number>();

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const n = slugMap.get(base) ?? 0;
  slugMap.set(base, n + 1);
  return n === 0 ? base : `${base}-${n + 1}`;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function duration(name: string): string {
  const m = name.match(/(\d+(?:\.\d+)?)\s*([dDmM])/);
  if (!m) return "masa aktif sesuai paket";
  const n = m[1];
  if (m[2].toLowerCase() === "d") return `${n} hari`;
  return `${n} bulan`;
}

function descFor(cat: string, name: string): string {
  const dur = duration(name);
  const intro =
    cat === "AI & Chatbot"
      ? `Akses penuh ${name} dengan masa aktif ${dur}.`
      : cat === "Streaming"
        ? `Langganan streaming ${name} dengan masa aktif ${dur}.`
        : cat === "VPN & Keamanan"
          ? `Layanan VPN ${name} dengan masa aktif ${dur}.`
          : cat === "Akun & Email"
            ? `Akun ${name} siap pakai.`
            : cat === "Sosial Media"
              ? `Layanan peningkatan ${name.toLowerCase()}.`
              : cat === "Desain & Kreatif"
                ? `Lisensi ${name} untuk kebutuhan kreatif.`
                : `Lisensi premium ${name} dengan masa aktif ${dur}.`;
  return `${intro} Dikirim otomatis ke email Anda setelah pembayaran terverifikasi — biasanya 1–30 menit. Didukung bantuan penggantian selama masa aktif jika ada kendala.`;
}

function featuresFor(cat: string): string[] {
  const base = [
    "Dikirim otomatis setelah pembayaran (1–30 menit)",
    "Garansi penggantian selama masa aktif",
    "Bantuan cepat via chat",
    "Harga terbaik di kelasnya",
  ];
  switch (cat) {
    case "Streaming":
      return ["Akses konten penuh sesuai paket", "Bisa dipakai di perangkat pendukung", ...base.slice(0, 2)];
    case "AI & Chatbot":
      return ["Akses penuh fitur premium AI", "Pembaruan mengikuti akun asli", ...base.slice(0, 2)];
    case "VPN & Keamanan":
      return ["Enkripsi koneksi penuh", "Server di berbagai negara", ...base.slice(0, 2)];
    case "Sosial Media":
      return ["Proses pengerjaan bertahap & aman", "Kualitas follower/like HQ", ...base.slice(0, 2)];
    default:
      return base;
  }
}

function screenshotFor(cat: string): App["screenshots"] {
  const map: Record<string, App["screenshots"]> = {
    "AI & Chatbot": ["dashboard", "form"],
    Streaming: ["mobile", "grid"],
    "VPN & Keamanan": ["form", "dashboard"],
    "Akun & Email": ["mobile", "form"],
    "Sosial Media": ["grid", "analytics"],
    "Developer & Cloud": ["terminal", "dashboard"],
    "Desain & Kreatif": ["editor", "grid"],
    Produktivitas: ["dashboard", "grid"],
    "Lisensi & Kredit": ["form", "mobile"],
    Pendidikan: ["analytics", "mobile"],
  };
  return map[cat] ?? ["dashboard", "form"];
}

const featuredNames = [
  "ChatGPT Plus 1M (Vietnamese Trial) (NW)",
  "Disney Premium + Hulu Bundle",
  "Gemini AI Pro 18m",
  "Nord VPN 3m",
  "Instagram - 1K Followers HQ",
  "Spotify Premium 90D",
  "Notion Business 6-12M",
  "Steam Account",
];

const newNames = [
  "Lovable Pro 6-12M",
  "Manus Pro 6-12M",
  "Supabase Pro",
  "Warp Build 12m",
  "Wispr Flow Pro 6-12M",
];

/**
 * Peringkat popularitas — produk paling laris di urutan teratas.
 * Pola dicocokkan ke nama produk; urutan daftar = urutan tampil.
 * Edit daftar ini untuk mengubah produk yang tampil paling atas.
 */
export const popularRank = [
  "ChatGPT Plus",
  "Gemini AI Pro",
  "Spotify Premium",
  "Disney Premium + Hulu",
  "Netflix Premium",
  "Nord VPN",
  "Surfshark",
  "Coursera Premium",
  "Super Duolingo",
  "Notion Business",
  "Canva Business",
  "Steam Account",
  "1,000 Robux",
  "YouTube Premium",
  "Instagram - 1K Followers HQ",
  "Instagram - 10K Followers HQ",
  "TikTok - 1K Followers",
  "TikTok - 10K Followers",
  "Warp Build",
  "Cursor Pro",
  "Microsoft 365 Personal",
  "Replit Core",
  "N8N Starter",
  "Railway",
  "Supabase",
  "Linear Business",
  "PostHog",
  "Linkedin Career 2M",
  "Hotmail Outlook",
  "Zoom Pro",
];

export function popularityOf(name: string): number {
  const idx = popularRank.findIndex((p) => name.startsWith(p) || name.includes(p));
  return idx === -1 ? popularRank.length : idx;
}

/** Map nama produk → file logo di /public/logos. */
function brandLogo(name: string): string {
  const l = name.toLowerCase();
  const has = (...parts: string[]) => parts.some((p) => l.includes(p));
  if (has("chatgpt", "codex")) return "chatgpt.png";
  if (has("claude", "anthropic")) return "claude.svg";
  if (has("gemini", "max plan", "genie")) return "gemini.svg";
  if (has("google ai", "google email")) return "google.svg";
  if (has("grok")) return "grok.svg";
  if (has("perplexity")) return "perplexity.svg";
  if (has("cursor")) return "cursor.svg";
  if (has("lovable")) return "lovable.png";
  if (has("manus")) return "manus.png";
  if (has("runway")) return "runway.png";
  if (has("higgsfield")) return "higgsfield.png";
  if (has("elevenlabs")) return "elevenlabs.svg";
  if (has("leonardo")) return "leonardo.png";
  if (has("gamma")) return "gamma.png";
  if (has("granola")) return "granola.png";
  if (has("wispr")) return "wispr.png";
  if (has("chatprd")) return "chatprd.png";
  if (has("n8n")) return "n8n.svg";
  if (has("disney")) return "disney.ico";
  if (has("netflix")) return "netflix.svg";
  if (has("spotify")) return "spotify.svg";
  if (has("prime video")) return "prime.ico";
  if (has("crunchyroll")) return "crunchyroll.svg";
  if (has("apple tv")) return "apple.svg";
  if (has("paramount")) return "paramount.svg";
  if (has("youtube")) return "youtube.svg";
  if (has("capcut")) return "capcut.png";
  if (has("nord")) return "nord.svg";
  if (has("surfshark")) return "surfshark.svg";
  if (has("warp")) return "warp.svg";
  if (has("gmail")) return "gmail.svg";
  if (has("hotmail", "outlook")) return "outlook.ico";
  if (has("microsoft 365", "microsoft azura", "microsoft office")) return "microsoft.ico";
  if (has("paypal")) return "paypal.svg";
  if (has("steam")) return "steam.svg";
  if (has("linkedin", "sales navigator", "career", "business premium")) return "linkedin.ico";
  if (has("instagram")) return "instagram.svg";
  if (has("tiktok")) return "tiktok.svg";
  if (has("notion")) return "notion.svg";
  if (has("quillbot")) return "quillbot.ico";
  if (has("zoom")) return "zoom.svg";
  if (has("camscanner")) return "camscanner.png";
  if (has("coursera")) return "coursera.svg";
  if (has("duolingo")) return "duolingo.svg";
  if (has("canva")) return "canva.png";
  if (has("figma")) return "figma.svg";
  if (has("framer")) return "framer.svg";
  if (has("robux")) return "roblox.svg";
  if (has("discord")) return "discord.svg";
  if (has("heygen")) return "heygen.png";
  if (has("replit")) return "replit.svg";
  if (has("railway")) return "railway.svg";
  if (has("supabase")) return "supabase.svg";
  if (has("linear")) return "linear.svg";
  if (has("posthog")) return "posthog.svg";
  if (has("factory")) return "factory.png";
  if (has("mobbin")) return "mobbin.png";
  if (has("jam team")) return "jam.png";
  if (has("gumloop")) return "gumloop.png";
  if (has("supercut")) return "supercut.png";
  if (has("magic patterns")) return "magicpatterns.ico";
  if (has("links shop")) return "links.svg";
  if (has("esim")) return "esim.ico";
  return "links.svg";
}

/**
 * Tier diskon harga — semua produk wajib turun:
 *   murah/wajar      → -20%
 *   agak mahal       → -30%
 *   jelas kemahalan  → -50%
 * Default berdasar harga; override untuk produk yang sudah terlanjur murah (Notion, Steam)
 * atau yang butuh potongan lebih besar (Zoom).
 */
export function discountTier(price: number, name: string): number {
  if (/notion|steam account/i.test(name)) return 0.8;
  if (/zoom/i.test(name)) return 0.7;
  if (price <= 50000) return 0.8;
  if (price <= 250000) return 0.7;
  return 0.5;
}

/** Potongan tambahan global — semua produk dikurangi lagi 15%. */
export const EXTRA_DISCOUNT = 0.85;

export const apps: App[] = rows.map(([name, price, stock, catName, glyph, colorKey]) => {
  const catId = C[catName];
  // Seed menyertakan harga agar varian bernama sama (beda harga) punya popularitas berbeda,
  // sehingga tidak tampil berdampingan seperti produk ganda.
  const seed = hashStr(name + price);
  const finalPrice = Math.round((price * discountTier(price, name) * EXTRA_DISCOUNT) / 1000) * 1000;
  const slug = slugify(name);
  const color = (colorKey && P[colorKey]) || pick(Object.values(P), seed);
  const glyphKey = glyph ?? pick(G[catId] ?? G.tools, seed);
  const icon: AppIconConfig = { from: color.from, to: color.to, glyph: glyphKey, logo: brandLogo(name) };

  const mobileBrands = /chatgpt|claude|gemini|spotify|netflix|disney|youtube|nord|surfshark|duolingo|coursera|canva|tiktok|instagram/i;
  const platforms: Platform[] = ["Web"];
  if (mobileBrands.test(name)) platforms.push("Android", "iOS");

  const isFeatured = featuredNames.some((f) => name.startsWith(f)) || featuredNames.includes(name);
  const isNew = newNames.some((f) => name.startsWith(f));

  return {
    id: slug,
    slug,
    name,
    tagline: catName,
    description: descFor(catId, name),
    developerId: "tokono-store",
    categoryId: catId,
    price: finalPrice,
    stock,
    rating: 3.9 + (seed % 11) / 10,
    ratingCount: 100 + (seed % 2400),
    downloads: 5000 + (seed % 90000),
    platforms,
    icon,
    screenshots: screenshotFor(catId),
    version: `${1 + (seed % 3)}.${seed % 9}.0`,
    releasedAt: `202${5 + (seed % 2)}-0${1 + (seed % 9)}-1${seed % 9}`,
    updatedAt: `2026-0${1 + (seed % 8)}-${1 + (seed % 27)}`,
    features: featuresFor(catId),
    requirements: {
      Web: `Akses via web setelah dikirim ke email. Masa aktif ${duration(name)}.`,
    },
    isFeatured,
    isNew,
  } satisfies App;
});
