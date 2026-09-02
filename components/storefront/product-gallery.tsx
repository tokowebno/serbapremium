"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { App, ScreenshotKey } from "@/types";
import { MockScreenshot } from "./mock-screenshot";
import { cn } from "@/lib/utils";

export function ProductGallery({ app }: { app: App }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const accent = app.icon.to;
  const shots: ScreenshotKey[] = app.screenshots;

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % shots.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + shots.length) % shots.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, shots.length]);

  return (
    <div>
      {/* Desktop: utama + thumbnail */}
      <div className="hidden md:block">
        <button
          onClick={() => setLightbox(true)}
          className="block w-full cursor-zoom-in rounded-lg border-2 border-border shadow-[4px_4px_0px_var(--shadow-color)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--shadow-color)] overflow-hidden"
          aria-label="Perbesar tangkapan layar"
        >
          <MockScreenshot variant={shots[active]} accent={accent} className="aspect-[16/10] w-full" />
        </button>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {shots.map((s, i) => (
            <button
              key={s + i}
              onClick={() => setActive(i)}
              aria-label={`Lihat tangkapan layar ${i + 1}`}
              aria-current={active === i}
              className={cn(
                "overflow-hidden rounded-md border-2 transition-all duration-100",
                active === i
                  ? "border-border shadow-[3px_3px_0px_var(--shadow-color)] -translate-x-0.5 -translate-y-0.5"
                  : "border-border/40 opacity-70 hover:opacity-100 hover:border-border",
              )}
            >
              <MockScreenshot variant={s} accent={accent} className="aspect-[16/10] w-full" />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto md:hidden" aria-label="Galeri tangkapan layar">
        {shots.map((s, i) => (
          <button
            key={s + i}
            onClick={() => setActive(i)}
            className={cn(
              "w-[85%] shrink-0 rounded-lg border-2 border-border shadow-[3px_3px_0px_var(--shadow-color)] overflow-hidden",
              active === i && "border-accent",
            )}
          >
            <MockScreenshot variant={s} accent={accent} className="aspect-[16/10] w-full" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              className="absolute inset-0 bg-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-3xl rounded-lg border-2 border-border bg-surface p-4 shadow-[8px_8px_0px_var(--shadow-color)]"
              role="dialog"
              aria-modal="true"
              aria-label={`Tangkapan layar ${app.name}`}
            >
              <div className="overflow-hidden rounded-md border-2 border-border">
                <MockScreenshot variant={shots[active]} accent={accent} className="aspect-[16/10] w-full" />
              </div>
              <button
                onClick={() => setLightbox(false)}
                aria-label="Tutup"
                className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-discount text-white shadow-[2px_2px_0px_var(--shadow-color)]"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setActive((i) => (i - 1 + shots.length) % shots.length)}
                  aria-label="Sebelumnya"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface text-fg shadow-[2px_2px_0px_var(--shadow-color)] hover:bg-surface-2 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <span className="rounded-xs border border-border bg-surface-2 px-2 py-0.5 text-xs font-bold tabular-nums text-fg">
                  {active + 1} / {shots.length}
                </span>
                <button
                  onClick={() => setActive((i) => (i + 1) % shots.length)}
                  aria-label="Berikutnya"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface text-fg shadow-[2px_2px_0px_var(--shadow-color)] hover:bg-surface-2 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
