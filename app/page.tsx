import type { Metadata } from "next";
import { api } from "@/lib/api";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/empty-state";
import { AppGrid } from "@/components/storefront/app-grid";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { Hero } from "@/components/storefront/hero";
import { CategoryShelf } from "@/components/storefront/category-shelf";
import { CategoryMarquee } from "@/components/storefront/category-marquee";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Jelajahi aplikasi dan lisensi digital premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.",
};

export default function HomePage() {
  const featured = api.apps.featured().slice(0, 4);
  const newArrivals = api.apps.newArrivals(4);
  const banners = api.banners.active();

  return (
    <>
      <Hero />

      {/* Marquee Ticker */}
      <div className="mb-10">
        <CategoryMarquee />
      </div>

      {/* Kategori Quick Shelf */}
      <section className="tk-container pb-14">
        <Reveal>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase text-fg">Pilih Berdasarkan Kategori</h2>
            <ButtonLink href="/kategori" variant="ghost" size="sm">
              Semua Kategori →
            </ButtonLink>
          </div>
          <CategoryShelf />
        </Reveal>
      </section>

      {/* Aplikasi Pilihan */}
      <section className="tk-container py-12">
        <SectionHeader
          eyebrow="Unggulan"
          title="Aplikasi & Lisensi Pilihan"
          description="Produk digital dengan rating terbaik dan teruji, dikurasi langsung oleh tim SerbaPremium."
          action={
            <ButtonLink href="/aplikasi" variant="secondary">
              Lihat Semua Aplikasi
            </ButtonLink>
          }
        />
        <AppGrid slugs={featured.map((a) => a.slug)} />
      </section>

      {/* Promo Banner */}
      {banners.length > 0 && (
        <section className="tk-container py-10">
          <Reveal>
            <PromoBanner banner={banners[0]} />
          </Reveal>
        </section>
      )}

      {/* Aplikasi Baru */}
      <section className="tk-container py-12 pb-24">
        <SectionHeader
          eyebrow="Rilis Baru"
          title="Koleksi Terbaru"
          description="Aplikasi dan lisensi digital terbaru yang baru ditambahkan ke katalog."
          action={
            <ButtonLink href="/aplikasi?urutkan=terbaru" variant="secondary">
              Lihat Yang Baru
            </ButtonLink>
          }
        />
        <AppGrid slugs={newArrivals.map((a) => a.slug)} />
      </section>
    </>
  );
}
