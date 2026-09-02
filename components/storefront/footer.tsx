"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { api } from "@/lib/api";
import { Reveal } from "@/components/ui/reveal";
import { useTranslation } from "./i18n-provider";
import { getLocalizedCategory } from "@/lib/i18n/product-translations";

export function Footer() {
  const { lang, t } = useTranslation();
  const year = new Date().getFullYear();
  const categoriesWithCount = api.categories.withCount();

  return (
    <footer className="mt-24 border-t-2 border-border bg-surface">
      <Reveal className="tk-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2" aria-label="SerbaPremium — Beranda">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-accent text-accent-fg shadow-[1.5px_1.5px_0px_var(--shadow-color)]">
              <Zap size={18} strokeWidth={2.8} className="fill-current" />
            </span>
            <span className="text-[18px] font-black tracking-tighter text-fg uppercase">
              SERBA<span className="text-accent-blue dark:text-accent">PREMIUM</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm font-medium leading-relaxed text-fg-muted">
            {t.footer.about}
          </p>
        </div>

        <nav aria-label="Jelajahi">
          <h3 className="text-xs font-black tracking-wider uppercase text-fg">{t.footer.explore}</h3>
          <ul className="mt-3.5 space-y-2.5">
            <li><Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href="/aplikasi">{t.footer.allApps}</Link></li>
            <li><Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href="/promo">{t.navbar.promo}</Link></li>
            <li><Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href="/kategori">{t.footer.categories}</Link></li>
            <li><Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href="/akun/koleksi">{t.footer.myCollection}</Link></li>
          </ul>
        </nav>

        <nav aria-label="Kategori">
          <h3 className="text-xs font-black tracking-wider uppercase text-fg">{t.footer.categories}</h3>
          <ul className="mt-3.5 space-y-2.5">
            {categoriesWithCount
              .filter((c) => c.count > 0)
              .slice(0, 6)
              .map((c) => {
                const localized = getLocalizedCategory(c, lang);
                return (
                  <li key={c.id}>
                    <Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href={`/kategori/${c.slug}`}>
                      {localized.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-black tracking-wider uppercase text-fg">{t.footer.support}</h3>
          <ul className="mt-3.5 space-y-2.5">
            <li><Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href="/keranjang">{t.navbar.cart}</Link></li>
            <li><Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href="/cek-pesanan">{t.navbar.checkOrder}</Link></li>
            <li><Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href="/akun">{t.footer.myCollection}</Link></li>
            <li><Link className="text-sm font-semibold text-fg-muted transition-colors hover:text-fg" href="/promo">{t.navbar.promo}</Link></li>
          </ul>
          <p className="mt-5 text-xs font-medium leading-5 text-fg-faint">
            {t.footer.secureTransaction}
          </p>
        </div>
      </Reveal>

      <div className="border-t-2 border-border bg-surface-2">
        <div className="tk-container flex flex-wrap items-center justify-between gap-2 py-4">
          <p className="text-xs font-bold text-fg-muted">© {year} {t.footer.rights}</p>
          <p className="text-xs font-bold text-fg-muted">{t.footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
