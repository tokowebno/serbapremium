"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-header";
import { formatDate } from "@/lib/utils";
import type { Banner } from "@/types";
import { BannerForm } from "./banner-form";

export default function AdminBannerPage() {
  const banners = api.banners.list();
  const [open, setOpen] = useState(false);

  const columns: Column<Banner>[] = [
    {
      key: "judul",
      header: "Banner",
      render: (b) => (
        <div>
          <p className="text-[13px] font-medium">{b.title}</p>
          <p className="max-w-sm truncate text-xs text-fg-faint">{b.description}</p>
        </div>
      ),
    },
    { key: "cta", header: "CTA", render: (b) => <span className="text-[13px]">{b.cta}</span> },
    { key: "tujuan", header: "Tujuan", render: (b) => <span className="font-mono text-xs text-fg-muted">{b.href}</span> },
    {
      key: "periode",
      header: "Periode",
      render: (b) => (
        <span className="text-[13px] text-fg-muted">
          {formatDate(b.startDate)} – {formatDate(b.endDate)}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (b) => <StatusBadge status={b.status} /> },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Banner"
        description={`${banners.length} banner, ${banners.filter((b) => b.status === "aktif").length} tampil.`}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} />
            Tambah Banner
          </Button>
        }
      />
      <DataTable columns={columns} rows={banners} />
      <BannerForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}