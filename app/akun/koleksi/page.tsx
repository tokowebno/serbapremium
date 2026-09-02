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
import { useTranslation } from "@/components/storefront/i18n-provider";
import { getLocalizedApp } from "@/lib/i18n/product-translations";

export default function KoleksiPage() {
  const { entries } = useLibrary();
  const { lang, t } = useTranslation();
  const apps = entries
    .map((e) => {
      const raw = api.apps.getBySlug(e.appId);
      return { entry: e, app: raw ? getLocalizedApp(raw, lang) : undefined };
    })
    .filter((x) => x.app !== undefined)
    .reverse();

  if (apps.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={lang === "en" ? "No applications in your collection yet." : lang === "zh" ? "您的收藏库中暂无应用。" : "Belum ada aplikasi di koleksi Anda."}
        description={lang === "en" ? "Explore our digital catalog to find what you need." : lang === "zh" ? "探索我们的数字产品库以发现您所需的应用与会员。" : "Jelajahi aplikasi untuk menemukan sesuatu yang Anda butuhkan."}
        action={{ label: t.navbar?.apps || "Jelajahi Aplikasi", href: "/aplikasi" }}
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-fg-muted">
        {apps.length} {lang === "en" ? "items in your collection · One-time purchase, access anytime" : lang === "zh" ? "个已购项目 · 一次性购买，随时取用" : "aplikasi dalam koleksi Anda · Pembelian satu kali, unduh kapan saja"}
      </p>
      <ul className="glass-card divide-y divide-border/60 rounded-2xl border border-border/80 bg-surface/90 shadow-sm backdrop-blur-md">
        {apps.map(({ entry, app }) => {
          const hasUpdate = app!.updatedAt > entry.purchasedAt;
          return (
            <li key={app!.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <AppIcon icon={app!.icon} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold tracking-tight text-fg">{app!.name}</p>
                  {hasUpdate && <Badge tone="accent">{lang === "en" ? "Update available" : lang === "zh" ? "有可用更新" : "Pembaruan tersedia"}</Badge>}
                </div>
                <p className="mt-0.5 text-xs font-normal text-fg-muted">
                  {lang === "en" ? "Version" : lang === "zh" ? "版本" : "Versi"} {app!.version} · {lang === "en" ? "Purchased" : lang === "zh" ? "购买时间" : "Dibeli"} {formatDate(entry.purchasedAt, lang)}
                </p>
                <div className="mt-1.5">
                  <PlatformBadge platform={app!.platforms[0] as Platform} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ButtonLink href={`/aplikasi/${app!.slug}`} variant="secondary" size="sm" className="rounded-full">
                  {t.product?.viewDetail || "Detail"}
                </ButtonLink>
                <ButtonLink href={`/aplikasi/${app!.slug}`} size="sm" className="rounded-full">
                  <Download size={14} strokeWidth={2} />
                  {lang === "en" ? "Access" : lang === "zh" ? "使用" : "Unduh"}
                </ButtonLink>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs font-normal text-fg-faint">
        {lang === "en" ? "Clicking the access button directs you to the license and instructions page." : lang === "zh" ? "点击按钮将前往该产品的授权信息与使用说明页面。" : "Tombol unduh mengarah ke halaman detail aplikasi untuk mengunduh versi terbaru lisensi Anda."}
      </p>
    </div>
  );
}