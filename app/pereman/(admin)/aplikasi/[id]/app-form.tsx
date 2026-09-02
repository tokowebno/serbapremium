"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { App, Platform } from "@/types";

const platforms: Platform[] = ["Android", "iOS", "Windows", "macOS", "Linux", "Web"];

export function AppForm({ app }: { app?: App }) {
  const router = useRouter();
  const toast = useToast();
  const devs = api.developers.list();
  const cats = api.categories.list();

  const [name, setName] = useState(app?.name ?? "");
  const [slug, setSlug] = useState(app?.slug ?? "");
  const [tagline, setTagline] = useState(app?.tagline ?? "");
  const [description, setDescription] = useState(app?.description ?? "");
  const [price, setPrice] = useState(app?.price ?? 0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(app?.originalPrice);
  const [stock, setStock] = useState(app?.stock ?? 100);
  const [developerId, setDeveloperId] = useState(app?.developerId ?? devs[0]?.id ?? "serbapremium-store");
  const [categoryId, setCategoryId] = useState(app?.categoryId ?? cats[0]?.id ?? "ai");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(app?.platforms ?? ["Web"]);
  const [iconFrom, setIconFrom] = useState(app?.icon.from ?? "#3d3a34");
  const [iconTo, setIconTo] = useState(app?.icon.to ?? "#1f1d19");
  const [version, setVersion] = useState(app?.version ?? "1.0.0");
  const [isFeatured, setIsFeatured] = useState(app?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(app?.isNew ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePlatform = (p: Platform) =>
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const appData: Partial<App> = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      tagline,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      developerId,
      categoryId,
      platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ["Web"],
      icon: {
        from: iconFrom,
        to: iconTo,
        glyph: app?.icon.glyph ?? "box",
        logo: app?.icon.logo ?? "links.svg",
      },
      version,
      isFeatured,
      isNew,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (app) {
        await api.apps.update(app.id, appData);
        toast.push({ title: "Aplikasi berhasil diperbarui", description: name, tone: "success" });
      } else {
        const newApp: App = {
          id: slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          rating: 4.8,
          ratingCount: 1,
          downloads: 0,
          releasedAt: new Date().toISOString().slice(0, 10),
          features: ["Aktivasi Instan Otomatis", "Garansi Penuh", "Bantuan Support 24/7"],
          requirements: {},
          screenshots: ["dashboard", "form"],
          ...appData,
        } as App;
        await api.apps.create(newApp);
        toast.push({ title: "Aplikasi berhasil ditambahkan", description: name, tone: "success" });
      }
      setTimeout(() => {
        router.push("/pereman/aplikasi");
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      toast.push({ title: "Gagal menyimpan aplikasi", description: (err as Error)?.message, tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <AppIcon icon={{ from: iconFrom, to: iconTo, glyph: app?.icon.glyph ?? "box", logo: app?.icon.logo }} size="lg" />
        <div>
          <h1 className="text-xl font-black tracking-tight sm:text-2xl text-fg">
            {app ? `Edit ${app.name}` : "Tambah Aplikasi Baru"}
          </h1>
          <p className="text-sm font-semibold text-fg-muted">
            {app ? "Perbarui informasi dan harga aplikasi di SerbaPremium." : "Daftarkan produk/layanan baru ke SerbaPremium."}
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="space-y-4 rounded-xl border-2 border-border bg-surface p-6 shadow-[3px_3px_0px_var(--shadow-color)]">
          <h2 className="text-[15px] font-black tracking-tight text-fg">Informasi Dasar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Aplikasi / Produk" htmlFor="nama">
              <Input
                id="nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. ChatGPT Plus 1 Bulan"
                required
              />
            </Field>
            <Field label="Slug URL" htmlFor="slug">
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="chatgpt-plus-1m"
                required
              />
            </Field>
          </div>
          <Field label="Deskripsi Singkat (Tagline)" htmlFor="tagline">
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Akses GPT-4o & Fitur AI Premium"
              required
            />
          </Field>
          <Field label="Deskripsi Lengkap" htmlFor="deskripsi">
            <Textarea
              id="deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pengembang / Penyedia" htmlFor="dev">
              <Select
                id="dev"
                value={developerId}
                onChange={(e) => setDeveloperId(e.target.value)}
              >
                {devs.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Kategori" htmlFor="cat">
              <Select
                id="cat"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Harga Jual (IDR)" htmlFor="harga">
              <Input
                id="harga"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </Field>
            <Field label="Harga Coret (IDR)" hint="Opsional" htmlFor="asli">
              <Input
                id="asli"
                type="number"
                value={originalPrice ?? ""}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </Field>
            <Field label="Stok Tersedia" htmlFor="stok">
              <Input
                id="stok"
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </Field>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border-2 border-border bg-surface p-6 shadow-[3px_3px_0px_var(--shadow-color)]">
          <h2 className="text-[15px] font-black tracking-tight text-fg">Platform & Opsi</h2>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={cn(
                  "rounded-md border-2 px-3 py-1.5 text-xs font-black transition-all",
                  selectedPlatforms.includes(p)
                    ? "border-border bg-accent text-black shadow-[2px_2px_0px_var(--shadow-color)]"
                    : "border-border bg-surface-2 text-fg-muted hover:text-fg shadow-none",
                )}
                aria-pressed={selectedPlatforms.includes(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Versi" htmlFor="versi">
              <Input
                id="versi"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                required
              />
            </Field>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-2 border-border"
              />
              <label htmlFor="featured" className="text-xs font-bold text-fg cursor-pointer">
                Produk Unggulan
              </label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isNew"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="h-4 w-4 rounded border-2 border-border"
              />
              <label htmlFor="isNew" className="text-xs font-bold text-fg cursor-pointer">
                Tandai Baru
              </label>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border-2 border-border bg-surface p-6 shadow-[3px_3px_0px_var(--shadow-color)]">
          <h2 className="text-[15px] font-black tracking-tight text-fg">Warna Gradient Card</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Warna Aksen 1" htmlFor="from">
              <Input id="from" type="color" value={iconFrom} onChange={(e) => setIconFrom(e.target.value)} className="h-10 p-1 cursor-pointer" />
            </Field>
            <Field label="Warna Aksen 2" htmlFor="to">
              <Input id="to" type="color" value={iconTo} onChange={(e) => setIconTo(e.target.value)} className="h-10 p-1 cursor-pointer" />
            </Field>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <ButtonLink href="/pereman/aplikasi" variant="secondary">Batal</ButtonLink>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : app ? "Simpan Perubahan" : "Tambahkan Produk"}
          </Button>
        </div>
      </form>
    </div>
  );
}