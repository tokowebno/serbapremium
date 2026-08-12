"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { AdminPageHeader, AdminSearchInput, AdminToolbar } from "@/components/admin/admin-header";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatCompact } from "@/lib/utils";
import type { Developer } from "@/types";

export default function AdminPengembangPage() {
  const devs = api.developers.list();
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const toast = useToast();

  const filtered = useMemo(
    () => devs.filter((d) => q === "" || d.name.toLowerCase().includes(q.toLowerCase())),
    [devs, q],
  );

  const columns: Column<Developer>[] = [
    {
      key: "nama",
      header: "Pengembang",
      render: (d) => (
        <div className="flex items-center gap-3">
          <AppIcon icon={d.logo} size="sm" />
          <div>
            <p className="text-[13px] font-medium">{d.name}</p>
            <p className="text-xs text-fg-faint">{d.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: "aplikasi",
      header: "Aplikasi",
      render: (d) => <span className="tabular-nums">{api.apps.byDeveloper(d.id).length}</span>,
    },
    {
      key: "unduhan",
      header: "Unduhan",
      render: (d) => (
        <span className="tabular-nums">{formatCompact(api.apps.byDeveloper(d.id).reduce((s, a) => s + a.downloads, 0))}</span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (d) => {
        const apps = api.apps.byDeveloper(d.id);
        const avg = apps.length ? apps.reduce((s, a) => s + a.rating, 0) / apps.length : 0;
        return <span className="tabular-nums">{avg.toLocaleString("id-ID", { minimumFractionDigits: 1 })}</span>;
      },
    },
    { key: "bergabung", header: "Bergabung", render: (d) => <span className="text-[13px] text-fg-muted">{formatDate(d.joinDate)}</span> },
    {
      key: "status",
      header: "Status",
      render: () => <StatusBadge status="aktif" />,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Pengembang"
        description={`${devs.length} studio terdaftar.`}
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={15} />
            Tambah Pengembang
          </Button>
        }
      />
      <AdminToolbar>
        <AdminSearchInput value={q} onChange={setQ} placeholder="Cari pengembang…" />
      </AdminToolbar>
      <DataTable columns={columns} rows={filtered} />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Tambah Pengembang">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setAddOpen(false);
            toast.push({ title: "Pengembang ditambahkan" });
          }}
        >
          <Field label="Nama Studio" htmlFor="nama">
            <Input id="nama" required placeholder="cth. NusaSoft" />
          </Field>
          <Field label="Deskripsi" htmlFor="deskripsi">
            <Textarea id="deskripsi" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website" htmlFor="web">
              <Input id="web" placeholder="https://…" />
            </Field>
            <Field label="Lokasi" htmlFor="lokasi">
              <Input id="lokasi" placeholder="cth. Jakarta, Indonesia" />
            </Field>
          </div>
          <Field label="Status">
            <Select defaultValue="aktif">
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </Select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setAddOpen(false)}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      <p className="mt-3 flex items-center gap-2 text-xs text-fg-faint">
        <Badge tone="neutral">Demo</Badge> Penambahan pengembang baru tersimpan sementara — integrasi backend menyusul.
      </p>
    </div>
  );
}