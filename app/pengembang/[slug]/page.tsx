import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Globe, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { formatCompact, formatDate } from "@/lib/utils";
import { AppIcon } from "@/components/ui/app-icon";
import { SectionHeader } from "@/components/ui/empty-state";
import { EmptyState } from "@/components/ui/empty-state";
import { AppGrid } from "@/components/storefront/app-grid";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const developer = api.developers.getBySlug(slug);
  if (!developer) return { title: "Pengembang tidak ditemukan" };
  return {
    title: developer.name,
    description: developer.description,
  };
}

export default async function PengembangPage({ params }: Props) {
  const { slug } = await params;
  const developer = api.developers.getBySlug(slug);
  if (!developer) notFound();

  const apps = api.apps.byDeveloper(developer.id);
  const totalDownloads = apps.reduce((s, a) => s + a.downloads, 0);
  const avgRating = apps.length > 0 ? apps.reduce((s, a) => s + a.rating, 0) / apps.length : 0;

  return (
    <div className="tk-container pt-28 pb-20">
      <header className="ambient-bg relative overflow-hidden rounded-[var(--radius-xl)] p-8 sm:p-10">
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="mat-func shrink-0 rounded-[var(--radius-lg)] p-2">
            <AppIcon icon={developer.logo} size="xl" />
          </div>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-fg-muted uppercase">Pengembang</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">{developer.name}</h1>
            <p className="mt-2 text-[15px] leading-7 text-fg-muted">{developer.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted">
              <a
                href={developer.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
              >
                <Globe size={15} />
                Situs web
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} />
                {developer.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} />
                Bergabung {formatDate(developer.joinDate)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
        <div className="content-card rounded-[var(--radius-lg)] p-4">
          <p className="text-xl font-semibold tracking-tight tabular-nums">{apps.length}</p>
          <p className="mt-0.5 text-[13px] text-fg-muted">Aplikasi</p>
        </div>
        <div className="content-card rounded-[var(--radius-lg)] p-4">
          <p className="text-xl font-semibold tracking-tight tabular-nums">{formatCompact(totalDownloads)}</p>
          <p className="mt-0.5 text-[13px] text-fg-muted">Unduhan</p>
        </div>
        <div className="content-card rounded-[var(--radius-lg)] p-4">
          <p className="text-xl font-semibold tracking-tight tabular-nums">
            {apps.length > 0
              ? avgRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
              : "—"}
          </p>
          <p className="mt-0.5 text-[13px] text-fg-muted">Rating</p>
        </div>
      </div>

      <section className="mt-14">
        <SectionHeader eyebrow="Koleksi" title={`Aplikasi oleh ${developer.name}`} />
        {apps.length === 0 ? (
          <EmptyState
            icon={Globe}
            title="Belum ada aplikasi"
            description="Pengembang ini belum menerbitkan aplikasi di Tokono."
            action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
            className="rounded-xl border border-border"
          />
        ) : (
          <AppGrid slugs={apps.map((a) => a.slug)} />
        )}
      </section>
    </div>
  );
}
