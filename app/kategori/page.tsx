import type { Metadata } from "next";
import { api } from "@/lib/api";
import { CategoryCard } from "@/components/storefront/category-card";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Kategori",
  description: "Jelajahi aplikasi dan akun premium SerbaPremium berdasarkan kategori pilihan.",
};

export default function KategoriIndexPage() {
  const rawCats = api.categories.withCount().filter((c) => c.count > 0);
  const cats = rawCats.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    count: c.count,
  }));

  return (
    <div className="tk-container pt-28 pb-20">
      <header className="mb-10 border-b-2 border-border pb-6">
        <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
          DIREKTORI
        </span>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-fg sm:text-4xl">Kategori Aplikasi</h1>
        <p className="mt-2 max-w-xl text-[15px] font-medium leading-relaxed text-fg-muted">
          Pilih kategori yang sesuai dengan alur kerja, produktivitas, atau hiburan Anda.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cats.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.03}>
            <CategoryCard category={{ id: c.id, slug: c.slug, name: c.name, description: c.description }} count={c.count} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
