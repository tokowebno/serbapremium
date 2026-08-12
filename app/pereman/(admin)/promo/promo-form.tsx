"use client";

import { api } from "@/lib/api";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function PromoForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const apps = api.apps.list();

  return (
    <Modal open={open} onClose={onClose} title="Tambah Promo">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
          toast.push({ title: "Promo dibuat", description: "Daftar promo diperbarui." });
        }}
      >
        <Field label="Judul" htmlFor="judul">
          <Input id="judul" required placeholder="cth. Pekan Produktivitas" />
        </Field>
        <Field label="Deskripsi" htmlFor="deskripsi">
          <Textarea id="deskripsi" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipe" htmlFor="tipe">
            <Select id="tipe" defaultValue="persen">
              <option value="persen">Diskon persentase</option>
              <option value="nominal">Diskon nominal</option>
            </Select>
          </Field>
          <Field label="Nilai" htmlFor="nilai">
            <Input id="nilai" type="number" min={1} placeholder="25" required />
          </Field>
          <Field label="Mulai" htmlFor="mulai">
            <Input id="mulai" type="date" required />
          </Field>
          <Field label="Selesai" htmlFor="selesai">
            <Input id="selesai" type="date" required />
          </Field>
        </div>
        <Field label="Aplikasi Terkait" htmlFor="apps">
          <Select id="apps" defaultValue="semua">
            <option value="semua">Semua aplikasi di kategori promo</option>
            {apps.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" defaultValue="aktif">
            <option value="aktif">Aktif</option>
            <option value="terjadwal">Terjadwal</option>
            <option value="nonaktif">Nonaktif</option>
          </Select>
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}