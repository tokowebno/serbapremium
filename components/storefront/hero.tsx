"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatPrice, USDT_RATE } from "@/lib/utils";
import { useTranslation } from "./i18n-provider";
import { useAuth } from "./providers";
import { getLocalizedApp } from "@/lib/i18n/product-translations";

const PRESET_TOPUPS = [
  { usd: 5, idr: 5 * USDT_RATE },
  { usd: 10, idr: 10 * USDT_RATE },
  { usd: 25, idr: 25 * USDT_RATE },
  { usd: 50, idr: 50 * USDT_RATE },
];

export function Hero() {
  const { lang } = useTranslation();
  const { openTopUp } = useAuth();
  const allApps = api.apps.featured();
  const showcaseApps = allApps.slice(0, 5);

  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTopup] = useState(10);

  // Auto rotate showcase item every 4.5 seconds with pause support
  useEffect(() => {
    if (isPaused || showcaseApps.length === 0) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActiveTab((prev) => (prev + 1) % showcaseApps.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, showcaseApps.length]);

  const handleSelectTab = (idx: number) => {
    setDirection(idx > activeTab ? 1 : -1);
    setActiveTab(idx);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveTab((prev) => (prev - 1 + showcaseApps.length) % showcaseApps.length);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveTab((prev) => (prev + 1) % showcaseApps.length);
  };

  const currentShowcaseApp = showcaseApps[activeTab] || showcaseApps[0];
  const localizedShowcase = currentShowcaseApp ? getLocalizedApp(currentShowcaseApp, lang) : null;

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Background styling - Removed AI colorful blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-bg" />

      <div className="tk-container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          
          {/* LEFT COLUMN: HERO HEADLINE & VALUE PROPOSITION */}
          <div className="space-y-6 text-left min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full bg-surface-2 border border-border px-3 py-1 text-xs font-bold text-fg"
            >
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fg" />
              </span>
              <span className="font-mono text-[11px] font-bold tracking-wider">
                TEXASAI · PLATFORM LISENSI RESMI
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] text-fg"
            >
              Akses Flagship AI Pro,{" "}
              <span className="text-fg">
                Beli Sekali Tanpa Langganan.
              </span>
            </motion.h1>

            {/* Sub-tagline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="max-w-xl text-[14.5px] sm:text-base font-normal leading-relaxed text-fg-muted"
            >
              {lang === "en"
                ? "Smart digital licensing platform with integrated wallet system. Top up via QRIS & Multi-Crypto for instant access to ChatGPT (GPT-6 Astra & Sol), Claude (Opus & Sonnet 5.5), Gemini 4 Argon, Grok 4.7, Cursor, and 40+ latest-generation premium AI applications."
                : lang === "zh"
                ? "智能数字授权平台，集成一体化充值钱包。支持 QRIS 与多币种加密货币即时结算，秒级开通 ChatGPT (GPT-6 Astra/Sol)、Claude (Opus/Sonnet 5.5)、Gemini 4 Argon、Grok 4.7、Cursor 及 40+ 款 2026 最新前沿 AI 应用。"
                : "Platform lisensi digital pintar dengan sistem dompet terpadu. Cukup isi saldo akun via QRIS & Multi-Crypto untuk belanja instan ChatGPT (GPT-6 Astra & Sol), Claude (Opus & Sonnet 5.5), Gemini 4 Argon, Grok 4.7, Cursor, dan 40+ aplikasi AI premium generasi terbaru."}
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <ButtonLink
                href="/aplikasi"
                size="lg"
                className="!bg-fg !text-surface rounded-full font-bold px-7 shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{lang === "en" ? "Explore All Applications" : lang === "zh" ? "探索全部应用" : "Jelajahi Semua Aplikasi"}</span>
                <ArrowRight size={16} strokeWidth={2.5} className="text-surface" />
              </ButtonLink>

              <Button
                onClick={() => openTopUp()}
                size="lg"
                className="rounded-full font-bold px-6 bg-surface-2 border border-border text-fg hover:bg-surface-3 active:scale-95 transition-all cursor-pointer"
              >
                <span>{lang === "en" ? "Top Up Balance" : lang === "zh" ? "充值余额" : "Isi Saldo"}</span>
              </Button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: APPLE iOS 27 LIQUID GLASS TERMINAL & SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative min-w-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Outer Apple Liquid Glass Slab */}
            <div className="bg-surface border-2 border-border rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-6 shadow-[8px_8px_0_0_var(--color-border)] transition-all">
              
              {/* Dynamic Countdown Progress Bar (Top Liquid Edge) */}
              <div className="absolute top-0 inset-x-0 h-1 overflow-hidden rounded-t-[inherit]">
                <motion.div
                  key={`${activeTab}-${isPaused}`}
                  initial={{ width: "0%" }}
                  animate={{ width: isPaused ? "100%" : "100%" }}
                  transition={{
                    duration: isPaused ? 0 : 4.5,
                    ease: "linear",
                  }}
                  className="h-full bg-fg"
                />
              </div>

              {/* Terminal Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-black/[0.06] dark:border-white/[0.1] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong shadow-xs" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong shadow-xs" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong shadow-xs" />
                  </div>
                  <span className="ml-1.5 font-mono text-[10.5px] sm:text-[11px] font-bold text-fg tracking-wider">
                    TEXASAI LIQUID TERMINAL
                  </span>
                </div>

                {/* Radar Ping Latency Badge */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-2 py-0.5 font-mono text-[9.5px] sm:text-[10px] font-bold text-fg">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fg" />
                    </span>
                    <span>14ms Latency</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Live Spotlight Card: iOS 27 Liquid Glass Slab */}
              <div className="bg-surface-2 border-2 border-border relative mt-3 sm:mt-4 min-h-[165px] rounded-xl sm:rounded-2xl p-3 sm:p-5">
                <AnimatePresence mode="wait" custom={direction}>
                  {localizedShowcase && (
                    <motion.div
                      key={currentShowcaseApp.id}
                      custom={direction}
                      initial={{
                        opacity: 0,
                        x: direction * 28,
                        scale: 0.98,
                        filter: "blur(6px)",
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }}
                      exit={{
                        opacity: 0,
                        x: direction * -28,
                        scale: 0.98,
                        filter: "blur(6px)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                        mass: 0.8,
                      }}
                      className="space-y-3.5"
                    >
                      {/* App Header & Rating */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          className="shrink-0"
                        >
                          <AppIcon
                            icon={currentShowcaseApp.icon}
                            size="md"
                          />
                        </motion.div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-surface-2 border border-border px-2.5 py-0.5 text-[10px] font-bold text-fg uppercase tracking-wider">
                              {currentShowcaseApp.categoryId}
                            </span>

                            {/* Clean Minimal Rating Badge */}
                            <span className="rounded-full bg-surface-2 border border-border px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-fg-muted">
                              {currentShowcaseApp.rating.toFixed(1)} / 5.0
                            </span>
                          </div>

                          <h3 className="mt-1 text-base sm:text-lg font-bold text-fg truncate tracking-tight">
                            {localizedShowcase.name}
                          </h3>
                          <p className="text-xs text-fg-muted line-clamp-2 mt-0.5 leading-snug">
                            {localizedShowcase.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Price & 1-Click Action */}
                      <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5">
                        <div className="min-w-0 flex-1">
                          <span className="text-[9.5px] sm:text-[10px] font-bold tracking-wider text-fg-muted uppercase block">
                            HARGA LISENSI RESMI
                          </span>
                          <div className="flex flex-wrap items-baseline gap-x-1.5 mt-0.5">
                            <span className="text-lg sm:text-2xl font-black text-fg tabular-nums tracking-tight">
                              {formatPrice(currentShowcaseApp.price, lang)}
                            </span>
                            <span className="text-[11px] font-semibold text-fg-muted shrink-0">
                              (≈ ${(currentShowcaseApp.price / USDT_RATE).toFixed(2)})
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/aplikasi/${currentShowcaseApp.slug}`}
                          className="group inline-flex items-center justify-center gap-1 rounded-full bg-fg text-surface px-3 sm:px-4 py-2 text-xs font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm shrink-0 whitespace-nowrap"
                        >
                          <span>Beli Langsung</span>
                          <ChevronRight
                            size={13}
                            className="transition-transform group-hover:translate-x-0.5 text-surface shrink-0"
                          />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtle navigation arrows on hover */}
                <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Produk Sebelumnya"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/80 border border-black/10 dark:border-white/10 text-fg-muted hover:text-fg shadow-xs cursor-pointer"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Produk Berikutnya"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/80 border border-black/10 dark:border-white/10 text-fg-muted hover:text-fg shadow-xs cursor-pointer"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Apple Segmented Liquid Glass Dock (Tabs) */}
              <div className="bg-surface-2 border-2 border-border relative mt-3 flex items-center gap-1 overflow-x-auto no-scrollbar rounded-2xl p-1.5">
                {showcaseApps.map((app, idx) => {
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleSelectTab(idx)}
                      className={`relative z-10 flex shrink-0 sm:flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                        isActive
                          ? "text-fg font-bold bg-surface border border-border shadow-sm"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <AppIcon
                          icon={app.icon}
                          size="2xs"
                        />
                        <span className="text-[11.5px] font-bold">
                          {app.name.split(" ")[0]}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Quick Top Up Simulator (Apple Liquid Glass) */}
              <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fg">
                    <Wallet size={13} className="text-fg" />
                    Isi Saldo Cepat
                  </span>
                  <button
                    type="button"
                    onClick={() => openTopUp()}
                    className="text-[11px] font-bold text-fg hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Menu Lengkap</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {PRESET_TOPUPS.map((p) => (
                    <button
                      key={p.usd}
                      type="button"
                      onClick={() => openTopUp(p.idr)}
                      className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                        selectedTopup === p.usd
                          ? "border-fg bg-fg text-surface font-bold shadow-sm"
                          : "bg-surface text-fg-muted hover:text-fg border-border hover:border-border-strong"
                      }`}
                    >
                      <span className={`text-[11px] sm:text-xs font-black ${selectedTopup === p.usd ? "text-surface" : "text-fg"}`}>${p.usd}</span>
                      <span className={`text-[9px] sm:text-[9.5px] tabular-nums mt-0.5 ${selectedTopup === p.usd ? "text-surface/80" : "text-fg-muted"}`}>
                        {p.usd * 16.5}k
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
