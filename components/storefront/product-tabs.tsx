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
    <div>
      <dt className="text-xs font-semibold tracking-wide text-fg-faint uppercase">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
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
            <p className="text-[15px] leading-7 text-fg-muted">{app.description}</p>
            <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Info label="Pengembang">
                {developer ? (
                  <Link href={`/pengembang/${developer.slug}`} className="text-accent hover:underline">
                    {developer.name}
                  </Link>
                ) : (
                  "—"
                )}
              </Info>
              <Info label="Kategori">
                {category ? (
                  <Link href={`/kategori/${category.slug}`} className="text-accent hover:underline">
                    {category.name}
                  </Link>
                ) : (
                  "—"
                )}
              </Info>
              <Info label="Dirilis">{formatDate(app.releasedAt)}</Info>
              <Info label="Diperbarui">{formatDate(app.updatedAt)}</Info>
              <Info label="Unduhan">{formatCompact(app.downloads)}</Info>
            </dl>
          </div>
        )}

        {active === "fitur" && (
          <ul className="grid max-w-2xl gap-3 sm:grid-cols-2">
            {app.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm leading-6 text-fg">
                <Check size={16} className="mt-1 shrink-0 text-accent" strokeWidth={2.5} />
                {f}
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
                <div key={p} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
                  <PlatformBadge platform={p} />
                  <p className="text-sm text-fg-muted">{requirement}</p>
                </div>
              );
            })}
          </div>
        )}

        {active === "versi" && (
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">Versi {app.version}</Badge>
              <span className="text-sm text-fg-muted">Diperbarui {formatDate(app.updatedAt)}</span>
            </div>
            <p className="mt-7 text-xs font-semibold tracking-wide text-fg-faint uppercase">Perubahan terbaru</p>
            <ul className="mt-3 space-y-3">
              {changes.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm leading-6 text-fg-muted">
                  <Check size={15} className="mt-1 shrink-0 text-accent" strokeWidth={2.5} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {active === "ulasan" && (
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="h-fit rounded-xl border border-border bg-surface p-6">
              <p className="text-4xl font-semibold tracking-tight tabular-nums">
                {app.rating.toLocaleString("id-ID", { minimumFractionDigits: 1 })}
              </p>
              <Rating value={app.rating} showValue={false} size={16} className="mt-2" />
              <p className="mt-1 text-sm text-fg-muted">{app.ratingCount.toLocaleString("id-ID")} ulasan</p>
              <div className="mt-6 space-y-2.5">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-5 text-[13px] text-fg-muted tabular-nums">{star}</span>
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2"
                      role="img"
                      aria-label={`${star} bintang: ${distribution[i]} persen`}
                    >
                      <div className="h-full rounded-full bg-star" style={{ width: `${distribution[i]}%` }} />
                    </div>
                    <span className="w-11 text-right text-xs text-fg-faint tabular-nums">{distribution[i]}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {reviews.length === 0 ? (
                <p className="rounded-xl border border-border bg-surface px-6 py-14 text-center text-sm text-fg-muted">
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
