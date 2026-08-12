"use client";

import { BookOpen, Download } from "lucide-react";
import { useLibrary } from "@/components/storefront/providers";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { formatDate } from "@/lib/utils";
import type { Platform } from "@/types";

export default function KoleksiPage() {
  const { entries } = useLibrary();
  const apps = entries
    .map((e) => ({ entry: e, app: api.apps.getBySlug(e.appId) }))
    .filter((x) => x.app !== undefined)
    .reverse();

  if (apps.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Belum ada aplikasi di koleksi Anda."
        description="Jelajahi aplikasi untuk menemukan sesuatu yang Anda butuhkan."
        action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-fg-muted">
        {apps.length} aplikasi dalam koleksi Anda. Pembelian satu kali — unduh kapan saja.
      </p>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface shadow-sm">
        {apps.map(({ entry, app }) => {
          const hasUpdate = app!.updatedAt > entry.purchasedAt;
          return (
            <li key={app!.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <AppIcon icon={app!.icon} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold tracking-tight">{app!.name}</p>
                  {hasUpdate && <Badge tone="accent">Pembaruan tersedia</Badge>}
                </div>
                <p className="mt-0.5 text-[13px] text-fg-muted">
                  Versi {app!.version} · Dibeli {formatDate(entry.purchasedAt)}
                </p>
                <div className="mt-1.5">
                  <PlatformBadge platform={app!.platforms[0] as Platform} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ButtonLink href={`/aplikasi/${app!.slug}`} variant="secondary" size="sm">
                  Detail
                </ButtonLink>
                <ButtonLink href={`/aplikasi/${app!.slug}`} size="sm">
                  <Download size={14} />
                  Unduh
                </ButtonLink>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-fg-faint">
        Tombol unduh mengarah ke halaman detail aplikasi — integrasi unduhan sungguhan menyusul bersama backend.
      </p>
    </div>
  );
}