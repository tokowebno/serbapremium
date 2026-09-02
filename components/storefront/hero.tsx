"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "./i18n-provider";
import { getLocalizedApp } from "@/lib/i18n/product-translations";

export function Hero() {
  const { lang, t } = useTranslation();
  const apps = api.apps.featured().slice(0, 4);

  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-36 sm:pb-24">
      {/* Ambient background glow orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 ambient-bg opacity-70" />

      <div className="tk-container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Subtle Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-4 sm:mb-6 w-fit"
          >
            <span className="mat-func inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide text-fg-muted shadow-sm">
              <Zap size={13} className="text-accent" />
              {t.hero.badge || "SERBAPREMIUM · LISENSI DIGITAL RESMI"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-[32px] sm:text-[50px] md:text-[62px] leading-[1.1] font-extrabold tracking-tight text-fg"
          >
            {t.hero.title1} <br className="hidden sm:inline" />
            <span className="text-accent">{t.product.buyOnce}</span>, {t.hero.title2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mx-auto mt-4 sm:mt-6 max-w-xl text-[14.5px] sm:text-[17px] font-normal leading-relaxed text-fg-muted px-2"
          >
            {t.hero.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto"
          >
            <ButtonLink href="/aplikasi" size="lg" className="flex-1 sm:flex-none justify-center px-7 shadow-[var(--elev-2)]">
              {t.hero.exploreBtn} <ArrowRight size={16} strokeWidth={2.5} />
            </ButtonLink>
            <ButtonLink href="/promo" size="lg" variant="secondary" className="flex-1 sm:flex-none justify-center px-7">
              {t.hero.promoBtn} 🔥
            </ButtonLink>
          </motion.div>

          {/* Badges Kepercayaan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 sm:mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-medium text-fg-muted"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/70 border border-border/80 px-3 py-1 shadow-sm backdrop-blur-sm">
              <ShieldCheck size={14} className="text-emerald-500" strokeWidth={2} /> {t.footer.warranty}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/70 border border-border/80 px-3 py-1 shadow-sm backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-500" strokeWidth={2} /> {t.footer.instantActivation}
            </span>
          </motion.div>
        </div>

        {/* Floating Liquid Glass Shelf */}
        <div className="relative mx-auto mt-10 sm:mt-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-3 sm:gap-4"
          >
            {apps.map((app) => {
              const localized = getLocalizedApp(app, lang);
              return (
                <a
                  key={app.id}
                  href={`/aplikasi/${app.slug}`}
                  className="group flex items-center gap-2.5 sm:gap-3.5 rounded-2xl border border-border/70 bg-surface/80 p-2.5 sm:p-3 sm:pr-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:-translate-y-1"
                >
                  <AppIcon icon={app.icon} size="sm" className="shrink-0 group-hover:scale-105 transition-transform duration-200" />
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-[12.5px] sm:text-[14px] leading-tight font-semibold text-fg truncate group-hover:text-accent transition-colors">
                      {localized.name}
                    </p>
                    <div className="mt-0.5 sm:mt-1 flex items-center justify-between sm:justify-start gap-1 sm:gap-2">
                      <Rating value={app.rating} showValue={false} size={10} />
                      <span className="text-[11px] sm:text-xs font-semibold tabular-nums text-fg-muted">{formatPrice(app.price, lang)}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
