"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Zap, ShoppingBag, ArrowRight } from "lucide-react";
import type { App, ProductVariant } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "./providers";
import { useToast } from "@/components/ui/toast";
import { AppIcon } from "@/components/ui/app-icon";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { Button } from "@/components/ui/button";

export function ProductVariantSelector({ app }: { app: App }) {
  const router = useRouter();
  const cart = useCart();
  const toast = useToast();
  const { t } = useTranslation();

  const rawVariants: ProductVariant[] =
    app.variants && app.variants.length > 0
      ? app.variants
      : [
          {
            id: "default",
            name: app.name,
            price: app.price,
            stock: app.stock,
          },
        ];

  // Urutkan variasi dari harga termurah ke termahal (stok habis di paling bawah)
  const variants: ProductVariant[] = [...rawVariants].sort((a, b) => {
    const aOut = a.stock === 0;
    const bOut = b.stock === 0;
    if (aOut && !bOut) return 1;
    if (!aOut && bOut) return -1;
    return a.price - b.price;
  });

  const defaultVariant = variants.find((v) => v.stock !== 0) || variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [isAdding, setIsAdding] = useState(false);

  const currentPrice = selectedVariant.price;
  const defaultPlatform = app.platforms[0] || "Web";

  const handleAddToCart = () => {
    setIsAdding(true);
    const customItemName =
      variants.length === 1 || selectedVariant.name.toLowerCase().includes(app.name.toLowerCase())
        ? selectedVariant.name
        : `${app.name} (${selectedVariant.name})`;

    cart.add(
      {
        ...app,
        name: customItemName,
        price: currentPrice,
      },
      defaultPlatform,
    );

    toast.push({
      title: t.product.addedToCart || "Ditambahkan ke Keranjang",
      description: `${customItemName} — ${formatRupiah(currentPrice)}`,
      tone: "success",
    });
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleBuyNow = () => {
    const customItemName =
      variants.length === 1 || selectedVariant.name.toLowerCase().includes(app.name.toLowerCase())
        ? selectedVariant.name
        : `${app.name} (${selectedVariant.name})`;

    const params = new URLSearchParams({
      app: app.slug,
      variant: selectedVariant.id,
      platform: defaultPlatform,
      price: String(currentPrice),
      title: customItemName,
    });
    router.push(`/pembayaran?${params.toString()}`);
  };

  return (
    <div className="rounded-lg border-2 border-border bg-surface p-5 sm:p-6 shadow-[5px_5px_0px_var(--shadow-color)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-border pb-3.5">
        <div>
          <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
            {variants.length > 1 ? (t.product.packageOptions || "PILIHAN PAKET") : (t.product.priceInfo || "INFO HARGA")}
          </span>
          <h2 className="mt-1 text-lg font-black tracking-tight text-fg">
            {variants.length > 1 ? (t.product.selectVariant || "Pilih Variasi Produk") : (t.product.servicePackage || "Paket Layanan")}
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-xs border border-border bg-surface px-2 py-1 text-xs font-bold text-success shadow-[1px_1px_0px_var(--shadow-color)]">
          <ShieldCheck size={14} strokeWidth={2.5} /> {t.product.warranty || "Garansi 100%"}
        </span>
      </div>

      {/* List Variasi Bar Style */}
      {variants.length > 1 ? (
        <div className="mt-4 space-y-2 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
          {variants.map((v) => {
            const active = selectedVariant.id === v.id;
            const isOutOfStock = v.stock === 0;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                disabled={isOutOfStock}
                className={`group flex w-full items-center justify-between gap-2.5 rounded-md border-2 p-3 text-left transition-all duration-100 ${
                  active
                    ? "border-border bg-accent text-black font-black shadow-[3px_3px_0px_var(--shadow-color)] -translate-x-0.5 -translate-y-0.5"
                    : isOutOfStock
                      ? "border-border/30 bg-surface-2 opacity-50 cursor-not-allowed text-fg-faint"
                      : "border-border bg-surface text-fg hover:bg-surface-2 hover:shadow-[2px_2px_0px_var(--shadow-color)] shadow-[1.5px_1.5px_0px_var(--shadow-color)]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0">
                    <AppIcon icon={app.icon} size="xs" className="h-6 w-6 !min-h-6 !min-w-6 rounded-xs" />
                  </div>
                  <div className="truncate">
                    <p className="text-[13.5px] font-black truncate">{v.name}</p>
                    <p className="text-[11px] font-semibold opacity-80">
                      {isOutOfStock
                        ? (t.product.outOfStock || "Stok Habis")
                        : `Stok: ${v.stock ?? app.stock}`}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[14px] font-black tabular-nums">{formatRupiah(v.price)}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-md border-2 border-border bg-surface-2 p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
          <p className="text-xs font-black uppercase text-fg-muted">{t.product.totalPayment || "Harga Produk"}</p>
          <p className="mt-1 text-2xl font-black text-fg tabular-nums">{formatRupiah(currentPrice)}</p>
        </div>
      )}

      {/* Ringkasan Harga Terpilih */}
      <div className="mt-5 border-t-2 border-border pt-4">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-xs font-black uppercase text-fg-muted">{t.product.totalPayment || "Total Pembayaran"}</p>
            <p className="text-2xl font-black text-fg tabular-nums">{formatRupiah(currentPrice)}</p>
          </div>
          <span className="rounded-xs border border-border bg-accent-yellow px-2 py-0.5 text-xs font-black text-black shadow-[1px_1px_0px_var(--shadow-color)]">
            <Zap size={12} className="inline mr-1 fill-current" />
            {t.product.instantActivation || "Aktivasi Instan"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <Button
            size="lg"
            className="w-full"
            onClick={handleBuyNow}
            disabled={selectedVariant.stock === 0}
          >
            {t.product.buyNow || "Beli Sekarang"} <ArrowRight size={17} strokeWidth={2.5} />
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full"
            onClick={handleAddToCart}
            disabled={selectedVariant.stock === 0 || isAdding}
          >
            <ShoppingBag size={17} strokeWidth={2.5} />
            {isAdding ? (t.product.adding || "Menambahkan…") : (t.product.addToCart || "Tambah ke Keranjang")}
          </Button>
        </div>
      </div>
    </div>
  );
}
