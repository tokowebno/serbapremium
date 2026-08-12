"use client";

import { Download, Smartphone, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatCard } from "@/components/admin/stat-card";
import { AppIcon } from "@/components/ui/app-icon";
import { AdminPageHeader } from "@/components/admin/admin-header";
import { formatCompact } from "@/lib/utils";
import { HorizontalBars } from "@/components/admin/charts";
import type { App } from "@/types";

export default function AdminUnduhanPage() {
  const apps = [...api.apps.list()].sort((a, b) => b.downloads - a.downloads);
  const total = api.stats.downloads();
  const series = api.charts.revenueSeries();
  const month = series[series.length - 1].value;

  const columns: Column<App>[] = [
    {
      key: "aplikasi",
      header: "Aplikasi",
      render: (a) => (
        <div className="flex items-center gap-3">
          <AppIcon icon={a.icon} size="sm" />
          <div>
            <p className="text-[13px] font-medium">{a.name}</p>
            <p className="text-xs text-fg-faint">v{a.version}</p>
          </div>
        </div>
      ),
    },
    { key: "unduhan", header: "Unduhan", render: (a) => <span className="font-medium tabular-nums">{formatCompact(a.downloads)}</span> },
    { key: "platform", header: "Platform", render: (a) => <span className="tabular-nums">{a.platforms.length}</span> },
    { key: "rating", header: "Rating", render: (a) => <span className="tabular-nums">{a.rating.toLocaleString("id-ID", { minimumFractionDigits: 1 })}</span> },
  ];

  return (
    <div>
      <AdminPageHeader title="Unduhan" description="Performa unduhan seluruh aplikasi." />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard label="Total Unduhan" value={formatCompact(total)} icon={Download} />
        <StatCard label="Estimasi Bulan Ini" value={formatCompact(Math.round(month * 12))} icon={TrendingUp} />
        <StatCard label="Rata-rata per Aplikasi" value={formatCompact(Math.round(total / apps.length))} icon={Smartphone} />
      </div>
      <div className="mb-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-[15px] font-semibold tracking-tight">Distribusi Unduhan</h2>
        <HorizontalBars data={api.charts.topApps(8)} />
      </div>
      <DataTable columns={columns} rows={apps} />
    </div>
  );
}