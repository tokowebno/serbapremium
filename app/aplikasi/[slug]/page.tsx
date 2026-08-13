import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { PlatformList } from "@/components/ui/platform-badge";
import { SectionHeader } from "@/components/ui/empty-state";
import { AppGrid } from "@/components/storefront/app-grid";
import { AddToCartButton } from "@/components/storefront/add-to-cart";
import { ProductTabs } from "@/components/storefront/product-tabs";
import { ProductStats } from "@/components/storefront/product-stats";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = api.apps.getBySlug(slug);
  if (!app) return { title: "Aplikasi tidak ditemukan" };
  return {
    title: app.name,
    description: `${app.tagline} Pembelian satu kali, tanpa langganan.`,
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const app = api.apps.getBySlug(slug);
  if (!app) notFound();

  const developer = api.developers.getBySlug(app.developerId);
  const reviews = api.reviews.byApp(app.id);
  const related = api.apps.related(app, 4);

  return (
    <div className="tk-container pt-28 pb-20">
      {/* Informasi utama produk */}
      <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            <AppIcon icon={app.icon} size="xl" />
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight">{app.name}</h1>
              {developer && (
                <Link
                  href={`/pengembang/${developer.slug}`}
                  className="mt-0.5 inline-block text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {developer.name}
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Rating value={app.rating} count={app.ratingCount} size={15} />
          </div>

          <ProductStats downloads={app.downloads} ratingCount={app.ratingCount} stock={app.stock} />

          <p className="mt-4 text-[15px] font-medium">{app.tagline}</p>
          <p className="mt-3 text-[15px] leading-7 text-fg-muted">{app.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <PlatformList platforms={app.platforms} />
            <Badge tone="neutral">Versi {app.version}</Badge>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Price value={app.price} original={app.originalPrice} size="lg" />
            <Badge tone="accent">Pembelian satu kali. Tidak ada langganan.</Badge>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={`/pembayaran?app=${app.slug}`} size="lg">
              Beli Sekarang
            </ButtonLink>
            <AddToCartButton slug={app.slug} size="lg" />
          </div>
        </div>

        {/* Tab info + sidebar CTA sticky */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_300px]">
        <ProductTabs slug={app.slug} reviews={reviews} />

        <aside className="hidden lg:block">
          <div className="mat-func sticky top-28 rounded-[var(--radius-xl)] p-5">
            <div className="flex items-center gap-3">
              <AppIcon icon={app.icon} size="sm" />
              <p className="text-sm leading-tight font-semibold">{app.name}</p>
            </div>
            <Price value={app.price} original={app.originalPrice} className="mt-4" />
            <Badge tone="accent" className="mt-2">
              Pembelian satu kali
            </Badge>
            <div className="mt-4 flex flex-col gap-2.5">
              <ButtonLink href={`/pembayaran?app=${app.slug}`}>Beli Sekarang</ButtonLink>
              <AddToCartButton slug={app.slug} />
            </div>
          </div>
        </aside>
      </div>

      {/* Aplikasi serupa */}
      <section className="mt-16">
        <SectionHeader
          eyebrow="Rekomendasi"
          title="Aplikasi Serupa"
          description="Aplikasi lain yang mungkin Anda sukai."
        />
        <AppGrid slugs={related.map((a) => a.slug)} />
      </section>
    </div>
  );
}
