"use client";

import { CountUp } from "@/components/ui/count-up";
import { formatCompact } from "@/lib/utils";

export function ProductStats({
  downloads,
  ratingCount,
  stock,
}: {
  downloads: number;
  ratingCount: number;
  stock: number;
}) {
  const items = [
    { label: "Unduhan", value: formatCompact(downloads) },
    { label: "Ulasan", value: `${ratingCount.toLocaleString("id-ID")}` },
    { label: "Stok", value: stock > 0 ? `${stock.toLocaleString("id-ID")}` : "Habis" },
  ];
  return (
    <div className="mt-5 grid grid-cols-3 gap-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-lg border border-border bg-surface-2/60 px-4 py-3">
          <p className="text-[11px] font-semibold tracking-wide text-fg-faint uppercase">{s.label}</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
