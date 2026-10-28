import type { Metadata } from "next";
import { Wallet, ArrowRight, Cpu } from "lucide-react";
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
  title: "Texas AI — Marketplace Aplikasi & Lisensi Digital Premium",
  description:
    "Akses seluruh AI Flagship dan tools digital pro dunia (ChatGPT Plus, Claude Pro, Gemini, Cursor, Lovable) dengan sistem dompet saldo instan.",
};

export default async function HomePage() {
  const { lang, t } = await getServerTranslation();
  const featured = api.apps.featured().slice(0, 8);
  const newArrivals = api.apps.newArrivals(4);
  const banners = api.banners.active();

  return (
    <>
      {/* High-Impact Hero Section */}
      <Hero />

      {/* Marquee Ticker */}
      <div className="mb-12">
        <CategoryMarquee />
      </div>

      {/* Kategori Quick Shelf */}
      <section className="tk-container pb-14">
        <Reveal>
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-fg flex items-center gap-2">
              <Cpu size={15} className="text-accent" />
              <span>{t.home?.categories || (lang === "en" ? "EXPLORE BY CATEGORY" : lang === "zh" ? "按分类探索" : "PILIH BERDASARKAN KATEGORI")}</span>
            </h2>
            <ButtonLink href="/kategori" variant="ghost" size="sm" className="text-xs font-bold text-accent">
              {lang === "en" ? "All Categories →" : lang === "zh" ? "全部分类 →" : "Semua Kategori →"}
            </ButtonLink>
          </div>
          <CategoryShelf />
        </Reveal>
      </section>

      {/* Aplikasi Pilihan / AI Flagship Grid */}
      <section className="tk-container py-8">
        <SectionHeader
          eyebrow={t.home?.featuredBadge || (lang === "en" ? "FLAGSHIP AI & PRO APPS" : lang === "zh" ? "顶尖大模型与专业工具" : "FLAGSHIP AI & PRO TOOLS")}
          title={t.home?.featuredTitle || (lang === "en" ? "Curated AI & Premium Licenses" : lang === "zh" ? "官方甄选 AI 与正版授权" : "Aplikasi & AI Pilihan")}
          description={t.home?.featuredDesc || (lang === "en" ? "Top-rated verified digital licenses, handpicked by the Texas AI team." : lang === "zh" ? "经严格测试与高分评价的数字产品，由 Texas AI 团队官方甄选。" : "Produk digital dengan rating terbaik dan teruji, dikurasi langsung oleh tim Texas AI.")}
          action={
            <ButtonLink href="/aplikasi" variant="secondary" className="rounded-full font-bold">
              {lang === "en" ? "View All 49 Apps" : lang === "zh" ? "查看全部 49 款应用" : "Lihat Semua (49 Produk)"}
            </ButtonLink>
          }
        />
        <AppGrid slugs={featured.map((a) => a.slug)} />
      </section>

      {/* Texas AI Wallet Ecosystem Highlight Banner */}
      <section className="tk-container py-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-surface p-6 sm:p-10 text-fg shadow-[8px_8px_0_0_var(--color-border)]">
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-surface-2 px-3 py-1 text-[11px] sm:text-xs font-black uppercase tracking-widest text-fg shadow-[3px_3px_0_0_var(--color-border)]">
                  <Wallet size={13} className="text-fg" />
                  {lang === "en" ? "TEXAS AI UNIFIED WALLET SYSTEM" : lang === "zh" ? "TEXAS AI 统一钱包系统" : "SISTEM SALDO TERPADU TEXAS AI"}
                </span>
                
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-fg leading-tight">
                  {lang === "en" ? "One Balance to Buy All Digital & AI Licenses." : lang === "zh" ? "用一个余额购买所有数字与 AI 许可证。" : "Satu Saldo untuk Belanja Seluruh Lisensi Digital & AI."}
                </h2>
                
                <p className="text-sm sm:text-base text-fg-muted leading-relaxed max-w-xl font-medium">
                  {lang === "en" ? "No need to repeatedly pay for every single app. Just top up your account via automated QRIS & Multi-Crypto (USDT, SOL, TON), then checkout instantly with 1 click anytime!" : lang === "zh" ? "无需为每个应用重复支付。只需通过自动 QRIS 和多重加密货币（USDT、SOL、TON）充值您的账户，随时一键秒级结账！" : "Tidak perlu repot bayar berulang kali untuk setiap aplikasi. Cukup isi saldo akun via QRIS Otomatis & Multi-Crypto (USDT, SOL, TON), lalu checkout kapan pun secara instan hanya dengan 1 klik!"}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <ButtonLink
                    href="/isi-saldo"
                    size="lg"
                    className="rounded-full bg-accent text-accent-fg border-2 border-border shadow-[4px_4px_0_0_var(--color-border)] px-7 font-black hover:-translate-y-0.5 transition-transform active:translate-y-0 active:shadow-none flex items-center gap-2"
                  >
                    <Wallet size={16} className="text-accent-fg" />
                    <span>{lang === "en" ? "Top Up Now" : lang === "zh" ? "立即充值" : "Isi Saldo Sekarang"}</span>
                    <ArrowRight size={16} strokeWidth={3} className="text-accent-fg" />
                  </ButtonLink>
                  
                  <ButtonLink
                    href="/aplikasi"
                    variant="ghost"
                    size="lg"
                    className="rounded-full bg-surface-2 text-fg font-black border-2 border-border shadow-[4px_4px_0_0_var(--color-border)] hover:-translate-y-0.5 transition-transform active:translate-y-0 active:shadow-none"
                  >
                    {lang === "en" ? "Explore Catalog →" : lang === "zh" ? "探索应用目录 →" : "Jelajahi Katalog →"}
                  </ButtonLink>
                </div>
              </div>

              {/* Clean Specification Box */}
              <div className="space-y-4 rounded-2xl border-2 border-border bg-surface-2 p-6 shadow-[4px_4px_0_0_var(--color-border)]">
                <div className="border-b border-border pb-3.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg">
                    {lang === "en" ? "FLEXIBLE TOP UP" : lang === "zh" ? "灵活充值" : "TOP UP FLEKSIBEL"}
                  </span>
                  <h4 className="text-sm font-bold text-fg mt-1">
                    {lang === "en" ? "One Balance for All" : lang === "zh" ? "统一账户余额" : "Satu Saldo untuk Semua"}
                  </h4>
                  <p className="text-xs text-fg-muted mt-0.5 font-medium">
                    {lang === "en" ? "Top up easily and quickly anytime you need." : lang === "zh" ? "随时随地快速轻松地进行充值。" : "Isi saldo mudah dan cepat kapan saja sesuai kebutuhan."}
                  </p>
                </div>

                <div className="border-b border-border pb-3.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg">
                    {lang === "en" ? "PAYMENT SYSTEM" : lang === "zh" ? "支付系统" : "SISTEM PEMBAYARAN"}
                  </span>
                  <h4 className="text-sm font-bold text-fg mt-1">
                    {lang === "en" ? "QRIS & Multi-Crypto" : lang === "zh" ? "QRIS 与 多重加密货币" : "QRIS & Multi-Crypto"}
                  </h4>
                  <p className="text-xs text-fg-muted mt-0.5 font-medium">
                    {lang === "en" ? "Automated QRIS, USDT, SOL, and TON supported." : lang === "zh" ? "支持全自动 QRIS、USDT、SOL 以及 TON。" : "Dukungan QRIS otomatis, USDT, SOL, dan TON."}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg">
                    {lang === "en" ? "SECURITY & WARRANTY" : lang === "zh" ? "安全与质保" : "KEAMANAN & GARANSI"}
                  </span>
                  <h4 className="text-sm font-bold text-fg mt-1">
                    {lang === "en" ? "Full Period Warranty" : lang === "zh" ? "全程质保保障" : "Garansi Penuh Masa Aktif"}
                  </h4>
                  <p className="text-xs text-fg-muted mt-0.5 font-medium">
                    {lang === "en" ? "Account replacement guarantee and direct support from the official team." : lang === "zh" ? "官方团队直接支持及全额账号换新保证。" : "Jaminan penggantian akun dan bantuan langsung tim resmi."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Promo Banner */}
      {banners.length > 0 && (
        <section className="tk-container py-6">
          <Reveal>
            <PromoBanner banner={banners[0]} />
          </Reveal>
        </section>
      )}

      {/* Aplikasi Baru */}
      <section className="tk-container py-12 pb-24">
        <SectionHeader
          eyebrow={t.home?.newBadge || (lang === "en" ? "NEW RELEASES" : lang === "zh" ? "全新上架" : "RILIS BARU")}
          title={t.home?.newTitle || (lang === "en" ? "Latest AI & Tools" : lang === "zh" ? "最新产品专区" : "Koleksi Terbaru")}
          description={t.home?.newDesc || (lang === "en" ? "Freshly added applications and software licenses in our digital store." : lang === "zh" ? "最新收录与上架的正版数字软件授权与高级会员。" : "Aplikasi dan lisensi digital terbaru yang baru ditambahkan ke katalog.")}
          action={
            <ButtonLink href="/aplikasi?urutkan=terbaru" variant="secondary" className="rounded-full font-bold">
              {lang === "en" ? "View New Arrivals" : lang === "zh" ? "探索最新上架" : "Lihat Yang Baru"}
            </ButtonLink>
          }
        />
        <AppGrid slugs={newArrivals.map((a) => a.slug)} />
      </section>
    </>
  );
}
