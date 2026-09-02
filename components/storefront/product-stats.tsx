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
    <div className="mt-5 grid grid-cols-3 gap-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-md border-2 border-border bg-surface px-4 py-3 shadow-[2px_2px_0px_var(--shadow-color)]">
          <p className="text-[11px] font-black tracking-wider text-fg-muted uppercase">{s.label}</p>
          <p className="mt-0.5 text-lg font-black tracking-tight tabular-nums text-fg">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
