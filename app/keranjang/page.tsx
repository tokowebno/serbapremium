"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Wallet, LogIn, Zap, PlusCircle, CheckCircle2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartItemRow } from "@/components/storefront/cart-item";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { useCart, useAuth, useLibrary } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { useHydrated } from "@/lib/use-hydrated";
import { formatRupiah } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { supabase, supabaseReady } from "@/lib/supabase";

export default function CartPage() {
  const router = useRouter();
  const toast = useToast();
  const { items, subtotal, clear: clearCart } = useCart();
  const { user, isAuthenticated, balance, balanceUsd, deduct, openTopUp } = useAuth();
  const library = useLibrary();
  const { lang, t } = useTranslation();
  const hydrated = useHydrated();

  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

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

  const hasEnoughBalance = balance >= subtotal;
  const balanceDeficit = subtotal - balance;

  const handlePayCartWithBalance = async () => {
    if (!isAuthenticated) {
      router.push(`/masuk?next=/keranjang`);
      return;
    }

    if (!hasEnoughBalance) {
      router.push(`/isi-saldo?needed=${subtotal}`);
      return;
    }

    setIsPaying(true);
    const orderCode = `TK-${Date.now().toString().slice(-6)}`;
    const success = deduct(subtotal, `Beli ${items.length} Item Keranjang`, orderCode);

    if (!success) {
      toast.push({
        title: "Saldo Kurang",
        description: "Silakan isi saldo Anda terlebih dahulu.",
        tone: "error",
      });
      setIsPaying(false);
      return;
    }

    // Add items to library
    items.forEach((item) => {
      library.add(item.appId, {
        accountEmail: user?.email,
        licenseKey: `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      });
    });

    // Record order in Supabase
    if (supabaseReady && supabase) {
      try {
        await supabase.from("orders").insert({
          order_code: orderCode,
          customer_name: user?.name || "Member",
          customer_email: user?.email || "member@texasai.com",
          customer_phone: "-",
          total_price: subtotal,
          payment_method: "saldo_akun",
          status: "lunas",
          items: items.map((it) => ({
            id: it.appId,
            name: it.name,
            price: it.price,
            platform: it.platform,
          })),
        });
      } catch (err) {
        console.warn("DB insert error:", err);
      }
    }

    clearCart();
    toast.push({
      title: "Pembayaran Keranjang Berhasil",
      description: "Seluruh lisensi telah berhasil diaktifkan ke akun Anda.",
      tone: "success",
    });

    setPaySuccess(true);
    setIsPaying(false);

    setTimeout(() => {
      router.push(`/cek-pesanan?code=${orderCode}`);
    }, 1200);
  };

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

        <aside className="space-y-4">
          <CheckoutSummary items={items} subtotal={subtotal} discount={0} />

          {/* Saldo status */}
          {isAuthenticated ? (
            <div className="rounded-2xl border border-border/80 bg-surface/90 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-accent" />
                  <span className="text-xs font-semibold text-fg-muted">Saldo Akun</span>
                </div>
                <span className="text-sm font-bold text-fg tabular-nums">{formatRupiah(balance)}</span>
              </div>

              {hasEnoughBalance ? (
                <Button
                  size="lg"
                  onClick={handlePayCartWithBalance}
                  disabled={isPaying || paySuccess}
                  loading={isPaying}
                  className="mt-3.5 w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer"
                >
                  {paySuccess ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 size={16} />
                      <span>Berhasil! Mengalihkan…</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <Zap size={16} />
                      <span>Bayar dengan Saldo ({formatRupiah(subtotal)})</span>
                    </span>
                  )}
                </Button>
              ) : (
                <div className="mt-3 space-y-2">
                  <p className="text-[11.5px] text-amber-600 dark:text-amber-400 font-medium">
                    Saldo Anda kurang {formatRupiah(balanceDeficit)}. Silakan isi saldo terlebih dahulu.
                  </p>
                  <Button
                    onClick={() => openTopUp(subtotal)}
                    size="lg"
                    className="w-full rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md cursor-pointer"
                  >
                    <PlusCircle size={16} />
                    <span>Isi Saldo Sekarang</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-center">
              <p className="text-xs font-bold text-fg">Wajib Masuk Akun untuk Melakukan Checkout</p>
              <p className="mt-1 text-[11.5px] text-fg-muted">
                Silakan masuk atau buat akun baru untuk melanjutkan pembayaran via saldo.
              </p>
              <ButtonLink href="/masuk?next=/keranjang" size="lg" className="mt-3 w-full rounded-full">
                <LogIn size={16} />
                <span>Masuk Sekarang</span>
              </ButtonLink>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
