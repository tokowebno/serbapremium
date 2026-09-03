"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import type { App } from "@/types";
import { api } from "@/lib/api";
import { formatCompact, formatDate, seededRandom } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { useTranslation } from "./i18n-provider";
import { getLocalizedApp, getLocalizedCategory } from "@/lib/i18n/product-translations";

function changelogFor(app: App, lang: string): string[] {
  const poolID = [
    "Perbaikan stabilitas saat membuka berkas besar",
    "Peningkatan kecepatan peluncuran hingga 25%",
    "Perbaikan sinkronisasi antar perangkat",
    "Pembaruan antarmuka dan aksesibilitas",
    "Optimasi penggunaan memori pada sesi panjang",
    "Perbaikan masalah ekspor pada format tertentu",
    "Pintasan keyboard baru untuk akses cepat",
    "Pembaruan terjemahan dan penyesuaian teks",
  ];
  const poolEN = [
    "Performance and stability enhancements for large workspaces",
    "Launch speed boosted by up to 25%",
    "Improved multi-device realtime synchronization",
    "Refined user interface and accessibility improvements",
    "Optimized memory usage during extended sessions",
    "Export and rendering improvements across all formats",
    "New quick keyboard shortcuts",
    "Multilingual locale and translation polish",
  ];
  const poolZH = [
    "全面优化处理超大文件与工作区的稳定性",
    "应用冷启动速度提升高达 25%",
    "增强多设备间实时同步与数据备份能力",
    "全新打磨的视觉界面与无障碍交互支持",
    "大幅优化长时间运行下的内存与 CPU 占用",
    "修复特定格式导出与渲染的兼容性问题",
    "新增常用功能全局快捷键支持",
    "多语言界面文案与本地化体验全面优化",
  ];

  const pool = lang === "en" ? poolEN : lang === "zh" ? poolZH : poolID;
  const rand = seededRandom(app.ratingCount * 13 + 7);
  return [...pool].sort(() => rand() - 0.5).slice(0, 4);
}

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border/80 bg-surface/80 p-3.5 shadow-sm backdrop-blur-sm">
      <dt className="text-xs font-medium text-fg-muted uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-fg">{children}</dd>
    </div>
  );
}

export function ProductTabs({ slug }: { slug: string; reviews?: any[] }) {
  const [active, setActive] = useState("ringkasan");
  const { lang, t } = useTranslation();
  const rawApp = api.apps.getBySlug(slug);
  if (!rawApp) return null;
  const app = getLocalizedApp(rawApp, lang);
  const developer = api.developers.getBySlug(app.developerId);
  const rawCategory = api.categories.getBySlug(app.categoryId);
  const category = rawCategory ? getLocalizedCategory(rawCategory, lang) : undefined;
  const changes = changelogFor(app, lang);

  const tabItems = [
    { id: "ringkasan", label: t.product?.tabs?.summary || "Ringkasan" },
    { id: "fitur", label: t.product?.tabs?.features || "Fitur" },
    { id: "persyaratan", label: t.product?.tabs?.requirements || "Persyaratan Sistem" },
    { id: "versi", label: t.product?.tabs?.version || "Versi" },
  ];

  return (
    <div>
      <Tabs items={tabItems} active={active} onChange={setActive} className="w-fit max-w-full" />

      <div className="mt-6">
        {active === "ringkasan" && (
          <div className="max-w-2xl">
            <div className="rounded-2xl border border-border/80 bg-surface/80 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
              <p className="text-[14.5px] font-normal leading-relaxed text-fg">{app.description}</p>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label={t.product?.byDeveloper || "Pengembang"}>
                {developer ? (
                  <Link href={`/pengembang/${developer.slug}`} className="text-accent hover:underline font-semibold">
                    {developer.name}
                  </Link>
                ) : (
                  "—"
                )}
              </Info>
              <Info label={t.filter?.category || "Kategori"}>
                {category ? (
                  <Link href={`/kategori/${category.slug}`} className="text-accent hover:underline font-semibold">
                    {category.name}
                  </Link>
                ) : (
                  "—"
                )}
              </Info>
              <Info label={lang === "en" ? "Released" : lang === "zh" ? "发布日期" : "Dirilis"}>{formatDate(app.releasedAt, lang)}</Info>
              <Info label={lang === "en" ? "Updated" : lang === "zh" ? "最近更新" : "Diperbarui"}>{formatDate(app.updatedAt, lang)}</Info>
              <Info label={lang === "en" ? "Total Delivered" : lang === "zh" ? "累计成交" : "Total Terjual"}>{formatCompact(app.downloads, lang)}</Info>
            </dl>
          </div>
        )}

        {active === "fitur" && (
          <ul className="grid max-w-2xl gap-3 sm:grid-cols-2">
            {app.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-surface/80 p-3.5 text-sm font-medium text-fg shadow-sm backdrop-blur-sm"
              >
                <Check size={17} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.5} />
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
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border/80 bg-surface/80 px-4 py-3.5 shadow-sm backdrop-blur-sm"
                >
                  <PlatformBadge platform={p} />
                  <p className="text-sm font-medium text-fg">{requirement}</p>
                </div>
              );
            })}
          </div>
        )}

        {active === "versi" && (
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/80 bg-surface/80 p-4 shadow-sm backdrop-blur-sm">
              <Badge tone="accent">{t.product?.version || "Versi"} {app.version}</Badge>
              <span className="text-xs font-medium text-fg-muted">{lang === "en" ? "Updated on" : lang === "zh" ? "更新于" : "Diperbarui"} {formatDate(app.updatedAt, lang)}</span>
            </div>
            <p className="mt-6 text-xs font-semibold tracking-wider text-fg-muted uppercase">{lang === "en" ? "Recent Changes" : lang === "zh" ? "最近更新日志" : "Perubahan terbaru"}</p>
            <ul className="mt-3 space-y-2.5">
              {changes.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-surface/80 p-3 text-sm font-medium text-fg shadow-sm"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" strokeWidth={2} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
