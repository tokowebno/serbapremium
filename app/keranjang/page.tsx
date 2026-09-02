"use client";

import { ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartItemRow } from "@/components/storefront/cart-item";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { useCart } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { useHydrated } from "@/lib/use-hydrated";

export default function CartPage() {
  const { items, subtotal } = useCart();
  const { lang, t } = useTranslation();
  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={ShoppingBag}
          title={t.cart?.empty || (lang === "en" ? "Shopping Cart is Empty" : lang === "zh" ? "购物车为空" : "Keranjang masih kosong")}
          description={t.cart?.emptyDesc || (lang === "en" ? "You haven't added any digital apps or licenses to your cart yet." : lang === "zh" ? "您尚未添加任何应用或数字授权到购物车。" : "Temukan aplikasi terbaik untuk kebutuhan Anda.")}
          action={{ label: t.cart?.startShopping || (lang === "en" ? "Explore Apps" : lang === "zh" ? "浏览应用" : "Mulai Belanja"), href: "/aplikasi" }}
        />
      </div>
    );
  }

  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mb-6 border-b border-border/70 pb-4">
        <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold uppercase text-accent">
          {lang === "en" ? "ORDER" : lang === "zh" ? "订单" : "PESANAN"}
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-fg">
          {t.cart?.title || (lang === "en" ? "Shopping Cart" : lang === "zh" ? "购物车" : "Keranjang Belanja")}
        </h1>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="glass-card rounded-2xl border border-border/80 bg-surface/90 p-5 sm:p-6 shadow-sm backdrop-blur-md">
          {items.map((item) => (
            <CartItemRow key={item.appId + item.platform} item={item} />
          ))}
        </div>

        <aside>
          <CheckoutSummary items={items} subtotal={subtotal} discount={0} />
          <ButtonLink href="/pembayaran" size="lg" className="mt-4 w-full rounded-full shadow-[var(--elev-2)]">
            {t.cart?.checkout ? `${t.cart.checkout} 💳` : (lang === "en" ? "Proceed to Checkout 💳" : lang === "zh" ? "前往结账 💳" : "Lanjut Pembayaran 💳")}
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
