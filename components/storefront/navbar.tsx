"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Heart, Moon, Search, ShoppingBag, Sun, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart, useTheme, useWishlist } from "./providers";
import { useTranslation } from "./i18n-provider";
import { SearchDialog } from "./search-dialog";
import { SerbaPremiumLogo } from "@/components/ui/logo";
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
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1240px]"
        >
          <nav
            aria-label="Navigasi utama"
            className={cn(
              "mt-3 flex h-13 items-center justify-between gap-2 rounded-full px-3 transition-all duration-300 sm:px-4",
              scrolled
                ? "mat-func shadow-[var(--elev-2)]"
                : "mat-func shadow-[var(--elev-1)]",
            )}
          >
            {/* Brand SERBAPREMIUM */}
            <Link
              href="/"
              className="group flex shrink-0 items-center pl-1 pr-2"
              aria-label="SerbaPremium — Beranda"
            >
              <SerbaPremiumLogo iconSize={26} textSize="text-[16px]" />
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
                      "relative rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-200",
                      active ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-surface shadow-[var(--elev-1)] ring-1 ring-border/80"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Kontrol kanan */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-8 sm:h-9 items-center gap-2 rounded-full bg-surface/60 px-3 text-[13px] text-fg-muted shadow-[inset_0_0_0_1px_var(--border)] backdrop-blur-md transition-all duration-200 hover:bg-surface hover:text-fg hover:shadow-[var(--elev-1)] sm:w-40 sm:justify-between lg:w-48"
                aria-label={t.navbar.search}
              >
                <span className="flex items-center gap-2">
                  <Search size={14} strokeWidth={2} />
                  <span className="hidden sm:inline text-xs">{t.navbar.search}</span>
                </span>
                <kbd className="hidden rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-fg-faint sm:inline">
                  /
                </kbd>
              </button>

              {/* Language Switcher */}
              <button
                onClick={openLanguageSelector}
                aria-label={t.navbar.selectLanguage}
                title={t.navbar.selectLanguage}
                className="flex h-8 sm:h-9 items-center gap-1 rounded-full bg-surface/60 px-2.5 text-xs font-semibold text-fg shadow-[inset_0_0_0_1px_var(--border)] backdrop-blur-md transition-all duration-200 hover:bg-surface hover:shadow-[var(--elev-1)] active:scale-95"
              >
                <Globe size={13} strokeWidth={2} />
                <span>{langFlags[lang] || "🌐"}</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                aria-label={theme === "dark" ? t.navbar.lightMode : t.navbar.darkMode}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-fg-muted transition-all duration-200 hover:bg-surface/80 hover:text-fg hover:shadow-[var(--elev-1)] active:scale-95"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Wishlist */}
              <Link
                href="/akun/keinginan"
                aria-label={t.navbar.wishlist}
                className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-fg-muted transition-all duration-200 hover:bg-surface/80 hover:text-fg hover:shadow-[var(--elev-1)] active:scale-95"
              >
                <Heart size={16} />
                <AnimatePresence>
                  {ids.length > 0 && (
                    <motion.span
                      key={ids.length}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                      className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-fg shadow-sm"
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
                className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-fg-muted transition-all duration-200 hover:bg-surface/80 hover:text-fg hover:shadow-[var(--elev-1)] active:scale-95"
              >
                <ShoppingBag size={16} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                      className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-fg shadow-sm"
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
