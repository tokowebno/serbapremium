"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { StaggerWords, easeOut } from "@/components/ui/reveal";
import { formatRupiah } from "@/lib/utils";

/**
 * Hero — application discovery experience.
 * Komposisi baru: environmental artwork + integrated headline
 * + floating app shelf (bukan headline kiri + icon random kanan).
 */
export function Hero() {
  const apps = api.apps.featured().slice(0, 4);

  return (
    <section className="relative overflow-hidden pt-36 pb-28">
      {/* Environmental layer — artwork aplikasi sebagai cahaya lingkungan */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full opacity-70 blur-3xl"
          style={{ background: `radial-gradient(circle, ${apps[0].icon.from}40 0%, transparent 65%)` }}
        />
        <div
          className="absolute top-10 right-[-10%] h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
          style={{ background: `radial-gradient(circle, ${apps[1].icon.to}38 0%, transparent 65%)` }}
        />
        <div
          className="absolute bottom-[-20%] left-1/3 h-[380px] w-[380px] rounded-full opacity-50 blur-3xl"
          style={{ background: `radial-gradient(circle, ${apps[2].icon.from}30 0%, transparent 65%)` }}
        />
      </div>

      <div className="tk-container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Integrated headline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
            className="mx-auto mb-6 w-fit"
          >
            <span className="mat-func inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium text-fg-muted">
              <Sparkles size={14} className="text-accent" />
              Marketplace aplikasi premium
            </span>
          </motion.div>

          <h1 className="text-[44px] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[68px]">
            <StaggerWords text="Temukan aplikasi yang tepat." />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease: easeOut }}
            className="mx-auto mt-5 max-w-xl text-[17px] leading-7 text-fg-muted"
          >
            Jelajahi aplikasi premium untuk berbagai perangkat, pilih yang sesuai kebutuhan, dan gunakan tanpa
            langganan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.65, ease: easeOut }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <ButtonLink href="/aplikasi" size="lg">
              Jelajahi Aplikasi
            </ButtonLink>
            <ButtonLink href="/promo" size="lg" variant="glass">
              Lihat Promo
            </ButtonLink>
          </motion.div>
        </div>

        {/* Floating app shelf — komposisi intentional, bukan icon random */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute inset-x-8 top-1/2 h-24 -translate-y-1/2 rounded-full bg-surface-2/50 blur-2xl" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: easeOut }}
            className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {apps.map((app, i) => (
              <motion.a
                key={app.id}
                href={`/aplikasi/${app.slug}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.85 + i * 0.1, ease: easeOut }}
                whileHover={{ y: -6 }}
                className="mat-func group flex items-center gap-3 rounded-[var(--radius-xl)] p-3 pr-5 transition-shadow duration-[var(--dur-base)] hover:shadow-[var(--elev-3)]"
              >
                <div className="relative">
                  <AppIcon icon={app.icon} size="lg" />
                  <span
                    className="pointer-events-none absolute -inset-2 rounded-2xl opacity-0 blur-lg transition-opacity duration-[var(--dur-slow)] group-hover:opacity-50"
                    style={{ background: `radial-gradient(circle, ${app.icon.from}55, transparent 70%)` }}
                  />
                </div>
                <div className="text-left">
                  <p className="text-[14px] leading-tight font-semibold">{app.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Rating value={app.rating} showValue={false} size={10} />
                    <span className="text-xs text-fg-muted tabular-nums">{formatRupiah(app.price)}</span>
                  </div>
                </div>
              </motion.a>
            ))}
            <motion.a
              href="/aplikasi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.25, ease: easeOut }}
              whileHover={{ y: -6 }}
              aria-label="Lihat semua aplikasi"
              className="mat-clear flex h-[68px] w-[68px] items-center justify-center rounded-[var(--radius-xl)] text-fg-muted transition-shadow duration-[var(--dur-base)] hover:text-fg hover:shadow-[var(--elev-2)]"
            >
              <ArrowRight size={22} strokeWidth={1.75} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
