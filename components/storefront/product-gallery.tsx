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
          className="block w-full cursor-zoom-in"
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
                "overflow-hidden rounded-lg transition-all duration-200",
                active === i
                  ? "ring-2 ring-accent ring-offset-2 ring-offset-bg"
                  : "opacity-70 hover:opacity-100",
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
            className={cn("w-[85%] shrink-0", active === i && "opacity-100")}
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
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-3xl"
              role="dialog"
              aria-modal="true"
              aria-label="Tangkapan layar {app.name}"
            >
              <MockScreenshot variant={shots[active]} accent={accent} className="aspect-[16/10] w-full" />
              <button
                onClick={() => setLightbox(false)}
                aria-label="Tutup"
                className="glass absolute -top-4 -right-4 rounded-full p-2.5 text-fg"
              >
                <X size={16} />
              </button>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setActive((i) => (i - 1 + shots.length) % shots.length)}
                  aria-label="Sebelumnya"
                  className="glass rounded-full p-2.5 text-fg"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-fg-muted tabular-nums">
                  {active + 1} / {shots.length}
                </span>
                <button
                  onClick={() => setActive((i) => (i + 1) % shots.length)}
                  aria-label="Berikutnya"
                  className="glass rounded-full p-2.5 text-fg"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
