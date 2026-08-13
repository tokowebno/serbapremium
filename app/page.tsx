import type { Metadata } from "next";
import { api } from "@/lib/api";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/empty-state";
import { CategoryCard } from "@/components/storefront/category-card";
import { AppGrid } from "@/components/storefront/app-grid";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { Hero } from "@/components/storefront/hero";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Jelajahi aplikasi premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.",
};

export default function HomePage() {
  const featured = api.apps.featured().slice(0, 4);
  const categories = api
    .categories.withCount()
    .filter((c) => c.count > 0)
    .slice(0, 8);
  const banners = api.banners.active();
  const newArrivals = api.apps.newArrivals(4);

  return (
    <>
      <Hero />

      <section className="glass-backdrop tk-container py-16">
        <SectionHeader
          eyebrow="Koleksi"
          title="Aplikasi Pilihan"
          description="Aplikasi dengan rating terbaik, dipilih oleh tim Tokono."
          action={
            <ButtonLink href="/aplikasi" variant="ghost">
              Lihat Semua
            </ButtonLink>
          }
        />
        <AppGrid slugs={featured.map((a) => a.slug)} />
      </section>

      <section className="glass-backdrop tk-container py-16">
        <SectionHeader
          eyebrow="Kategori"
          title="Jelajahi Kategori"
          description="Temukan aplikasi berdasarkan kebutuhan Anda."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <CategoryCard category={c} count={c.count} />
            </Reveal>
          ))}
        </div>
      </section>

      {banners.length > 0 && (
        <section className="glass-backdrop tk-container py-16">
          <Reveal>
            <PromoBanner banner={banners[0]} />
          </Reveal>
        </section>
      )}

      <section className="glass-backdrop tk-container py-16">
        <SectionHeader
          eyebrow="Terbaru"
          title="Aplikasi Baru"
          description="Peluncuran dan pembaruan terbaru yang layak dicoba."
        />
        <AppGrid slugs={newArrivals.map((a) => a.slug)} />
      </section>
    </>
  );
}