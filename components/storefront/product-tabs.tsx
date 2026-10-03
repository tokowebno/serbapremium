"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Check, ShieldCheck, ShoppingCart } from "lucide-react";
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

function StructuredSummary({ summary, fallbackDescription, lang }: { summary?: string; fallbackDescription?: string; lang: string }) {
  const text = summary || fallbackDescription || "";
  if (!text) return null;

  // Normalisasi baris jika 1. 2. 3. menumpuk dalam satu baris teks
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\s+(\d+\.\s+)/g, "\n$1")
    .replace(/(CARA ORDER [^:\n]+:)/gi, "\n\n$1\n")
    .replace(/(HOW TO ORDER [^:\n]+:)/gi, "\n\n$1\n")
    .replace(/(购买流程[^：\n]+：)/g, "\n\n$1\n")
    .replace(/(购买指引[^：\n]+：)/g, "\n\n$1\n")
    .replace(/(HAL PENTING [^:\n]+:)/gi, "\n\n$1\n")
    .replace(/(CATATAN PENGGUNAAN [^:\n]+:)/gi, "\n\n$1\n")
    .replace(/(IMPORTANT USAGE [^:\n]+:)/gi, "\n\n$1\n")
    .replace(/(重要使用须知[^：\n]+：)/g, "\n\n$1\n");

  const lines = normalized.split("\n").map((l) => l.trim()).filter(Boolean);
  let mode: "overview" | "steps" | "notes" = "overview";
  const overviewLines: string[] = [];
  const orderSteps: string[] = [];
  const notes: string[] = [];

  for (const line of lines) {
    if (/^(CARA ORDER|HOW TO ORDER|购买流程|购买指引)/i.test(line)) {
      mode = "steps";
      continue;
    }
    if (/^(HAL PENTING|CATATAN PENGGUNAAN|IMPORTANT USAGE|重要使用须知)/i.test(line)) {
      mode = "notes";
      continue;
    }

    if (mode === "overview") {
      overviewLines.push(line);
    } else if (mode === "steps") {
      const stepText = line.replace(/^\d+[\.\)]\s*/, "").trim();
      if (stepText) orderSteps.push(stepText);
    } else if (mode === "notes") {
      const noteText = line.replace(/^[•\-\*]\s*/, "").trim();
      if (noteText) notes.push(noteText);
    }
  }

  const stepTitle =
    lang === "en" ? "Purchase Guide" : lang === "zh" ? "购买流程指南" : "Panduan Pemesanan";
  const noteTitle =
    lang === "en" ? "Important Usage Notes" : lang === "zh" ? "重要使用须知与说明" : "Hal Penting & Catatan Penggunaan";

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      {overviewLines.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-surface/80 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
          <p className="text-[14.5px] font-normal leading-relaxed text-fg">
            {overviewLines.join(" ")}
          </p>
        </div>
      )}

      {/* Step-by-Step Order Guide */}
      {orderSteps.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-surface/80 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/60">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <ShoppingCart size={14} strokeWidth={2.5} />
            </span>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-fg">{stepTitle}</h4>
          </div>

          <div className="space-y-3">
            {orderSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium leading-relaxed text-fg pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Notes / Warranty Callout */}
      {notes.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-amber-600 dark:text-amber-400 shrink-0" strokeWidth={2.5} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              {noteTitle}
            </h4>
          </div>
          <ul className="space-y-2">
            {notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] font-medium leading-relaxed text-fg-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
            <StructuredSummary summary={app.summary} fallbackDescription={app.description} lang={lang} />
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
              <Badge tone="accent">{app.version?.startsWith("v") ? `${t.product?.version || "Versi"} ${app.version}` : (app.version || "Official")}</Badge>
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
