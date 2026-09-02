import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Zap } from "lucide-react";
import type { App } from "@/types";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { PlatformList } from "@/components/ui/platform-badge";
import { SectionHeader } from "@/components/ui/empty-state";
import { AppGrid } from "@/components/storefront/app-grid";
import { ProductTabs } from "@/components/storefront/product-tabs";
import { ProductStats } from "@/components/storefront/product-stats";
import { ProductVariantSelector } from "@/components/storefront/product-variant-selector";
import { getServerTranslation } from "@/lib/i18n";
import { getLocalizedApp, getLocalizedCategory } from "@/lib/i18n/product-translations";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = api.apps.getBySlug(slug);
  if (!app) return { title: "Aplikasi tidak ditemukan" };
  return {
    title: `${app.name} · SerbaPremium`,
    description: `${app.tagline} Aktivasi instan, pembayaran aman otomatis bergaransi di SerbaPremium.`,
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const rawApp = api.apps.getBySlug(slug);
  if (!rawApp) notFound();

  const { lang, t } = await getServerTranslation();
  const app = getLocalizedApp(rawApp, lang);
  const rawCat = api.categories.getBySlug(app.categoryId);
  const category = rawCat ? getLocalizedCategory(rawCat, lang) : undefined;
  const developer = api.developers.getBySlug(app.developerId);
  const reviews = api.reviews.byApp(app.id);
  const related = api.apps.related(rawApp, 4);

  return (
    <div className="tk-container pt-20 sm:pt-28 pb-20 sm:pb-24">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center gap-1.5 text-xs font-bold text-fg-muted overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="transition-colors hover:text-fg">
          {t.navbar.home}
        </Link>
        <ChevronRight size={13} strokeWidth={3} className="text-fg-muted shrink-0" />
        <Link href="/aplikasi" className="transition-colors hover:text-fg">
          {t.navbar.apps}
        </Link>
        <ChevronRight size={13} strokeWidth={3} className="text-fg-muted shrink-0" />
        <span className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 text-fg font-black truncate max-w-[160px] sm:max-w-none">
          {app.name}
        </span>
      </nav>

      {/* Main Grid: Info Kiri + Selector Varian Kanan */}
      <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12">
        {/* Kolom Kiri: Identity Header + Description + Stats + Tabs */}
        <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-7">
          {/* Identity Header */}
          <header className="rounded-md sm:rounded-lg border-2 border-border bg-surface p-4 sm:p-8 shadow-[3px_3px_0px_var(--shadow-color)] sm:shadow-[5px_5px_0px_var(--shadow-color)]">
            <div className="flex flex-row items-center gap-4 sm:gap-5">
              <div className="w-fit shrink-0">
                <AppIcon icon={app.icon} size="xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="rounded-xs border border-border bg-accent-yellow px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                    {category?.name ?? "Aplikasi"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-success">
                    <ShieldCheck size={13} strokeWidth={2.5} /> {t.product.warranty || "Garansi Resmi"}
                  </span>
                </div>
                <h1 className="text-lg sm:text-[34px] font-black tracking-tight text-fg leading-tight truncate sm:whitespace-normal">
                  {app.name}
                </h1>
                {developer && (
                  <p className="mt-1 text-xs font-bold text-fg-muted">
                    {t.product.byDeveloper || "Disediakan oleh"}{" "}
                    <Link
                      href={`/pengembang/${developer.slug}`}
                      className="text-accent-blue dark:text-accent underline decoration-2 hover:opacity-80"
                    >
                      {developer.name}
                    </Link>
                  </p>
                )}
                <div className="mt-2.5">
                  <Rating value={app.rating} count={app.ratingCount} size={15} />
                </div>
              </div>
            </div>
          </header>

          {/* Key Stats Bar */}
          <ProductStats downloads={app.downloads} ratingCount={app.ratingCount} stock={app.stock} />

          {/* Description & Features */}
          <div className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
            <h3 className="text-sm font-black uppercase tracking-tight text-fg">
              {t.product.serviceDesc || "Deskripsi Layanan & Produk"}
            </h3>
            <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-fg-muted">{app.description}</p>

            <div className="mt-4 flex items-center gap-2.5 rounded-md border-2 border-border bg-accent/20 p-3 text-xs font-black text-fg shadow-[2px_2px_0px_var(--shadow-color)]">
              <ShieldCheck size={18} className="text-success shrink-0" strokeWidth={2.5} />
              <span>
                {lang === "en"
                  ? "⭐ Full Warranty Guaranteed: 100% replacement and support throughout the active duration."
                  : lang === "zh"
                  ? "⭐ 全程全额质保承诺：在有效使用期内享 100% 极速补发或全额售后保障。"
                  : "⭐ Full Garansi Selama Masa Aktif: Jaminan ganti baru atau perbaikan 100% selama periode berlangganan."}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t-2 border-border pt-4">
              <PlatformList platforms={app.platforms} />
              <Badge tone="neutral">{t.product.version || "Versi"} {app.version}</Badge>
              <span className="inline-flex items-center gap-1 rounded-xs border border-border bg-accent px-2 py-0.5 text-xs font-black text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                <Zap size={12} strokeWidth={3} className="fill-current" />
                {t.product.instantActivation || "Aktivasi Instan"}
              </span>
            </div>
          </div>

          {/* Product Tabs (Persyaratan, Fitur, Ulasan) */}
          <div className="mt-2">
            <ProductTabs slug={app.slug} reviews={reviews} />
          </div>
        </div>

        {/* Kolom Kanan: Sticky Selector Pilihan Varian Produk */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28">
          <ProductVariantSelector app={app} />
        </aside>
      </div>

      {/* Rekomendasi Produk Serupa */}
      <section className="mt-16 border-t-2 border-border pt-12">
        <SectionHeader
          eyebrow={t.product.similarBadge || "Rekomendasi"}
          title={t.product.similarTitle || "Aplikasi & Lisensi Serupa"}
          description={t.product.similarDesc || "Pilihan produk digital lain yang sering dibeli bersamaan."}
        />
        <AppGrid slugs={related.map((a) => a.slug)} />
      </section>
    </div>
  );
}
