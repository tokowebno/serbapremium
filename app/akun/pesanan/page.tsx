"use client";

import { History } from "lucide-react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useLibrary } from "@/components/storefront/providers";
import { formatDate, formatPrice } from "@/lib/utils";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { getLocalizedApp } from "@/lib/i18n/product-translations";

export default function PesananPage() {
  const { entries } = useLibrary();
  const { lang, t } = useTranslation();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={History}
        title={lang === "en" ? "No orders yet." : lang === "zh" ? "暂无历史订单。" : "Belum ada pesanan."}
        description={lang === "en" ? "Your purchases and licenses will appear here after checkout." : lang === "zh" ? "您购买的商品与授权将在结账完成后在此展示。" : "Pembelian Anda akan muncul di sini setelah selesai."}
        action={{ label: t.navbar?.apps || "Jelajahi Aplikasi", href: "/aplikasi" }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const rawApp = api.apps.getBySlug(entry.appId);
        if (!rawApp) return null;
        const app = getLocalizedApp(rawApp, lang);
        return (
          <article key={entry.appId} className="glass-card rounded-2xl border border-border/80 bg-surface/90 p-5 sm:p-6 shadow-sm backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
              <div>
                <p className="font-mono text-sm font-bold tracking-tight text-fg">
                  {`SP-${entry.appId.slice(0, 6).toUpperCase()}`}
                </p>
                <p className="text-xs font-normal text-fg-muted">{formatDate(entry.purchasedAt, lang)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="dibayar" />
                <StatusBadge status="selesai" />
              </div>
            </div>

            <ul className="divide-y divide-border/60">
              <li className="flex items-center gap-3.5 py-3.5">
                <AppIcon icon={app.icon} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-fg">{app.name}</p>
                  <p className="text-xs font-normal text-fg-muted">
                    {lang === "en" ? "Official License · Active Warranty" : lang === "zh" ? "官方正版授权 · 质保已生效" : "Lisensi Resmi · Garansi Aktif"}
                  </p>
                </div>
                <span className="text-sm font-bold tabular-nums text-fg">{formatPrice(app.price, lang)}</span>
              </li>
            </ul>

            <div className="flex items-center justify-between border-t border-border/70 pt-3 text-sm">
              <span className="font-medium text-fg-muted">{t.checkout?.total || "Total Bayar"}</span>
              <span className="font-bold tabular-nums text-accent">{formatPrice(app.price, lang)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}