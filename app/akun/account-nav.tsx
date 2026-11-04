"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, History, LayoutDashboard, Settings, Star, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/storefront/i18n-provider";

const menu = [
  { label: { en: "Overview", id: "Ringkasan", zh: "概览" }, href: "/akun", icon: LayoutDashboard },
  { label: { en: "Wallet & Top Up", id: "Dompet & Isi Saldo", zh: "钱包与充值" }, href: "/isi-saldo", icon: Wallet },
  { label: { en: "My Collection", id: "Koleksi Saya", zh: "我的收藏" }, href: "/akun/koleksi", icon: BookOpen },
  { label: { en: "Purchase History", id: "Riwayat Pembelian", zh: "购买记录" }, href: "/akun/pesanan", icon: History },
  { label: { en: "Wishlist", id: "Daftar Keinginan", zh: "心愿单" }, href: "/akun/keinginan", icon: Heart },
  { label: { en: "My Reviews", id: "Ulasan Saya", zh: "我的评价" }, href: "/akun/ulasan", icon: Star },
  { label: { en: "Settings", id: "Pengaturan", zh: "设置" }, href: "/akun/pengaturan", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();
  const { lang } = useTranslation();
  const key = (lang === "en" || lang === "zh" ? lang : "id") as "en" | "id" | "zh";

  return (
    <nav
      aria-label={key === "en" ? "Account menu" : key === "zh" ? "账户菜单" : "Menu akun"}
      className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:px-0"
    >
      {menu.map((item) => {
        const active = item.href === "/akun" ? pathname === "/akun" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 lg:w-full",
              active
                ? "bg-accent text-accent-fg shadow-sm font-semibold"
                : "text-fg-muted hover:bg-surface hover:text-fg",
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon size={16} strokeWidth={2} />
            {item.label[key]}
          </Link>
        );
      })}
    </nav>
  );
}
