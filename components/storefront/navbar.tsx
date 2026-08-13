"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Moon, Search, ShoppingBag, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart, useTheme, useWishlist } from "./providers";
import { SearchDialog } from "./search-dialog";
import { cn } from "@/lib/utils";
import { easeOut } from "@/components/ui/reveal";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Aplikasi", href: "/aplikasi" },
  { label: "Kategori", href: "/aplikasi" },
  { label: "Promo", href: "/promo" },
  { label: "Cek Pesanan", href: "/cek-pesanan" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { count } = useCart();
  const { ids } = useWishlist();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mx-auto max-w-[1200px]"
        >
          <nav
            aria-label="Navigasi utama"
            className={cn(
              "mt-3 flex h-12 items-center justify-between gap-2 rounded-full px-2.5 transition-all duration-[var(--dur-slow)] ease-[var(--ease-out)] sm:px-3",
              scrolled
                ? "mat-func shadow-[var(--elev-2)]"
                : "mat-func",
            )}
          >
            {/* Brand */}
            <Link href="/" className="flex shrink-0 items-center gap-2.5 pl-2" aria-label="Tokono — Beranda">
              <span className="flex h-6 w-6 items-center justify-center rounded-[8px] bg-fg shadow-[var(--elev-1)]">
                <span className="block h-3 w-3 rounded-[3px] border-[1.5px] border-bg" />
              </span>
              <span className="text-[16px] font-semibold tracking-tight">Tokono</span>
            </Link>

            {/* Links desktop — active dimensional, bukan kotak */}
            <div className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-[var(--dur-base)]",
                      active ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-surface shadow-[var(--elev-1)] ring-1 ring-border"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Kontrol kanan */}
            <div className="flex items-center gap-0.5">
              {/* Search pill */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-9 items-center gap-2 rounded-full bg-surface/60 px-3.5 text-[13.5px] text-fg-muted shadow-[inset_0_0_0_1px_var(--border)] backdrop-blur-md transition-all duration-[var(--dur-base)] hover:bg-surface/80 hover:text-fg hover:shadow-[inset_0_0_0_1px_var(--border-strong),var(--elev-1)] sm:w-44 sm:justify-between lg:w-52"
                aria-label="Cari aplikasi"
              >
                <span className="flex items-center gap-2">
                  <Search size={15} strokeWidth={2} />
                  <span className="hidden sm:inline">Cari aplikasi…</span>
                </span>
                <kbd className="hidden rounded-md border border-border bg-surface px-1.5 py-0.5 text-[11px] text-fg-faint sm:inline">
                  /
                </kbd>
              </button>

              <button
                onClick={toggle}
                aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
                className="rounded-full p-2 text-fg-muted transition-colors duration-[var(--dur-base)] hover:bg-surface/70 hover:text-fg"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <Link
                href="/akun/keinginan"
                aria-label="Daftar keinginan"
                className="relative rounded-full p-2 text-fg-muted transition-colors duration-[var(--dur-base)] hover:bg-surface/70 hover:text-fg"
              >
                <Heart size={17} />
                <AnimatePresence>
                  {ids.length > 0 && (
                    <motion.span
                      key={ids.length}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                      className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg"
                    >
                      {ids.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link
                href="/keranjang"
                aria-label="Keranjang"
                className="relative rounded-full p-2 text-fg-muted transition-colors duration-[var(--dur-base)] hover:bg-surface/70 hover:text-fg"
              >
                <ShoppingBag size={17} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                      className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg"
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
