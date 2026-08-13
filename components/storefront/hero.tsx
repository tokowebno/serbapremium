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
  // Layangan sangat halus (6 detik, ±7px) — tenang, bukan gerakan mencolok.
  return (
    <div className="relative hidden h-[380px] lg:block" aria-hidden="true">
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute top-6 left-6 -rotate-[9deg]">
          <AppIcon icon={apps[0].icon} size="2xl" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <div className="absolute top-0 left-44 rotate-[7deg]">
          <AppIcon icon={apps[1].icon} size="2xl" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <div className="absolute top-52 left-24 -rotate-[3deg]">
          <AppIcon icon={apps[2].icon} size="2xl" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
        className="absolute right-0 bottom-6"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="glass flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg"
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
    <section className="glass-backdrop relative tk-container grid items-center gap-16 pt-40 pb-24 lg:grid-cols-2">
      <div className="max-w-xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
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
          transition={{ duration: 0.55, delay: 0.65, ease: easeOut }}
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
