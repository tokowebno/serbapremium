import type { Metadata } from "next";
import { api } from "@/lib/api";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/empty-state";
import { AppGrid } from "@/components/storefront/app-grid";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { Hero } from "@/components/storefront/hero";
import { CategoryShelf } from "@/components/storefront/category-shelf";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Jelajahi aplikasi premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.",
};

export default function HomePage() {
  const featured = api.apps.featured().slice(0, 4);
  const newArrivals = api.apps.newArrivals(4);
  const banners = api.banners.active();

  return (
    <>
      <Hero />

      {/* Kategori — floating system control */}
      <section className="tk-container pb-16">
        <Reveal>
          <CategoryShelf />
        </Reveal>
      </section>

      {/* Aplikasi Pilihan */}
      <section className="tk-container py-12">
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

      {/* Promo */}
      {banners.length > 0 && (
        <section className="tk-container py-12">
          <Reveal>
            <PromoBanner banner={banners[0]} />
          </Reveal>
        </section>
      )}

      {/* Aplikasi Baru */}
      <section className="tk-container py-12 pb-24">
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
