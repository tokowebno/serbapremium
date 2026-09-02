import type { Metadata } from "next";
import { AccountNav } from "./account-nav";

export const metadata: Metadata = {
  title: "Koleksi & Akun",
  description: "Kelola koleksi, pesanan, dan daftar keinginan SerbaPremium Anda.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mb-8 border-b-2 border-border pb-4">
        <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
          KOLEKSI & PESANAN
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-fg sm:text-[32px]">Koleksi & Pesanan Saya</h1>
        <p className="mt-1 text-xs font-bold text-fg-muted">Akses semua lisensi digital dan riwayat pesanan Anda di browser ini.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
