import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/empty-state";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { AppGrid } from "@/components/storefront/app-grid";

export const metadata: Metadata = {
  title: "Promo",
  description:
    "Promo dan diskon aplikasi premium di Tokono. Pembelian satu kali, tanpa langganan.",
};

export default function PromoPage() {
  const banners = api.banners.active();
  const promoApps = api.apps.promo();

  return (
    <div className="tk-container pt-28 pb-20">
      <header className="pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Promo</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-6 text-fg-muted">
          Penawaran terbatas untuk aplikasi pilihan. Harga kembali normal setelah periode promo berakhir.
        </p>
      </header>

      {banners.length > 0 && (
        <div className="space-y-4">
          {banners.map((b) => (
            <PromoBanner key={b.id} banner={b} />
          ))}
        </div>
      )}

      <section className="mt-16">
        <SectionHeader
          eyebrow="Diskon"
          title="Aplikasi Sedang Promo"
          description="Aplikasi pilihan dengan harga khusus selama periode promo."
          action={<Badge tone="discount">Promo aktif</Badge>}
        />
        <AppGrid slugs={promoApps.map((a) => a.slug)} />
      </section>
    </div>
  );
}
