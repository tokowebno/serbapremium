"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Heart, Moon, Search, ShoppingBag, Sun, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart, useTheme, useWishlist } from "./providers";
import { useTranslation } from "./i18n-provider";
import { SearchDialog } from "./search-dialog";
import { cn } from "@/lib/utils";

const langFlags: Record<string, string> = {
  id: "🇮🇩 ID",
  en: "🇬🇧 EN",
  zh: "🇨🇳 ZH",
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { lang, t } = useTranslation();
  const { count } = useCart();
  const { ids } = useWishlist();
  const pathname = usePathname();

  const navLinks = [
    { label: t.navbar.home, href: "/" },
    { label: t.navbar.apps, href: "/aplikasi" },
    { label: t.navbar.categories, href: "/kategori" },
    { label: t.navbar.promo, href: "/promo" },
    { label: t.navbar.checkOrder, href: "/cek-pesanan" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openLanguageSelector = () => {
    window.dispatchEvent(new CustomEvent("open-language-selector"));
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mx-auto max-w-[1240px]"
        >
          <nav
            aria-label="Navigasi utama"
            className={cn(
              "mt-3 flex h-14 items-center justify-between gap-2 rounded-md border-2 border-border bg-surface px-3 transition-all duration-150 sm:px-4",
              scrolled
                ? "shadow-[5px_5px_0px_var(--shadow-color)] -translate-y-0.5"
                : "shadow-[3px_3px_0px_var(--shadow-color)]",
            )}
          >
            {/* Brand SERBAPREMIUM */}
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2 pr-2"
              aria-label="SerbaPremium — Beranda"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border bg-accent text-accent-fg shadow-[1.5px_1.5px_0px_var(--shadow-color)] transition-transform duration-100 group-hover:scale-105">
                <Zap size={18} strokeWidth={2.8} className="fill-current" />
              </span>
              <div className="flex flex-col">
                <span className="text-[17px] font-black tracking-tighter text-fg uppercase">
                  SERBA<span className="text-accent-blue dark:text-accent">PREMIUM</span>
                </span>
              </div>
            </Link>

            {/* Links desktop */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    className={cn(
                      "relative rounded-sm px-3 py-1.5 text-[13.5px] font-bold transition-all duration-100",
                      active
                        ? "border-2 border-border bg-accent-yellow text-black shadow-[2px_2px_0px_var(--shadow-color)]"
                        : "border-2 border-transparent text-fg-muted hover:border-border hover:bg-surface-2 hover:text-fg",
                    )}
                  >
                    <span>{l.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Kontrol kanan */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-9 items-center gap-2 rounded-sm border-2 border-border bg-surface-2 px-3 text-[13px] font-bold text-fg-muted shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface hover:text-fg hover:shadow-[3px_3px_0px_var(--shadow-color)] sm:w-40 sm:justify-between lg:w-44"
                aria-label={t.navbar.search}
              >
                <span className="flex items-center gap-2">
                  <Search size={15} strokeWidth={2.5} className="text-fg" />
                  <span className="hidden sm:inline">{t.navbar.search}</span>
                </span>
                <kbd className="hidden rounded-xs border border-border bg-surface px-1 py-0.2 text-[10px] font-mono text-fg font-black sm:inline">
                  /
                </kbd>
              </button>

              {/* Language Switcher */}
              <button
                onClick={openLanguageSelector}
                aria-label={t.navbar.selectLanguage}
                title={t.navbar.selectLanguage}
                className="flex h-9 items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-2.5 text-xs font-black text-fg shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface-2 hover:shadow-[3px_3px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Globe size={14} strokeWidth={2.5} />
                <span>{langFlags[lang] || "🌐"}</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                aria-label={theme === "dark" ? t.navbar.lightMode : t.navbar.darkMode}
                className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface text-fg shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface-2 hover:shadow-[3px_3px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                {theme === "dark" ? <Sun size={17} strokeWidth={2.5} /> : <Moon size={17} strokeWidth={2.5} />}
              </button>

              {/* Wishlist */}
              <Link
                href="/akun/keinginan"
                aria-label={t.navbar.wishlist}
                className="relative flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface text-fg shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface-2 hover:shadow-[3px_3px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Heart size={17} strokeWidth={2.5} />
                <AnimatePresence>
                  {ids.length > 0 && (
                    <motion.span
                      key={ids.length}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-xs border border-border bg-discount px-1 text-[10px] font-black text-white shadow-[1px_1px_0px_var(--shadow-color)]"
                    >
                      {ids.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Cart */}
              <Link
                href="/keranjang"
                aria-label={t.navbar.cart}
                className="relative flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-accent text-accent-fg shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[3px_3px_0px_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <ShoppingBag size={17} strokeWidth={2.5} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-xs border border-border bg-discount px-1 text-[10px] font-black text-white shadow-[1px_1px_0px_var(--shadow-color)]"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </nav>
        </motion.div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
