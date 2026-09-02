"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { AppIcon } from "@/components/ui/app-icon";
import type { App } from "@/types";

const RECENT_KEY = "serbapremium:recent-searches";

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
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian"
            className="relative w-full max-w-xl overflow-hidden rounded-lg border-2 border-border bg-surface shadow-[8px_8px_0px_var(--shadow-color)]"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 border-b-2 border-border bg-surface-2 px-5 py-3.5">
              <Search size={18} strokeWidth={2.5} className="shrink-0 text-fg" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q.trim()) goToResults(q.trim());
                }}
                placeholder="Cari aplikasi, akun premium, tools AI…"
                className="w-full bg-transparent text-[15px] font-bold text-fg outline-none placeholder:text-fg-faint"
                aria-label="Kata kunci pencarian"
              />
              <button
                onClick={onClose}
                aria-label="Tutup pencarian"
                className="rounded-xs border border-border bg-surface px-1.5 py-0.5 text-[11px] font-black text-fg shadow-[1px_1px_0px_var(--shadow-color)]"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto scrollbar-thin p-3">
              {q.trim() === "" ? (
                <div className="p-2">
                  {recent.length > 0 && (
                    <div className="mb-5">
                      <p className="mb-2 text-xs font-black tracking-wider text-fg-muted uppercase">
                        Pencarian terbaru
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQ(r)}
                            className="rounded-xs border-2 border-border bg-surface px-3 py-1 text-xs font-bold text-fg shadow-[1.5px_1.5px_0px_var(--shadow-color)] transition-all hover:bg-accent-yellow hover:text-black hover:-translate-x-0.5 hover:-translate-y-0.5"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="mb-2 text-xs font-black tracking-wider text-fg-muted uppercase">
                    Kategori populer
                  </p>
                  <div className="grid gap-1.5">
                    {popularCategories.map((name) => {
                      const cat = api.categories.list().find((c) => c.name === name);
                      if (!cat) return null;
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.id}
                          href={categoryHref(name)}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-md border-2 border-transparent p-2 transition-all hover:border-border hover:bg-surface-2 hover:shadow-[2px_2px_0px_var(--shadow-color)]"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-xs border-2 border-border bg-accent-yellow text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                            <Icon size={15} strokeWidth={2.5} />
                          </span>
                          <span className="text-sm font-bold text-fg">{cat.name}</span>
                          <ArrowRight size={14} strokeWidth={2.5} className="ml-auto text-fg-muted" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm font-bold text-fg-muted">
                  Tidak ada hasil untuk &ldquo;{q}&rdquo;.
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="px-2 py-1 text-xs font-black tracking-wider text-fg-muted uppercase">
                    {results.length} hasil ditemukan
                  </p>
                  {results.map((app) => (
                    <Link
                      key={app.id}
                      href={`/aplikasi/${app.slug}`}
                      onClick={() => {
                        commitSearch(q.trim());
                        onClose();
                      }}
                      className="flex items-center gap-3 rounded-md border-2 border-transparent p-2.5 transition-all hover:border-border hover:bg-surface-2 hover:shadow-[2px_2px_0px_var(--shadow-color)]"
                    >
                      <AppIcon icon={app.icon} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-fg">{app.name}</p>
                        <p className="truncate text-[13px] font-medium text-fg-muted">{app.tagline}</p>
                      </div>
                      <span className="ml-auto shrink-0 text-sm font-black tabular-nums text-fg">
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
