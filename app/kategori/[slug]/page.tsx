import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { AppGrid } from "@/components/storefront/app-grid";

interface Props {
  params: Promise<{ slug: string }>;
}

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
  const category = api.categories.getBySlug(slug);
  if (!category) notFound();

  const Icon = category.icon;
  const apps = api.apps.byCategory(category.id);

  return (
    <div className="tk-container pt-28 pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs font-bold text-fg-muted">
        <Link href="/" className="transition-colors hover:text-fg">
          Beranda
        </Link>
        <ChevronRight size={13} strokeWidth={3} className="text-fg-muted" />
        <Link href="/kategori" className="transition-colors hover:text-fg">
          Kategori
        </Link>
        <ChevronRight size={13} strokeWidth={3} className="text-fg-muted" />
        <span className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 text-fg font-black">
          {category.name}
        </span>
      </nav>

      {/* Header kategori */}
      <header className="relative rounded-lg border-2 border-border bg-surface p-6 sm:p-8 shadow-[5px_5px_0px_var(--shadow-color)]">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border-2 border-border bg-accent-yellow text-black shadow-[2px_2px_0px_var(--shadow-color)]">
            <Icon size={30} strokeWidth={2.5} />
          </span>
          <div>
            <div className="mb-1">
              <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                KATEGORI PRODUK
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-fg sm:text-4xl">{category.name}</h1>
            <p className="mt-1.5 max-w-xl text-[15px] font-medium leading-relaxed text-fg-muted">
              {category.description}
            </p>
            <p className="mt-2 text-xs font-bold text-fg">
              Total <span className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.2">{apps.length}</span> aplikasi
            </p>
          </div>
        </div>
      </header>

      {/* Grid aplikasi */}
      <div className="mt-10">
        {apps.length === 0 ? (
          <EmptyState
            icon={Icon}
            title="Belum ada aplikasi di kategori ini"
            description="Produk untuk kategori ini sedang disiapkan. Silakan cek kembali nanti."
            action={{ label: "Jelajahi Aplikasi Lain", href: "/aplikasi" }}
          />
        ) : (
          <AppGrid slugs={apps.map((a) => a.slug)} />
        )}
      </div>
    </div>
  );
}
