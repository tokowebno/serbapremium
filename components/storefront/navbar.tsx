"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Heart,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  Zap,
  Wallet,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  PlusCircle,
  PackageCheck,
  BookOpen,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useCart, useTheme, useWishlist, useAuth } from "./providers";
import { useTranslation } from "./i18n-provider";
import { SearchDialog } from "./search-dialog";
import { TexasAiLogo } from "@/components/ui/logo";
import { IndonesiaFlag, EnglishFlag, ChinaFlag } from "@/components/ui/language-selector";
import { cn, formatRupiah } from "@/lib/utils";

const langFlags: Record<string, string> = {
  id: "ID",
  en: "EN",
  zh: "ZH",
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme, toggle } = useTheme();
  const { lang, t } = useTranslation();
  const { count } = useCart();
  const { ids } = useWishlist();
  const { user, isAuthenticated, balance, balanceUsd, logout, openTopUp } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { label: t.navbar.home, href: "/" },
    { label: t.navbar.apps, href: "/aplikasi" },
    { label: lang === "en" ? "Top Up Balance" : lang === "zh" ? "充值余额" : "Isi Saldo", href: "/isi-saldo" },
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLanguageSelector = () => {
    window.dispatchEvent(new CustomEvent("open-language-selector"));
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-surface/95 backdrop-blur-xl border-b border-border/80 py-2 px-3 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:p-0 sm:px-5"
            : "px-3 sm:px-5 py-1.5 sm:py-0"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1240px]"
        >
          <nav
            aria-label="Navigasi utama"
            className={cn(
              "flex h-12 sm:h-13 items-center justify-between gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-4 transition-all duration-300 sm:mt-3",
              scrolled
                ? "bg-surface border border-border shadow-[var(--elev-2)]"
                : "bg-surface/90 backdrop-blur-md border border-border/80 shadow-[var(--elev-1)]",
            )}
          >
            {/* Brand TOKONO */}
            <Link
              href="/"
              className="group flex shrink-0 items-center pl-1 pr-2"
              aria-label="TexasAi — Beranda"
            >
              <TexasAiLogo iconSize={26} textSize="text-[16px]" />
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
                      active ? "text-fg font-semibold" : "text-fg-muted hover:text-fg",
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
                className="flex h-8 sm:h-9 items-center gap-2 rounded-full bg-surface/60 px-3 text-[13px] text-fg-muted shadow-[inset_0_0_0_1px_var(--border)] backdrop-blur-md transition-all duration-200 hover:bg-surface hover:text-fg hover:shadow-[var(--elev-1)] sm:w-36 lg:w-44 sm:justify-between cursor-pointer"
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
                className="flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-surface/60 px-2.5 text-xs font-semibold text-fg shadow-[inset_0_0_0_1px_var(--border)] backdrop-blur-md transition-all duration-200 hover:bg-surface hover:shadow-[var(--elev-1)] active:scale-95 cursor-pointer"
              >
                {lang === "id" ? (
                  <IndonesiaFlag className="w-4.5 h-3" />
                ) : lang === "zh" ? (
                  <ChinaFlag className="w-4.5 h-3" />
                ) : (
                  <EnglishFlag className="w-4.5 h-3" />
                )}
                <span className="font-bold">{langFlags[lang] || "ID"}</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                aria-label={theme === "dark" ? t.navbar.lightMode : t.navbar.darkMode}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-fg-muted transition-all duration-200 hover:bg-surface/80 hover:text-fg hover:shadow-[var(--elev-1)] active:scale-95 cursor-pointer"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Saldo Badge (When logged in) */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => openTopUp()}
                  aria-label="Isi Saldo Dompet"
                  title="Klik untuk Buka Menu Isi Saldo"
                  className="hidden sm:flex items-center gap-1.5 rounded-full bg-accent-soft/80 border border-accent/30 px-2.5 sm:px-3 py-1 text-xs font-bold text-fg hover:bg-accent-soft hover:border-accent/60 transition-all duration-200 shadow-xs cursor-pointer active:scale-95 select-none"
                >
                  <Wallet size={13} className="text-accent shrink-0" />
                  <span className="tabular-nums font-bold text-accent">{formatRupiah(balance)}</span>
                  <span className="text-[10px] rounded-full bg-accent px-1.5 py-0.2 text-accent-fg font-black">
                    + Top Up
                  </span>
                </button>
              )}

              {/* Auth Button / User Dropdown */}
              {!isAuthenticated ? (
                <Link
                  href="/masuk"
                  className="flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-bold text-accent-fg shadow-[var(--elev-1)] transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
                >
                  <LogIn size={13} strokeWidth={2.5} />
                  <span>{lang === "en" ? "Sign In" : lang === "zh" ? "登录" : "Masuk"}</span>
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((v) => !v)}
                    className="flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-surface/80 border border-border px-2 sm:px-2.5 text-xs font-semibold text-fg hover:bg-surface transition-all active:scale-95 cursor-pointer"
                    aria-label="Menu Akun"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-black text-accent-fg">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                    <span className="hidden md:inline max-w-[80px] truncate text-xs font-bold">
                      {user?.name || "Akun"}
                    </span>
                    <ChevronDown size={12} className="text-fg-muted" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-60 rounded-2xl border border-border/80 bg-surface/95 p-2 shadow-xl backdrop-blur-md z-50 text-left"
                      >
                        {/* User info */}
                        <div className="border-b border-border/70 p-2.5">
                          <p className="text-xs font-bold text-fg truncate">{user?.name}</p>
                          <p className="text-[11px] text-fg-muted truncate">{user?.email}</p>
                          <div className="mt-2 flex items-center justify-between rounded-xl bg-accent-soft p-2 border border-accent/20">
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-fg-muted block">Saldo Akun</span>
                              <span className="text-xs font-black text-accent tabular-nums">{formatRupiah(balance)}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setUserDropdownOpen(false);
                                openTopUp();
                              }}
                              className="rounded-lg bg-accent px-2 py-1 text-[10.5px] font-bold text-accent-fg shadow-xs hover:opacity-90 cursor-pointer"
                            >
                              + Isi Saldo
                            </button>
                          </div>
                        </div>

                        {/* Navigation links */}
                        <div className="py-1.5 space-y-0.5">
                          <Link
                            href="/akun"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-fg hover:bg-surface-2 transition-colors"
                          >
                            <User size={14} className="text-fg-muted" />
                            <span>Ringkasan Akun</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              openTopUp();
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-fg hover:bg-surface-2 transition-colors cursor-pointer text-left"
                          >
                            <PlusCircle size={14} className="text-accent" />
                            <span>Tambah Dana</span>
                          </button>
                          <Link
                            href="/akun/koleksi"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-fg hover:bg-surface-2 transition-colors"
                          >
                            <BookOpen size={14} className="text-fg-muted" />
                            <span>Koleksi Saya</span>
                          </Link>
                          <Link
                            href="/akun/pesanan"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-fg hover:bg-surface-2 transition-colors"
                          >
                            <PackageCheck size={14} className="text-fg-muted" />
                            <span>Riwayat Pembelian</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-border/70 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <LogOut size={14} />
                            <span>Keluar dari Akun</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Cart (Desktop) */}
              <Link
                href="/keranjang"
                aria-label={t.navbar.cart}
                className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-all duration-200 hover:bg-surface/80 hover:text-fg hover:shadow-[var(--elev-1)] active:scale-95"
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
