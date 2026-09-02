import type { Metadata } from "next";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterPanel, SortSelect } from "@/components/storefront/filter-panel";
import { AppGrid } from "@/components/storefront/app-grid";
import { AppFilterToggle } from "@/components/storefront/app-filter-toggle";
import { getServerTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

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
  const { lang, t } = await getServerTranslation();
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
                  {lang === "en" ? "SERBAPREMIUM CATALOG" : lang === "zh" ? "SERBAPREMIUM 全球产品目录" : "KATALOG SERBAPREMIUM"}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-fg sm:text-[32px]">
                {q ? (
                  <>
                    {lang === "en" ? "Search results for: " : lang === "zh" ? "搜索结果: " : "Hasil pencarian: "}&ldquo;{q}&rdquo;
                  </>
                ) : (
                  lang === "en" ? "All Applications & Licenses" : lang === "zh" ? "全部应用与会员授权" : "Semua Aplikasi & Akun"
                )}
              </h1>
              <p className="mt-1 text-sm font-bold text-fg-muted">
                {lang === "en" ? "Showing " : lang === "zh" ? "展示 " : "Menampilkan "}<span className="text-fg">{apps.length}</span> {lang === "en" ? "digital products" : lang === "zh" ? "款精选数字产品" : "produk digital"}
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
              title={lang === "en" ? "No results found" : lang === "zh" ? "未找到相关产品" : "Tidak ada hasil ditemukan"}
              description={lang === "en" ? "Try using different keywords or clear the active filters." : lang === "zh" ? "请尝试其他关键词或清除当前筛选条件。" : "Coba gunakan kata kunci lain atau reset filter yang sedang aktif."}
              action={{ label: t.filter?.clearAll || "Reset Filter", href: "/aplikasi" }}
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
