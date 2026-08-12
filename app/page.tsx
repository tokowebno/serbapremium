import type { Metadata } from "next";
import { api } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { AppIcon } from "@/components/ui/app-icon";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { SectionHeader } from "@/components/ui/empty-state";
import { CategoryCard } from "@/components/storefront/category-card";
import { AppGrid } from "@/components/storefront/app-grid";
import { PromoBanner } from "@/components/storefront/promo-banner";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Jelajahi aplikasi premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.",
};

function HeroVisual() {
  const apps = api.apps.featured().slice(0, 3);
  return (
    <div className="relative hidden h-[380px] lg:block" aria-hidden="true">
      <div className="absolute top-6 left-6 -rotate-[9deg]">
        <AppIcon icon={apps[0].icon} size="2xl" />
      </div>
      <div className="absolute top-0 left-44 rotate-[7deg]">
        <AppIcon icon={apps[1].icon} size="2xl" />
      </div>
      <div className="absolute top-52 left-24 -rotate-[3deg]">
        <AppIcon icon={apps[2].icon} size="2xl" />
      </div>
      <div className="glass absolute right-0 bottom-6 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg">
        <AppIcon icon={apps[0].icon} size="sm" />
        <div>
          <p className="text-sm leading-tight font-semibold">{apps[0].name}</p>
          <div className="mt-1 flex items-center gap-2">
            <Rating value={apps[0].rating} showValue={false} size={11} />
            <span className="text-xs text-fg-muted tabular-nums">{formatRupiah(apps[0].price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <section className="tk-container grid items-center gap-16 pt-40 pb-24 lg:grid-cols-2">
        <div className="max-w-xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Temukan aplikasi yang tepat.</h1>
          <p className="mt-5 max-w-md text-[17px] leading-7 text-fg-muted">
            Jelajahi aplikasi premium untuk berbagai perangkat, pilih yang sesuai kebutuhan, dan gunakan tanpa
            langganan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/aplikasi" size="lg">
              Jelajahi Aplikasi
            </ButtonLink>
            <ButtonLink href="/promo" size="lg" variant="secondary">
              Lihat Promo
            </ButtonLink>
          </div>
        </div>
        <HeroVisual />
      </section>

      <section className="tk-container py-16">
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

      <section className="tk-container py-16">
        <SectionHeader
          eyebrow="Kategori"
          title="Jelajahi Kategori"
          description="Temukan aplikasi berdasarkan kebutuhan Anda."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} count={c.count} />
          ))}
        </div>
      </section>

      {banners.length > 0 && (
        <section className="tk-container py-16">
          <PromoBanner banner={banners[0]} />
        </section>
      )}

      <section className="tk-container py-16">
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
