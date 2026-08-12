"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-header";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatRupiah } from "@/lib/utils";
import type { Promotion } from "@/types";
import { PromoForm } from "./promo-form";

export default function AdminPromoPage() {
  const promos = api.promotions.list();
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const columns: Column<Promotion>[] = [
    {
      key: "judul",
      header: "Promo",
      render: (p) => (
        <div>
          <p className="text-[13px] font-medium">{p.title}</p>
          <p className="max-w-xs truncate text-xs text-fg-faint">{p.description}</p>
        </div>
      ),
    },
    {
      key: "tipe",
      header: "Tipe",
      render: (p) => (p.type === "persen" ? <Badge tone="accent">Persentase</Badge> : <Badge>Nominal</Badge>),
    },
    {
      key: "nilai",
      header: "Nilai",
      render: (p) => (
        <span className="font-medium tabular-nums">
          {p.type === "persen" ? `${p.value}%` : formatRupiah(p.value)}
        </span>
      ),
    },
    {
      key: "periode",
      header: "Periode",
      render: (p) => (
        <span className="text-[13px] text-fg-muted">
          {formatDate(p.startDate)} – {formatDate(p.endDate)}
        </span>
      ),
    },
    {
      key: "aplikasi",
      header: "Aplikasi Terkait",
      render: (p) => <span className="tabular-nums">{p.appIds.length} aplikasi</span>,
    },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
    {
      key: "aksi",
      header: "Aksi",
      className: "text-right",
      render: (p) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.push({ title: "Promo diperbarui", description: p.title, tone: "info" })}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Promo"
        description={`${promos.length} promo, ${promos.filter((p) => p.status === "aktif").length} aktif.`}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} />
            Tambah Promo
          </Button>
        }
      />
      <DataTable columns={columns} rows={promos} />
      <PromoForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}