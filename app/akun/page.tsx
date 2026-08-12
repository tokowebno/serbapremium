"use client";

import Link from "next/link";
import { History } from "lucide-react";
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
    { label: "Aplikasi di koleksi", value: koleksi.toString() },
    { label: "Daftar keinginan", value: ids.length.toString() },
    { label: "Total belanja", value: formatRupiah(totalBelanja) },
  ];

  return (
    <div className="space-y-6">
      {/* Profil */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-lg font-semibold">
          {user?.name?.charAt(0) ?? "?"}
        </span>
        <div>
          <p className="text-lg font-semibold tracking-tight">{user?.name ?? "Pengguna"}</p>
          <p className="text-sm text-fg-muted">{user?.email ?? "-"}</p>
        </div>
        <ButtonLink href="/akun/pengaturan" variant="secondary" size="sm" className="ml-auto">
          Pengaturan
        </ButtonLink>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-[13px] text-fg-muted">{s.label}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Koleksi */}
      {koleksi > 0 ? (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold tracking-tight">Koleksi Terakhir</h2>
            <Link href="/akun/koleksi" className="text-[13px] font-medium text-accent hover:underline">
              Lihat semua
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
                  <div key={e.appId} className="flex items-center gap-3">
                    <AppIcon icon={app.icon} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{app.name}</p>
                      <p className="text-[13px] text-fg-muted">Dibeli {formatDate(e.purchasedAt)}</p>
                    </div>
                    <span className="text-sm font-medium tabular-nums">{formatRupiah(app.price)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="Belum ada koleksi."
          description="Aplikasi yang Anda beli akan muncul di sini."
          action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
        />
      )}
    </div>
  );
}