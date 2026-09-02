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
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24">
      <div className="tk-container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Brutalist Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-5 w-fit"
          >
            <span className="inline-flex items-center gap-2 rounded-sm border-2 border-border bg-accent-yellow px-3 py-1 text-xs font-black tracking-wider text-black uppercase shadow-[2px_2px_0px_var(--shadow-color)]">
              <Zap size={14} className="fill-current text-black" />
              {t.hero.badge || "SERBAPREMIUM · LISENSI DIGITAL RESMI"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-[38px] leading-[1.08] font-black tracking-tight text-fg sm:text-[62px]"
          >
            {t.hero.title1} <br className="hidden sm:inline" />
            <span className="bg-accent px-2 py-0.5 text-black border-2 border-border shadow-[3px_3px_0px_var(--shadow-color)] inline-block my-1">
              {t.product.buyOnce}
            </span>
            , {t.hero.title2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-[16px] font-medium leading-relaxed text-fg-muted sm:text-[17px]"
          >
            {t.hero.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <ButtonLink href="/aplikasi" size="lg">
              {t.hero.exploreBtn} <ArrowRight size={17} strokeWidth={2.5} />
            </ButtonLink>
            <ButtonLink href="/promo" size="lg" variant="glass">
              {t.hero.promoBtn} 🔥
            </ButtonLink>
          </motion.div>

          {/* Badges Kepercayaan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-fg-muted"
          >
            <span className="inline-flex items-center gap-1.5 rounded-xs border border-border bg-surface px-2.5 py-1 shadow-[1px_1px_0px_var(--shadow-color)]">
              <ShieldCheck size={14} className="text-success" strokeWidth={2.5} /> {t.footer.warranty}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xs border border-border bg-surface px-2.5 py-1 shadow-[1px_1px_0px_var(--shadow-color)]">
              <Sparkles size={14} className="text-warning" strokeWidth={2.5} /> {t.footer.instantActivation}
            </span>
          </motion.div>
        </div>

        {/* Floating Brutalist Shelf */}
        <div className="relative mx-auto mt-14 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {apps.map((app) => {
              const localized = getLocalizedApp(app, lang);
              return (
                <a
                  key={app.id}
                  href={`/aplikasi/${app.slug}`}
                  className="group flex items-center gap-3 rounded-md border-2 border-border bg-surface p-3 pr-5 shadow-[3px_3px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <AppIcon icon={app.icon} size="md" />
                  <div className="text-left">
                    <p className="text-[14px] leading-tight font-black text-fg group-hover:text-accent-blue dark:group-hover:text-accent">
                      {localized.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Rating value={app.rating} showValue={false} size={11} />
                      <span className="text-xs font-bold tabular-nums text-fg">{formatPrice(app.price, lang)}</span>
                    </div>
                  </div>
                </a>
              );
            })}
            <a
              href="/aplikasi"
              aria-label="Lihat semua aplikasi"
              className="flex h-[60px] w-[60px] items-center justify-center rounded-md border-2 border-border bg-accent text-accent-fg shadow-[3px_3px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <ArrowRight size={22} strokeWidth={2.8} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
