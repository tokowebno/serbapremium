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
  // Tunggu hidrasi keranjang dari localStorage agar EmptyState tidak berkedip.
  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={ShoppingBag}
          title="Keranjang kosong"
          description="Anda belum menambahkan aplikasi apa pun."
          action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
        />
      </div>
    );
  }

  return (
    <div className="tk-container pt-28 pb-20">
      <h1 className="text-[26px] font-semibold tracking-[-0.025em] sm:text-3xl">Keranjang</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border rounded-xl border border-border bg-surface p-6 shadow-sm">
          {items.map((item) => (
            <CartItemRow key={item.appId + item.platform} item={item} />
          ))}
        </div>

        <aside>
          <CheckoutSummary items={items} subtotal={subtotal} discount={0} />
          <ButtonLink href="/pembayaran" size="lg" className="mt-4 w-full">
            Lanjut ke Pembayaran
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
