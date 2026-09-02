"use client";

import { formatCompact } from "@/lib/utils";
import { useTranslation } from "./i18n-provider";

export function ProductStats({
  downloads,
  ratingCount,
  stock,
}: {
  downloads: number;
  ratingCount: number;
  stock: number;
}) {
  const { lang, t } = useTranslation();

  const items = [
    {
      label: lang === "en" ? "Total Delivered" : lang === "zh" ? "累计交付" : "Total Terjual",
      value: formatCompact(downloads, lang),
    },
    {
      label: lang === "en" ? "Customer Reviews" : lang === "zh" ? "买家评价" : "Ulasan Pembeli",
      value: `${ratingCount.toLocaleString(lang === "en" ? "en-US" : "id-ID")}`,
    },
    {
      label: lang === "en" ? "Available Stock" : lang === "zh" ? "剩余库存" : "Sisa Stok",
      value: stock > 0
        ? `${stock.toLocaleString(lang === "en" ? "en-US" : "id-ID")} ${lang === "en" ? "pcs" : lang === "zh" ? "件" : "unit"}`
        : (t.product?.outOfStock || "Habis"),
    },
  ];

  return (
    <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-2xl border border-border/80 bg-surface/80 px-2.5 sm:px-4 py-2.5 sm:py-3.5 shadow-sm text-center sm:text-left backdrop-blur-sm">
          <p className="text-[10px] sm:text-[11px] font-medium tracking-wide text-fg-muted uppercase truncate">{s.label}</p>
          <p className="mt-0.5 text-xs sm:text-lg font-bold tracking-tight tabular-nums text-fg truncate">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
