import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      <header className="flex items-start gap-5 pb-10">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-2">
          <Icon size={24} strokeWidth={1.75} className="text-fg" />
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{category.name}</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-6 text-fg-muted">{category.description}</p>
          <p className="mt-1 text-sm text-fg-faint">{apps.length} aplikasi</p>
        </div>
      </header>

      {apps.length === 0 ? (
        <EmptyState
          icon={Icon}
          title="Belum ada aplikasi"
          description="Aplikasi pada kategori ini belum tersedia. Silakan cek kembali nanti."
          action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
          className="rounded-xl border border-border"
        />
      ) : (
        <AppGrid slugs={apps.map((a) => a.slug)} />
      )}
    </div>
  );
}
