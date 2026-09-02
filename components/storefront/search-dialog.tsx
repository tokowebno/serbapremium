"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { AppIcon } from "@/components/ui/app-icon";
import type { App } from "@/types";
import { useTranslation } from "./i18n-provider";
import { getLocalizedApp, getLocalizedCategory } from "@/lib/i18n/product-translations";

const RECENT_KEY = "serbapremium:recent-searches";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { lang, t } = useTranslation();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<App[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => setQ(""));
    try {
      const stored = localStorage.getItem(RECENT_KEY) || localStorage.getItem("tokono:recent-searches");
      if (stored) {
        queueMicrotask(() => {
          try {
            setRecent(JSON.parse(stored));
          } catch {
            setRecent([]);
          }
        });
      }
    } catch {
      /* localStorage not available */
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (q.trim().length === 0) {
      queueMicrotask(() => setResults([]));
      return;
    }
    queueMicrotask(() => setResults(api.apps.search(q.trim())));
  }, [q, open]);

  const saveRecent = (term: string) => {
    try {
      const next = [term, ...recent.filter((r) => r.toLowerCase() !== term.toLowerCase())].slice(0, 5);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* localStorage not available */
    }
  };

  const goToResults = (term: string) => {
    saveRecent(term);
    onClose();
    router.push(`/aplikasi?q=${encodeURIComponent(term)}`);
  };

  const popularCats = api.categories.withCount().slice(0, 4);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.navbar?.search || "Pencarian"}
            className="glass-card relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/80 bg-surface/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 border-b border-border/70 bg-surface-2/70 px-5 py-4">
              <Search size={18} className="shrink-0 text-fg-muted" strokeWidth={2} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q.trim()) goToResults(q.trim());
                }}
                placeholder={lang === "en" ? "Search applications, premium accounts, AI tools…" : lang === "zh" ? "搜索应用、高级会员、AI 生产力工具…" : "Cari aplikasi, akun premium, tools AI…"}
                className="w-full bg-transparent text-[15px] font-medium text-fg outline-none placeholder:text-fg-faint"
                aria-label="Kata kunci pencarian"
              />
              <button
                onClick={onClose}
                aria-label="Tutup pencarian"
                className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-mono text-fg-faint ring-1 ring-border"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto scrollbar-thin p-3">
              {q.trim() === "" ? (
                <div className="p-2">
                  {recent.length > 0 && (
                    <div className="mb-5">
                      <p className="mb-2 text-xs font-semibold tracking-wide text-fg-muted uppercase">
                        {lang === "en" ? "Recent Searches" : lang === "zh" ? "最近搜索" : "Pencarian terbaru"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQ(r)}
                            className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-fg ring-1 ring-border/50 transition-colors hover:bg-surface-3"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="mb-2 text-xs font-semibold tracking-wide text-fg-muted uppercase">
                    {lang === "en" ? "Popular Categories" : lang === "zh" ? "热门分类" : "Kategori populer"}
                  </p>
                  <div className="grid gap-1.5">
                    {popularCats.map((cat) => {
                      const localized = getLocalizedCategory(cat, lang);
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.id}
                          href={`/kategori/${cat.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-2"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                            <Icon size={16} strokeWidth={2} />
                          </span>
                          <span className="text-sm font-medium text-fg">{localized.name}</span>
                          <ArrowRight size={14} className="ml-auto text-fg-faint" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm font-medium text-fg-muted">
                  {lang === "en" ? `No results found for "${q}".` : lang === "zh" ? `未找到与 “${q}” 相关的产品。` : `Tidak ada hasil untuk "${q}".`}
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="px-2 py-1 text-xs font-semibold tracking-wide text-fg-muted uppercase">
                    {results.length} {lang === "en" ? "results found" : lang === "zh" ? "条匹配结果" : "hasil ditemukan"}
                  </p>
                  {results.map((rawApp) => {
                    const app = getLocalizedApp(rawApp, lang);
                    return (
                      <Link
                        key={app.id}
                        href={`/aplikasi/${app.slug}`}
                        onClick={() => {
                          saveRecent(app.name);
                          onClose();
                        }}
                        className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-2"
                      >
                        <AppIcon icon={app.icon} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-fg">{app.name}</p>
                          <p className="truncate text-xs font-normal text-fg-muted">{app.tagline}</p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-fg">
                          {formatPrice(app.price, lang)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {q.trim() && (
              <div className="border-t border-border/70 bg-surface-2/60 px-5 py-3 text-right">
                <button
                  onClick={() => goToResults(q.trim())}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                >
                  {lang === "en" ? `View all results for "${q}"` : lang === "zh" ? `查看 “${q}” 的全部结果` : `Lihat semua hasil untuk "${q}"`}
                  <ArrowRight size={13} strokeWidth={2} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
