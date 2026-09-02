"use client";

import Link from "next/link";
import { History, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth, useLibrary, useWishlist } from "@/components/storefront/providers";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function RingkasanPage() {
  const { user } = useAuth();
  const { entries } = useLibrary();
  const { ids } = useWishlist();

  const koleksi = entries.filter((e) => api.apps.getBySlug(e.appId)).length;
  const totalBelanja = entries.reduce((sum, e) => {
    const app = api.apps.getBySlug(e.appId);
    return sum + (app ? app.price : 0);
  }, 0);

  const stats = [
    { label: "Aplikasi di Koleksi", value: koleksi.toString() },
    { label: "Daftar Keinginan", value: ids.length.toString() },
    { label: "Total Nilai Akun", value: formatRupiah(totalBelanja) },
  ];

  return (
    <div className="space-y-6">
      {/* Profil */}
      <div className="glass-card flex flex-wrap items-center gap-4 rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-xl font-bold text-accent ring-1 ring-accent/20">
          {user?.name?.charAt(0) ?? "U"}
        </span>
        <div>
          <p className="text-xl font-bold tracking-tight text-fg">{user?.name ?? "Pengguna"}</p>
          <p className="text-xs font-normal text-fg-muted">{user?.email ?? "-"}</p>
        </div>
        <ButtonLink href="/akun/pengaturan" variant="secondary" size="sm" className="ml-auto rounded-full">
          Pengaturan Akun
        </ButtonLink>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-2xl border border-border/80 bg-surface/90 p-4 shadow-sm backdrop-blur-md">
            <p className="text-xs font-medium uppercase text-fg-muted">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-fg">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Koleksi */}
      {koleksi > 0 ? (
        <div className="glass-card rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
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
                  <div key={e.appId} className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface-2/60 p-3">
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