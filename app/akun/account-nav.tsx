"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, History, LayoutDashboard, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const menu = [
  { label: "Ringkasan", href: "/akun", icon: LayoutDashboard },
  { label: "Koleksi Saya", href: "/akun/koleksi", icon: BookOpen },
  { label: "Riwayat Pembelian", href: "/akun/pesanan", icon: History },
  { label: "Daftar Keinginan", href: "/akun/keinginan", icon: Heart },
  { label: "Ulasan Saya", href: "/akun/ulasan", icon: Star },
  { label: "Pengaturan", href: "/akun/pengaturan", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Menu akun"
      className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:px-0"
    >
      {menu.map((item) => {
        const active = item.href === "/akun" ? pathname === "/akun" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-md border-2 px-3.5 py-2.5 text-sm font-bold transition-all duration-100 lg:w-full",
              active
                ? "border-border bg-accent text-black shadow-[3px_3px_0px_var(--shadow-color)]"
                : "border-transparent text-fg-muted hover:border-border hover:bg-surface hover:text-fg hover:shadow-[2px_2px_0px_var(--shadow-color)]",
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon size={16} strokeWidth={2.5} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
