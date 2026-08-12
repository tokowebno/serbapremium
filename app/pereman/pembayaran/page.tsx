"use client";

import { useMemo, useState } from "react";
import { Banknote, CircleSlash2, Clock, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader, AdminSelect, AdminToolbar } from "@/components/admin/admin-header";
import { formatRupiah, formatDate, seededRandom } from "@/lib/utils";
import type { Order } from "@/types";

const methods = ["Transfer Bank", "Kartu Kredit", "e-Wallet"];

function methodFor(id: string): string {
  return methods[Math.floor(seededRandom(id.split("").reduce((s, c) => s + c.charCodeAt(0), 0))() * methods.length)];
}

const orders = api.orders.list();

export default function AdminPembayaranPage() {
  const [status, setStatus] = useState("semua");

  const paid = orders.filter((o) => o.paymentStatus === "dibayar").reduce((s, o) => s + o.total, 0);
  const menunggu = orders.filter((o) => o.paymentStatus === "menunggu").reduce((s, o) => s + o.total, 0);
  const gagal = orders.filter((o) => o.paymentStatus === "gagal").reduce((s, o) => s + o.total, 0);
  const kembali = orders.filter((o) => o.paymentStatus === "dikembalikan").reduce((s, o) => s + o.total, 0);

  const filtered = useMemo(
    () => (status === "semua" ? orders : orders.filter((o) => o.paymentStatus === status)),
    [status],
  );

  const columns: Column<Order>[] = [
    { key: "id", header: "Transaksi", render: (o) => <span className="font-mono text-[13px] font-medium">{o.id}</span> },
    { key: "pengguna", header: "Pengguna", render: (o) => <span className="text-[13px]">{o.userName}</span> },
    { key: "metode", header: "Metode", render: (o) => <span className="text-[13px] text-fg-muted">{methodFor(o.id)}</span> },
    { key: "total", header: "Total", render: (o) => <span className="font-medium tabular-nums">{formatRupiah(o.total)}</span> },
    { key: "status", header: "Status", render: (o) => <StatusBadge status={o.paymentStatus} /> },
    { key: "tanggal", header: "Tanggal", render: (o) => <span className="text-[13px] text-fg-muted">{formatDate(o.date)}</span> },
  ];

  return (
    <div>
      <AdminPageHeader title="Pembayaran" description="Rekap pembayaran dan transaksi." />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total Diterima" value={formatRupiah(paid)} icon={Banknote} />
        <StatCard label="Menunggu" value={formatRupiah(menunggu)} icon={Clock} hint="Belum dikonfirmasi" />
        <StatCard label="Gagal" value={formatRupiah(gagal)} icon={CircleSlash2} hint="Perlu ditinjau" />
        <StatCard label="Dikembalikan" value={formatRupiah(kembali)} icon={RotateCcw} hint="Refund" />
      </div>
      <AdminToolbar>
        <AdminSelect
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "semua", label: "Semua Status" },
            { value: "menunggu", label: "Menunggu" },
            { value: "dibayar", label: "Dibayar" },
            { value: "gagal", label: "Gagal" },
            { value: "dibatalkan", label: "Dibatalkan" },
            { value: "dikembalikan", label: "Dikembalikan" },
          ]}
        />
      </AdminToolbar>
      <DataTable columns={columns} rows={filtered} />
    </div>
  );
}