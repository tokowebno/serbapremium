export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatRupiah(n: number): string {
  return `Rp${n.toLocaleString("id-ID")}`;
}

// Kurs USDT/IDR real-time resmi (1 USDT ≈ Rp 17.904)
export const USDT_RATE = 17904;

export function formatPrice(n: number, lang: string = "en"): string {
  if (lang === "en" || lang === "zh") {
    const usd = n / USDT_RATE;
    return `$${usd.toFixed(2)}`;
  }
  return `Rp${n.toLocaleString("id-ID")}`;
}

export const DEPOSIT_TIERS = [
  { usd: 5, bonusPercent: 0, tagEn: "Standard", tagZh: "标准", tagId: "Standar", popular: false },
  { usd: 10, bonusPercent: 8, tagEn: "Recommended", tagZh: "推荐", tagId: "Populer", popular: true },
  { usd: 20, bonusPercent: 12, tagEn: "Pro Volume", tagZh: "专业版", tagId: "Pro", popular: false },
  { usd: 50, bonusPercent: 15, tagEn: "Wholesale", tagZh: "批发级", tagId: "Reseller", popular: false },
] as const;

export function getDepositBonusRate(usd: number): number {
  if (usd >= 50) return 0.15;
  if (usd >= 20) return 0.12;
  if (usd >= 10) return 0.08;
  return 0;
}

export function calculateDepositCredit(usd: number): {
  baseUsd: number;
  bonusRate: number;
  bonusPercent: number;
  bonusUsd: number;
  totalUsd: number;
} {
  const safeUsd = Number.isFinite(usd) && usd > 0 ? usd : 0;
  const bonusRate = getDepositBonusRate(safeUsd);
  const bonusPercent = Math.round(bonusRate * 100);
  const bonusUsd = Number((safeUsd * bonusRate).toFixed(2));
  const totalUsd = Number((safeUsd + bonusUsd).toFixed(2));
  return {
    baseUsd: safeUsd,
    bonusRate,
    bonusPercent,
    bonusUsd,
    totalUsd,
  };
}

export function formatDate(iso: string, lang: string = "en"): string {
  const locale = lang === "en" ? "en-US" : lang === "zh" ? "zh-CN" : "id-ID";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string, lang: string = "id"): string {
  const locale = lang === "en" ? "en-US" : lang === "zh" ? "zh-CN" : "id-ID";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatCompact(n: number, lang: string = "id"): string {
  if (lang === "en") {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  }
  if (lang === "zh") {
    if (n >= 10_000) return `${(n / 10_000).toFixed(1)}万`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}千`;
    return `${n}`;
  }
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} rb`;
  return `${n}`;
}

export function discountPercent(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

/** PRNG deterministik untuk mock data — hasil konsisten antar render. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function pickFrom<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
