import type { Metadata } from "next";
import { AccountNav } from "./account-nav";

export const metadata: Metadata = {
  title: "Koleksi & Akun",
  description: "Kelola koleksi, pesanan, dan daftar keinginan SerbaPremium Anda.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mb-8 border-b border-border/70 pb-4">
        <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold uppercase text-accent">
          KOLEKSI & PESANAN
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-fg">Koleksi & Pesanan Saya</h1>
        <p className="mt-1 text-xs sm:text-sm font-normal text-fg-muted">Akses semua lisensi digital dan riwayat pesanan Anda di browser ini.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
