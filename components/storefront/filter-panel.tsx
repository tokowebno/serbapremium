"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Check, X } from "lucide-react";
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
    <div className="border-b border-border py-5 first:pt-0 last:border-0">
      <p className="mb-3 text-[13px] font-semibold tracking-wide">{title}</p>
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
        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-2",
        checked ? "text-fg font-medium" : "text-fg-muted",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
          checked ? "border-accent bg-accent text-accent-fg" : "border-border-strong bg-surface",
        )}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      {label}
      {count != null && <span className="ml-auto text-xs text-fg-faint tabular-nums">{count}</span>}
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
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-2">
        <p className="text-sm font-semibold tracking-tight">Filter</p>
        {activeCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-[13px] text-fg-muted hover:text-fg">
            <X size={13} />
            Hapus semua
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

      <FilterGroup title="Lainnya">
        <OptionRow
          checked={f.promoOnly}
          label="Sedang promo"
          onClick={() => setParam("promo", f.promoOnly ? "" : "1")}
        />
      </FilterGroup>

      <Button className="mt-4" onClick={onApplied}>
        Terapkan
      </Button>
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const f = useFilterState();
  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-[13px] text-fg-muted sm:inline">Urutkan</span>
      <select
        value={f.sort}
        onChange={(e) => {
          const params = new URLSearchParams(window.location.search);
          params.set("urutkan", e.target.value);
          router.replace(`/aplikasi?${params.toString()}`, { scroll: false });
        }}
        className="h-9 rounded-lg border border-border bg-surface px-3 text-[13px] font-medium shadow-sm outline-none focus:border-accent/50"
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
