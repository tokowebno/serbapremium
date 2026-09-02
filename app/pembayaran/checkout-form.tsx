"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, Copy, ShieldCheck, Zap, AlertCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input } from "@/components/ui/form";
import { useAuth, useCart, useLibrary } from "@/components/storefront/providers";
import { api } from "@/lib/api";
import { supabase, supabaseReady } from "@/lib/supabase";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "@/components/storefront/i18n-provider";
import type { Platform } from "@/types";

export type PaymentMethod = "qris" | "usdt_bnb" | "usdt_tron";

const PAYMENT_INFO: Record<PaymentMethod, {
  name: Record<string, string>;
  network: string;
  address?: string;
  badge: string;
  icon: string;
}> = {
  qris: {
    name: {
      id: "QRIS (Semua E-Wallet & Bank)",
      en: "QRIS (Indonesian Banks & E-Wallets)",
      zh: "QRIS (印尼全境电子钱包与银行转账)",
    },
    network: "BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay",
    badge: "IDR QRIS",
    icon: "/logos/qris-square.svg",
  },
  usdt_bnb: {
    name: {
      id: "USDT (BNB Smart Chain / BEP-20)",
      en: "USDT (BNB Smart Chain / BEP-20)",
      zh: "USDT (币安智能链 / BEP-20)",
    },
    network: "BNB Smart Chain (BEP-20 / BSC)",
    address: "0x141b43fCDb8D17c09e7b4235b2527309db674A27",
    badge: "USDT BEP-20",
    icon: "/logos/bnb.svg",
  },
  usdt_tron: {
    name: {
      id: "USDT (Tron Network / TRC-20)",
      en: "USDT (Tron Network / TRC-20)",
      zh: "USDT (波场 / TRC-20)",
    },
    network: "TRON (TRC-20)",
    address: "TQTpRn6j1Pfwf38xP8CxqxJi18YX4v8Wcm",
    badge: "USDT TRC-20",
    icon: "/logos/tron.svg",
  },
};

/** Simpan pesanan ke Supabase (tabel orders). */
async function saveOrderToDb(order: Record<string, unknown>) {
  if (!supabaseReady) return;
  try {
    await supabase.from("orders").insert(order);
  } catch {
    /* database tidak tersedia — checkout tetap jalan */
  }
}

interface CheckoutFormProps {
  initialSlug?: string;
  customTitle?: string;
  customPrice?: number;
  customPlatform?: string;
}

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  platform: string;
}

export function CheckoutForm({ initialSlug, customTitle, customPrice, customPlatform }: CheckoutFormProps) {
  const { lang, t } = useTranslation();
  const router = useRouter();
  const hydrated = useHydrated();

  const { items: cartItems, clear: clearCart } = useCart();
  const { add: addToLibrary } = useLibrary();
  const { user } = useAuth();

  // Multi-step form: Step 1 = Pilih Metode + Data, Step 2 = Instruksi Pembayaran + Kode Unik
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAmountCopied, setIsAmountCopied] = useState(false);
  const [qrisDone, setQrisDone] = useState(false);
  const [usdtDone, setUsdtDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Kode unik 3 digit acak agar mudah diverifikasi (misal: 123)
  const [uniqueCode] = useState(() => Math.floor(Math.random() * 800 + 100));

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user, name, email]);

  // Siapkan daftar item checkout
  let itemsToCheckout: CheckoutItem[] = [];
  if (customTitle && customPrice !== undefined) {
    itemsToCheckout = [
      {
        id: initialSlug || "custom-item",
        name: customTitle,
        price: customPrice,
        platform: customPlatform || "Web",
      },
    ];
  } else if (initialSlug) {
    const app = api.apps.getBySlug(initialSlug);
    if (app) {
      itemsToCheckout = [
        {
          id: app.id,
          name: app.name,
          price: app.price,
          platform: customPlatform || app.platforms[0] || "Web",
        },
      ];
    }
  } else {
    itemsToCheckout = cartItems.map((c) => ({
      id: c.appId,
      name: c.name,
      price: c.price,
      platform: c.platform,
    }));
  }

  const subtotal = itemsToCheckout.reduce((sum, item) => sum + item.price, 0);

  // Rate: 1 USDT ≈ Rp 16.000
  const rawUsd = subtotal / 16000;
  const baseUsd = Math.max(0.5, rawUsd);
  // Kode unik 3-4 desimal untuk USDT (misal: 0.0123)
  const usdtDecimalUnique = (uniqueCode % 900 + 100) / 10000;
  const totalUsdt = Number((baseUsd + usdtDecimalUnique).toFixed(4));

  const totalBayar = paymentMethod === "qris" ? subtotal + uniqueCode : subtotal;

  const copyAddress = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const copyAmount = async (amount: number | string) => {
    try {
      await navigator.clipboard.writeText(amount.toString());
      setIsAmountCopied(true);
      setTimeout(() => setIsAmountCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage(lang === "en" ? "Please enter your full name." : lang === "zh" ? "请输入您的姓名。" : "Harap masukkan nama lengkap Anda.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage(lang === "en" ? "Please enter a valid email address." : lang === "zh" ? "请输入有效的电子邮件地址。" : "Harap masukkan alamat email yang valid.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const goNext = () => {
    if (!validateForm()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishCheckout = async () => {
    if (!validateForm()) {
      setStep(1);
      return;
    }

    setLoading(true);

    const orderId = `SP-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const orderRecord = {
      id: orderId,
      user_id: "guest",
      user_name: name.trim(),
      user_email: email.trim(),
      user_phone: phone.trim() || null,
      payment_method: paymentMethod,
      total: paymentMethod === "qris" ? totalBayar : totalUsdt,
      currency: paymentMethod === "qris" ? "IDR" : "USDT",
      payment_status: "menunggu",
      order_status: "diproses",
      date: nowIso,
      items: itemsToCheckout.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        platform: item.platform,
      })),
    };

    try {
      await saveOrderToDb(orderRecord);

      itemsToCheckout.forEach((item) => {
        addToLibrary(item.id);
      });

      if (!initialSlug) {
        clearCart();
      }

      const receipt = {
        id: orderId,
        date: nowIso,
        items: itemsToCheckout.map((item) => ({
          name: item.name,
          platform: item.platform,
        })),
        total: paymentMethod === "qris" ? totalBayar : totalUsdt,
        currency: paymentMethod === "qris" ? "IDR" : "USDT",
        customer: {
          name: name.trim(),
          email: email.trim(),
        },
      };

      sessionStorage.setItem("serbapremium:last-order", JSON.stringify(receipt));
      sessionStorage.setItem("tokono:last-order", JSON.stringify(receipt));

      router.push("/pembayaran/berhasil");
    } catch {
      setErrorMessage(lang === "en" ? "Failed to create order. Please try again." : lang === "zh" ? "创建订单失败，请重试。" : "Gagal membuat pesanan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  if (!hydrated) return null;

  if (itemsToCheckout.length === 0) {
    return (
      <EmptyState
        icon={Zap}
        title={lang === "en" ? "Checkout is empty" : lang === "zh" ? "结账单为空" : "Tidak ada item untuk dibayar"}
        description={lang === "en" ? "Select apps from our catalog or cart to proceed." : lang === "zh" ? "请从应用目录或购物车中选择要购买的商品。" : "Pilih aplikasi dari katalog atau keranjang untuk melanjutkan pembayaran."}
        action={{ label: lang === "en" ? "Explore Catalog" : lang === "zh" ? "浏览应用目录" : "Jelajahi Katalog", href: "/aplikasi" }}
      />
    );
  }

  const steps = [
    { n: 1, label: lang === "en" ? "Buyer & Method" : lang === "zh" ? "信息与方式" : "Metode & Data" },
    { n: 2, label: lang === "en" ? "Transfer & Code" : lang === "zh" ? "转账与核验" : "Transfer & Kode Unik" },
    { n: 3, label: lang === "en" ? "Done" : lang === "zh" ? "完成" : "Selesai" },
  ];

  return (
    <div>
      {/* Stepper Progress Bar */}
      <div className="flex items-center justify-between border-b-2 border-border pb-3 sm:pb-5 gap-1">
        {steps.map(({ n, label }, i) => {
          const active = step === n;
          const done = step > n;
          return (
            <div key={n} className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  if (done) setStep(n as 1 | 2);
                }}
                className={`flex items-center gap-1 sm:gap-1.5 rounded-sm border-1.5 sm:border-2 px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-black transition-all ${
                  active
                    ? "border-border bg-accent text-black shadow-[1.5px_1.5px_0px_var(--shadow-color)] sm:shadow-[2px_2px_0px_var(--shadow-color)]"
                    : done
                    ? "border-border bg-surface text-fg shadow-[1px_1px_0px_var(--shadow-color)] cursor-pointer"
                    : "border-border/40 bg-surface-2 text-fg-muted opacity-60 cursor-default"
                }`}
              >
                <span className={`flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-xs text-[9px] sm:text-[10px] font-black ${active || done ? "bg-black text-white" : "bg-border text-fg-muted"}`}>
                  {done ? <Check size={10} strokeWidth={3} /> : n}
                </span>
                <span className="truncate max-w-[65px] sm:max-w-none">{label}</span>
              </button>
              {i < steps.length - 1 && <span className="text-fg-muted text-[10px] sm:text-xs font-bold">→</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
        <section className="rounded-md sm:rounded-xl border-2 border-border bg-surface p-4 sm:p-7 shadow-[3px_3px_0px_var(--shadow-color)] sm:shadow-[5px_5px_0px_var(--shadow-color)]">
          {step === 1 ? (
            /* STEP 1: PILIH METODE PEMBAYARAN + DATA PEMBELI */
            <div className="flex flex-col gap-4 sm:gap-5">
              <div>
                <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                  {lang === "en" ? "STEP 1" : lang === "zh" ? "步骤 1" : "LANGKAH 1"}
                </span>
                <h2 className="mt-1 text-base sm:text-lg font-black tracking-tight text-fg">
                  {lang === "en" ? "Buyer Information & Payment Method" : lang === "zh" ? "选择付款方式与填写信息" : "Informasi Pembeli & Metode Pembayaran"}
                </h2>
              </div>

              {/* Ringkasan Singkat Produk & Total */}
              <div className="flex items-center justify-between gap-3 rounded-md sm:rounded-lg border-2 border-border bg-surface-2 p-3 sm:p-3.5 shadow-[2px_2px_0px_var(--shadow-color)]">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-black uppercase text-fg-muted">Produk</p>
                  <p className="truncate text-xs sm:text-sm font-black text-fg">{itemsToCheckout[0]?.name || "Item Digital"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] sm:text-xs font-black uppercase text-fg-muted">Total</p>
                  <p className="text-sm sm:text-base font-black text-fg tabular-nums">
                    {paymentMethod === "qris" ? formatPrice(totalBayar, lang) : `${totalUsdt} USDT`}
                  </p>
                </div>
              </div>

              {/* Pilihan Metode Pembayaran dengan Logo Asli QRIS / BNB / TRON */}
              <div className="space-y-2">
                <label className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-fg-muted">
                  {lang === "en" ? "Select Payment Method" : lang === "zh" ? "选择付款方式" : "Metode Pembayaran"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {(["qris", "usdt_bnb", "usdt_tron"] as PaymentMethod[]).map((method) => {
                    const info = PAYMENT_INFO[method];
                    const active = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`relative flex flex-col justify-between rounded-md sm:rounded-lg border-2 p-3 sm:p-3.5 text-left transition-all duration-150 ${
                          active
                            ? "border-border bg-accent text-black font-black shadow-[3px_3px_0px_var(--shadow-color)] sm:shadow-[4px_4px_0px_var(--shadow-color)] -translate-x-0.5 -translate-y-0.5"
                            : "border-border bg-surface text-fg hover:bg-surface-2 shadow-[1.5px_1.5px_0px_var(--shadow-color)] sm:shadow-[2px_2px_0px_var(--shadow-color)]"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={info.icon}
                              alt={info.badge}
                              className="h-7 w-7 rounded-sm object-contain border border-border/40 bg-white p-0.5 shadow-[1px_1px_0px_var(--shadow-color)]"
                            />
                            <span className="text-xs font-black uppercase tracking-tight">{info.badge}</span>
                          </div>
                          {active && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white shadow-[1px_1px_0px_var(--shadow-color)]">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold opacity-80 line-clamp-2">
                          {info.name[lang] || info.name.id}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Form */}
              <div className="space-y-4 pt-2 border-t-2 border-border">
                <Field label={lang === "en" ? "Full Name" : lang === "zh" ? "姓名" : "Nama Lengkap"} htmlFor="nama-lengkap">
                  <Input
                    id="nama-lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === "en" ? "Your full name" : lang === "zh" ? "您的姓名" : "Nama Anda"}
                    autoComplete="name"
                  />
                </Field>

                <Field
                  label={lang === "en" ? "Email Address (Account/License delivery)" : lang === "zh" ? "电子邮箱（接收授权与凭据）" : "Alamat Email (Pengiriman Lisensi/Akun)"}
                  htmlFor="email-address"
                >
                  <Input
                    id="email-address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                  />
                </Field>

                <Field
                  label={lang === "en" ? "WhatsApp / Phone (Optional)" : lang === "zh" ? "手机号 / WhatsApp（选填）" : "No. HP / WhatsApp (Opsional)"}
                  htmlFor="phone-number"
                >
                  <Input
                    id="phone-number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    autoComplete="tel"
                  />
                </Field>

                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-md border-2 border-discount bg-discount/10 p-3 text-xs font-bold text-discount">
                    <AlertCircle size={15} /> {errorMessage}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button size="lg" onClick={goNext} disabled={loading} className="w-full sm:w-auto h-13 sm:h-12 px-8 text-base font-black shadow-[3px_3px_0px_var(--shadow-color)]">
                  {loading ? (lang === "en" ? "Processing…" : lang === "zh" ? "处理中…" : "Memproses…") : (lang === "en" ? "Proceed to Payment" : lang === "zh" ? "前往付款" : "Lanjut ke Pembayaran")}
                  {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: DETAIL PEMBAYARAN, KODE UNIK, QRIS / USDT */
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b-2 border-border pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={PAYMENT_INFO[paymentMethod].icon}
                    alt={PAYMENT_INFO[paymentMethod].badge}
                    className="h-9 w-9 rounded-md object-contain border-2 border-border bg-white p-1 shadow-[2px_2px_0px_var(--shadow-color)]"
                  />
                  <div>
                    <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                      {PAYMENT_INFO[paymentMethod].badge}
                    </span>
                    <h2 className="mt-0.5 text-lg font-black tracking-tight text-fg">
                      {paymentMethod === "qris" ? "Pembayaran QRIS" : `Pembayaran ${PAYMENT_INFO[paymentMethod].badge}`}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-black text-fg-muted hover:text-fg underline"
                >
                  {lang === "en" ? "← Change Info" : lang === "zh" ? "← 修改信息" : "← Ubah Data"}
                </button>
              </div>

              {paymentMethod === "qris" ? (
                <>
                  <div className="rounded-lg border-2 border-border bg-surface-2 p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
                    <p className="text-xs font-black uppercase text-fg-muted">
                      {lang === "en" ? "Total amount to pay" : lang === "zh" ? "应付总额" : "Total yang harus dibayar"}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <p className="text-3xl font-black tracking-tight text-fg tabular-nums">
                        {formatPrice(totalBayar, lang)}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyAmount(totalBayar)}
                        className="flex items-center gap-1 rounded-xs border border-border bg-accent px-2.5 py-1 text-[11px] font-black text-black shadow-[1px_1px_0px_var(--shadow-color)] hover:bg-accent-hover"
                      >
                        {isAmountCopied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.5} />}
                        {isAmountCopied ? "Disalin!" : "Salin Nominal"}
                      </button>
                    </div>
                    <p className="mt-2.5 text-xs font-bold leading-5 text-fg-muted border-t border-border pt-2">
                      <span className="font-black text-fg">Kode unik {uniqueCode}</span> sudah termasuk di nominal di atas — bayar persis sejumlah itu agar pesanan mudah dikenali dan diproses otomatis oleh robot SerbaPremium.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="relative overflow-hidden rounded-lg border-2 border-border bg-white p-3 shadow-[3px_3px_0px_var(--shadow-color)]">
                      <img
                        src="/qris.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                        }}
                        alt="Kode QRIS — pindai dengan aplikasi e-wallet atau m-banking"
                        className="h-56 w-56 object-contain"
                      />
                    </div>
                    <p className="max-w-xs text-center text-xs font-bold leading-5 text-fg-muted">
                      Pindai QRIS di atas, bayar sesuai nominal{" "}
                      <span className="font-black text-fg">{formatPrice(totalBayar, lang)}</span>, lalu tekan tombol di bawah.
                    </p>

                    <div className="w-full pt-1">
                      {qrisDone ? (
                        <div className="flex items-center justify-center gap-2 rounded-md border-2 border-border bg-accent/20 p-3 text-sm font-black text-fg shadow-[2px_2px_0px_var(--shadow-color)]">
                          <CheckCircle2 size={18} className="text-success" /> Pembayaran Anda tercatat.
                        </div>
                      ) : (
                        <Button size="lg" className="w-full h-13 text-base font-black shadow-[3px_3px_0px_var(--shadow-color)]" onClick={() => setQrisDone(true)}>
                          Saya Sudah Bayar
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg border-2 border-border bg-surface-2 p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase text-fg-muted">
                        {lang === "en" ? "Total USDT amount to send" : lang === "zh" ? "应付 USDT 数量" : "Total USDT yang harus dikirim"}
                      </p>
                      <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black text-black">
                        1 USDT ≈ Rp 16.000
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <div>
                        <p className="text-3xl font-black tracking-tight text-fg tabular-nums">
                          {totalUsdt} <span className="text-lg font-black text-accent-blue dark:text-accent">USDT</span>
                        </p>
                        <p className="text-xs font-bold text-fg-muted mt-0.5">
                          ≈ ${totalUsdt.toFixed(2)} USD (Rp {subtotal.toLocaleString("id-ID")})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyAmount(totalUsdt)}
                        className="flex items-center gap-1 rounded-xs border border-border bg-accent px-2.5 py-1 text-[11px] font-black text-black shadow-[1px_1px_0px_var(--shadow-color)] hover:bg-accent-hover"
                      >
                        {isAmountCopied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.5} />}
                        {isAmountCopied ? "Disalin!" : "Salin Nominal"}
                      </button>
                    </div>

                    <p className="mt-2.5 text-xs font-bold leading-5 text-fg-muted border-t border-border pt-2">
                      <span className="font-black text-fg">Kode unik desimal (+{usdtDecimalUnique.toFixed(4)} USDT)</span> sudah termasuk dalam nominal di atas. Transfer persis <span className="font-black text-fg">{totalUsdt} USDT</span> agar sistem otomatis mengenali transfer Anda.
                    </p>
                  </div>

                  {/* QR Code Alamat Wallet USD / USDT */}
                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="relative overflow-hidden rounded-lg border-2 border-border bg-white p-3 shadow-[3px_3px_0px_var(--shadow-color)]">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(PAYMENT_INFO[paymentMethod].address ?? "")}&margin=10`}
                        alt={`QR Code Wallet ${PAYMENT_INFO[paymentMethod].badge}`}
                        className="h-52 w-52 object-contain"
                      />
                    </div>
                    <p className="max-w-xs text-center text-xs font-bold leading-5 text-fg-muted">
                      Pindai QR di atas menggunakan aplikasi wallet crypto Anda (Binance, Trust Wallet, MetaMask, TronLink, OKX) atau salin alamat di bawah.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-black uppercase text-fg-muted">Jaringan Transfer (Network)</p>
                      <p className="mt-1 font-mono text-sm font-black text-fg bg-surface px-3 py-2 rounded-md border border-border">
                        {PAYMENT_INFO[paymentMethod].network}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase text-fg-muted">Alamat Wallet Penerima</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Input
                          readOnly
                          value={PAYMENT_INFO[paymentMethod].address ?? ""}
                          className="font-mono text-xs font-bold"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => copyAddress(PAYMENT_INFO[paymentMethod].address ?? "")}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? "Tersalin" : "Salin"}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2">
                      {usdtDone ? (
                        <div className="flex items-center justify-center gap-2 rounded-md border-2 border-border bg-accent/20 p-3 text-sm font-black text-fg shadow-[2px_2px_0px_var(--shadow-color)]">
                          <CheckCircle2 size={18} className="text-success" /> Transfer USDT Anda tercatat.
                        </div>
                      ) : (
                        <Button size="lg" className="w-full h-13 text-base font-black shadow-[3px_3px_0px_var(--shadow-color)]" onClick={() => setUsdtDone(true)}>
                          Saya Sudah Transfer USDT
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-md border-2 border-discount bg-discount/10 p-3 text-xs font-bold text-discount">
                  <AlertCircle size={15} /> {errorMessage}
                </div>
              )}

              {/* Tombol Aksi Bawah: Tebal, Padat, dan Jelas di HP */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep(1)} className="w-full sm:w-1/3 h-14 text-sm font-black shadow-[2px_2px_0px_var(--shadow-color)]">
                  ← Kembali
                </Button>
                <Button size="lg" onClick={finishCheckout} disabled={loading} className="w-full sm:flex-1 h-14 text-base sm:text-lg font-black py-4 shadow-[4px_4px_0px_var(--shadow-color)]">
                  {loading ? (lang === "en" ? "Confirming Order…" : lang === "zh" ? "确认订单中…" : "Mengonfirmasi Pesanan…") : (lang === "en" ? "Complete Order 🚀" : lang === "zh" ? "完成订单 🚀" : "Selesaikan Pembayaran 🚀")}
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
