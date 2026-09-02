"use client";

import { ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartItemRow } from "@/components/storefront/cart-item";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { useCart } from "@/components/storefront/providers";
import { useHydrated } from "@/lib/use-hydrated";

export default function CartPage() {
  const { items, subtotal } = useCart();
  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={ShoppingBag}
          title="Keranjang belanja kosong"
          description="Anda belum menambahkan aplikasi atau lisensi digital apa pun ke dalam keranjang."
          action={{ label: "Jelajahi Katalog", href: "/aplikasi" }}
        />
      </div>
    );
  }

  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mb-6 border-b-2 border-border pb-4">
        <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
          PESANAN
        </span>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-fg">Keranjang Belanja</h1>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="divide-y-2 divide-border rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
          {items.map((item) => (
            <CartItemRow key={item.appId + item.platform} item={item} />
          ))}
        </div>

        <aside>
          <CheckoutSummary items={items} subtotal={subtotal} discount={0} />
          <ButtonLink href="/pembayaran" size="lg" className="mt-4 w-full">
            Lanjut ke Pembayaran 💳
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
