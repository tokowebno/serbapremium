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
import { getServerTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Jelajahi aplikasi dan lisensi digital premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.",
};

export default async function HomePage() {
  const { lang, t } = await getServerTranslation();
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
            <h2 className="text-sm font-black tracking-wider uppercase text-fg">
              {t.home?.categories || (lang === "en" ? "BROWSE BY CATEGORY" : lang === "zh" ? "按分类浏览" : "PILIH BERDASARKAN KATEGORI")}
            </h2>
            <ButtonLink href="/kategori" variant="ghost" size="sm">
              {lang === "en" ? "All Categories →" : lang === "zh" ? "全部分类 →" : "Semua Kategori →"}
            </ButtonLink>
          </div>
          <CategoryShelf />
        </Reveal>
      </section>

      {/* Aplikasi Pilihan */}
      <section className="tk-container py-12">
        <SectionHeader
          eyebrow={t.home?.featuredBadge || (lang === "en" ? "FEATURED" : lang === "zh" ? "精选推荐" : "UNGGULAN")}
          title={t.home?.featuredTitle || (lang === "en" ? "Curated Apps & Licenses" : lang === "zh" ? "精选应用与正版授权" : "Aplikasi & Lisensi Pilihan")}
          description={t.home?.featuredDesc || (lang === "en" ? "Top-rated verified digital licenses, handpicked by the SerbaPremium team." : lang === "zh" ? "经严格测试与高分评价的数字产品，由 SerbaPremium 团队官方甄选。" : "Produk digital dengan rating terbaik dan teruji, dikurasi langsung oleh tim SerbaPremium.")}
          action={
            <ButtonLink href="/aplikasi" variant="secondary">
              {lang === "en" ? "View All Apps" : lang === "zh" ? "查看全部应用" : "Lihat Semua Aplikasi"}
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
          eyebrow={t.home?.newBadge || (lang === "en" ? "NEW ARRIVALS" : lang === "zh" ? "全新上架" : "RILIS BARU")}
          title={t.home?.newTitle || (lang === "en" ? "Latest Collection" : lang === "zh" ? "最新产品专区" : "Koleksi Terbaru")}
          description={t.home?.newDesc || (lang === "en" ? "Freshly added applications and software licenses in our digital store." : lang === "zh" ? "最新收录与上架的正版数字软件授权与高级会员。" : "Aplikasi dan lisensi digital terbaru yang baru ditambahkan ke katalog.")}
          action={
            <ButtonLink href="/aplikasi?urutkan=terbaru" variant="secondary">
              {lang === "en" ? "View New Arrivals" : lang === "zh" ? "探索最新上架" : "Lihat Yang Baru"}
            </ButtonLink>
          }
        />
        <AppGrid slugs={newArrivals.map((a) => a.slug)} />
      </section>
    </>
  );
}
