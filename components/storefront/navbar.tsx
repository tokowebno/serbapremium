"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Moon, Search, ShoppingBag, Sun } from "lucide-react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="tk-container"
        >
          <nav
            aria-label="Navigasi utama"
            className={cn(
              "mt-3 flex h-12 items-center justify-between gap-3 rounded-full px-4 transition-all duration-300 sm:px-5",
              scrolled ? "glass shadow-md" : "glass",
            )}
          >
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2" aria-label="Tokono — Beranda">
                <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-fg">
                  <span className="block h-3 w-3 rounded-[3px] border-[1.5px] border-bg" />
                </span>
                <span className="text-[17px] font-semibold tracking-tight">Tokono</span>
              </Link>

              <div className="hidden items-center gap-1 lg:flex">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="rounded-md px-3 py-1.5 text-[13.5px] font-medium text-fg-muted transition-colors hover:text-fg"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-9 items-center gap-2 rounded-full bg-surface-2/80 px-3.5 text-[13.5px] text-fg-muted transition-colors hover:text-fg sm:w-48 sm:justify-between lg:w-56"
                aria-label="Cari aplikasi"
              >
                <span className="flex items-center gap-2">
                  <Search size={15} strokeWidth={2} />
                  <span className="hidden sm:inline">Cari aplikasi…</span>
                </span>
                <kbd className="hidden rounded border border-border bg-surface px-1.5 text-[11px] text-fg-faint sm:inline">
                  /
                </kbd>
              </button>

              <button
                onClick={toggle}
                aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
                className="rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <Link
                href="/akun/keinginan"
                aria-label="Daftar keinginan"
                className="relative rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
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
                className="relative rounded-full p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
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
