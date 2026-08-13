"use client";

import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { AppIcon } from "@/components/ui/app-icon";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { StaggerWords, easeOut } from "@/components/ui/reveal";

function HeroVisual() {
  const apps = api.apps.featured().slice(0, 3);
  return (
    <div className="relative hidden h-[420px] lg:block" aria-hidden="true">
      {/* Depth: artwork blur di belakang */}
      <div
        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${apps[0].icon.from}33 0%, transparent 70%)`,
        }}
      />

      {/* Floating surfaces dengan hubungan spatial */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
        className="absolute top-8 left-4"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="-rotate-6"
        >
          <div className="mat-clear rounded-2xl p-3">
            <AppIcon icon={apps[0].icon} size="xl" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
        className="absolute top-0 left-52"
      >
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="rotate-6"
        >
          <div className="mat-func rounded-2xl p-3">
            <AppIcon icon={apps[1].icon} size="xl" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65, ease: easeOut }}
        className="absolute top-56 left-28"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="-rotate-3"
        >
          <div className="mat-clear rounded-2xl p-3">
            <AppIcon icon={apps[2].icon} size="xl" />
          </div>
        </motion.div>
      </motion.div>

      {/* Kartu info mengambang */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8, ease: easeOut }}
        className="absolute right-0 bottom-8"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="mat-func flex items-center gap-3 rounded-2xl px-4 py-3"
        >
          <AppIcon icon={apps[0].icon} size="sm" />
          <div>
            <p className="text-sm leading-tight font-semibold">{apps[0].name}</p>
            <div className="mt-1 flex items-center gap-2">
              <Rating value={apps[0].rating} showValue={false} size={11} />
              <span className="text-xs text-fg-muted tabular-nums">{formatRupiah(apps[0].price)}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="ambient-bg relative tk-container grid items-center gap-14 pt-40 pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
      <div className="max-w-xl">
        <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-fg-muted uppercase">
          Marketplace aplikasi premium
        </p>
        <h1 className="text-[42px] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-6xl">
          <StaggerWords text="Temukan aplikasi yang tepat." />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45, ease: easeOut }}
          className="mt-5 max-w-md text-[17px] leading-7 text-fg-muted"
        >
          Jelajahi aplikasi premium untuk berbagai perangkat, pilih yang sesuai kebutuhan, dan gunakan tanpa
          langganan.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.62, ease: easeOut }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <ButtonLink href="/aplikasi" size="lg">
            Jelajahi Aplikasi
          </ButtonLink>
          <ButtonLink href="/promo" size="lg" variant="secondary">
            Lihat Promo
          </ButtonLink>
        </motion.div>
      </div>
      <HeroVisual />
    </section>
  );
}
