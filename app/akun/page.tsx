"use client";

import Link from "next/link";
import { History, Zap, Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth, useLibrary, useWishlist } from "@/components/storefront/providers";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function RingkasanPage() {
  const { user, balance, balanceUsd, transactions, openTopUp } = useAuth();
  const { entries } = useLibrary();
  const { ids } = useWishlist();

  const koleksi = entries.filter((e) => api.apps.getBySlug(e.appId)).length;
  const totalBelanja = entries.reduce((sum, e) => {
    const app = api.apps.getBySlug(e.appId);
    return sum + (app ? app.price : 0);
  }, 0);

  const stats = [
    { label: "Saldo Akun", value: formatRupiah(balance), sub: `$${balanceUsd.toFixed(2)} USD` },
    { label: "Aplikasi di Koleksi", value: koleksi.toString() },
    { label: "Daftar Keinginan", value: ids.length.toString() },
  ];

  return (
    <div className="space-y-6">
      {/* Profil & Saldo Card */}
      <div className="liquid-glass-slab flex flex-wrap items-center justify-between gap-4 rounded-[28px] p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="apple-squircle flex h-14 w-14 items-center justify-center text-xl font-black text-fg bg-surface-2 shadow-xs">
            {user?.name?.charAt(0) ?? "U"}
          </span>
          <div>
            <p className="text-xl font-black tracking-tight text-fg">{user?.name ?? "Pengguna"}</p>
            <p className="text-xs font-medium text-fg-muted">{user?.email ?? "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ButtonLink href="/isi-saldo" size="sm" className="rounded-full shadow-xs font-bold px-4">
            <PlusCircle size={14} />
            + Isi Saldo
          </ButtonLink>
          <ButtonLink href="/akun/pengaturan" variant="secondary" size="sm" className="rounded-full font-semibold px-4">
            Pengaturan Akun
          </ButtonLink>
        </div>
      </div>

      {/* Saldo Banner Widget */}
      <div className="liquid-glass-slab relative overflow-hidden rounded-[28px] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 border border-border-strong bg-surface">

        <div className="relative z-10 flex items-center gap-4">
          <div className="apple-squircle flex h-14 w-14 items-center justify-center bg-surface-2 text-fg shadow-sm">
            <Wallet size={26} strokeWidth={2.4} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">Saldo Dompet Tersedia</span>
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-fg tabular-nums">{formatRupiah(balance)}</span>
              <span className="text-sm font-bold text-fg-muted">≈ ${balanceUsd.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => openTopUp()}
          size="lg"
          className="relative z-10 w-full sm:w-auto rounded-full bg-fg hover:bg-fg/90 text-surface font-bold px-7 py-3 shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <PlusCircle size={16} />
          <span>Tambah Dana Sekarang</span>
        </Button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="liquid-glass-slab rounded-2xl p-4 transition-all">
            <p className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">{s.label}</p>
            <p className="mt-1.5 text-2xl font-black tracking-tight tabular-nums text-fg">{s.value}</p>
            {s.sub && <p className="text-[11px] font-bold text-fg-muted mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Riwayat Transaksi Saldo Terakhir */}
      {transactions && transactions.length > 0 && (
        <div className="liquid-glass-slab rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold tracking-tight text-fg">Riwayat Transaksi Saldo</h2>
            <button
              type="button"
              onClick={() => openTopUp()}
              className="text-xs font-semibold text-accent hover:underline cursor-pointer"
            >
              + Top Up Saldo →
            </button>
          </div>
          <div className="mt-4 space-y-2.5">
            {transactions.slice(-5).reverse().map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.type === "deposit" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                    {t.type === "deposit" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-fg">{t.title}</p>
                    <p className="text-[10.5px] text-fg-muted">{new Date(t.date).toLocaleString("id-ID")}</p>
                  </div>
                </div>
                <span className={`text-sm font-black tabular-nums ${t.type === "deposit" ? "text-success" : "text-fg"}`}>
                  {t.type === "deposit" ? "+" : "-"}{formatRupiah(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Koleksi */}
      {koleksi > 0 ? (
        <div className="liquid-glass-slab rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold tracking-tight text-fg">Koleksi Terakhir</h2>
            <Link href="/akun/koleksi" className="text-xs font-semibold text-accent hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {entries
              .slice(-3)
              .reverse()
              .map((e) => {
                const app = api.apps.getBySlug(e.appId);
                if (!app) return null;
                return (
                  <div key={e.appId} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
                    <AppIcon icon={app.icon} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{app.name}</p>
                      <p className="text-xs font-normal text-fg-muted">Dibeli {formatDate(e.purchasedAt)}</p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-fg">{formatRupiah(app.price)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="Belum ada lisensi di koleksi"
          description="Aplikasi yang Anda beli akan langsung muncul di sini dan siap diunduh."
          action={{ label: "Jelajahi Katalog", href: "/aplikasi" }}
        />
      )}
    </div>
  );
}