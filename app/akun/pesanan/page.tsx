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
          <article key={entry.appId} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <p className="font-mono text-sm font-medium tracking-tight">
                  {`TK-${entry.appId.slice(0, 6).toUpperCase()}`}
                </p>
                <p className="text-[13px] text-fg-muted">{formatDate(entry.purchasedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="dibayar" />
                <StatusBadge status="selesai" />
              </div>
            </div>

            <ul className="divide-y divide-border">
              <li className="flex items-center gap-3.5 py-3">
                <AppIcon icon={app.icon} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{app.name}</p>
                  <p className="text-[13px] text-fg-muted">
                    Lisensi Web · satu perangkat
                  </p>
                </div>
                <span className="text-sm font-medium tabular-nums">{formatRupiah(app.price)}</span>
              </li>
            </ul>

            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-fg-muted">Total</span>
              <span className="font-semibold tabular-nums">{formatRupiah(app.price)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}