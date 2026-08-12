"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { AdminPageHeader } from "@/components/admin/admin-header";
import { useToast } from "@/components/ui/toast";

interface Notification {
  id: string;
  title: string;
  target: string;
  status: "terkirim" | "terjadwal";
  date: string;
}

const initial: Notification[] = [
  { id: "n-001", title: "Pekan Produktivitas dimulai", target: "Semua pengguna", status: "terkirim", date: "1 Agustus 2026" },
  { id: "n-002", title: "NeuraMind 1.2 tersedia", target: "Pembeli NeuraMind", status: "terkirim", date: "8 Agustus 2026" },
  { id: "n-003", title: "Promo Kembali Sekolah", target: "Daftar keinginan pendidikan", status: "terjadwal", date: "1 September 2026" },
];

export default function AdminNotifikasiPage() {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const columns: Column<Notification>[] = [
    {
      key: "judul",
      header: "Notifikasi",
      render: (n) => <p className="text-[13px] font-medium">{n.title}</p>,
    },
    { key: "target", header: "Target", render: (n) => <Badge tone="neutral">{n.target}</Badge> },
    { key: "tanggal", header: "Tanggal", render: (n) => <span className="text-[13px] text-fg-muted">{n.date}</span> },
    { key: "status", header: "Status", render: (n) => <StatusBadge status={n.status === "terkirim" ? "berhasil" : "terjadwal"} /> },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Notifikasi"
        description="Kabar yang dikirim ke pengguna."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={15} />
            Buat Notifikasi
          </Button>
        }
      />
      <DataTable columns={columns} rows={initial} />

      <Modal open={open} onClose={() => setOpen(false)} title="Buat Notifikasi">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            toast.push({ title: "Notifikasi terjadwal" });
          }}
        >
          <Field label="Judul" htmlFor="judul">
            <Input id="judul" required placeholder="cth. Pembaruan SecureVault 2.6.4" />
          </Field>
          <Field label="Pesan" htmlFor="pesan">
            <Textarea id="pesan" />
          </Field>
          <Field label="Target" htmlFor="target">
            <Select id="target">
              <option>Semua pengguna</option>
              <option>Pembeli aplikasi tertentu</option>
              <option>Daftar keinginan</option>
            </Select>
          </Field>
          <Field label="Jadwal Kirim" htmlFor="jadwal">
            <Input id="jadwal" type="date" required />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit">
              <Send size={14} />
              Jadwalkan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}