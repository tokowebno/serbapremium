"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Wallet, SearchCheck, ShoppingBag, User, LogIn } from "lucide-react";
import { useCart, useAuth } from "./providers";
import { useTranslation } from "./i18n-provider";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { lang } = useTranslation();
  const { count } = useCart();
  const { isAuthenticated, openTopUp } = useAuth();

  const navItems = [
    {
      label: lang === "en" ? "Home" : lang === "zh" ? "首页" : "Beranda",
      href: "/",
      icon: Home,
    },
    {
      label: lang === "en" ? "Apps" : lang === "zh" ? "应用" : "Aplikasi",
      href: "/aplikasi",
      icon: Grid,
    },
    {
      label: lang === "en" ? "Top Up" : lang === "zh" ? "充值" : "Isi Saldo",
      href: "/isi-saldo",
      icon: Wallet,
    },
    {
      label: lang === "en" ? "Orders" : lang === "zh" ? "查单" : "Pesanan",
      href: "/cek-pesanan",
      icon: SearchCheck,
    },
    {
      label: isAuthenticated
        ? lang === "en"
          ? "Account"
          : lang === "zh"
          ? "账户"
          : "Akun"
        : lang === "en"
        ? "Sign In"
        : lang === "zh"
        ? "登录"
        : "Masuk",
      href: isAuthenticated ? "/akun" : "/masuk",
      icon: isAuthenticated ? User : LogIn,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-3 inset-x-3 z-50 lg:hidden bg-surface/95 backdrop-blur-xl rounded-2xl px-1.5 py-1.5 shadow-[var(--elev-3)] border border-border"
    >
      <div className="grid grid-cols-5 items-center gap-0.5">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (item.href === "/isi-saldo") {
                  e.preventDefault();
                  openTopUp();
                }
              }}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200",
                active
                  ? "bg-accent/15 text-accent font-semibold"
                  : "text-fg-muted hover:text-fg active:bg-surface-2"
              )}
            >
              <div className="relative">
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
              </div>
              <span className="mt-0.5 text-[10.5px] font-medium tracking-tight text-center whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
