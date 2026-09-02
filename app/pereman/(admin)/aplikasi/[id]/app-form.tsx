"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { App, Platform, ScreenshotKey } from "@/types";

const platforms: Platform[] = ["Android", "iOS", "Windows", "macOS", "Linux"];
const screenshotKeys: ScreenshotKey[] = ["editor", "dashboard", "mobile", "audio", "terminal", "grid", "form", "analytics", "video"];

export function AppForm({ app }: { app?: App }) {
  const toast = useToast();
  const devs = api.developers.list();
  const cats = api.categories.list();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(app?.platforms ?? []);
  const [iconFrom, setIconFrom] = useState(app?.icon.from ?? "#3d3a34");
  const [iconTo, setIconTo] = useState(app?.icon.to ?? "#1f1d19");

  const togglePlatform = (p: Platform) =>
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <AppIcon icon={{ from: iconFrom, to: iconTo, glyph: app?.icon.glyph ?? "box" }} size="lg" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {app ? `Edit ${app.name}` : "Tambah Aplikasi"}
          </h1>
          <p className="text-sm text-fg-muted">{app ? "Perbarui informasi aplikasi." : "Daftarkan aplikasi baru ke SerbaPremium."}</p>
        </div>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          toast.push({ title: app ? "Aplikasi disimpan" : "Aplikasi ditambahkan", description: app?.name, tone: "success" });
        }}
      >
        <section className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-[15px] font-semibold tracking-tight">Informasi Dasar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama" htmlFor="nama">
              <Input id="nama" defaultValue={app?.name} placeholder="cth. PixelForge Pro" required />
            </Field>
            <Field label="Slug" htmlFor="slug">
              <Input id="slug" defaultValue={app?.slug} placeholder="chatgpt-plus-1m" required />
            </Field>
          </div>
          <Field label="Deskripsi Singkat" htmlFor="tagline">
            <Input id="tagline" defaultValue={app?.tagline} required />
          </Field>
          <Field label="Deskripsi" htmlFor="deskripsi">
            <Textarea id="deskripsi" defaultValue={app?.description} rows={5} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pengembang" htmlFor="dev">
              <Select id="dev" defaultValue={app?.developerId ?? devs[0]?.id}>
                {devs.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Kategori" htmlFor="cat">
              <Select id="cat" defaultValue={app?.categoryId ?? cats[0]?.id}>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Harga (Rp)" htmlFor="harga">
              <Input id="harga" type="number" defaultValue={app?.price} required />
            </Field>
            <Field label="Harga Asli (Rp)" hint="Diisi jika sedang promo." htmlFor="asli">
              <Input id="asli" type="number" defaultValue={app?.originalPrice ?? ""} />
            </Field>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-[15px] font-semibold tracking-tight">Platform</h2>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors",
                  selectedPlatforms.includes(p)
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface text-fg-muted hover:border-border-strong",
                )}
                aria-pressed={selectedPlatforms.includes(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Versi Terbaru" htmlFor="versi">
              <Input id="versi" defaultValue={app?.version} placeholder="1.0.0" required />
            </Field>
            <Field label="Status Publikasi" htmlFor="status">
              <Select id="status" defaultValue="terbit">
                <option value="terbit">Terbit</option>
                <option value="draf">Draf</option>
              </Select>
            </Field>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-[15px] font-semibold tracking-tight">Ikon & Tangkapan Layar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Warna Ikon (atas)" htmlFor="from">
              <Input id="from" type="color" value={iconFrom} onChange={(e) => setIconFrom(e.target.value)} className="h-10 p-1" />
            </Field>
            <Field label="Warna Ikon (bawah)" htmlFor="to">
              <Input id="to" type="color" value={iconTo} onChange={(e) => setIconTo(e.target.value)} className="h-10 p-1" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {app?.screenshots.map((s, i) => (
              <Field key={i} label={`Tangkapan Layar ${i + 1}`}>
                <Select defaultValue={s}>
                  {screenshotKeys.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </Select>
              </Field>
            ))}
            {!app && (
              <Field label="Tangkapan Layar 1">
                <Select defaultValue="editor">
                  {screenshotKeys.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </Select>
              </Field>
            )}
          </div>
        </section>

        <div className="flex items-center justify-end gap-2">
          <ButtonLink href="/pereman/aplikasi" variant="secondary">Batal</ButtonLink>
          <Button type="submit">{app ? "Simpan Perubahan" : "Tambahkan"}</Button>
        </div>
      </form>
    </div>
  );
}