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
    <section className="relative overflow-hidden pt-24 pb-10 sm:pt-36 sm:pb-24">
      <div className="tk-container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Brutalist Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-3 sm:mb-5 w-fit"
          >
            <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xs sm:rounded-sm border-1.5 sm:border-2 border-border bg-accent-yellow px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-black tracking-wider text-black uppercase shadow-[1.5px_1.5px_0px_var(--shadow-color)] sm:shadow-[2px_2px_0px_var(--shadow-color)]">
              <Zap size={12} className="fill-current text-black sm:scale-125" />
              {t.hero.badge || "SERBAPREMIUM · LISENSI DIGITAL RESMI"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-[26px] sm:text-[46px] md:text-[60px] leading-[1.12] font-black tracking-tight text-fg"
          >
            {t.hero.title1} <br className="hidden sm:inline" />
            <span className="bg-accent px-1.5 sm:px-2 py-0.5 text-black border-1.5 sm:border-2 border-border shadow-[2px_2px_0px_var(--shadow-color)] sm:shadow-[3px_3px_0px_var(--shadow-color)] inline-block my-1">
              {t.product.buyOnce}
            </span>
            , {t.hero.title2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mx-auto mt-3 sm:mt-6 max-w-xl text-[13.5px] sm:text-[17px] font-medium leading-relaxed text-fg-muted px-2"
          >
            {t.hero.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mt-5 sm:mt-8 flex flex-row items-center justify-center gap-2 sm:gap-4"
          >
            <ButtonLink href="/aplikasi" size="sm" className="sm:hidden flex-1 justify-center">
              {t.hero.exploreBtn} <ArrowRight size={14} strokeWidth={2.5} />
            </ButtonLink>
            <ButtonLink href="/aplikasi" size="lg" className="hidden sm:inline-flex">
              {t.hero.exploreBtn} <ArrowRight size={17} strokeWidth={2.5} />
            </ButtonLink>
            <ButtonLink href="/promo" size="sm" variant="glass" className="sm:hidden flex-1 justify-center">
              {t.hero.promoBtn} 🔥
            </ButtonLink>
            <ButtonLink href="/promo" size="lg" variant="glass" className="hidden sm:inline-flex">
              {t.hero.promoBtn} 🔥
            </ButtonLink>
          </motion.div>

          {/* Badges Kepercayaan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold text-fg-muted"
          >
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xs border border-border bg-surface px-2 sm:px-2.5 py-0.5 sm:py-1 shadow-[1px_1px_0px_var(--shadow-color)]">
              <ShieldCheck size={12} className="text-success sm:scale-125" strokeWidth={2.5} /> {t.footer.warranty}
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xs border border-border bg-surface px-2 sm:px-2.5 py-0.5 sm:py-1 shadow-[1px_1px_0px_var(--shadow-color)]">
              <Sparkles size={12} className="text-warning sm:scale-125" strokeWidth={2.5} /> {t.footer.instantActivation}
            </span>
          </motion.div>
        </div>

        {/* Floating Brutalist Shelf */}
        <div className="relative mx-auto mt-8 sm:mt-14 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-2 sm:gap-4"
          >
            {apps.map((app) => {
              const localized = getLocalizedApp(app, lang);
              return (
                <a
                  key={app.id}
                  href={`/aplikasi/${app.slug}`}
                  className="group flex items-center gap-2 sm:gap-3 rounded-md border-1.5 sm:border-2 border-border bg-surface p-2 sm:p-3 sm:pr-5 shadow-[2px_2px_0px_var(--shadow-color)] sm:shadow-[3px_3px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <AppIcon icon={app.icon} size="sm" className="sm:hidden shrink-0" />
                  <AppIcon icon={app.icon} size="md" className="hidden sm:block shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-[11.5px] sm:text-[14px] leading-tight font-black text-fg truncate group-hover:text-accent-blue dark:group-hover:text-accent">
                      {localized.name}
                    </p>
                    <div className="mt-0.5 sm:mt-1 flex items-center justify-between sm:justify-start gap-1 sm:gap-2">
                      <Rating value={app.rating} showValue={false} size={10} />
                      <span className="text-[10px] sm:text-xs font-bold tabular-nums text-fg">{formatPrice(app.price, lang)}</span>
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
