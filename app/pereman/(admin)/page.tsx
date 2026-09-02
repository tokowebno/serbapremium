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
        description="Ringkasan performa SerbaPremium hari ini."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard label="Pendapatan" value={formatRupiah(revenue)} delta="+12% dari bulan lalu" icon={Banknote} />
        <StatCard label="Pesanan" value={api.stats.ordersCount().toString()} delta="+8% dari bulan lalu" icon={Package} />
        <StatCard label="Pengguna" value={api.stats.usersCount().toString()} hint="Terdaftar" icon={Users} />
        <StatCard label="Aplikasi" value={api.stats.appsCount().toString()} hint="18 terbit" icon={AppWindow} />
        <StatCard label="Unduhan" value={formatCompact(api.stats.downloads())} hint="Semua waktu" icon={Download} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
          <h2 className="mb-4 text-base font-black tracking-tight text-fg uppercase">Pendapatan 8 Bulan</h2>
          <LineChart data={revenueSeries} />
        </div>
        <div className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
          <h2 className="mb-4 text-base font-black tracking-tight text-fg uppercase">Aplikasi Terlaris</h2>
          <HorizontalBars data={topApps} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border-2 border-border bg-surface shadow-[4px_4px_0px_var(--shadow-color)]">
          <div className="flex items-center justify-between border-b-2 border-border px-6 py-4">
            <h2 className="text-base font-black tracking-tight text-fg uppercase">Pesanan Terbaru</h2>
            <Link href="/pereman/pesanan" className="text-xs font-bold text-accent-blue dark:text-accent hover:underline">
              Lihat semua →
            </Link>
          </div>
          <ul className="divide-y-2 divide-border px-6 py-2">
            {latestOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[13px] font-bold text-fg">{o.id}</p>
                  <p className="truncate text-xs font-medium text-fg-muted">{o.userName}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={o.paymentStatus} />
                  <span className="font-bold tabular-nums text-fg">{formatRupiah(o.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border-2 border-border bg-surface shadow-[4px_4px_0px_var(--shadow-color)]">
          <div className="flex items-center justify-between border-b-2 border-border px-6 py-4">
            <h2 className="text-base font-black tracking-tight text-fg uppercase">Aktivitas Terbaru</h2>
            <Link href="/pereman/aktivitas" className="text-xs font-bold text-accent-blue dark:text-accent hover:underline">
              Lihat semua →
            </Link>
          </div>
          <ul className="divide-y-2 divide-border px-6 py-2">
            {latestActivity.map((a) => (
              <li key={a.id} className="py-3 text-sm">
                <p className="truncate text-[13.5px]">
                  <span className="font-black text-fg">{a.admin}</span>{" "}
                  <span className="text-fg-muted">
                    {a.action} {a.target}
                  </span>
                </p>
                <p className="text-xs font-bold text-fg-faint">{formatDate(a.date)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}