import type { Metadata } from "next";
import { api } from "@/lib/api";
import { StatCard } from "@/components/admin/stat-card";
import { Banknote, Package, Users, AppWindow } from "lucide-react";
import { LineChart, BarChart, HorizontalBars } from "@/components/admin/charts";
import { AdminPageHeader } from "@/components/admin/admin-header";
import { formatRupiah } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Laporan",
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-4 text-[15px] font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

export default function AdminLaporanPage() {
  return (
    <div>
      <AdminPageHeader title="Laporan" description="Ringkasan performa SerbaPremium per periode. (Data contoh Januari–Agustus 2026)" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Pendapatan" value={formatRupiah(api.stats.revenue())} icon={Banknote} />
        <StatCard label="Pesanan" value={api.stats.ordersCount().toString()} icon={Package} />
        <StatCard label="Pengguna" value={api.stats.usersCount().toString()} icon={Users} />
        <StatCard label="Aplikasi Terbit" value={api.stats.appsCount().toString()} icon={AppWindow} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Pendapatan">
          <LineChart data={api.charts.revenueSeries()} />
        </ChartCard>
        <ChartCard title="Pesanan">
          <LineChart data={api.charts.ordersSeries()} />
        </ChartCard>
        <ChartCard title="Pertumbuhan Pengguna">
          <BarChart data={api.charts.usersSeries()} />
        </ChartCard>
        <div className="grid gap-4">
          <ChartCard title="Aplikasi Terlaris">
            <HorizontalBars data={api.charts.topApps(5)} />
          </ChartCard>
          <ChartCard title="Kategori Terlaris">
            <HorizontalBars data={api.charts.topCategories(5)} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}