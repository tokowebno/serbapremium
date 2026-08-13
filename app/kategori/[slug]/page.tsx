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
    title: category.name,
    description: category.description,
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
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[13px] text-fg-muted">
        <Link href="/" className="transition-colors hover:text-fg">
          Beranda
        </Link>
        <ChevronRight size={13} className="text-fg-faint" />
        <Link href="/aplikasi" className="transition-colors hover:text-fg">
          Aplikasi
        </Link>
        <ChevronRight size={13} className="text-fg-faint" />
        <span className="font-medium text-fg">{category.name}</span>
      </nav>

      {/* Header kategori — material glass */}
      <header className="ambient-bg relative overflow-hidden rounded-[var(--radius-xl)] p-8 sm:p-10">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="mat-func flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-lg)]">
            <Icon size={26} strokeWidth={1.75} className="text-fg" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-fg-muted uppercase">Kategori</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">{category.name}</h1>
            <p className="mt-2 max-w-xl text-[15px] leading-6 text-fg-muted">{category.description}</p>
            <p className="mt-1.5 text-sm text-fg-faint">{apps.length} aplikasi</p>
          </div>
        </div>
      </header>

      {/* Grid aplikasi */}
      <div className="mt-10">
        {apps.length === 0 ? (
          <EmptyState
            icon={Icon}
            title="Belum ada aplikasi"
            description="Aplikasi pada kategori ini belum tersedia. Silakan cek kembali nanti."
            action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
            className="content-card rounded-[var(--radius-lg)]"
          />
        ) : (
          <AppGrid slugs={apps.map((a) => a.slug)} />
        )}
      </div>
    </div>
  );
}
