import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/empty-state";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { AppGrid } from "@/components/storefront/app-grid";
import { Flame } from "lucide-react";
import { getServerTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Promo & Diskon",
  description:
    "Promo dan diskon akun & aplikasi premium di SerbaPremium. Beli satu kali, tanpa biaya langganan.",
};

export default async function PromoPage() {
  const { lang, t } = await getServerTranslation();
  const banners = api.banners.active();
  const promoApps = api.apps.promo();

  return (
    <div className="tk-container pt-28 pb-20">
      <header className="glass-card mb-10 rounded-2xl border border-border/80 bg-surface/90 p-6 sm:p-8 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-0.5 text-xs font-semibold uppercase text-rose-600 dark:text-rose-400">
            <Flame size={13} /> {lang === "en" ? "ACTIVE DEALS" : lang === "zh" ? "限时特惠" : "DISKON AKTIF"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
          {lang === "en" ? "Special Deals & Limited Offers" : lang === "zh" ? "独家优惠与限时折扣" : "Promo & Penawaran Terbatas"}
        </h1>
        <p className="mt-2 max-w-xl text-[14.5px] font-normal leading-relaxed text-fg-muted">
          {lang === "en"
            ? "Get exclusive discounts on premium subscriptions, accounts, and tools. Available while stock lasts."
            : lang === "zh"
            ? "尊享精选高级会员、生产力工具与流媒体独家特惠折扣，库存有限先到先得。"
            : "Dapatkan diskon harga spesial untuk berbagai aplikasi dan tools premium. Berlaku selama kuota masih tersedia."}
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
          eyebrow={lang === "en" ? "Flash Sale" : lang === "zh" ? "秒杀专区" : "Flash Sale"}
          title={lang === "en" ? "Discounted Products" : lang === "zh" ? "今日特价折扣" : "Produk Sedang Diskon"}
          description={lang === "en" ? "Top-rated digital licenses with the best prices today." : lang === "zh" ? "今日最高性价比精选数字授权与会员订阅。" : "Pilihan aplikasi dengan potongan harga terbaik hari ini."}
          action={<Badge tone="discount">{lang === "en" ? "Up to 50% Off" : lang === "zh" ? "最高立省 50%" : "Diskon s/d 50%"}</Badge>}
        />
        <AppGrid slugs={promoApps.map((a) => a.slug)} />
      </section>
    </div>
  );
}
