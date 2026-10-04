"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  Check,
  Copy,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Clock,
  Sparkles,
  QrCode,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice, formatRupiah, USDT_RATE } from "@/lib/utils";
import { useCart, useAuth } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/form";

import { supabase, supabaseReady } from "@/lib/supabase";

type PaymentMethod = "qris" | "usdt_bnb" | "usdt_tron" | "solana" | "ton";

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

interface BorderPayData {
  id: string;
  reference_id: string;
  status: string;
  amount: number;
  customer_pays: number;
  pay_url: string;
  qr_string: string;
  expires_at: string;
}

const PAYMENT_INFO: Record<
  PaymentMethod,
  {
    name: { id: string; en: string; zh: string };
    badge: { id: string; en: string; zh: string };
    icon: string;
    network?: string;
    address?: string;
  }
> = {
  qris: {
    name: {
      id: "QRIS Otomatis (Semua Bank & E-Wallet)",
      en: "Automated QRIS (Indonesian Banks & E-Wallets)",
      zh: "QRIS 自动扫码支付（印尼所有银行与电子钱包）",
    },
    badge: {
      id: "IDR QRIS Otomatis",
      en: "Automated QRIS",
      zh: "QRIS 自动扫码",
    },
    icon: "/logos/qris-icon.svg",
  },
  usdt_bnb: {
    name: {
      id: "BNB / USDT (BNB Smart Chain BEP-20)",
      en: "BNB / USDT (BNB Smart Chain BEP-20)",
      zh: "BNB / USDT（BNB 智能链 BEP-20）",
    },
    badge: {
      id: "BNB BEP-20",
      en: "BNB BEP-20",
      zh: "BNB BEP-20",
    },
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
    badge: {
      id: "TRON TRC-20",
      en: "TRON TRC-20",
      zh: "TRON TRC-20",
    },
    icon: "/logos/tron.svg",
    network: "Tron (TRC-20)",
    address: "TQTpRn6j1Pfwf38xP8CxqxJi18YX4v8Wcm",
  },
  solana: {
    name: {
      id: "Solana / SOL (Solana SPL Network)",
      en: "Solana / SOL (Solana SPL Network)",
      zh: "Solana / SOL（Solana 网络）",
    },
    badge: {
      id: "SOLANA SOL",
      en: "SOLANA SOL",
      zh: "SOLANA SOL",
    },
    icon: "/logos/solana.svg",
    network: "Solana (SPL)",
    address: "7JKwQ81LiXgKw4ekSCurNeqXk3jYv3vDMJcDyCLyW64Y",
  },
  ton: {
    name: {
      id: "TON / GRAM (The Open Network)",
      en: "TON / GRAM (The Open Network)",
      zh: "TON / GRAM（The Open Network）",
    },
    badge: {
      id: "TON / GRAM",
      en: "TON / GRAM",
      zh: "TON / GRAM",
    },
    icon: "/logos/ton.svg",
    network: "The Open Network (TON)",
    address: "UQA2ka2a3umUuzmr3ymBM6x7FV3DZOLQ92fRsS_KdElex77P",
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
  const { lang } = useTranslation();

  // Ambil parameter jika user klik "Beli Sekarang" dari halaman detail
  const initialSlug = propInitialSlug || searchParams.get("app") || undefined;
  const customPrice =
    propCustomPrice !== undefined
      ? propCustomPrice
      : searchParams.get("price")
      ? Number(searchParams.get("price"))
      : undefined;
  const customTitle = propCustomTitle || searchParams.get("title") || undefined;
  const customPlatform =
    propCustomPlatform || searchParams.get("platform") || undefined;

  // Step 1: Info Pembeli & Metode Pembayaran | Step 2: Bayar (QRIS / USDT / Binance)
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");

  const [orderId, setOrderId] = useState<string>(
    () => `TK-${Date.now().toString().slice(-6)}`
  );

  const [loading, setLoading] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAmountCopied, setIsAmountCopied] = useState(false);
  const [isQrCopied, setIsQrCopied] = useState(false);
  const [qrisDone, setQrisDone] = useState(false);
  const [usdtDone, setUsdtDone] = useState(false);
  const [txId, setTxId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // BorderPay QRIS Gateway State
  const [borderpayData, setBorderpayData] = useState<BorderPayData | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const [uniqueCode] = useState(() => Math.floor(Math.random() * 800 + 100));

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user, name, email]);

  let itemsToCheckout: CheckoutItem[] = [];
  if (customTitle && customPrice !== undefined) {
    itemsToCheckout = [
      {
        id: initialSlug || "custom-item",
        name: customTitle,
        price: customPrice,
        platform: customPlatform || "Digital",
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
          platform: app.platforms[0] || "Universal",
        },
      ];
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
  const baseUsd = subtotal / USDT_RATE;
  const usdtDecimalUnique = (uniqueCode % 100) / 10000;
  const totalUsdt = Number((baseUsd + usdtDecimalUnique).toFixed(4));
  // Jika BorderPay QRIS aktif, pakai subtotal langsung (BorderPay dynamic QR sudah spesifik)
  const totalBayar =
    paymentMethod === "qris"
      ? borderpayData
        ? borderpayData.customer_pays
        : subtotal + (uniqueCode % 1000)
      : subtotal;

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

  const copyQrString = (qr: string) => {
    navigator.clipboard.writeText(qr);
    setIsQrCopied(true);
    setTimeout(() => setIsQrCopied(false), 2000);
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

  // Generate BorderPay Payment on Step 1 -> Step 2
  const createBorderPayPayment = async (currentOrderId: string) => {
    try {
      const res = await fetch("/api/payments/borderpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: subtotal,
          reference_id: currentOrderId,
          customer_name: name.trim(),
          customer_email: email.trim(),
        }),
      });

      const json = await res.json();
      if (json.ok && json.data) {
        setBorderpayData(json.data);
        return json.data as BorderPayData;
      } else {
        console.warn("BorderPay error:", json.error);
        return null;
      }
    } catch (err) {
      console.error("Failed to connect to BorderPay API:", err);
      return null;
    }
  };

  const checkPaymentStatusManual = useCallback(
    async (silent = false) => {
      if (!borderpayData?.reference_id && !orderId) return;
      const refId = borderpayData?.reference_id || orderId;

      if (!silent) setCheckingStatus(true);
      try {
        const res = await fetch(
          `/api/payments/borderpay/status?id=${encodeURIComponent(refId)}`
        );
        const json = await res.json();

        if (json.ok && json.status === "paid") {
          setPaymentVerified(true);
          setQrisDone(true);
          if (!silent) {
            setStatusMessage(
              lang === "en"
                ? "Payment received! Redirecting..."
                : lang === "zh"
                ? "支付成功！正在跳转..."
                : "Pembayaran Berhasil! Mengalihkan..."
            );
          }
          // Simpan order dan redirect
          setTimeout(() => {
            finishCheckout("lunas");
          }, 1200);
        } else {
          if (!silent) {
            setStatusMessage(
              lang === "en"
                ? "Payment not yet detected. Please complete transfer."
                : lang === "zh"
                ? "尚未检测到付款，请完成扫码转账。"
                : "Pembayaran belum terdeteksi. Silakan scan dan bayar QRIS."
            );
            setTimeout(() => setStatusMessage(null), 3500);
          }
        }
      } catch (err) {
        if (!silent) {
          setStatusMessage("Gagal memeriksa status. Coba sesaat lagi.");
          setTimeout(() => setStatusMessage(null), 3000);
        }
      } finally {
        if (!silent) setCheckingStatus(false);
      }
    },
    [borderpayData, orderId, lang]
  );

  // Polling status secara otomatis tiap 3.5 detik saat di Step 2 dan QRIS
  useEffect(() => {
    if (
      step === 2 &&
      paymentMethod === "qris" &&
      borderpayData?.reference_id &&
      !paymentVerified
    ) {
      pollingRef.current = setInterval(() => {
        checkPaymentStatusManual(true);
      }, 3500);

      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
      };
    }
  }, [step, paymentMethod, borderpayData, paymentVerified, checkPaymentStatusManual]);

  // Countdown timer expiration
  useEffect(() => {
    if (borderpayData?.expires_at) {
      const targetTime = new Date(borderpayData.expires_at).getTime();

      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
        setTimeLeft(diff);
      };

      updateTimer();
      const timerInterval = setInterval(updateTimer, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [borderpayData]);

  const goNext = async () => {
    if (!validateForm()) return;
    setErrorMessage("");
    setStepLoading(true);

    const newOrderId = `TK-${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);

    if (paymentMethod === "qris") {
      // Create live BorderPay QRIS
      const bpData = await createBorderPayPayment(newOrderId);
      if (!bpData) {
        // Fallback jika API sedang gangguan
        console.warn("Proceeding with standard QRIS display");
      }
    }

    setStepLoading(false);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishCheckout = async (forcedStatus?: string) => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    const effectiveStatus =
      forcedStatus ||
      (paymentVerified ? "lunas" : qrisDone || usdtDone ? "menunggu" : "menunggu");

    const currentOrderId = borderpayData?.reference_id || orderId;

    const orderData = {
      id: currentOrderId,
      user_name: name.trim() || "Pelanggan",
      items: itemsToCheckout,
      subtotal,
      discount: 0,
      total: totalBayar,
      payment_method: paymentMethod,
      payment_status: effectiveStatus,
      order_status: effectiveStatus === "lunas" ? "diproses" : "menunggu",
      tx_id: txId.trim() || borderpayData?.id || undefined,
      txId: txId.trim() || borderpayData?.id || undefined,
      borderpay_id: borderpayData?.id || undefined,
      pay_url: borderpayData?.pay_url || undefined,
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      sessionStorage.setItem("tokono:last-order", JSON.stringify(orderData));
      sessionStorage.setItem("serbapremium:last-order", JSON.stringify(orderData));
      const raw =
        localStorage.getItem("tokono:orders") ||
        localStorage.getItem("serbapremium:orders") ||
        "[]";
      const existing = JSON.parse(raw);
      const list = Array.isArray(existing) ? existing : [];
      const updated = [
        orderData,
        ...list.filter((o: any) => o.id !== currentOrderId),
      ];
      localStorage.setItem("tokono:orders", JSON.stringify(updated));
      localStorage.setItem("serbapremium:orders", JSON.stringify(updated));
    } catch {
      /* ignore storage full */
    }

    try {
      if (supabaseReady) {
        await supabase.from("orders").insert([
          {
            id: currentOrderId,
            user_name: name.trim() || "Pelanggan",
            items: itemsToCheckout,
            subtotal,
            discount: 0,
            total: totalBayar,
            payment_method: paymentMethod,
            payment_status: effectiveStatus,
            order_status: effectiveStatus === "lunas" ? "diproses" : "menunggu",
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

    router.push(
      `/pembayaran/berhasil?orderId=${currentOrderId}${
        effectiveStatus === "lunas" ? "&status=lunas" : ""
      }`
    );
  };

  const steps = [
    {
      num: 1,
      label:
        lang === "en"
          ? "Information & Method"
          : lang === "zh"
          ? "信息与支付方式"
          : "Info & Metode",
    },
    {
      num: 2,
      label:
        lang === "en"
          ? "Payment & QRIS"
          : lang === "zh"
          ? "支付与扫码"
          : "Pembayaran & QRIS",
    },
  ];

  if (itemsToCheckout.length === 0) {
    return (
      <div className="tk-container py-24 text-center">
        <div className="mx-auto max-w-md glass-card rounded-2xl p-8 border border-border/80">
          <p className="text-lg font-bold text-fg">
            Keranjang belanja Anda masih kosong
          </p>
          <p className="mt-2 text-sm text-fg-muted">
            Pilih produk atau lisensi yang ingin Anda beli terlebih dahulu.
          </p>
          <Button
            className="mt-6 rounded-full"
            onClick={() => router.push("/aplikasi")}
          >
            Jelajahi Aplikasi
          </Button>
        </div>
      </div>
    );
  }

  // Format countdown mm:ss
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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
              {i < steps.length - 1 && (
                <span className="text-fg-faint text-xs">→</span>
              )}
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
                  {lang === "en"
                    ? "STEP 1"
                    : lang === "zh"
                    ? "步骤 1"
                    : "LANGKAH 1"}
                </span>
                <h2 className="mt-1 text-base sm:text-xl font-bold tracking-tight text-fg">
                  {lang === "en"
                    ? "Buyer Information & Payment Method"
                    : lang === "zh"
                    ? "选择付款方式与填写信息"
                    : "Informasi Pembeli & Metode Pembayaran"}
                </h2>
              </div>

              {/* Ringkasan Singkat Produk & Total */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-2/70 p-3.5 sm:p-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-fg-muted uppercase">
                    {lang === "en" ? "Product" : lang === "zh" ? "商品" : "Produk"}
                  </p>
                  <p className="truncate text-xs sm:text-sm font-semibold text-fg">
                    {itemsToCheckout[0]?.name || "Item Digital"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-medium text-fg-muted uppercase">
                    {lang === "en" ? "Total" : lang === "zh" ? "总计" : "Total"}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-accent tabular-nums">
                    {paymentMethod === "qris"
                      ? formatPrice(subtotal, lang)
                      : `$${baseUsd.toFixed(2)}`}
                  </p>
                </div>
              </div>

              {/* Pilihan Metode Pembayaran */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                  {lang === "en"
                    ? "Select Payment Method"
                    : lang === "zh"
                    ? "选择付款方式"
                    : "Metode Pembayaran"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {(
                    [
                      "qris",
                      "usdt_bnb",
                      "usdt_tron",
                      "solana",
                      "ton",
                    ] as PaymentMethod[]
                  ).map((method) => {
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
                              alt={info.badge[lang as 'en' | 'id' | 'zh'] || info.badge.en}
                              className="h-6 w-6 rounded-md object-contain border border-border/40 bg-white p-0.5 shadow-xs"
                            />
                            <span className="text-xs font-bold uppercase tracking-tight">
                              {info.badge[lang as 'en' | 'id' | 'zh'] || info.badge.en}
                            </span>
                          </div>
                          {active && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-fg shadow-xs">
                              <Check size={12} strokeWidth={2.5} />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-fg-muted line-clamp-2">
                          {info.name[lang as "id" | "en" | "zh"] || info.name.id}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Form */}
              <div className="space-y-4 pt-2 border-t border-border/70">
                <Field
                  label={
                    lang === "en"
                      ? "Full Name"
                      : lang === "zh"
                      ? "姓名"
                      : "Nama Lengkap"
                  }
                  htmlFor="nama-lengkap"
                >
                  <Input
                    id="nama-lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      lang === "en"
                        ? "Your full name"
                        : lang === "zh"
                        ? "您的姓名"
                        : "Nama Anda"
                    }
                    autoComplete="name"
                  />
                </Field>

                <Field
                  label={
                    lang === "en"
                      ? "Email Address (Account/License delivery)"
                      : lang === "zh"
                      ? "电子邮箱（接收授权与凭据）"
                      : "Alamat Email (Pengiriman Lisensi/Akun)"
                  }
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
                  label={
                    lang === "en"
                      ? "WhatsApp / Phone (Optional)"
                      : lang === "zh"
                      ? "手机号 / WhatsApp（选填）"
                      : "No. HP / WhatsApp (Opsional)"
                  }
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
                <Button
                  size="lg"
                  onClick={goNext}
                  disabled={stepLoading || loading}
                  loading={stepLoading}
                  className="w-full sm:w-auto h-13 sm:h-12 px-8 text-base font-bold shadow-[var(--elev-2)]"
                >
                  {stepLoading
                    ? lang === "en"
                      ? "Generating Payment Gateway…"
                      : lang === "zh"
                      ? "正在生成专属支付账单…"
                      : "Membuat QRIS Otomatis…"
                    : lang === "en"
                    ? "Proceed to Payment"
                    : lang === "zh"
                    ? "前往付款"
                    : "Lanjut ke Pembayaran"}
                  {!stepLoading && <ArrowRight size={18} strokeWidth={2.5} />}
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: DETAIL PEMBAYARAN, QRIS / BINANCE / USDT */
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border/70 pb-3.5">
                <div className="flex items-center gap-3">
                  <img
                    src={PAYMENT_INFO[paymentMethod].icon}
                    alt={PAYMENT_INFO[paymentMethod].badge[lang as 'en' | 'id' | 'zh'] || PAYMENT_INFO[paymentMethod].badge.en}
                    className="h-8 w-8 rounded-lg object-contain border border-border/40 bg-white p-0.5 shadow-xs"
                  />
                  <div>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">
                      {PAYMENT_INFO[paymentMethod].badge[lang as 'en' | 'id' | 'zh'] || PAYMENT_INFO[paymentMethod].badge.en}
                    </span>
                    <h2 className="mt-0.5 text-base sm:text-lg font-bold tracking-tight text-fg">
                      {paymentMethod === "qris"
                        ? lang === "en"
                          ? "Instant Dynamic QRIS"
                          : lang === "zh"
                          ? "实时动态 QRIS 扫码"
                          : "QRIS Otomatis Instan"
                        : lang === "en"
                        ? `${PAYMENT_INFO[paymentMethod].badge.en} Payment`
                        : lang === "zh"
                        ? `${PAYMENT_INFO[paymentMethod].badge.zh} 付款`
                        : `Pembayaran ${PAYMENT_INFO[paymentMethod].badge.id}`}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-fg-muted hover:text-fg underline"
                >
                  {lang === "en"
                    ? "← Change Info"
                    : lang === "zh"
                    ? "← 修改信息"
                    : "← Ubah Data"}
                </button>
              </div>

              {/* QRIS SECTION */}
              {paymentMethod === "qris" ? (
                <>
                  {/* Status Banner */}
                  {paymentVerified ? (
                    <div className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 animate-fade-in">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                          <Check size={20} strokeWidth={3} />
                        </span>
                        <div>
                          <p className="text-sm font-bold">
                            {lang === "en"
                              ? "Payment Verified Successfully!"
                              : lang === "zh"
                              ? "支付已自动核验成功！"
                              : "Pembayaran Berhasil Diverifikasi Otomatis!"}
                          </p>
                          <p className="text-xs opacity-80">
                            {lang === "en"
                              ? "Your order is being processed."
                              : lang === "zh"
                              ? "您的订单正在处理中。"
                              : "Pesanan Anda langsung diproses otomatis."}
                          </p>
                        </div>
                      </div>
                      <Sparkles size={22} className="shrink-0 animate-pulse text-emerald-500" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-border/70 bg-surface-2/70 p-4 sm:p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium uppercase text-fg-muted">
                          Nominal yang Harus Dibayar (Termasuk Kode Unik)
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {lang === "en"
                            ? "Auto Verified 24/7"
                            : lang === "zh"
                            ? "24/7 自动入账"
                            : "Verifikasi Otomatis 24/7"}
                        </span>
                      </div>

                      <div className="mt-1 flex items-baseline justify-between gap-2">
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-accent tabular-nums">
                          {formatRupiah(totalBayar)}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyAmount(totalBayar)}
                          className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg shadow-sm hover:bg-accent-hover active:scale-95"
                        >
                          {isAmountCopied ? (
                            <Check size={12} strokeWidth={2.5} />
                          ) : (
                            <Copy size={12} strokeWidth={2} />
                          )}
                          {isAmountCopied ? "Disalin!" : "Salin Nominal"}
                        </button>
                      </div>

                      {/* Order Ref & Timer */}
                      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-fg-muted">
                        <span className="font-mono font-medium">
                          Ref:{" "}
                          <span className="text-fg font-bold">
                            {borderpayData?.reference_id || orderId}
                          </span>
                        </span>
                        {timeLeft !== null && (
                          <span
                            className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
                              timeLeft <= 120
                                ? "text-rose-500"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            <Clock size={13} />
                            {lang === "en" ? "Expires in:" : "Berlaku:"}{" "}
                            {formatTimer(timeLeft)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* QRIS Image & Scan Frame */}
                  <div className="mt-3 text-center text-xs font-bold text-accent">
                    Pastikan transfer nominal sesuai hingga 3 digit terakhir (kode unik) agar saldo otomatis masuk.
                  </div>
                  <div className="flex flex-col items-center gap-3.5 py-1">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-accent/30 bg-white p-3.5 shadow-md text-center">
                      <div className="mb-2 flex items-center justify-center gap-2 border-b border-gray-200 pb-1.5">
                        <img
                          src="/logos/qris-icon.svg"
                          alt="QRIS"
                          className="h-5 object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                        <span className="text-[11px] font-bold text-gray-800 tracking-wider">
                          QRIS STANDAR NASIONAL
                        </span>
                      </div>

                      <div className="relative flex items-center justify-center">
                        <img
                          src={
                            borderpayData?.qr_string
                              ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
                                  borderpayData.qr_string
                                )}&margin=8`
                              : "/qris.png"
                          }
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/qris-placeholder.svg";
                          }}
                          alt="QRIS Standar Nasional"
                          className="h-56 w-56 sm:h-60 sm:w-60 object-contain rounded-lg"
                        />

                        {paymentVerified && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 rounded-lg backdrop-blur-xs">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                              <Check size={36} strokeWidth={3} />
                            </span>
                            <p className="mt-2 text-sm font-bold text-gray-900">
                              LUNAS
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR String Copy & Link */}
                    {borderpayData && (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {borderpayData.qr_string && (
                          <button
                            type="button"
                            onClick={() => copyQrString(borderpayData.qr_string)}
                            className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-surface px-3 py-1 text-xs font-semibold text-fg hover:bg-surface-2 transition-colors"
                          >
                            <QrCode size={13} />
                            {isQrCopied ? "QR String Disalin!" : "Salin QR String"}
                          </button>
                        )}
                        {borderpayData.pay_url && (
                          <a
                            href={borderpayData.pay_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                          >
                            <ExternalLink size={13} />
                            {lang === "en"
                              ? "Open Payment Page"
                              : lang === "zh"
                              ? "打开支付页面"
                              : "Buka Halaman Pembayaran"}
                          </a>
                        )}
                      </div>
                    )}

                    <p className="max-w-xs text-center text-xs font-medium leading-relaxed text-fg-muted">
                      Pindai QRIS di atas dengan m-Banking / e-Wallet (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay). Sistem{" "}
                      <span className="font-bold text-fg">
                        langsung memverifikasi otomatis
                      </span>
                      .
                    </p>

                    {/* Status Feedback */}
                    {statusMessage && (
                      <div className="w-full rounded-xl border border-accent/40 bg-accent/10 p-3 text-center text-xs font-semibold text-fg animate-fade-in">
                        {statusMessage}
                      </div>
                    )}

                    {/* Action Controls for QRIS */}
                    <div className="w-full pt-1 space-y-2.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        disabled={checkingStatus || paymentVerified}
                        loading={checkingStatus}
                        onClick={() => checkPaymentStatusManual(false)}
                        className="w-full h-12 text-sm font-bold border-border"
                      >
                        <RefreshCw size={16} className={checkingStatus ? "animate-spin" : ""} />
                        {checkingStatus
                          ? lang === "en"
                            ? "Checking status…"
                            : "Sedang mengecek status…"
                          : lang === "en"
                          ? "Check Payment Status Now"
                          : "Cek Status Pembayaran Sekarang"}
                      </Button>

                      {qrisDone ? (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={18} />{" "}
                            Pembayaran Anda sedang kami proses.
                        </div>
                      ) : (
                        <Button
                          size="lg"
                          className="w-full h-13 text-base font-bold shadow-[var(--elev-2)]"
                          onClick={() => finishCheckout("menunggu")}
                          disabled={loading}
                          loading={loading}
                        >
                          Saya Sudah Bayar / Selesaikan Pesanan
                        </Button>
                      )}
                    </div>
                  </div>
                </>

              ) : (
                /* USDT BEP20 / TRC20 SECTION */
                <>
                  <div className="rounded-2xl border border-border/70 bg-surface-2/70 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase text-fg-muted">
                        {lang === "en"
                          ? "Total USDT amount to send"
                          : lang === "zh"
                          ? "应付 USDT 数量"
                          : "Total USDT yang harus dikirim"}
                      </p>
                      <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                        {lang === "en"
                          ? "1 USDT ≈ 1 USD"
                          : lang === "zh"
                          ? "1 USDT ≈ 1 USD"
                          : "1 USDT ≈ Rp 16.000"}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-accent tabular-nums">
                          {totalUsdt} <span className="text-lg font-bold text-fg">USDT</span>
                        </p>
                        <p className="text-xs font-medium text-fg-muted mt-0.5">
                          {lang === "en"
                            ? `≈ $${totalUsdt.toFixed(2)} USD`
                            : lang === "zh"
                            ? `≈ $${totalUsdt.toFixed(2)} USD`
                            : `≈ $${totalUsdt.toFixed(2)} USD (Rp ${subtotal.toLocaleString("id-ID")})`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyAmount(totalUsdt)}
                        className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg shadow-sm hover:bg-accent-hover active:scale-95"
                      >
                        {isAmountCopied ? (
                          <Check size={12} strokeWidth={2.5} />
                        ) : (
                          <Copy size={12} strokeWidth={2} />
                        )}
                        {isAmountCopied
                          ? lang === "en"
                            ? "Copied!"
                            : lang === "zh"
                            ? "已复制!"
                            : "Disalin!"
                          : lang === "en"
                          ? "Copy Amount"
                          : lang === "zh"
                          ? "复制金额"
                          : "Salin Nominal"}
                      </button>
                    </div>

                    <p className="mt-2.5 text-xs font-normal leading-relaxed text-fg-muted border-t border-border/50 pt-2.5">
                      {lang === "en" ? (
                        <>
                          The{" "}
                          <span className="font-semibold text-fg">
                            decimal unique code (+{usdtDecimalUnique.toFixed(4)} USDT)
                          </span>{" "}
                          is included in the total. Please transfer exactly{" "}
                          <span className="font-semibold text-fg">
                            {totalUsdt} USDT
                          </span>{" "}
                          for automated verification.
                        </>
                      ) : lang === "zh" ? (
                        <>
                          上方总额已包含{" "}
                          <span className="font-semibold text-fg">
                            识别码 (+{usdtDecimalUnique.toFixed(4)} USDT)
                          </span>
                          。请准确转入{" "}
                          <span className="font-semibold text-fg">
                            {totalUsdt} USDT
                          </span>{" "}
                          以便系统自动核对。
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-fg">
                            Kode unik desimal (+{usdtDecimalUnique.toFixed(4)} USDT)
                          </span>{" "}
                          sudah termasuk dalam nominal di atas. Transfer persis{" "}
                          <span className="font-semibold text-fg">
                            {totalUsdt} USDT
                          </span>{" "}
                          agar sistem otomatis mengenali transfer Anda.
                        </>
                      )}
                    </p>
                  </div>

                  {/* Detail Jaringan & Alamat Wallet */}
                  <div className="space-y-3.5">
                    <div>
                      <p className="text-xs font-medium uppercase text-fg-muted">
                        {lang === "en"
                          ? "Transfer Network"
                          : lang === "zh"
                          ? "转账网络 (Network)"
                          : "Jaringan Transfer (Network)"}
                      </p>
                      <p className="mt-1 font-mono text-sm font-semibold text-fg bg-surface px-3.5 py-2.5 rounded-xl border border-border">
                        {PAYMENT_INFO[paymentMethod].network}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-fg-muted">
                        {lang === "en"
                          ? "Recipient Wallet Address"
                          : lang === "zh"
                          ? "收款钱包地址"
                          : "Alamat Wallet Penerima"}
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
                          onClick={() =>
                            copyAddress(PAYMENT_INFO[paymentMethod].address ?? "")
                          }
                          className="shrink-0"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied
                            ? lang === "en"
                              ? "Copied"
                              : lang === "zh"
                              ? "已复制"
                              : "Tersalin"
                            : lang === "en"
                            ? "Copy"
                            : lang === "zh"
                            ? "复制"
                            : "Salin"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Alamat Wallet USD / USDT */}
                  <div className="flex flex-col items-center gap-3 pt-2 pb-1 border-t border-border/60">
                    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-white p-3 shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                          PAYMENT_INFO[paymentMethod].address ?? ""
                        )}&margin=10`}
                        alt={`QR Code Wallet ${PAYMENT_INFO[paymentMethod].badge[lang as 'en' | 'id' | 'zh'] || PAYMENT_INFO[paymentMethod].badge.en}`}
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

                  {/* Tombol Konfirmasi Pembayaran */}
                  <div className="pt-1 space-y-2.5">
                    <div className="w-full space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-fg-muted">
                        {lang === "en"
                          ? "Transaction Hash / TxID (Optional)"
                          : lang === "zh"
                          ? "交易哈希 / TxID（选填）"
                          : "Hash Transaksi / TxID (Opsional)"}
                      </label>
                      <Input
                        value={txId}
                        onChange={(e) => setTxId(e.target.value)}
                        placeholder={
                          lang === "en"
                            ? "Enter TxID / ID Hash..."
                            : lang === "zh"
                            ? "输入交易哈希 TxID..."
                            : "Masukkan TxID / ID Hash bukti transfer..."
                        }
                        className="bg-surface font-mono text-xs"
                      />
                    </div>

                    {usdtDone ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={18} />{" "}
                        {lang === "en"
                          ? "Your USDT transfer has been recorded."
                          : lang === "zh"
                          ? "您的 USDT 转账已记录。"
                          : "Transfer USDT Anda tercatat."}
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full h-13 text-base font-bold shadow-[var(--elev-2)]"
                        onClick={() => setUsdtDone(true)}
                      >
                        {lang === "en"
                          ? "I Have Transferred USDT"
                          : lang === "zh"
                          ? "我已转账 USDT"
                          : "Saya Sudah Transfer USDT"}
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
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-1/3 h-14 text-sm font-bold"
                >
                  {lang === "en" ? "← Back" : lang === "zh" ? "← 返回" : "← Kembali"}
                </Button>
                <Button
                  size="lg"
                  onClick={() => finishCheckout()}
                  disabled={loading}
                  className="w-full sm:flex-1 h-14 text-base sm:text-lg font-bold shadow-[var(--elev-2)]"
                >
                  {loading
                    ? lang === "en"
                      ? "Confirming Order…"
                      : lang === "zh"
                      ? "确认订单中…"
                      : "Mengonfirmasi Pesanan…"
                    : lang === "en"
                    ? "Complete Order"
                    : lang === "zh"
                    ? "完成订单"
                    : "Selesaikan Pembayaran"}
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
