"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Check, X, Filter } from "lucide-react";
import { api, type SortKey } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "./i18n-provider";
import { getLocalizedCategory } from "@/lib/i18n/product-translations";

const platforms = ["Android", "iOS", "Windows", "macOS", "Linux", "Web"] as const;

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
    <div className="border-b border-border/70 py-4 first:pt-0 last:border-0">
      <p className="mb-2.5 text-xs font-semibold tracking-wide text-fg-muted uppercase">{title}</p>
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
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-surface-2",
        checked ? "font-semibold text-fg" : "font-normal text-fg-muted",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-colors",
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
  const { lang, t } = useTranslation();

  const priceRanges = [
    { id: "0-50000", label: t.filter?.prices?.under50k || "Di bawah Rp50.000", min: 0, max: 50000 },
    { id: "50000-150000", label: t.filter?.prices?.between50k150k || "Rp50.000 – Rp150.000", min: 50000, max: 150000 },
    { id: "150000-9999999", label: t.filter?.prices?.above150k || "Di atas Rp150.000", min: 150000, max: 9999999 },
  ];

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

  const rawCats = api.categories.withCount().filter((c) => c.count > 0);
  const categories = rawCats.map((c) => ({
    ...c,
    ...getLocalizedCategory(c, lang),
  }));

  const activeCount = [f.category, f.platform, f.price, f.promoOnly ? "p" : ""].filter(Boolean).length;

  const clearAll = () => {
    const params = new URLSearchParams();
    if (f.q) params.set("q", f.q);
    router.replace(`/aplikasi?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-1.5">
          <Filter size={15} className="text-accent" />
          <p className="text-sm font-bold tracking-tight text-fg">{t.filter?.title || "Filter"}</p>
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs font-semibold text-discount hover:underline">
            <X size={13} strokeWidth={2.5} />
            {t.filter?.clearAll || "Hapus semua"}
          </button>
        )}
      </div>

      <FilterGroup title={t.filter?.category || "Kategori"}>
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

      <FilterGroup title={t.filter?.platform || "Platform"}>
        <div className="flex flex-col gap-0.5">
          {platforms.map((p) => (
            <OptionRow key={p} checked={f.platform === p} label={p} onClick={() => toggleParam("platform", p)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t.filter?.price || "Harga"}>
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

      <FilterGroup title={t.filter?.other || "Lainnya"}>
        <OptionRow
          checked={f.promoOnly}
          label={t.filter?.onSale || "Sedang promo"}
          onClick={() => setParam("promo", f.promoOnly ? "" : "1")}
        />
      </FilterGroup>

      <Button className="mt-4 rounded-full" onClick={onApplied}>
        {t.filter?.apply || "Terapkan"}
      </Button>
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const f = useFilterState();
  const { t } = useTranslation();

  const sortOptions: Array<{ id: SortKey; label: string }> = [
    { id: "popularitas", label: t.filter?.sorts?.popularity || "Popularitas" },
    { id: "terbaru", label: t.filter?.sorts?.newest || "Terbaru" },
    { id: "terlaris", label: t.filter?.sorts?.bestseller || "Terlaris" },
    { id: "harga-rendah", label: t.filter?.sorts?.priceLow || "Harga terendah" },
    { id: "harga-tinggi", label: t.filter?.sorts?.priceHigh || "Harga tertinggi" },
    { id: "rating", label: t.filter?.sorts?.rating || "Rating tertinggi" },
  ];

  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-xs font-semibold text-fg-muted sm:inline">{t.filter?.sortBy || "Urutkan"}</span>
      <select
        value={f.sort}
        onChange={(e) => {
          const params = new URLSearchParams(window.location.search);
          params.set("urutkan", e.target.value);
          router.replace(`/aplikasi?${params.toString()}`, { scroll: false });
        }}
        className="h-9 rounded-full border border-border/80 bg-surface/80 px-3 text-xs font-semibold shadow-xs outline-none focus:border-accent"
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
