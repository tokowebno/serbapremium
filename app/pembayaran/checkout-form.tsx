"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  Check,
  Copy,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCart, useAuth } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/form";

import { supabase, supabaseReady } from "@/lib/supabase";

type PaymentMethod = "qris" | "binance" | "usdt_bnb" | "usdt_tron";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  platform: string;
}

export interface CheckoutFormProps {
  initialSlug?: string;
  customTitle?: string;
  customPrice?: number;
  customPlatform?: string;
}

const PAYMENT_INFO: Record<
  PaymentMethod,
  {
    name: { id: string; en: string; zh: string };
    badge: string;
    icon: string;
    network?: string;
    address?: string;
  }
> = {
  qris: {
    name: {
      id: "QRIS (Semua Bank & E-Wallet)",
      en: "QRIS (Indonesian Banks & E-Wallets)",
      zh: "QRIS（印尼全币种银行与电子钱包）",
    },
    badge: "IDR QRIS",
    icon: "/logos/qris-icon.svg",
  },
  binance: {
    name: {
      id: "Binance Pay (ID: 1275129025)",
      en: "Binance Pay (ID: 1275129025)",
      zh: "币安支付 / Binance Pay (ID: 1275129025)",
    },
    badge: "Binance Pay",
    icon: "/logos/binance.svg",
    network: "Binance Pay",
    address: "1275129025",
  },
  usdt_bnb: {
    name: {
      id: "BNB / USDT (BNB Smart Chain BEP-20)",
      en: "BNB / USDT (BNB Smart Chain BEP-20)",
      zh: "BNB / USDT（BNB 智能链 BEP-20）",
    },
    badge: "BNB BEP-20",
    icon: "/logos/bnb.svg",
    network: "BNB Smart Chain (BEP-20)",
    address: "0x141b43fCDb8D17c09e7b4235b2527309db674A27",
  },
  usdt_tron: {
    name: {
      id: "Tron / USDT (Tron Network TRC-20)",
      en: "Tron / USDT (Tron Network TRC-20)",
      zh: "Tron / USDT（波场网络 TRC-20）",
    },
    badge: "TRON TRC-20",
    icon: "/logos/tron.svg",
    network: "Tron (TRC-20)",
    address: "TQTpRn6j1Pfwf38xP8CxqxJi18YX4v8Wcm",
  },
};

export function CheckoutForm({
  initialSlug: propInitialSlug,
  customTitle: propCustomTitle,
  customPrice: propCustomPrice,
  customPlatform: propCustomPlatform,
}: CheckoutFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: cartItems, clear: clearCart } = useCart();
  const { user } = useAuth();
  const { lang, t } = useTranslation();

  // Ambil parameter jika user klik "Beli Sekarang" dari halaman detail
  const initialSlug = propInitialSlug || searchParams.get("app") || undefined;
  const customPrice = propCustomPrice !== undefined ? propCustomPrice : (searchParams.get("price") ? Number(searchParams.get("price")) : undefined);
  const customTitle = propCustomTitle || searchParams.get("title") || undefined;
  const customPlatform = propCustomPlatform || searchParams.get("platform") || undefined;

  // Step 1: Info Pembeli & Metode Pembayaran | Step 2: Bayar (QRIS / USDT)
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");

  const [loading, setLoading] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAmountCopied, setIsAmountCopied] = useState(false);
  const [qrisDone, setQrisDone] = useState(false);
  const [binanceDone, setBinanceDone] = useState(false);
  const [usdtDone, setUsdtDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [uniqueCode] = useState(() => Math.floor(Math.random() * 800 + 100));

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user, name, email]);

  let itemsToCheckout: CheckoutItem[] = [];
  if (customTitle && customPrice !== undefined) {
    itemsToCheckout = [{
      id: initialSlug || "custom-item",
      name: customTitle,
      price: customPrice,
      platform: customPlatform || "Digital",
    }];
  } else if (initialSlug) {
    const app = api.apps.getBySlug(initialSlug);
    if (app) {
      itemsToCheckout = [{
        id: app.id,
        name: app.name,
        price: app.price,
        platform: app.platforms[0] || "Universal",
      }];
    }
  } else if (cartItems.length > 0) {
    itemsToCheckout = cartItems.map((it) => {
      const app = api.apps.getById(it.appId);
      return {
        id: it.appId,
        name: app ? app.name : "Digital Item",
        price: app ? app.price : 0,
        platform: it.platform,
      };
    });
  }

  const subtotal = itemsToCheckout.reduce((acc, item) => acc + item.price, 0);
  const baseUsd = subtotal / 16000;
  const usdtDecimalUnique = (uniqueCode % 100) / 10000;
  const totalUsdt = Number((baseUsd + usdtDecimalUnique).toFixed(4));
  const totalBayar = paymentMethod === "qris" ? subtotal + uniqueCode : subtotal;

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAmount = (amount: number | string) => {
    navigator.clipboard.writeText(amount.toString());
    setIsAmountCopied(true);
    setTimeout(() => setIsAmountCopied(false), 2000);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage(
        lang === "en"
          ? "Please enter your full name."
          : lang === "zh"
          ? "请输入您的完整姓名。"
          : "Mohon isi nama lengkap Anda."
      );
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage(
        lang === "en"
          ? "Please enter a valid email address for delivery."
          : lang === "zh"
          ? "请输入有效的接收邮箱地址。"
          : "Mohon masukkan alamat email yang valid untuk pengiriman lisensi."
      );
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateForm()) return;
    setErrorMessage("");
    setStepLoading(true);
    setTimeout(() => {
      setStepLoading(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  };

  const finishCheckout = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    const orderId = `SP-${Date.now().toString().slice(-6)}`;
    const orderData = {
      id: orderId,
      user_name: name.trim() || "Pelanggan",
      items: itemsToCheckout,
      subtotal,
      discount: 0,
      total: totalBayar,
      payment_method: paymentMethod,
      payment_status: "menunggu",
      order_status: "diproses",
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      sessionStorage.setItem("serbapremium:last-order", JSON.stringify(orderData));
      const raw = localStorage.getItem("serbapremium:orders") || "[]";
      const existing = JSON.parse(raw);
      const list = Array.isArray(existing) ? existing : [];
      const updated = [orderData, ...list.filter((o: any) => o.id !== orderId)];
      localStorage.setItem("serbapremium:orders", JSON.stringify(updated));
    } catch {
      /* ignore storage full */
    }

    try {
      if (supabaseReady) {
        await supabase.from("orders").insert([
          {
            id: orderId,
            user_name: name.trim() || "Pelanggan",
            items: itemsToCheckout,
            subtotal,
            discount: 0,
            total: totalBayar,
            payment_method: paymentMethod,
            payment_status: "menunggu",
            order_status: "diproses",
            date: new Date().toISOString().slice(0, 10),
          },
        ]);
      }
    } catch (err) {
      console.warn("Supabase order insert failed, order saved locally:", err);
    }

    if (!initialSlug && !customTitle) {
      clearCart();
    }

    router.push(`/pembayaran/berhasil?orderId=${orderId}`);
  };

  const steps = [
    { num: 1, label: lang === "en" ? "Information & Method" : lang === "zh" ? "信息与支付方式" : "Info & Metode" },
    { num: 2, label: lang === "en" ? "Payment & Transfer" : lang === "zh" ? "支付与转账" : "Pembayaran & Transfer" },
  ];

  if (itemsToCheckout.length === 0) {
    return (
      <div className="tk-container py-24 text-center">
        <div className="mx-auto max-w-md glass-card rounded-2xl p-8 border border-border/80">
          <p className="text-lg font-bold text-fg">Keranjang belanja Anda masih kosong</p>
          <p className="mt-2 text-sm text-fg-muted">Pilih produk atau lisensi yang ingin Anda beli terlebih dahulu.</p>
          <Button className="mt-6 rounded-full" onClick={() => router.push("/aplikasi")}>
            Jelajahi Aplikasi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="tk-container pt-24 sm:pt-28 pb-20 sm:pb-24">
      {/* Header Stepper */}
      <div className="mx-auto flex max-w-xl items-center justify-center gap-3 sm:gap-6">
        {steps.map((s, i) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div key={s.num} className="flex items-center gap-2 sm:gap-3">
              <div
                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-accent-fg shadow-sm"
                    : isDone
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-surface-2 text-fg-muted"
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={2.5} /> : s.num}
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold tracking-tight ${
                  isActive ? "text-fg" : "text-fg-muted"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && <span className="text-fg-faint text-xs">→</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
        <section className="glass-card rounded-2xl border border-border/80 bg-surface/90 p-5 sm:p-8 shadow-sm backdrop-blur-md">
          {step === 1 ? (
            /* STEP 1: PILIH METODE PEMBAYARAN + DATA PEMBELI */
            <div className="flex flex-col gap-5">
              <div>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase text-accent">
                  {lang === "en" ? "STEP 1" : lang === "zh" ? "步骤 1" : "LANGKAH 1"}
                </span>
                <h2 className="mt-1 text-base sm:text-xl font-bold tracking-tight text-fg">
                  {lang === "en" ? "Buyer Information & Payment Method" : lang === "zh" ? "选择付款方式与填写信息" : "Informasi Pembeli & Metode Pembayaran"}
                </h2>
              </div>

              {/* Ringkasan Singkat Produk & Total */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-2/70 p-3.5 sm:p-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-fg-muted uppercase">
                    {lang === "en" ? "Product" : lang === "zh" ? "商品" : "Produk"}
                  </p>
                  <p className="truncate text-xs sm:text-sm font-semibold text-fg">{itemsToCheckout[0]?.name || "Item Digital"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-medium text-fg-muted uppercase">
                    {lang === "en" ? "Total" : lang === "zh" ? "总计" : "Total"}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-accent tabular-nums">
                    {paymentMethod === "qris" ? formatPrice(subtotal, lang) : `$${baseUsd.toFixed(2)}`}
                  </p>
                </div>
              </div>

              {/* Pilihan Metode Pembayaran */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                  {lang === "en" ? "Select Payment Method" : lang === "zh" ? "选择付款方式" : "Metode Pembayaran"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {(["qris", "binance", "usdt_bnb", "usdt_tron"] as PaymentMethod[]).map((method) => {
                    const info = PAYMENT_INFO[method];
                    const active = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                          active
                            ? "border-accent bg-accent/10 shadow-sm ring-1 ring-accent/30 text-fg"
                            : "border-border/80 bg-surface/60 text-fg hover:border-accent/40 hover:bg-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={info.icon}
                              alt={info.badge}
                              className="h-6 w-6 rounded-md object-contain border border-border/40 bg-white p-0.5 shadow-xs"
                            />
                            <span className="text-xs font-bold uppercase tracking-tight">{info.badge}</span>
                          </div>
                          {active && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-fg shadow-xs">
                              <Check size={12} strokeWidth={2.5} />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-fg-muted line-clamp-2">
                          {info.name[lang] || info.name.id}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Form */}
              <div className="space-y-4 pt-2 border-t border-border/70">
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
                  <div className="flex items-center gap-2 rounded-xl border border-discount/30 bg-discount-soft p-3 text-xs font-semibold text-discount">
                    <AlertCircle size={15} /> {errorMessage}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button size="lg" onClick={goNext} disabled={stepLoading || loading} loading={stepLoading} className="w-full sm:w-auto h-13 sm:h-12 px-8 text-base font-bold shadow-[var(--elev-2)]">
                  {stepLoading ? (lang === "en" ? "Generating Invoice…" : lang === "zh" ? "生成账单中…" : "Menyiapkan Tagihan Pembayaran…") : (lang === "en" ? "Proceed to Payment" : lang === "zh" ? "前往付款" : "Lanjut ke Pembayaran")}
                  {!stepLoading && <ArrowRight size={18} strokeWidth={2.5} />}
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: DETAIL PEMBAYARAN, KODE UNIK, QRIS / USDT */
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border/70 pb-3.5">
                <div className="flex items-center gap-3">
                  <img
                    src={PAYMENT_INFO[paymentMethod].icon}
                    alt={PAYMENT_INFO[paymentMethod].badge}
                    className="h-8 w-8 rounded-lg object-contain border border-border/40 bg-white p-0.5 shadow-xs"
                  />
                  <div>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">
                      {PAYMENT_INFO[paymentMethod].badge}
                    </span>
                    <h2 className="mt-0.5 text-base sm:text-lg font-bold tracking-tight text-fg">
                      {paymentMethod === "qris"
                        ? (lang === "en" ? "QRIS Payment" : lang === "zh" ? "QRIS 扫码支付" : "Pembayaran QRIS")
                        : (lang === "en" ? `${PAYMENT_INFO[paymentMethod].badge} Payment` : lang === "zh" ? `${PAYMENT_INFO[paymentMethod].badge} 付款` : `Pembayaran ${PAYMENT_INFO[paymentMethod].badge}`)}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-fg-muted hover:text-fg underline"
                >
                  {lang === "en" ? "← Change Info" : lang === "zh" ? "← 修改信息" : "← Ubah Data"}
                </button>
              </div>

              {paymentMethod === "binance" ? (
                <>
                  <div className="rounded-2xl border border-[#F0B90B]/40 bg-[#F0B90B]/5 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase text-fg-muted">
                        {lang === "en" ? "Total Binance Pay (USD / USDT)" : lang === "zh" ? "币安支付应付总额 (USD / USDT)" : "Total Bayar via Binance (USD / USDT)"}
                      </p>
                      <span className="rounded-full bg-[#F0B90B]/20 text-[#D9A404] dark:text-[#F0B90B] px-2.5 py-0.5 text-[10px] font-bold">
                        Binance Pay
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-fg tabular-nums">
                          {totalUsdt} <span className="text-lg font-bold text-fg-muted">USDT / USD</span>
                        </p>
                        <p className="text-xs font-medium text-fg-muted mt-0.5">
                          ≈ Rp {subtotal.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyAmount(totalUsdt)}
                        className="flex items-center gap-1 rounded-full bg-[#F0B90B] px-3 py-1 text-xs font-bold text-[#181A20] shadow-sm hover:bg-[#e0ac07] active:scale-95"
                      >
                        {isAmountCopied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
                        {isAmountCopied
                          ? (lang === "en" ? "Copied!" : lang === "zh" ? "已复制!" : "Disalin!")
                          : (lang === "en" ? "Copy Amount" : lang === "zh" ? "复制金额" : "Salin Nominal")}
                      </button>
                    </div>

                    <p className="mt-2.5 text-xs font-normal leading-relaxed text-fg-muted border-t border-[#F0B90B]/20 pt-2.5">
                      {lang === "en" ? (
                        <>The <span className="font-semibold text-fg">decimal unique code (+{usdtDecimalUnique.toFixed(4)})</span> is included in the total above. Please transfer exactly <span className="font-semibold text-fg">{totalUsdt} USDT/USD</span> for automatic verification.</>
                      ) : lang === "zh" ? (
                        <>上方总额已包含 <span className="font-semibold text-fg">唯一识别码 (+{usdtDecimalUnique.toFixed(4)})</span>。请准确转入 <span className="font-semibold text-fg">{totalUsdt} USDT/USD</span> 以便系统自动核对。</>
                      ) : (
                        <><span className="font-semibold text-fg">Kode unik desimal (+{usdtDecimalUnique.toFixed(4)})</span> sudah termasuk dalam total di atas. Transfer persis <span className="font-semibold text-fg">{totalUsdt} USDT/USD</span> agar pesanan Anda langsung diproses otomatis.</>
                      )}
                    </p>
                  </div>

                  {/* Binance Pay ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase text-fg-muted">
                      {lang === "en" ? "Binance Pay ID / User ID" : lang === "zh" ? "币安支付 ID / 用户 ID" : "Binance Pay ID Penerima"}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value="1275129025"
                        className="font-mono text-sm font-bold bg-surface"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => copyAddress("1275129025")}
                        className="shrink-0"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied
                          ? (lang === "en" ? "Copied" : lang === "zh" ? "已复制" : "Tersalin")
                          : (lang === "en" ? "Copy ID" : lang === "zh" ? "复制 ID" : "Salin ID")}
                      </Button>
                    </div>
                  </div>

                  {/* QR Code Binance Pay */}
                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-white p-3 shadow-sm">
                      <img
                        src="/binance.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/binance-qr.png";
                        }}
                        alt="Binance Pay QR Code"
                        className="h-56 w-56 object-contain"
                      />
                    </div>
                    <p className="max-w-xs text-center text-xs font-medium leading-relaxed text-fg-muted">
                      {lang === "en" ? (
                        <>Open <span className="font-bold text-fg">Binance App</span> &gt; Scan the QR code above or send to Pay ID <span className="font-bold text-fg font-mono">1275129025</span> with exact amount <span className="font-bold text-fg font-mono">${totalUsdt}</span>.</>
                      ) : lang === "zh" ? (
                        <>打开 <span className="font-bold text-fg">币安 Binance App</span> 扫一扫上方二维码，或转账至币安支付 ID <span className="font-bold text-fg font-mono">1275129025</span>，金额 <span className="font-bold text-fg font-mono">${totalUsdt}</span>。</>
                      ) : (
                        <>Buka aplikasi <span className="font-bold text-fg">Binance</span> &gt; Scan QR di atas atau kirim ke Pay ID <span className="font-bold text-fg font-mono">1275129025</span> sejumlah <span className="font-bold text-fg font-mono">${totalUsdt}</span>.</>
                      )}
                    </p>

                    <div className="w-full pt-1">
                      {binanceDone ? (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={18} /> {lang === "en" ? "Your Binance Pay payment has been recorded." : lang === "zh" ? "您的币安支付已记录。" : "Pembayaran Binance Pay Anda tercatat."}
                        </div>
                      ) : (
                        <Button size="lg" className="w-full h-13 text-base font-bold bg-[#F0B90B] hover:bg-[#e0ac07] text-[#181A20] shadow-[var(--elev-2)]" onClick={() => setBinanceDone(true)}>
                          {lang === "en" ? "I Have Paid with Binance Pay" : lang === "zh" ? "我已完成币安支付" : "Saya Sudah Bayar via Binance"}
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : paymentMethod === "qris" ? (
                <>
                  <div className="rounded-2xl border border-border/70 bg-surface-2/70 p-4 sm:p-5">
                    <p className="text-xs font-medium uppercase text-fg-muted">
                      {lang === "en" ? "Total amount to pay" : lang === "zh" ? "应付总额" : "Total yang harus dibayar"}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-accent tabular-nums">
                        {formatPrice(totalBayar, lang)}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyAmount(totalBayar)}
                        className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg shadow-sm hover:bg-accent-hover active:scale-95"
                      >
                        {isAmountCopied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
                        {isAmountCopied
                          ? (lang === "en" ? "Copied!" : lang === "zh" ? "已复制!" : "Disalin!")
                          : (lang === "en" ? "Copy Amount" : lang === "zh" ? "复制金额" : "Salin Nominal")}
                      </button>
                    </div>
                    <p className="mt-2.5 text-xs font-normal leading-relaxed text-fg-muted border-t border-border/50 pt-2.5">
                      {lang === "en" ? (
                        <>The <span className="font-semibold text-fg">unique code {uniqueCode}</span> is included in the total above. Please pay this exact total for automatic verification.</>
                      ) : lang === "zh" ? (
                        <>上方总额已包含 <span className="font-semibold text-fg">验证码 {uniqueCode}</span>。请务必支付精确金额，以便系统自动确认。</>
                      ) : (
                        <><span className="font-semibold text-fg">Kode unik {uniqueCode}</span> sudah termasuk di nominal di atas — bayar persis sejumlah itu agar pesanan mudah dikenali dan diproses otomatis oleh robot SerbaPremium.</>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-white p-3 shadow-sm">
                      <img
                        src="/qris.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                        }}
                        alt="QRIS"
                        className="h-56 w-56 object-contain"
                      />
                    </div>
                    <p className="max-w-xs text-center text-xs font-medium leading-relaxed text-fg-muted">
                      {lang === "en" ? (
                        <>Scan the QRIS above, pay the exact amount of <span className="font-bold text-fg">{formatPrice(totalBayar, lang)}</span>, then click the button below.</>
                      ) : lang === "zh" ? (
                        <>扫描上方 QRIS 二维码，支付准确金额 <span className="font-bold text-fg">{formatPrice(totalBayar, lang)}</span>，然后点击下方按钮。</>
                      ) : (
                        <>Pindai QRIS di atas, bayar sesuai nominal <span className="font-bold text-fg">{formatPrice(totalBayar, lang)}</span>, lalu tekan tombol di bawah.</>
                      )}
                    </p>

                    <div className="w-full pt-1">
                      {qrisDone ? (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={18} /> {lang === "en" ? "Your payment has been recorded." : lang === "zh" ? "您的付款已记录。" : "Pembayaran Anda tercatat."}
                        </div>
                      ) : (
                        <Button size="lg" className="w-full h-13 text-base font-bold shadow-[var(--elev-2)]" onClick={() => setQrisDone(true)}>
                          {lang === "en" ? "I Have Paid" : lang === "zh" ? "我已完成支付" : "Saya Sudah Bayar"}
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-border/70 bg-surface-2/70 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase text-fg-muted">
                        {lang === "en" ? "Total USDT amount to send" : lang === "zh" ? "应付 USDT 数量" : "Total USDT yang harus dikirim"}
                      </p>
                      <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                        {lang === "en" ? "1 USDT ≈ 1 USD" : lang === "zh" ? "1 USDT ≈ 1 USD" : "1 USDT ≈ Rp 16.000"}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-accent tabular-nums">
                          {totalUsdt} <span className="text-lg font-bold text-fg">USDT</span>
                        </p>
                        <p className="text-xs font-medium text-fg-muted mt-0.5">
                          {lang === "en" ? `≈ $${totalUsdt.toFixed(2)} USD` : lang === "zh" ? `≈ $${totalUsdt.toFixed(2)} USD` : `≈ $${totalUsdt.toFixed(2)} USD (Rp ${subtotal.toLocaleString("id-ID")})`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyAmount(totalUsdt)}
                        className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg shadow-sm hover:bg-accent-hover active:scale-95"
                      >
                        {isAmountCopied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
                        {isAmountCopied
                          ? (lang === "en" ? "Copied!" : lang === "zh" ? "已复制!" : "Disalin!")
                          : (lang === "en" ? "Copy Amount" : lang === "zh" ? "复制金额" : "Salin Nominal")}
                      </button>
                    </div>

                    <p className="mt-2.5 text-xs font-normal leading-relaxed text-fg-muted border-t border-border/50 pt-2.5">
                      {lang === "en" ? (
                        <>The <span className="font-semibold text-fg">decimal unique code (+{usdtDecimalUnique.toFixed(4)} USDT)</span> is included in the total. Please transfer exactly <span className="font-semibold text-fg">{totalUsdt} USDT</span> for automated verification.</>
                      ) : lang === "zh" ? (
                        <>上方总额已包含 <span className="font-semibold text-fg">识别码 (+{usdtDecimalUnique.toFixed(4)} USDT)</span>。请准确转入 <span className="font-semibold text-fg">{totalUsdt} USDT</span> 以便系统自动核对。</>
                      ) : (
                        <><span className="font-semibold text-fg">Kode unik desimal (+{usdtDecimalUnique.toFixed(4)} USDT)</span> sudah termasuk dalam nominal di atas. Transfer persis <span className="font-semibold text-fg">{totalUsdt} USDT</span> agar sistem otomatis mengenali transfer Anda.</>
                      )}
                    </p>
                  </div>

                  {/* 1. Detail Jaringan & Alamat Wallet di ATAS */}
                  <div className="space-y-3.5">
                    <div>
                      <p className="text-xs font-medium uppercase text-fg-muted">
                        {lang === "en" ? "Transfer Network" : lang === "zh" ? "转账网络 (Network)" : "Jaringan Transfer (Network)"}
                      </p>
                      <p className="mt-1 font-mono text-sm font-semibold text-fg bg-surface px-3.5 py-2.5 rounded-xl border border-border">
                        {PAYMENT_INFO[paymentMethod].network}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-fg-muted">
                        {lang === "en" ? "Recipient Wallet Address" : lang === "zh" ? "收款钱包地址" : "Alamat Wallet Penerima"}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Input
                          readOnly
                          value={PAYMENT_INFO[paymentMethod].address ?? ""}
                          className="font-mono text-xs font-medium bg-surface"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => copyAddress(PAYMENT_INFO[paymentMethod].address ?? "")}
                          className="shrink-0"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied
                            ? (lang === "en" ? "Copied" : lang === "zh" ? "已复制" : "Tersalin")
                            : (lang === "en" ? "Copy" : lang === "zh" ? "复制" : "Salin")}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 2. QR Code Alamat Wallet USD / USDT di BAWAH */}
                  <div className="flex flex-col items-center gap-3 pt-2 pb-1 border-t border-border/60">
                    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-white p-3 shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(PAYMENT_INFO[paymentMethod].address ?? "")}&margin=10`}
                        alt={`QR Code Wallet ${PAYMENT_INFO[paymentMethod].badge}`}
                        className="h-52 w-52 object-contain"
                      />
                    </div>
                    <p className="max-w-xs text-center text-xs font-medium leading-relaxed text-fg-muted">
                      {lang === "en"
                        ? "Scan the QR code above using your crypto wallet (Binance, Trust Wallet, MetaMask, TronLink, OKX) or send directly to the copied address."
                        : lang === "zh"
                        ? "使用您的加密货币钱包（Binance、Trust Wallet、MetaMask、TronLink、OKX）扫描上方二维码，或转账至已复制的地址。"
                        : "Pindai QR di atas menggunakan aplikasi wallet crypto Anda (Binance, Trust Wallet, MetaMask, TronLink, OKX) atau transfer ke alamat yang telah disalin."}
                    </p>
                  </div>

                  {/* 3. Tombol Konfirmasi Pembayaran */}
                  <div className="pt-1">
                    {usdtDone ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={18} /> {lang === "en" ? "Your USDT transfer has been recorded." : lang === "zh" ? "您的 USDT 转账已记录。" : "Transfer USDT Anda tercatat."}
                      </div>
                    ) : (
                      <Button size="lg" className="w-full h-13 text-base font-bold shadow-[var(--elev-2)]" onClick={() => setUsdtDone(true)}>
                        {lang === "en" ? "I Have Transferred USDT" : lang === "zh" ? "我已转账 USDT" : "Saya Sudah Transfer USDT"}
                      </Button>
                    )}
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-discount/30 bg-discount-soft p-3 text-xs font-semibold text-discount">
                  <AlertCircle size={15} /> {errorMessage}
                </div>
              )}

              {/* Tombol Aksi Bawah */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep(1)} className="w-full sm:w-1/3 h-14 text-sm font-bold">
                  {lang === "en" ? "← Back" : lang === "zh" ? "← 返回" : "← Kembali"}
                </Button>
                <Button size="lg" onClick={finishCheckout} disabled={loading} className="w-full sm:flex-1 h-14 text-base sm:text-lg font-bold shadow-[var(--elev-2)]">
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
