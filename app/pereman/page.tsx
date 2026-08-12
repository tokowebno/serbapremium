import type { Metadata } from "next";
import Link from "next/link";
import { AppWindow, Banknote, Download, Package, Users } from "lucide-react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { LineChart, HorizontalBars } from "@/components/admin/charts";
import { AdminPageHeader } from "@/components/admin/admin-header";
import { formatRupiah, formatCompact, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dasbor",
};

export default function AdminDashboardPage() {
  const revenue = api.stats.revenue();
  const orders = api.orders.list();
  const latestOrders = orders.slice(0, 5);
  const latestActivity = api.activity.list().slice(0, 6);
  const revenueSeries = api.charts.revenueSeries();
  const topApps = api.charts.topApps(5);

  return (
    <div>
      <AdminPageHeader
        title="Dasbor"
        description="Ringkasan performa Tokono hari ini."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard label="Pendapatan" value={formatRupiah(revenue)} delta="+12% dari bulan lalu" icon={Banknote} />
        <StatCard label="Pesanan" value={api.stats.ordersCount().toString()} delta="+8% dari bulan lalu" icon={Package} />
        <StatCard label="Pengguna" value={api.stats.usersCount().toString()} hint="Terdaftar" icon={Users} />
        <StatCard label="Aplikasi" value={api.stats.appsCount().toString()} hint="18 terbit" icon={AppWindow} />
        <StatCard label="Unduhan" value={formatCompact(api.stats.downloads())} hint="Semua waktu" icon={Download} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-[15px] font-semibold tracking-tight">Pendapatan 8 Bulan</h2>
          <LineChart data={revenueSeries} />
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-[15px] font-semibold tracking-tight">Aplikasi Terlaris</h2>
          <HorizontalBars data={topApps} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-[15px] font-semibold tracking-tight">Pesanan Terbaru</h2>
            <Link href="/pereman/pesanan" className="text-[13px] font-medium text-accent hover:underline">
              Lihat semua
            </Link>
          </div>
          <ul className="divide-y divide-border px-6 py-2">
            {latestOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[13px] font-medium">{o.id}</p>
                  <p className="truncate text-[13px] text-fg-muted">{o.userName}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={o.paymentStatus} />
                  <span className="font-medium tabular-nums">{formatRupiah(o.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-[15px] font-semibold tracking-tight">Aktivitas Terbaru</h2>
            <Link href="/pereman/aktivitas" className="text-[13px] font-medium text-accent hover:underline">
              Lihat semua
            </Link>
          </div>
          <ul className="divide-y divide-border px-6 py-2">
            {latestActivity.map((a) => (
              <li key={a.id} className="py-3 text-sm">
                <p className="truncate">
                  <span className="font-medium">{a.admin}</span>{" "}
                  <span className="text-fg-muted">
                    {a.action} {a.target}
                  </span>
                </p>
                <p className="text-xs text-fg-faint">{formatDate(a.date)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}