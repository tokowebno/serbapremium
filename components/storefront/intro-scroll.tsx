"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Rating } from "@/components/ui/rating";
import { formatRupiah } from "@/lib/utils";
import { easeOut } from "@/components/ui/reveal";

/**
 * Intro sinematik scroll-driven — gulir seperti memutar video.
 * Adegan: logo → tagline → produk → penutup. Selesai = masuk beranda.
 * Progress dihitung manual dari scroll window (andal, tanpa useScroll ref).
 * Dirender hanya setelah mount untuk menghindari hydration mismatch.
 */

/** Interpolasi linear: p dinormalisasi dari [a,b] ke [outA,outB] dengan clamp. */
function lerp(p: number, a: number, b: number, outA: number, outB: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return outA + t * (outB - outA);
}

/** opacity 0→1 untuk rentang [a,b], lalu tetap 1. */
function fadeIn(p: number, a: number, b: number): number {
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

function IntroScenes({ onFinish }: { onFinish: () => void }) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = spacerRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      setP(Math.min(1, Math.max(0, window.scrollY / total)));
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (p > 0.94 && !finishedRef.current) {
      finishedRef.current = true;
      onFinish();
    }
  }, [p, onFinish]);

  const apps = api.apps.featured().slice(0, 3);

  const logo = { opacity: fadeIn(p, 0, 0.06), y: lerp(p, 0, 0.1, 26, 0), scale: lerp(p, 0, 0.12, 0.92, 1) };
  const tag = { opacity: fadeIn(p, 0.14, 0.24), y: lerp(p, 0.14, 0.26, 30, 0) };
  const tagWord = fadeIn(p, 0.24, 0.34);
  const card = { opacity: fadeIn(p, 0.42, 0.54), y: lerp(p, 0.42, 0.56, 60, 0), scale: lerp(p, 0.42, 0.6, 0.96, 1) };
  const close = { opacity: fadeIn(p, 0.74, 0.84), y: lerp(p, 0.74, 0.86, 24, 0) };
  const overlayOpacity = 1 - fadeIn(p, 0.88, 0.97);

  return (
    <>
      <div ref={spacerRef} className="h-[340vh]" aria-hidden="true" />

      <motion.div
        className="glass-backdrop fixed inset-0 z-[70] flex items-center justify-center overflow-hidden"
        style={{ opacity: overlayOpacity }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: easeOut } }}
      >
        <div className="tk-container flex min-h-full flex-col items-center justify-center text-center">
          {/* Adegan 1 — logo */}
          <motion.div style={logo} className="flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fg shadow-lg">
              <span className="block h-8 w-8 rounded-md border-2 border-bg" />
            </span>
            <p className="mt-5 text-3xl font-semibold tracking-tight">Tokono</p>
            <p className="mt-2 text-sm text-fg-muted">Marketplace aplikasi premium</p>
          </motion.div>

          {/* Adegan 2 — tagline */}
          <motion.div style={tag} className="absolute inset-x-0 flex flex-col items-center px-6">
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Temukan aplikasi yang{" "}
              <motion.span style={{ opacity: tagWord }} className="text-accent">
                tepat.
              </motion.span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-fg-muted">
              Jelajahi aplikasi premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.
            </p>
          </motion.div>

          {/* Adegan 3 — produk */}
          <motion.div style={card} className="absolute inset-x-0 flex justify-center px-6">
            <div className="glass flex items-center gap-4 rounded-2xl px-6 py-5 shadow-lg">
              <AppIcon icon={apps[0].icon} size="lg" />
              <div className="text-left">
                <p className="text-[15px] font-semibold">{apps[0].name}</p>
                <p className="text-[13px] text-fg-muted">{apps[1].name}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Rating value={apps[0].rating} showValue={false} size={11} />
                  <span className="text-xs text-fg-muted tabular-nums">
                    mulai {formatRupiah(apps[0].price)}
                  </span>
                </div>
              </div>
              <AppIcon icon={apps[1].icon} size="lg" />
            </div>
          </motion.div>

          {/* Adegan 4 — penutup */}
          <motion.div style={close} className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 pb-16">
            <p className="text-sm font-medium text-fg-muted">Siap menjelajah?</p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1 text-fg-faint"
            >
              <ChevronDown size={18} />
              <span className="text-xs tracking-wide uppercase">Gulir terus</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bar progres video */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-surface-2">
          <motion.div className="h-full bg-accent" style={{ scaleX: p, originX: 0 }} />
        </div>
      </motion.div>
    </>
  );
}

export function IntroScroll() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  // Render null di server & render pertama — intro baru muncul setelah mount (client).
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (reduce || pathname !== "/") {
      setDone(true);
      return;
    }
    try {
      if (sessionStorage.getItem("tokono:intro") === "1") {
        setDone(true);
      }
    } catch {
      /* abaikan */
    }
  }, [reduce, pathname]);

  const finish = () => {
    try {
      sessionStorage.setItem("tokono:intro", "1");
    } catch {
      /* abaikan */
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setDone(true);
  };

  if (!mounted || done) return null;

  return (
    <AnimatePresence>
      <IntroScenes key="intro" onFinish={finish} />
    </AnimatePresence>
  );
}
