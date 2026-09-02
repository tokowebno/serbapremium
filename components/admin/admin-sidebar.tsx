"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AppWindow,
  BadgePercent,
  BarChart3,
  Bell,
  Box,
  CreditCard,
  Download,
  FolderOpen,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { SerbaPremiumIcon } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const sections = [
  {
    group: "Utama",
    items: [{ label: "Dasbor", href: "/pereman", icon: LayoutDashboard }],
  },
  {
    group: "Katalog",
    items: [
      { label: "Aplikasi", href: "/pereman/aplikasi", icon: AppWindow },
      { label: "Kategori", href: "/pereman/kategori", icon: FolderOpen },
      { label: "Pengembang", href: "/pereman/pengembang", icon: Box },
      { label: "Banner", href: "/pereman/banner", icon: Image },
    ],
  },
  {
    group: "Penjualan",
    items: [
      { label: "Pesanan", href: "/pereman/pesanan", icon: Package },
      { label: "Pembayaran", href: "/pereman/pembayaran", icon: CreditCard },
      { label: "Promo", href: "/pereman/promo", icon: BadgePercent },
      { label: "Unduhan", href: "/pereman/unduhan", icon: Download },
    ],
  },
  {
    group: "Komunitas",
    items: [
      { label: "Pengguna", href: "/pereman/pengguna", icon: Users },
      { label: "Ulasan", href: "/pereman/ulasan", icon: Star },
      { label: "Notifikasi", href: "/pereman/notifikasi", icon: Bell },
    ],
  },
  {
    group: "Operasional",
    items: [
      { label: "Laporan", href: "/pereman/laporan", icon: BarChart3 },
      { label: "Aktivitas", href: "/pereman/aktivitas", icon: Activity },
      { label: "Pengaturan", href: "/pereman/pengaturan", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/pereman" ? pathname === "/pereman" : pathname.startsWith(href);

  const nav = (
    <nav className="flex h-full flex-col overflow-y-auto scrollbar-thin border-r-2 border-[#333] bg-[#0c0d0e]" aria-label="Navigasi admin">
      <div className="flex h-16 items-center gap-2.5 border-b-2 border-[#333] px-5">
        <SerbaPremiumIcon size={26} />
        <span className="text-[15px] font-black tracking-tight text-white uppercase">
          SERBA<span className="text-accent">PREMIUM</span> <span className="text-[10px] text-white/50">ADMIN</span>
        </span>
      </div>
      <div className="flex-1 px-3 pb-6">
        {sections.map((s) => (
          <div key={s.group} className="mt-5">
            <p className="px-3 pb-1.5 text-[11px] font-black tracking-wider text-white/40 uppercase">
              {s.group}
            </p>
            <ul className="space-y-1">
              {s.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-sm px-3 py-2 text-[13.5px] font-bold transition-all",
                        active
                          ? "border-2 border-white bg-accent text-black shadow-[2px_2px_0px_#fff]"
                          : "border-2 border-transparent text-white/60 hover:border-[#444] hover:bg-white/5 hover:text-white",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <item.icon size={15} strokeWidth={2.5} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-[#333] p-4">
        <Link href="/" className="flex items-center gap-2 text-[13px] font-bold text-white/60 transition-colors hover:text-white">
          <ShieldCheck size={15} strokeWidth={2.5} />
          Lihat Toko Utama
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/pereman-keluar", { method: "POST" });
            window.location.href = "/pereman/masuk";
          }}
          className="mt-3 flex w-full items-center gap-2 text-[13px] font-bold text-discount transition-colors hover:text-white"
        >
          <LogOut size={15} strokeWidth={2.5} />
          Keluar Admin
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">{nav}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-overlay" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#0c0d0e] shadow-[8px_0px_0px_#000]">
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute top-3.5 right-3 rounded-md border-2 border-white bg-white/10 p-1.5 text-white hover:bg-discount"
            >
              <X size={17} strokeWidth={2.5} />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <button
        onClick={() => setOpen(true)}
        aria-label="Buka menu admin"
        className="fixed bottom-5 left-5 z-40 rounded-md border-2 border-border bg-surface p-3 text-fg shadow-[3px_3px_0px_var(--shadow-color)] lg:hidden"
      >
        <Menu size={18} strokeWidth={2.5} />
      </button>
    </>
  );
}
