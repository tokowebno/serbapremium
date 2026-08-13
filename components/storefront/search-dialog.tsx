"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { AppIcon } from "@/components/ui/app-icon";
import type { App } from "@/types";

const RECENT_KEY = "tokono:recent-searches";

const popularCategories = ["Desain", "Produktivitas", "Pengembangan", "AI", "Keamanan"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<App[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => setQ(""));
    try {
      const stored = localStorage.getItem(RECENT_KEY);
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
      /* localStorage tidak tersedia */
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

  const commitSearch = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* abaikan */
    }
  };

  const goToResults = (term: string) => {
    commitSearch(term);
    onClose();
    router.push(`/aplikasi?q=${encodeURIComponent(term)}`);
  };

  const categoryHref = (name: string) => {
    const cat = api.categories.list().find((c) => c.name === name);
    return cat ? `/kategori/${cat.slug}` : "/aplikasi";
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            className="absolute inset-0 bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian"
            className="mat-strong relative w-full max-w-xl overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--elev-3)]"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search size={18} className="shrink-0 text-fg-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q.trim()) goToResults(q.trim());
                }}
                placeholder="Cari aplikasi, pengembang, kategori…"
                className="w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-faint"
                aria-label="Kata kunci pencarian"
              />
              <kbd className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[11px] text-fg-faint">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto scrollbar-thin">
              {q.trim() === "" ? (
                <div className="p-4">
                  {recent.length > 0 && (
                    <div className="mb-5">
                      <p className="mb-2 px-2 text-xs font-semibold tracking-wide text-fg-faint uppercase">
                        Pencarian terbaru
                      </p>
                      <div className="flex flex-wrap gap-2 px-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQ(r)}
                            className="rounded-full border border-border bg-surface px-3 py-1 text-[13px] text-fg-muted transition-colors hover:text-fg"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="mb-2 px-2 text-xs font-semibold tracking-wide text-fg-faint uppercase">
                    Kategori populer
                  </p>
                  <div className="grid gap-1">
                    {popularCategories.map((name) => {
                      const cat = api.categories.list().find((c) => c.name === name);
                      if (!cat) return null;
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.id}
                          href={categoryHref(name)}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2">
                            <Icon size={15} className="text-fg-muted" />
                          </span>
                          <span className="text-sm font-medium">{cat.name}</span>
                          <ArrowRight size={14} className="ml-auto text-fg-faint" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-fg-muted">
                  Tidak ada hasil untuk “{q}”.
                </p>
              ) : (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-fg-faint uppercase">
                    {results.length} hasil
                  </p>
                  {results.map((app) => (
                    <Link
                      key={app.id}
                      href={`/aplikasi/${app.slug}`}
                      onClick={() => {
                        commitSearch(q.trim());
                        onClose();
                      }}
                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-2"
                    >
                      <AppIcon icon={app.icon} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{app.name}</p>
                        <p className="truncate text-[13px] text-fg-muted">{app.tagline}</p>
                      </div>
                      <span className="ml-auto shrink-0 text-sm font-semibold tabular-nums">
                        {formatRupiah(app.price)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
