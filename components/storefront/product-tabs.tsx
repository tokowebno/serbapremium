"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import type { App, Review } from "@/types";
import { api } from "@/lib/api";
import { formatCompact, formatDate, seededRandom } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Tabs } from "@/components/ui/tabs";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { ReviewCard } from "./review-card";

const tabItems = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "fitur", label: "Fitur" },
  { id: "persyaratan", label: "Persyaratan Sistem" },
  { id: "versi", label: "Versi" },
  { id: "ulasan", label: "Ulasan" },
];

/** Distribusi rating 5→1 bintang, deterministik dari ratingCount. */
function ratingDistribution(app: App): number[] {
  const rand = seededRandom(app.ratingCount);
  const raw = [5, 4, 3, 2, 1].map((star) => {
    const closeness = Math.max(0.12, 1 - Math.abs(app.rating - star));
    return closeness * (0.75 + rand() * 0.5);
  });
  const total = raw.reduce((s, x) => s + x, 0);
  const pct = raw.map((x) => Math.max(1, Math.round((x / total) * 100)));
  pct[0] = Math.max(0, pct[0] + 100 - pct.reduce((s, x) => s + x, 0));
  return pct;
}

function changelogFor(app: App): string[] {
  const pool = [
    "Perbaikan stabilitas saat membuka berkas besar",
    "Peningkatan kecepatan peluncuran hingga 25%",
    "Perbaikan sinkronisasi antar perangkat",
    "Pembaruan antarmuka dan aksesibilitas",
    "Optimasi penggunaan memori pada sesi panjang",
    "Perbaikan masalah ekspor pada format tertentu",
    "Pintasan keyboard baru untuk akses cepat",
    "Pembaruan terjemahan dan penyesuaian teks",
  ];
  const rand = seededRandom(app.ratingCount * 13 + 7);
  return [...pool].sort(() => rand() - 0.5).slice(0, 4);
}

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-md border-2 border-border bg-surface p-3.5 shadow-[2px_2px_0px_var(--shadow-color)]">
      <dt className="text-xs font-black tracking-wider text-fg-muted uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-fg">{children}</dd>
    </div>
  );
}

export function ProductTabs({ slug, reviews }: { slug: string; reviews: Review[] }) {
  const [active, setActive] = useState("ringkasan");
  const app = api.apps.getBySlug(slug);
  if (!app) return null;
  const developer = api.developers.getBySlug(app.developerId);
  const category = api.categories.getBySlug(app.categoryId);
  const distribution = ratingDistribution(app);
  const changes = changelogFor(app);

  return (
    <div>
      <Tabs items={tabItems} active={active} onChange={setActive} className="w-fit max-w-full" />

      <div className="mt-8">
        {active === "ringkasan" && (
          <div className="max-w-2xl">
            <div className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
              <p className="text-[15px] font-medium leading-relaxed text-fg">{app.description}</p>
            </div>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info label="Pengembang">
                {developer ? (
                  <Link href={`/pengembang/${developer.slug}`} className="text-accent-blue dark:text-accent hover:underline">
                    {developer.name}
                  </Link>
                ) : (
                  "—"
                )}
              </Info>
              <Info label="Kategori">
                {category ? (
                  <Link href={`/kategori/${category.slug}`} className="text-accent-blue dark:text-accent hover:underline">
                    {category.name}
                  </Link>
                ) : (
                  "—"
                )}
              </Info>
              <Info label="Dirilis">{formatDate(app.releasedAt)}</Info>
              <Info label="Diperbarui">{formatDate(app.updatedAt)}</Info>
              <Info label="Total Unduhan">{formatCompact(app.downloads)}</Info>
            </dl>
          </div>
        )}

        {active === "fitur" && (
          <ul className="grid max-w-2xl gap-3 sm:grid-cols-2">
            {app.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 rounded-md border-2 border-border bg-surface p-3 text-sm font-bold text-fg shadow-[2px_2px_0px_var(--shadow-color)]"
              >
                <Check size={18} className="mt-0.5 shrink-0 text-accent-blue dark:text-accent" strokeWidth={3} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {active === "persyaratan" && (
          <div className="max-w-2xl space-y-3">
            {app.platforms.map((p) => {
              const requirement = app.requirements[p];
              if (!requirement) return null;
              return (
                <div
                  key={p}
                  className="flex flex-wrap items-center gap-3 rounded-md border-2 border-border bg-surface px-4 py-3.5 shadow-[2px_2px_0px_var(--shadow-color)]"
                >
                  <PlatformBadge platform={p} />
                  <p className="text-sm font-bold text-fg">{requirement}</p>
                </div>
              );
            })}
          </div>
        )}

        {active === "versi" && (
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border-2 border-border bg-surface p-4 shadow-[3px_3px_0px_var(--shadow-color)]">
              <Badge tone="accent">Versi {app.version}</Badge>
              <span className="text-sm font-bold text-fg-muted">Diperbarui {formatDate(app.updatedAt)}</span>
            </div>
            <p className="mt-6 text-xs font-black tracking-wider text-fg-muted uppercase">Perubahan terbaru</p>
            <ul className="mt-3 space-y-2.5">
              {changes.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2.5 rounded-md border-2 border-border bg-surface p-3 text-sm font-semibold text-fg shadow-[2px_2px_0px_var(--shadow-color)]"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-success" strokeWidth={3} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === "ulasan" && (
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="h-fit rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
              <p className="text-4xl font-black tracking-tight tabular-nums text-fg">
                {app.rating.toLocaleString("id-ID", { minimumFractionDigits: 1 })}
              </p>
              <Rating value={app.rating} showValue={false} size={18} className="mt-2" />
              <p className="mt-1 text-xs font-bold text-fg-muted">{app.ratingCount.toLocaleString("id-ID")} ulasan pembeli</p>
              <div className="mt-6 space-y-2.5">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-black tabular-nums text-fg">{star}★</span>
                    <div
                      className="h-2.5 flex-1 overflow-hidden rounded-xs border border-border bg-surface-2"
                      role="img"
                      aria-label={`${star} bintang: ${distribution[i]} persen`}
                    >
                      <div className="h-full bg-star" style={{ width: `${distribution[i]}%` }} />
                    </div>
                    <span className="w-10 text-right text-xs font-bold tabular-nums text-fg-muted">{distribution[i]}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {reviews.length === 0 ? (
                <p className="rounded-lg border-2 border-border bg-surface px-6 py-14 text-center text-sm font-bold text-fg-muted shadow-[4px_4px_0px_var(--shadow-color)]">
                  Belum ada ulasan untuk aplikasi ini.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
