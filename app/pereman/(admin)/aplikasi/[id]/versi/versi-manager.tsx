"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Textarea, Switch } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/admin/data-table";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import type { App, Platform } from "@/types";

interface VersionDetail {
  number: string;
  releasedAt: string;
  platforms: Platform[];
  changelog: string[];
  isLatest: boolean;
}

function buildVersions(app: App): VersionDetail[] {
  const base = new Date(app.updatedAt);
  const older = (months: number): string => {
    const d = new Date(base);
    d.setMonth(d.getMonth() - months);
    return d.toISOString().slice(0, 10);
  };
  const [major, minor] = app.version.split(".").map(Number);
  const m = Math.max(0, (minor ?? 1) - 1);
  return [
    { number: app.version, releasedAt: older(0), platforms: app.platforms, changelog: ["Perbaikan bug dan peningkatan stabilitas", "Penyempurnaan antarmuka", "Optimalisasi performa"], isLatest: true },
    { number: `${major}.${m}.0`, releasedAt: older(2), platforms: app.platforms, changelog: ["Fitur baru: ekspor batch", "Perbaikan sinkronisasi"], isLatest: false },
    { number: `${major}.${Math.max(0, m - 1)}.0`, releasedAt: older(5), platforms: app.platforms.slice(0, 3), changelog: ["Rilis perdana untuk platform utama"], isLatest: false },
    { number: `${Math.max(1, major - 1)}.0.0`, releasedAt: older(9), platforms: app.platforms.slice(0, 2), changelog: ["Versi awal"], isLatest: false },
  ];
}

export function VersiManager({ app }: { app: App }) {
  const [versions, setVersions] = useState(buildVersions(app));
  const [open, setOpen] = useState(false);
  const [latest, setLatest] = useState(app.version);
  const toast = useToast();

  const remove = (v: VersionDetail) => {
    setVersions((prev) => prev.filter((x) => x.number !== v.number));
    toast.push({ title: "Versi dihapus", description: `${app.name} ${v.number}`, tone: "error" });
  };

  const setAsLatest = (v: VersionDetail) => {
    setLatest(v.number);
    setVersions((prev) => prev.map((x) => ({ ...x, isLatest: x.number === v.number })));
    toast.push({ title: "Versi terbaru diperbarui", description: `${app.name} ${v.number}` });
  };

  const columns: Column<VersionDetail>[] = [
    {
      key: "versi",
      header: "Versi",
      render: (v) => (
        <span className="font-mono text-[13px] font-medium">
          {v.number}
          {v.isLatest && <Badge tone="accent" className="ml-2">Terbaru</Badge>}
        </span>
      ),
    },
    { key: "tanggal", header: "Tanggal Rilis", render: (v) => <span className="text-[13px] text-fg-muted">{formatDate(v.releasedAt)}</span> },
    { key: "platform", header: "Platform", render: (v) => <span className="text-[13px] text-fg-muted">{v.platforms.join(", ")}</span> },
    {
      key: "changelog",
      header: "Changelog",
      render: (v) => (
        <ul className="max-w-md space-y-0.5">
          {v.changelog.slice(0, 2).map((c, i) => (
            <li key={i} className="truncate text-[13px] text-fg-muted">{c}</li>
          ))}
        </ul>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "text-right",
      render: (v) => (
        <div className="flex justify-end gap-1">
          {!v.isLatest && (
            <Button variant="ghost" size="sm" onClick={() => setAsLatest(v)}>
              Jadikan Terbaru
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => remove(v)} aria-label={`Hapus versi ${v.number}`}>
            <Trash2 size={14} className="text-discount" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Versi {app.name}</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Versi terbaru: <span className="font-mono font-medium text-fg">{latest}</span>
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={15} />
          Tambah Versi
        </Button>
      </div>

      <DataTable columns={columns} rows={versions} />

      <Modal open={open} onClose={() => setOpen(false)} title={`Tambah Versi — ${app.name}`}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const number = String(form.get("versi") ?? "");
            const changelog = String(form.get("changelog") ?? "").split("\n").filter(Boolean);
            const isLatest = form.get("terbaru") === "on";
            setVersions((prev) => [
              ...prev.map((v) => ({ ...v, isLatest: false })),
              { number, releasedAt: new Date().toISOString().slice(0, 10), platforms: app.platforms as Platform[], changelog, isLatest },
            ]);
            if (isLatest) setLatest(number);
            setOpen(false);
            toast.push({ title: "Versi ditambahkan", description: `${app.name} ${number}` });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nomor Versi" htmlFor="versi">
              <Input id="versi" name="versi" placeholder="2.5.0" required />
            </Field>
            <Field label="Tanggal Rilis" htmlFor="rilis">
              <Input id="rilis" name="rilis" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </Field>
          </div>
          <Field label="Changelog" hint="Satu baris per item." htmlFor="changelog">
            <Textarea id="changelog" name="changelog" rows={4} placeholder={"Perbaikan bug\nFitur baru\nPeningkatan performa"} />
          </Field>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Jadikan versi terbaru</span>
            <Switch checked onChange={() => {}} label="Jadikan versi terbaru" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit">Simpan Versi</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}