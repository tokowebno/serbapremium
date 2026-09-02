"use client";

import { CategoryForm } from "./category-form";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader } from "@/components/admin/admin-header";

export default function AdminKategoriPage() {
  const cats = api.categories.withCount();

  const columns: Column<(typeof cats)[number]>[] = [
    {
      key: "nama",
      header: "Kategori",
      render: (c) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
            <c.icon size={16} className="text-fg-muted" />
          </span>
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="font-mono text-xs text-fg-faint">{c.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "deskripsi",
      header: "Deskripsi",
      render: (c) => <span className="text-[13px] text-fg-muted">{c.description}</span>,
    },
    {
      key: "jumlah",
      header: "Aplikasi",
      render: (c) => (
        <span className={c.count > 0 ? "font-medium tabular-nums" : "text-fg-faint"}>{c.count}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => <StatusBadge status="aktif" />,
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <CategoryForm trigger="edit" category={c} />
          <CategoryForm trigger="hapus" category={c} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Kategori"
        description="Kelola kategori aplikasi di SerbaPremium."
        actions={<CategoryForm trigger="tambah" />}
      />
      <DataTable columns={columns} rows={cats} />
    </div>
  );
}