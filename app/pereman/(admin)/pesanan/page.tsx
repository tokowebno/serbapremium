"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader, AdminSearchInput, AdminSelect, AdminToolbar } from "@/components/admin/admin-header";
import { formatRupiah, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

export default function AdminPesananPage() {
  const orders = api.orders.list();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("semua");

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (status === "semua" || o.paymentStatus === status) &&
          (q === "" || o.id.toLowerCase().includes(q.toLowerCase()) || o.userName.toLowerCase().includes(q.toLowerCase())),
      ),
    [orders, q, status],
  );

  const columns: Column<Order>[] = [
    {
      key: "id",
      header: "Nomor Pesanan",
      render: (o) => <span className="font-mono text-[13px] font-medium">{o.id}</span>,
    },
    {
      key: "pengguna",
      header: "Pengguna",
      render: (o) => <span className="text-[13px]">{o.userName}</span>,
    },
    {
      key: "produk",
      header: "Produk",
      render: (o) => <span className="text-[13px] text-fg-muted">{o.items.map((i) => api.apps.getBySlug(i.appId)?.name ?? i.appId).join(", ")}</span>,
    },
    {
      key: "total",
      header: "Total",
      render: (o) => (
        <div className="text-[13px]">
          <span className="font-medium tabular-nums">{formatRupiah(o.total)}</span>
          {o.discount > 0 && <span className="ml-1.5 text-xs text-discount">-{formatRupiah(o.discount)}</span>}
        </div>
      ),
    },
    {
      key: "pembayaran",
      header: "Status Pembayaran",
      render: (o) => <StatusBadge status={o.paymentStatus} />,
    },
    {
      key: "status",
      header: "Status Pesanan",
      render: (o) => <StatusBadge status={o.orderStatus} />,
    },
    {
      key: "tanggal",
      header: "Tanggal",
      render: (o) => <span className="text-[13px] text-fg-muted">{formatDate(o.date)}</span>,
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Pesanan" description={`${orders.length} pesanan tercatat.`} />
      <AdminToolbar>
        <AdminSearchInput value={q} onChange={setQ} placeholder="Cari nomor atau pengguna…" />
        <AdminSelect
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "semua", label: "Semua Status" },
            { value: "menunggu", label: "Menunggu Pembayaran" },
            { value: "dibayar", label: "Dibayar" },
            { value: "gagal", label: "Gagal" },
            { value: "dibatalkan", label: "Dibatalkan" },
            { value: "dikembalikan", label: "Dikembalikan" },
          ]}
        />
      </AdminToolbar>
      <DataTable columns={columns} rows={filtered} empty={<p className="px-6 py-12 text-center text-sm text-fg-muted">Tidak ada pesanan yang cocok.</p>} />
    </div>
  );
}