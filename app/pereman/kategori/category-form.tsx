"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Category } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const iconOptions = ["PenTool", "Zap", "Code2", "ShieldCheck", "BookOpen", "Box", "Music2", "Briefcase", "Cpu", "Camera", "Video", "Server", "Network", "Sparkles"];

export function CategoryForm({
  trigger,
  category,
}: {
  trigger: "tambah" | "edit" | "hapus";
  category?: Category;
}) {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const isHapus = trigger === "hapus";

  return (
    <>
      <Button
        variant={trigger === "hapus" ? "ghost" : trigger === "tambah" ? "primary" : "ghost"}
        size={trigger === "tambah" ? "md" : "sm"}
        onClick={() => setOpen(true)}
      >
        {trigger === "tambah" && <Plus size={15} />}
        {trigger === "edit" && <Pencil size={14} />}
        {trigger === "hapus" && <Trash2 size={14} className="text-fg-faint" />}
        {trigger === "hapus" ? "Hapus" : trigger === "tambah" ? "Tambah Kategori" : "Edit"}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={isHapus ? "Hapus Kategori" : trigger === "tambah" ? "Tambah Kategori" : "Edit Kategori"}
      >
        {isHapus ? (
          <div className="space-y-4">
            <p className="text-sm text-fg-muted">
              Yakin ingin menghapus kategori <span className="font-medium text-fg">{category?.name}</span>?
              Aplikasi di dalamnya tidak akan terhapus, hanya tidak terhubung ke kategori ini.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
              <Button variant="danger" onClick={() => { setOpen(false); toast.push({ title: "Kategori dihapus", description: category?.name, tone: "error" }); }}>Hapus</Button>
            </div>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              toast.push({ title: trigger === "tambah" ? "Kategori ditambahkan" : "Kategori disimpan" });
            }}
          >
            <Field label="Nama" htmlFor="nama">
              <Input id="nama" defaultValue={category?.name} placeholder="cth. Utilitas" required />
            </Field>
            <Field label="Slug" htmlFor="slug">
              <Input id="slug" defaultValue={category?.slug} placeholder="utilitas" required />
            </Field>
            <Field label="Deskripsi" htmlFor="deskripsi">
              <Textarea id="deskripsi" defaultValue={category?.description} />
            </Field>
            <Field label="Ikon">
              <Select defaultValue="Box">
                {iconOptions.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </Select>
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}