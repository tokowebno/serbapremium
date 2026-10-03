"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  Wallet,
  LogIn,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Lock,
} from "lucide-react";
import type { App, ProductVariant } from "@/types";
import { formatPrice, formatRupiah } from "@/lib/utils";
import { useCart, useAuth, useLibrary } from "./providers";
import { useToast } from "@/components/ui/toast";
import { AppIcon } from "@/components/ui/app-icon";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { Button } from "@/components/ui/button";
import { supabase, supabaseReady } from "@/lib/supabase";

function localizeVariantName(name: string, lang: string): string {
  if (lang === "id") return name;
  let s = name;
  if (lang === "en") {
    s = s
      .replace(/1 Bulan/gi, "1 Month")
      .replace(/2 Bulan/gi, "2 Months")
      .replace(/3 Bulan/gi, "3 Months")
      .replace(/6 Bulan/gi, "6 Months")
      .replace(/12 Bulan/gi, "12 Months")
      .replace(/1 Tahun/gi, "1 Year")
      .replace(/2 Tahun/gi, "2 Years")
      .replace(/30 Hari/gi, "30 Days")
      .replace(/7 Hari/gi, "7 Days")
      .replace(/1 Hari/gi, "1 Day")
      .replace(/Akun Sharing/gi, "Shared Account")
      .replace(/Sharing/gi, "Shared")
      .replace(/Akun Privat/gi, "Private Account")
      .replace(/Akun Private/gi, "Private Account")
      .replace(/Private/gi, "Private")
      .replace(/Garansi Penuh/gi, "Full Warranty")
      .replace(/Garansi/gi, "Warranty")
      .replace(/Email Pribadi/gi, "Personal Email")
      .replace(/Akun Baru/gi, "New Account");
  } else if (lang === "zh") {
    s = s
      .replace(/1 Bulan/gi, "1 个月")
      .replace(/2 Bulan/gi, "2 个月")
      .replace(/3 Bulan/gi, "3 个月")
      .replace(/6 Bulan/gi, "6 个月")
      .replace(/12 Bulan/gi, "12 个月")
      .replace(/1 Tahun/gi, "1 年")
      .replace(/2 Tahun/gi, "2 年")
      .replace(/30 Hari/gi, "30 天")
      .replace(/7 Hari/gi, "7 天")
      .replace(/1 Hari/gi, "1 天")
      .replace(/Akun Sharing/gi, "共享账号")
      .replace(/Sharing/gi, "共享")
      .replace(/Akun Privat/gi, "独享专属账号")
      .replace(/Akun Private/gi, "独享专属账号")
      .replace(/Private/gi, "独享")
      .replace(/Garansi Penuh/gi, "全额质保")
      .replace(/Garansi/gi, "保修")
      .replace(/Email Pribadi/gi, "个人邮箱")
      .replace(/Akun Baru/gi, "全新账号");
  }
  return s;
}

export function ProductVariantSelector({ app }: { app: App }) {
  const router = useRouter();
  const pathname = usePathname();
  const cart = useCart();
  const toast = useToast();
  const { lang, t } = useTranslation();
  const { user, isAuthenticated, balance, balanceUsd, deduct, openTopUp } = useAuth();
  const library = useLibrary();

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
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isPayingWithBalance, setIsPayingWithBalance] = useState(false);
  const [purchasedSuccess, setPurchasedSuccess] = useState(false);

  const isSoldOut = selectedVariant.stock === 0;
  const maxStock = selectedVariant.stock !== undefined ? Math.max(1, selectedVariant.stock) : 99;
  const currentPrice = selectedVariant.price;
  const totalPrice = currentPrice * (isSoldOut ? 1 : quantity);
  const defaultPlatform = app.platforms[0] || "Web";
  const hasEnoughBalance = balance >= totalPrice;
  const balanceDeficit = totalPrice - balance;

  const handleSelectVariant = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.stock !== undefined && v.stock > 0 && quantity > v.stock) {
      setQuantity(v.stock);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const baseName =
      variants.length === 1 || selectedVariant.name.toLowerCase().includes(app.name.toLowerCase())
        ? selectedVariant.name
        : `${app.name} (${selectedVariant.name})`;
    const customItemName = quantity > 1 ? `${baseName} (${quantity}x)` : baseName;

    cart.add(
      {
        ...app,
        name: customItemName,
        price: totalPrice,
      },
      defaultPlatform,
    );

    toast.push({
      title: t.product.addedToCart || "Ditambahkan ke Keranjang",
      description: `${localizeVariantName(customItemName, lang)} — ${formatPrice(totalPrice, lang)}`,
      tone: "success",
    });
    setTimeout(() => setIsAdding(false), 300);
  };

  // 1-Click Pay with Balance
  const handlePayWithBalance = async () => {
    if (!isAuthenticated) {
      router.push(`/masuk?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!hasEnoughBalance) {
      router.push(`/isi-saldo?needed=${totalPrice}&app=${app.slug}&variant=${selectedVariant.id}`);
      return;
    }

    setIsPayingWithBalance(true);
    const orderCode = `TK-${Date.now().toString().slice(-6)}`;
    const baseName =
      variants.length === 1 || selectedVariant.name.toLowerCase().includes(app.name.toLowerCase())
        ? selectedVariant.name
        : `${app.name} (${selectedVariant.name})`;
    const customItemName = quantity > 1 ? `${baseName} (${quantity}x)` : baseName;

    const success = deduct(totalPrice, `Beli ${customItemName}`, orderCode);
    if (!success) {
      toast.push({
        title: "Saldo Tidak Mencukupi",
        description: "Silakan isi saldo Anda terlebih dahulu.",
        tone: "error",
      });
      setIsPayingWithBalance(false);
      return;
    }

    // Add to user library
    library.add(app.slug, {
      accountEmail: user?.email,
      licenseKey: `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    });

    // Record order in Supabase
    if (supabaseReady && supabase) {
      try {
        await supabase.from("orders").insert({
          order_code: orderCode,
          customer_name: user?.name || "Member",
          customer_email: user?.email || "member@texasai.com",
          customer_phone: "-",
          total_price: totalPrice,
          payment_method: "saldo_akun",
          status: "lunas",
          items: [
            {
              id: app.id,
              name: customItemName,
              price: totalPrice,
              platform: defaultPlatform,
            },
          ],
        });
      } catch (err) {
        console.warn("Error inserting order to Supabase:", err);
      }
    }

    toast.push({
      title: "Pembayaran Berhasil",
      description: `Berhasil membeli ${customItemName} menggunakan Saldo Akun.`,
      tone: "success",
    });

    setPurchasedSuccess(true);
    setIsPayingWithBalance(false);

    // Redirect to order details / check order
    setTimeout(() => {
      router.push(`/cek-pesanan?code=${orderCode}`);
    }, 1200);
  };

  return (
    <div className="glass-card rounded-2xl border border-border/80 bg-surface/90 p-4 sm:p-6 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3.5">
        <div>
          <span className="inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
            {variants.length > 1 ? (t.product.packageOptions || "PILIHAN PAKET") : (t.product.priceInfo || "INFO HARGA")}
          </span>
          <h2 className="mt-1 text-base sm:text-lg font-bold tracking-tight text-fg">
            {variants.length > 1 ? (t.product.selectVariant || "Pilih Variasi Produk") : (t.product.servicePackage || "Paket Layanan")}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 justify-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg">
            <ShieldCheck size={14} strokeWidth={2} className="text-emerald-500" /> {t.product.warranty || "Garansi 100%"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-sky-600 dark:text-sky-400">
            <Lock size={13} strokeWidth={2} /> {t.product.privateAccount || (lang === "en" ? "100% Private Account" : lang === "zh" ? "100% 独立私有账号" : "100% Akun Pribadi")}
          </span>
        </div>
      </div>

      {/* List Variasi Bar Style */}
      {variants.length > 1 ? (
        <div className="mt-4 space-y-2.5">
          {variants.map((v) => {
            const active = selectedVariant.id === v.id;
            const isOutOfStock = v.stock === 0;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectVariant(v)}
                className={`group flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                  active
                    ? isOutOfStock
                      ? "border-red-500/50 bg-red-500/5 ring-1 ring-red-500/30 text-fg"
                      : "border-accent bg-accent/10 shadow-xs ring-1 ring-accent text-fg"
                    : isOutOfStock
                      ? "border-border/50 bg-surface-2/40 opacity-60 text-fg-muted hover:opacity-80"
                      : "border-border/80 bg-surface/70 text-fg hover:border-accent/40 hover:bg-surface"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    <AppIcon icon={app.icon} size="xs" className="h-7 w-7 !min-h-7 !min-w-7 rounded-lg" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold truncate text-fg">{localizeVariantName(v.name, lang)}</p>
                      {isOutOfStock && (
                        <span className="rounded-md bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                          {lang === "en" ? "Sold Out" : lang === "zh" ? "缺货" : "Stok Habis"}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] font-normal text-fg-muted mt-0.5">
                      {isOutOfStock
                        ? (lang === "en" ? "Out of Stock" : lang === "zh" ? "暂无库存" : "Stok Habis")
                        : `${t.product.stock || "Stok:"} ${v.stock ?? app.stock}`}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`text-[14.5px] font-bold tabular-nums ${active ? (isOutOfStock ? "text-red-500" : "text-accent") : (isOutOfStock ? "text-fg-muted line-through" : "text-fg")}`}>
                    {formatPrice(v.price, lang)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-surface-2/70 p-4 border border-border/70">
          <p className="text-xs font-medium text-fg-muted">{t.product.totalPayment || "Harga Produk"}</p>
          <p className="mt-1 text-2xl font-bold text-fg tabular-nums">{formatPrice(currentPrice, lang)}</p>
        </div>
      )}

      {/* Kuantitas Pembelian */}
      <div className="mt-4.5 border-t border-border/70 pt-4 flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-fg">
            {lang === "en" ? "Quantity" : lang === "zh" ? "购买数量" : "Jumlah Pembelian"}
          </label>
          <p className="text-[11.5px] text-fg-muted mt-0.5">
            {isSoldOut
              ? (lang === "en" ? "Out of stock" : lang === "zh" ? "库存不足" : "Stok tidak tersedia")
              : (lang === "en" ? `Available: ${maxStock} pcs` : lang === "zh" ? `剩余库存: ${maxStock} 件` : `Tersedia: ${maxStock} item`)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-2 rounded-xl p-1 border border-border shadow-xs">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isSoldOut}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-fg font-bold shadow-2xs hover:bg-surface-3 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            aria-label="Kurangi kuantitas"
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>
          
          <input
            type="number"
            min={1}
            max={maxStock}
            value={isSoldOut ? 0 : quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                setQuantity(Math.max(1, Math.min(val, maxStock)));
              }
            }}
            disabled={isSoldOut}
            className="w-10 text-center font-bold text-sm bg-transparent text-fg focus:outline-hidden disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
            disabled={quantity >= maxStock || isSoldOut}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-fg font-bold shadow-2xs hover:bg-surface-3 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            aria-label="Tambah kuantitas"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Ringkasan Harga & Saldo Status */}
      <div className="mt-4 border-t border-border/70 pt-4">
        {/* Info Saldo User */}
        {isAuthenticated ? (
          <div className="mb-3.5 flex items-center justify-between rounded-xl bg-surface-2/90 px-3.5 py-2.5 border border-border">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-accent" />
              <div>
                <span className="text-[11px] text-fg-muted font-medium block">Saldo Akun Anda</span>
                <span className="text-xs sm:text-sm font-bold text-fg tabular-nums">
                  {formatRupiah(balance)} <span className="text-[11px] text-fg-muted">(${balanceUsd.toFixed(2)} USD)</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/isi-saldo?needed=${totalPrice}&app=${app.slug}&variant=${selectedVariant.id}`)}
              className="rounded-lg bg-accent/15 border border-accent/30 px-2.5 py-1 text-[11px] font-bold text-accent hover:bg-accent hover:text-accent-fg transition-colors cursor-pointer"
            >
              + Isi Saldo
            </button>
          </div>
        ) : (
          <div className="mb-3.5 flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-2.5 border border-border text-fg">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <LogIn size={15} />
              <span>Wajib Masuk Akun untuk Berbelanja</span>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/masuk?next=${encodeURIComponent(pathname)}`)}
              className="rounded-lg bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-fg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Masuk
            </button>
          </div>
        )}

        <div className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-fg-muted">{t.product.totalPayment || "Total Harga Produk"}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${isSoldOut ? "text-fg-muted line-through" : "text-accent"}`}>
                {formatPrice(totalPrice, lang)}
              </p>
              {quantity > 1 && !isSoldOut && (
                <span className="text-xs font-medium text-fg-muted">
                  ({formatPrice(currentPrice, lang)} × {quantity})
                </span>
              )}
            </div>
          </div>
          {isSoldOut ? (
            <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
              {lang === "en" ? "Sold Out" : lang === "zh" ? "暂时缺货" : "Stok Habis"}
            </span>
          ) : (
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Zap size={12} className="inline mr-1" />
              {t.product.instantActivation || "Aktivasi Instan"}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {isSoldOut ? (
            <>
              <button
                type="button"
                disabled
                className="w-full h-12 py-3 px-6 rounded-full bg-surface-3 text-fg-muted font-bold text-sm sm:text-base border border-border/80 opacity-70 cursor-not-allowed flex items-center justify-center gap-2 shadow-inner"
              >
                <span>{lang === "en" ? "Sold Out" : lang === "zh" ? "已售罄 (缺货)" : "Stok Habis (Sold Out)"}</span>
              </button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full opacity-50 cursor-not-allowed"
                disabled
              >
                <ShoppingBag size={17} strokeWidth={2} />
                {lang === "en" ? "Item Unavailable" : lang === "zh" ? "暂不可加购" : "Stok Tidak Tersedia"}
              </Button>
            </>
          ) : !isAuthenticated ? (
            /* USER BELUM LOGIN -> WAJIB LOGIN */
            <>
              <Button
                size="lg"
                className="w-full bg-accent hover:opacity-90 text-accent-fg shadow-md font-bold rounded-full cursor-pointer transition-transform active:scale-[0.98]"
                onClick={() => router.push(`/masuk?next=${encodeURIComponent(pathname)}`)}
              >
                <LogIn size={17} strokeWidth={2.4} />
                <span>{lang === "en" ? "Sign In to Purchase" : lang === "zh" ? "登录后购买" : "Wajib Masuk Akun untuk Membeli"}</span>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                <ShoppingBag size={17} strokeWidth={2} />
                {isAdding ? (t.product.adding || "Menambahkan…") : (t.product.addToCart || "Tambah ke Keranjang")}
              </Button>
            </>
          ) : hasEnoughBalance ? (
            /* SALDO CUKUP -> 1-CLICK BAYAR DENGAN SALDO */
            <>
              <Button
                size="lg"
                className="w-full bg-fg hover:bg-fg/90 text-surface shadow-sm font-bold rounded-full cursor-pointer transition-all active:scale-[0.98]"
                onClick={handlePayWithBalance}
                disabled={isPayingWithBalance || purchasedSuccess}
                loading={isPayingWithBalance}
              >
                {purchasedSuccess ? (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    <span>Pembayaran Berhasil! Mengalihkan…</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Zap size={18} />
                    <span>Bayar dengan Saldo ({formatRupiah(totalPrice)})</span>
                  </span>
                )}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                <ShoppingBag size={17} strokeWidth={2} />
                {isAdding ? (t.product.adding || "Menambahkan…") : (t.product.addToCart || "Tambah ke Keranjang")}
              </Button>
            </>
          ) : (
            /* SALDO KURANG -> TOMBOL ISI SALDO */
            <>
              <Button
                size="lg"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md font-bold rounded-full cursor-pointer transition-all active:scale-[0.98]"
                onClick={() => openTopUp(totalPrice)}
              >
                <PlusCircle size={18} />
                <span>
                  {lang === "en"
                    ? `Top Up Balance (Deficit ${formatRupiah(balanceDeficit)})`
                    : lang === "zh"
                    ? `余额不足，去充值（缺少 ${formatRupiah(balanceDeficit)}）`
                    : `Isi Saldo (Kurang ${formatRupiah(balanceDeficit)})`}
                </span>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                <ShoppingBag size={17} strokeWidth={2} />
                {isAdding ? (t.product.adding || "Menambahkan…") : (t.product.addToCart || "Tambah ke Keranjang")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
