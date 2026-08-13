import type { Metadata } from "next";
import { api } from "@/lib/api";
import { CategoryCard } from "@/components/storefront/category-card";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Kategori",
  description: "Jelajahi aplikasi Tokono berdasarkan kategori.",
};

export default function KategoriIndexPage() {
  const cats = api.categories.withCount().filter((c) => c.count > 0);

  return (
    <div className="tk-container pt-28 pb-20">
      <header className="mb-10">
        <p className="text-xs font-semibold tracking-[0.16em] text-fg-muted uppercase">Kategori</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">Jelajahi Kategori</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-6 text-fg-muted">
          Temukan aplikasi berdasarkan kebutuhan Anda.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {cats.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.04}>
            <CategoryCard category={c} count={c.count} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
