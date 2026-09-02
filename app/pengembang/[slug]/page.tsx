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
    title: `${developer.name} · SerbaPremium`,
    description: `${developer.description} Temukan produk resmi di SerbaPremium.`,
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
      <header className="relative rounded-lg border-2 border-border bg-surface p-6 sm:p-8 shadow-[5px_5px_0px_var(--shadow-color)]">
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <AppIcon icon={developer.logo} size="xl" />
          </div>
          <div className="max-w-2xl">
            <div className="mb-1">
              <span className="rounded-xs border border-border bg-accent-yellow px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                PROFIL PENGEMBANG
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-fg sm:text-4xl">{developer.name}</h1>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-fg-muted">{developer.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-fg-muted">
              <a
                href={developer.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-fg underline decoration-2"
              >
                <Globe size={14} strokeWidth={2.5} />
                Situs Resmi
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} strokeWidth={2.5} />
                {developer.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} strokeWidth={2.5} />
                Bergabung {formatDate(developer.joinDate)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
        <div className="rounded-md border-2 border-border bg-surface p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
          <p className="text-xl font-black tracking-tight tabular-nums text-fg">{apps.length}</p>
          <p className="mt-0.5 text-xs font-bold text-fg-muted">Aplikasi</p>
        </div>
        <div className="rounded-md border-2 border-border bg-surface p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
          <p className="text-xl font-black tracking-tight tabular-nums text-fg">{formatCompact(totalDownloads)}</p>
          <p className="mt-0.5 text-xs font-bold text-fg-muted">Unduhan</p>
        </div>
        <div className="rounded-md border-2 border-border bg-surface p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
          <p className="text-xl font-black tracking-tight tabular-nums text-fg">
            {apps.length > 0
              ? avgRating.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
              : "—"}
          </p>
          <p className="mt-0.5 text-xs font-bold text-fg-muted">Rating</p>
        </div>
      </div>

      <section className="mt-14 border-t-2 border-border pt-10">
        <SectionHeader eyebrow="Katalog" title={`Produk oleh ${developer.name}`} />
        {apps.length === 0 ? (
          <EmptyState
            icon={Globe}
            title="Belum ada aplikasi"
            description="Pengembang ini belum menerbitkan aplikasi di SerbaPremium."
            action={{ label: "Jelajahi Katalog", href: "/aplikasi" }}
          />
        ) : (
          <AppGrid slugs={apps.map((a) => a.slug)} />
        )}
      </section>
    </div>
  );
}
