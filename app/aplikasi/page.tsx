import type { Metadata } from "next";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterPanel, SortSelect } from "@/components/storefront/filter-panel";
import { AppGrid } from "@/components/storefront/app-grid";
import { AppFilterToggle } from "@/components/storefront/app-filter-toggle";

export const metadata: Metadata = {
  title: "Aplikasi",
  description:
    "Jelajahi semua aplikasi premium di SerbaPremium. Filter berdasarkan kategori, platform, harga, dan promo.",
};

const PLATFORMS = ["Android", "iOS", "Windows", "macOS", "Linux"] as const;
const SORTS = ["popularitas", "terbaru", "terlaris", "harga-rendah", "harga-tinggi", "rating"] as const;

const PRICE_RANGES: Record<string, { min: number; max: number }> = {
  "0-50000": { min: 0, max: 50000 },
  "50000-150000": { min: 50000, max: 150000 },
  "150000-9999999": { min: 150000, max: 9999999 },
};

export default async function AplikasiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const kategori = typeof sp.kategori === "string" ? sp.kategori : "";
  const platformRaw = typeof sp.platform === "string" ? sp.platform : "";
  const platform = PLATFORMS.find((p) => p === platformRaw);
  const harga = typeof sp.harga === "string" ? sp.harga : "";
  const range = PRICE_RANGES[harga];
  const promoOnly = sp.promo === "1";
  const sortRaw = typeof sp.urutkan === "string" ? sp.urutkan : "popularitas";
  const sort = SORTS.find((s) => s === sortRaw) ?? "popularitas";

  const apps = api.apps.list({
    q,
    category: kategori,
    platform,
    minPrice: range?.min,
    maxPrice: range?.max,
    promoOnly,
    sort,
  });

  return (
    <div className="tk-container pt-28 pb-20">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1 scrollbar-thin">
            <FilterPanel />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-border pb-5">
            <div>
              <div className="mb-1">
                <span className="inline-block rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                  KATALOG SERBAPREMIUM
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-fg sm:text-[32px]">
                {q ? <>Hasil pencarian: &ldquo;{q}&rdquo;</> : "Semua Aplikasi & Akun"}
              </h1>
              <p className="mt-1 text-sm font-bold text-fg-muted">
                Menampilkan <span className="text-fg">{apps.length}</span> produk digital
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <AppFilterToggle />
              <SortSelect />
            </div>
          </div>

          {apps.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Tidak ada hasil ditemukan"
              description="Coba gunakan kata kunci lain atau reset filter yang sedang aktif."
              action={{ label: "Reset Filter", href: "/aplikasi" }}
              className="mt-8"
            />
          ) : (
            <div className="mt-8">
              <AppGrid slugs={apps.map((a) => a.slug)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
