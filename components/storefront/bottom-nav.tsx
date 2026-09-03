"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Tag, SearchCheck, ShoppingBag, Flame } from "lucide-react";
import { useCart } from "./providers";
import { useTranslation } from "./i18n-provider";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { lang, t } = useTranslation();
  const { count } = useCart();

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
      label: lang === "en" ? "Promo" : lang === "zh" ? "优惠" : "Promo",
      href: "/promo",
      icon: Flame,
    },
    {
      label: lang === "en" ? "Orders" : lang === "zh" ? "查单" : "Pesanan",
      href: "/cek-pesanan",
      icon: SearchCheck,
    },
    {
      label: lang === "en" ? "Cart" : lang === "zh" ? "购物车" : "Keranjang",
      href: "/keranjang",
      icon: ShoppingBag,
      badge: count > 0 ? count : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-3 inset-x-3 z-50 lg:hidden mat-func rounded-2xl px-1.5 py-1.5 shadow-[var(--elev-3)] border border-white/40 dark:border-white/10"
    >
      <div className="grid grid-cols-5 items-center gap-0.5">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200",
                active
                  ? "bg-accent/15 text-accent font-semibold"
                  : "text-fg-muted hover:text-fg active:bg-surface-2"
              )}
            >
              <div className="relative">
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-fg shadow-sm">
                    {item.badge}
                  </span>
                )}
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
