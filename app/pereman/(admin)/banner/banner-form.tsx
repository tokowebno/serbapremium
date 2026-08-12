"use client";

import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function BannerForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();

  return (
    <Modal open={open} onClose={onClose} title="Tambah Banner">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
          toast.push({ title: "Banner dibuat", description: "Daftar banner diperbarui." });
        }}
      >
        <Field label="Judul" htmlFor="judul">
          <Input id="judul" required placeholder="cth. Pekan Produktivitas" />
        </Field>
        <Field label="Deskripsi" htmlFor="deskripsi">
          <Textarea id="deskripsi" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Teks CTA" htmlFor="cta">
            <Input id="cta" placeholder="Lihat Promo" />
          </Field>
          <Field label="Tujuan Tautan" htmlFor="href">
            <Input id="href" placeholder="/promo" />
          </Field>
          <Field label="Mulai" htmlFor="mulai">
            <Input id="mulai" type="date" required />
          </Field>
          <Field label="Selesai" htmlFor="selesai">
            <Input id="selesai" type="date" required />
          </Field>
        </div>
        <Field label="Tema Warna" htmlFor="tone">
          <Select id="tone" defaultValue="accent">
            <option value="accent">Hijau gelap</option>
            <option value="graphite">Graphite</option>
            <option value="warm">Krem hangat</option>
          </Select>
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" defaultValue="aktif">
            <option value="aktif">Aktif</option>
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