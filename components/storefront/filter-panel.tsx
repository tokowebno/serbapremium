"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Check, X, Filter } from "lucide-react";
import { api, type SortKey } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const platforms = ["Android", "iOS", "Windows", "macOS", "Linux", "Web"] as const;
const sortOptions: Array<{ id: SortKey; label: string }> = [
  { id: "popularitas", label: "Popularitas" },
  { id: "terbaru", label: "Terbaru" },
  { id: "terlaris", label: "Terlaris" },
  { id: "harga-rendah", label: "Harga terendah" },
  { id: "harga-tinggi", label: "Harga tertinggi" },
  { id: "rating", label: "Rating tertinggi" },
];

const priceRanges = [
  { id: "0-50000", label: "Di bawah Rp50.000", min: 0, max: 50000 },
  { id: "50000-150000", label: "Rp50.000 – Rp150.000", min: 50000, max: 150000 },
  { id: "150000-9999999", label: "Di atas Rp150.000", min: 150000, max: 9999999 },
];

export function useFilterState() {
  const searchParams = useSearchParams();
  return useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      category: searchParams.get("kategori") ?? "",
      platform: searchParams.get("platform") ?? "",
      sort: (searchParams.get("urutkan") ?? "popularitas") as SortKey,
      promoOnly: searchParams.get("promo") === "1",
      price: searchParams.get("harga") ?? "",
    }),
    [searchParams],
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-border py-4 first:pt-0 last:border-0">
      <p className="mb-2.5 text-xs font-black tracking-wider text-fg uppercase">{title}</p>
      {children}
    </div>
  );
}

function OptionRow({
  checked,
  label,
  count,
  onClick,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left text-[13.5px] transition-all hover:bg-surface-2",
        checked ? "font-black text-fg" : "font-medium text-fg-muted",
      )}
    >
      <span
        className={cn(
          "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-xs border-2 border-border transition-colors shadow-[1px_1px_0px_var(--shadow-color)]",
          checked ? "bg-accent text-black" : "bg-surface",
        )}
      >
        {checked && <Check size={12} strokeWidth={3.5} />}
      </span>
      <span className="truncate">{label}</span>
      {count != null && (
        <span className="ml-auto rounded-xs border border-border bg-surface-2 px-1.5 py-0.2 text-[10px] font-bold tabular-nums text-fg">
          {count}
        </span>
      )}
    </button>
  );
}

export function FilterPanel({ onApplied }: { onApplied?: () => void }) {
  const router = useRouter();
  const f = useFilterState();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(window.location.search);
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`/aplikasi?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  const toggleParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    router.replace(`/aplikasi?${params.toString()}`, { scroll: false });
  };

  const categories = api.categories.withCount().filter((c) => c.count > 0);
  const activeCount = [f.category, f.platform, f.price, f.promoOnly ? "p" : ""].filter(Boolean).length;

  const clearAll = () => {
    const params = new URLSearchParams();
    if (f.q) params.set("q", f.q);
    router.replace(`/aplikasi?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="rounded-lg border-2 border-border bg-surface p-5 shadow-[4px_4px_0px_var(--shadow-color)]">
      <div className="flex items-center justify-between border-b-2 border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-xs border-2 border-border bg-accent-yellow shadow-[1px_1px_0px_var(--shadow-color)]">
            <Filter size={13} strokeWidth={2.5} className="text-black" />
          </span>
          <p className="text-sm font-black tracking-tight uppercase text-fg">Filter</p>
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 text-xs font-bold text-fg transition-colors hover:bg-discount hover:text-white"
          >
            <X size={11} strokeWidth={3} />
            Reset
          </button>
        )}
      </div>

      <FilterGroup title="Kategori">
        <div className="flex flex-col gap-0.5">
          {categories.map((c) => (
            <OptionRow
              key={c.id}
              checked={f.category === c.id}
              label={c.name}
              count={c.count}
              onClick={() => setParam("kategori", f.category === c.id ? "" : c.id)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Platform">
        <div className="flex flex-col gap-0.5">
          {platforms.map((p) => (
            <OptionRow key={p} checked={f.platform === p} label={p} onClick={() => toggleParam("platform", p)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Harga">
        <div className="flex flex-col gap-0.5">
          {priceRanges.map((r) => (
            <OptionRow
              key={r.id}
              checked={f.price === r.id}
              label={r.label}
              onClick={() => toggleParam("harga", r.id)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Promo">
        <OptionRow
          checked={f.promoOnly}
          label="Sedang Diskon / Promo"
          onClick={() => setParam("promo", f.promoOnly ? "" : "1")}
        />
      </FilterGroup>

      {onApplied && (
        <Button className="mt-4 w-full" onClick={onApplied}>
          Terapkan Filter
        </Button>
      )}
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const f = useFilterState();
  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-xs font-black uppercase text-fg sm:inline">Urutkan</span>
      <select
        value={f.sort}
        onChange={(e) => {
          const params = new URLSearchParams(window.location.search);
          params.set("urutkan", e.target.value);
          router.replace(`/aplikasi?${params.toString()}`, { scroll: false });
        }}
        className="h-9 cursor-pointer rounded-md border-2 border-border bg-surface px-3 text-[13px] font-bold text-fg shadow-[2px_2px_0px_var(--shadow-color)] outline-none focus:shadow-[4px_4px_0px_var(--shadow-color)]"
        aria-label="Urutkan aplikasi"
      >
        {sortOptions.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
