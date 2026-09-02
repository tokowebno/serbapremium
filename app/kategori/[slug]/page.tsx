import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { AppGrid } from "@/components/storefront/app-grid";
import { getServerTranslation } from "@/lib/i18n";
import { getLocalizedCategory } from "@/lib/i18n/product-translations";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = api.categories.getBySlug(slug);
  if (!category) return { title: "Kategori tidak ditemukan" };
  return {
    title: `${category.name} · SerbaPremium`,
    description: `${category.description} Temukan produk terbaik di SerbaPremium.`,
  };
}

export default async function KategoriPage({ params }: Props) {
  const { slug } = await params;
  const rawCategory = api.categories.getBySlug(slug);
  if (!rawCategory) notFound();

  const { lang, t } = await getServerTranslation();
  const category = getLocalizedCategory(rawCategory, lang);
  const Icon = category.icon;
  const apps = api.apps.byCategory(category.id);

  return (
    <div className="tk-container pt-28 pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs font-medium text-fg-muted">
        <Link href="/" className="transition-colors hover:text-fg">
          {t.navbar?.home || "Beranda"}
        </Link>
        <ChevronRight size={13} className="text-fg-faint" />
        <Link href="/kategori" className="transition-colors hover:text-fg">
          {t.navbar?.categories || "Kategori"}
        </Link>
        <ChevronRight size={13} className="text-fg-faint" />
        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-fg font-semibold">
          {category.name}
        </span>
      </nav>

      {/* Header kategori */}
      <header className="glass-card relative rounded-2xl border border-border/80 bg-surface/90 p-6 sm:p-8 shadow-sm backdrop-blur-md">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent ring-1 ring-accent/20">
            <Icon size={30} strokeWidth={2} />
          </span>
          <div>
            <div className="mb-1.5">
              <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold uppercase text-accent">
                {lang === "en" ? "CATEGORY CATALOG" : lang === "zh" ? "分类产品目录" : "KATEGORI PRODUK"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">{category.name}</h1>
            <p className="mt-1.5 max-w-xl text-[14.5px] font-normal leading-relaxed text-fg-muted">
              {category.description}
            </p>
            <p className="mt-2 text-xs font-semibold text-fg">
              {apps.length} {lang === "en" ? "applications available" : lang === "zh" ? "款产品在售" : "aplikasi tersedia"}
            </p>
          </div>
        </div>
      </header>

      {/* Grid produk */}
      <section className="mt-8">
        {apps.length === 0 ? (
          <EmptyState
            icon={Icon}
            title={lang === "en" ? "No applications in this category yet" : lang === "zh" ? "该分类暂无上架产品" : "Belum ada aplikasi di kategori ini"}
            description={lang === "en" ? "We are actively curating more software for this category." : lang === "zh" ? "我们正在积极准备该分类下的优质正版产品。" : "Kami sedang menyiapkan aplikasi terbaik untuk kategori ini."}
            action={{ label: t.footer?.allApps || "Lihat Semua Aplikasi", href: "/aplikasi" }}
          />
        ) : (
          <AppGrid slugs={apps.map((a) => a.slug)} />
        )}
      </section>
    </div>
  );
}
