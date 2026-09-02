"use client";

import { History } from "lucide-react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useLibrary } from "@/components/storefront/providers";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function PesananPage() {
  const { entries } = useLibrary();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Belum ada pesanan."
        description="Pembelian Anda akan muncul di sini setelah selesai."
        action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const app = api.apps.getBySlug(entry.appId);
        if (!app) return null;
        return (
          <article key={entry.appId} className="rounded-lg border-2 border-border bg-surface p-5 shadow-[4px_4px_0px_var(--shadow-color)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border pb-3">
              <div>
                <p className="font-mono text-sm font-black tracking-tight text-fg">
                  {`SP-${entry.appId.slice(0, 6).toUpperCase()}`}
                </p>
                <p className="text-xs font-bold text-fg-muted">{formatDate(entry.purchasedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="dibayar" />
                <StatusBadge status="selesai" />
              </div>
            </div>

            <ul className="divide-y-2 divide-border">
              <li className="flex items-center gap-3.5 py-3.5">
                <AppIcon icon={app.icon} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-fg">{app.name}</p>
                  <p className="text-xs font-semibold text-fg-muted">
                    Lisensi Resmi · Garansi Aktif
                  </p>
                </div>
                <span className="text-sm font-black tabular-nums text-fg">{formatRupiah(app.price)}</span>
              </li>
            </ul>

            <div className="flex items-center justify-between border-t-2 border-border pt-3 text-sm">
              <span className="font-bold text-fg-muted">Total Bayar</span>
              <span className="font-black tabular-nums text-fg">{formatRupiah(app.price)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}