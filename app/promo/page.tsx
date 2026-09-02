import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/empty-state";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { AppGrid } from "@/components/storefront/app-grid";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Promo & Diskon",
  description:
    "Promo dan diskon akun & aplikasi premium di SerbaPremium. Beli satu kali, tanpa biaya langganan.",
};

export default function PromoPage() {
  const banners = api.banners.active();
  const promoApps = api.apps.promo();

  return (
    <div className="tk-container pt-28 pb-20">
      <header className="mb-10 rounded-lg border-2 border-border bg-surface p-6 sm:p-8 shadow-[5px_5px_0px_var(--shadow-color)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1 rounded-xs border-2 border-border bg-discount px-2.5 py-0.5 text-xs font-black uppercase text-white shadow-[1.5px_1.5px_0px_var(--shadow-color)]">
            <Flame size={14} strokeWidth={2.8} /> DISKON AKTIF
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-fg sm:text-4xl">Promo & Penawaran Terbatas</h1>
        <p className="mt-2 max-w-xl text-[15px] font-medium leading-relaxed text-fg-muted">
          Dapatkan diskon harga spesial untuk berbagai aplikasi dan tools premium. Berlaku selama kuota masih tersedia.
        </p>
      </header>

      {banners.length > 0 && (
        <div className="space-y-4 mb-14">
          {banners.map((b) => (
            <PromoBanner key={b.id} banner={b} />
          ))}
        </div>
      )}

      <section>
        <SectionHeader
          eyebrow="Flash Sale"
          title="Produk Sedang Diskon"
          description="Pilihan aplikasi dengan potongan harga terbaik hari ini."
          action={<Badge tone="discount">Diskon s/d 50%</Badge>}
        />
        <AppGrid slugs={promoApps.map((a) => a.slug)} />
      </section>
    </div>
  );
}
