export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatRupiah(n: number): string {
  return `Rp${n.toLocaleString("id-ID")}`;
}

export function formatPrice(n: number, lang: string = "id"): string {
  if (lang === "en" || lang === "zh") {
    const usd = n / 16000;
    return `$${usd.toFixed(2)}`;
  }
  return `Rp${n.toLocaleString("id-ID")}`;
}

export function formatDate(iso: string, lang: string = "id"): string {
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
