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
} from "lucide-react";
import { useState } from "react";
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
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <nav className="flex h-full flex-col overflow-y-auto scrollbar-thin" aria-label="Navigasi admin">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
          <span className="block h-3.5 w-3.5 rounded border-[1.5px] border-white/80" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-white">Tokono Admin</span>
      </div>
      <div className="flex-1 px-3 pb-6">
        {sections.map((s) => (
          <div key={s.group} className="mt-5">
            <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-[0.12em] text-white/35 uppercase">
              {s.group}
            </p>
            <ul className="space-y-0.5">
              {s.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] transition-colors",
                        active
                          ? "bg-white/10 font-medium text-white"
                          : "text-white/55 hover:bg-white/5 hover:text-white/85",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <item.icon size={15} strokeWidth={1.75} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-4">
        <Link href="/" className="flex items-center gap-2 text-[13px] text-white/45 transition-colors hover:text-white/80">
          <ShieldCheck size={14} />
          Lihat Toko
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/pereman-keluar", { method: "POST" });
            window.location.href = "/pereman/masuk";
          }}
          className="mt-2 flex w-full items-center gap-2 text-[13px] text-white/45 transition-colors hover:text-white/80"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 bg-[#191916] lg:block">{nav}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-overlay" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#191916] shadow-lg">
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute top-3.5 right-3 rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X size={17} />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <button
        onClick={() => setOpen(true)}
        aria-label="Buka menu admin"
        className="fixed bottom-5 left-5 z-40 rounded-full bg-[#191916] p-3 text-white shadow-lg lg:hidden"
      >
        <Menu size={18} />
      </button>
    </>
  );
}
