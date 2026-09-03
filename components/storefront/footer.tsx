"use client";

import Link from "next/link";
import { Zap, Send } from "lucide-react";
import { api } from "@/lib/api";
import { Reveal } from "@/components/ui/reveal";
import { useTranslation } from "./i18n-provider";
import { getLocalizedCategory } from "@/lib/i18n/product-translations";

import { SerbaPremiumLogo } from "@/components/ui/logo";

export function Footer() {
  const { lang, t } = useTranslation();
  const year = new Date().getFullYear();
  const categoriesWithCount = api.categories.withCount();

  return (
    <footer className="mt-24 border-t border-border bg-surface/80 backdrop-blur-md">
      <Reveal className="tk-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="group flex items-center" aria-label="SerbaPremium — Beranda">
            <SerbaPremiumLogo iconSize={28} textSize="text-[17px]" />
          </Link>
          <p className="mt-3 max-w-xs text-sm font-normal leading-relaxed text-fg-muted">
            {t.footer.about}
          </p>
          <div className="mt-4">
            <a
              href="https://t.me/serbapremiumy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#229ED9]/15 border border-[#229ED9]/30 px-3 py-1.5 text-xs font-semibold text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all duration-200"
            >
              <Send size={13} className="fill-current" />
              <span>Telegram Admin: @serbapremiumy</span>
            </a>
          </div>
        </div>

        <nav aria-label="Jelajahi">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-fg-muted">{t.footer.explore}</h3>
          <ul className="mt-3.5 space-y-2.5">
            <li><Link className="text-sm font-medium text-fg-muted transition-colors hover:text-fg" href="/aplikasi">{t.footer.allApps}</Link></li>
            <li><Link className="text-sm font-medium text-fg-muted transition-colors hover:text-fg" href="/promo">{t.navbar.promo}</Link></li>
            <li><Link className="text-sm font-medium text-fg-muted transition-colors hover:text-fg" href="/kategori">{t.footer.categories}</Link></li>
            <li><Link className="text-sm font-medium text-fg-muted transition-colors hover:text-fg" href="/akun/koleksi">{t.footer.myCollection}</Link></li>
          </ul>
        </nav>

        <nav aria-label="Kategori">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-fg-muted">{t.footer.categories}</h3>
          <ul className="mt-3.5 space-y-2.5">
            {categoriesWithCount
              .filter((c) => c.count > 0)
              .slice(0, 6)
              .map((c) => {
                const localized = getLocalizedCategory(c, lang);
                return (
                  <li key={c.id}>
                    <Link className="text-sm font-medium text-fg-muted transition-colors hover:text-fg" href={`/kategori/${c.slug}`}>
                      {localized.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold tracking-wider uppercase text-fg-muted">{t.footer.support}</h3>
          <ul className="mt-3.5 space-y-2.5">
            <li><Link className="text-sm font-medium text-fg-muted transition-colors hover:text-fg" href="/keranjang">{t.navbar.cart}</Link></li>
            <li><Link className="text-sm font-medium text-fg-muted transition-colors hover:text-fg" href="/cek-pesanan">{t.navbar.checkOrder}</Link></li>
            <li><Link className="text-sm font-medium text-fg-muted transition-colors hover:text-fg" href="/akun">{t.footer.myCollection}</Link></li>
            <li><a className="text-sm font-medium text-[#229ED9] transition-colors hover:underline" href="https://t.me/serbapremiumy" target="_blank" rel="noopener noreferrer">Telegram: @serbapremiumy</a></li>
          </ul>
          <p className="mt-5 text-xs font-normal leading-5 text-fg-faint">
            {t.footer.secureTransaction}
          </p>
        </div>
      </Reveal>

      <div className="border-t border-border bg-surface-2/60">
        <div className="tk-container flex flex-wrap items-center justify-between gap-2 py-4">
          <p className="text-xs font-medium text-fg-muted">© {year} {t.footer.rights}</p>
          <p className="text-xs font-medium text-fg-muted">{t.footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
