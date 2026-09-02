"use client";

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
    { label: "Total Unduhan", value: formatCompact(downloads) },
    { label: "Ulasan Pembeli", value: `${ratingCount.toLocaleString("id-ID")}` },
    { label: "Sisa Stok", value: stock > 0 ? `${stock.toLocaleString("id-ID")} unit` : "Habis" },
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
