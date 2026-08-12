"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { AdminPageHeader, AdminSearchInput, AdminSelect, AdminToolbar } from "@/components/admin/admin-header";
import { useToast } from "@/components/ui/toast";
import { formatRupiah } from "@/lib/utils";
import type { App } from "@/types";

export default function AdminAplikasiPage() {
  const apps = api.apps.list();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("semua");
  const toast = useToast();

  // Status publikasi deterministik per produk (demo: 2 produk jadi draf)
  const isDraft = (id: string) => ["higgsfield-unlimited", "link-apple-tv"].includes(id);

  const filtered = useMemo(
    () =>
      apps.filter(
        (a) =>
          (cat === "semua" || a.categoryId === cat) &&
          (q === "" || a.name.toLowerCase().includes(q.toLowerCase()) || a.slug.toLowerCase().includes(q.toLowerCase())),
      ),
    [apps, q, cat],
  );

  const togglePublish = (a: App) => {
    toast.push({
      title: isDraft(a.id) ? "Aplikasi diterbitkan" : "Aplikasi diarsipkan",
      description: a.name,
      tone: isDraft(a.id) ? "success" : "info",
    });
  };

  const columns: Column<App>[] = [
    {
      key: "nama",
      header: "Aplikasi",
      render: (a) => (
        <div className="flex items-center gap-3">
          <AppIcon icon={a.icon} size="sm" />
          <div className="min-w-0">
            <p className="text-[13px] font-medium">{a.name}</p>
            <p className="truncate font-mono text-xs text-fg-faint">{a.slug}</p>
          </div>
          {a.isFeatured && <Badge tone="accent">Unggulan</Badge>}
        </div>
      ),
    },
    {
      key: "kategori",
      header: "Kategori",
      render: (a) => <span className="text-[13px]">{api.categories.list().find((c) => c.id === a.categoryId)?.name ?? "-"}</span>,
    },
    {
      key: "harga",
      header: "Harga",
      render: (a) => (
        <span className="text-[13px]">
          <span className="font-medium tabular-nums">{formatRupiah(a.price)}</span>
          {a.originalPrice && <span className="ml-1.5 text-xs text-fg-faint line-through">{formatRupiah(a.originalPrice)}</span>}
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (a) => <span className="tabular-nums">{a.rating.toLocaleString("id-ID", { minimumFractionDigits: 1 })}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (a) => (
        isDraft(a.id) ? <Badge>Draf</Badge> : <Badge tone="success">Terbit</Badge>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "text-right",
      render: (a) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => togglePublish(a)}>
            {isDraft(a.id) ? "Terbitkan" : "Arsipkan"}
          </Button>
          <ButtonLink href={`/pereman/aplikasi/${a.slug}`} variant="secondary" size="sm">
            Edit
          </ButtonLink>
          <ButtonLink href={`/pereman/aplikasi/${a.slug}/versi`} variant="ghost" size="sm">
            Versi
          </ButtonLink>
        </div>
      ),
    },
  ];

  const catOptions = [
    { value: "semua", label: "Semua Kategori" },
    ...api.categories.list().map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div>
      <AdminPageHeader
        title="Aplikasi"
        description={`${apps.length} aplikasi terdaftar.`}
        actions={
          <ButtonLink href="/pereman/aplikasi/baru">
            <Plus size={15} />
            Tambah Aplikasi
          </ButtonLink>
        }
      />
      <AdminToolbar>
        <AdminSearchInput value={q} onChange={setQ} placeholder="Cari nama atau slug…" />
        <AdminSelect label="Filter kategori" value={cat} onChange={setCat} options={catOptions} />
      </AdminToolbar>
      <DataTable columns={columns} rows={filtered} />
    </div>
  );
}