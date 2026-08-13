"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
 * Tampil sekali per sesi (sessionStorage), dilewati saat "kurangi gerakan".
 */

function IntroScenes({ onFinish }: { onFinish: () => void }) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });

  const logoOpacity = useTransform(scrollYProgress, [0, 0.06, 0.16], [0, 1, 1]);
  const logoY = useTransform(scrollYProgress, [0, 0.1], [26, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.12], [0.92, 1]);

  const tagOpacity = useTransform(scrollYProgress, [0.14, 0.24, 0.4], [0, 1, 1]);
  const tagY = useTransform(scrollYProgress, [0.14, 0.26], [30, 0]);
  const tagWord2 = useTransform(scrollYProgress, [0.24, 0.34], [0, 1]);

  const cardOpacity = useTransform(scrollYProgress, [0.42, 0.54, 0.72], [0, 1, 1]);
  const cardY = useTransform(scrollYProgress, [0.42, 0.56], [60, 0]);
  const cardScale = useTransform(scrollYProgress, [0.42, 0.6], [0.96, 1]);

  const closeOpacity = useTransform(scrollYProgress, [0.74, 0.84, 0.92], [0, 1, 1]);
  const closeY = useTransform(scrollYProgress, [0.74, 0.86], [24, 0]);

  const overlayOpacity = useTransform(scrollYProgress, [0.88, 0.97], [1, 0]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.94 && !finishedRef.current) {
        finishedRef.current = true;
        onFinish();
      }
    });
    return () => {
      unsub();
      document.body.style.overflow = "";
    };
  }, [scrollYProgress, onFinish]);

  const apps = api.apps.featured().slice(0, 3);

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
          <motion.div style={{ opacity: logoOpacity, y: logoY, scale: logoScale }} className="flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fg shadow-lg">
              <span className="block h-8 w-8 rounded-md border-2 border-bg" />
            </span>
            <p className="mt-5 text-3xl font-semibold tracking-tight">Tokono</p>
            <p className="mt-2 text-sm text-fg-muted">Marketplace aplikasi premium</p>
          </motion.div>

          {/* Adegan 2 — tagline */}
          <motion.div style={{ opacity: tagOpacity, y: tagY }} className="absolute inset-x-0 flex flex-col items-center px-6">
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Temukan aplikasi yang{" "}
              <motion.span style={{ opacity: tagWord2 }} className="text-accent">
                tepat.
              </motion.span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-fg-muted">
              Jelajahi aplikasi premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.
            </p>
          </motion.div>

          {/* Adegan 3 — produk */}
          <motion.div
            style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}
            className="absolute inset-x-0 flex justify-center px-6"
          >
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
          <motion.div
            style={{ opacity: closeOpacity, y: closeY }}
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 pb-16"
          >
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
          <motion.div className="h-full bg-accent" style={{ scaleX: barScale, originX: 0 }} />
        </div>
      </motion.div>
    </>
  );
}

export function IntroScroll() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  // Dimulai "intro" agar render server & client identik (hindari hydration mismatch).
  const [phase, setPhase] = useState<"intro" | "done">("intro");

  useEffect(() => {
    if (reduce || pathname !== "/") {
      setPhase("done");
      return;
    }
    try {
      if (sessionStorage.getItem("tokono:intro") === "1") {
        setPhase("done");
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
    setPhase("done");
  };

  if (phase !== "intro") return null;

  return (
    <AnimatePresence>
      <IntroScenes key="intro" onFinish={finish} />
    </AnimatePresence>
  );
}