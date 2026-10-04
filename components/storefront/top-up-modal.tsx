"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  RefreshCw,
  X,
  ExternalLink,
  QrCode,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { formatRupiah, cn, USDT_RATE } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { supabase, supabaseReady } from "@/lib/supabase";

const USD_RATE = USDT_RATE; // 17904 IDR sesuai kurs pasar real-time
const MIN_DEPOSIT_USD = 5;
const MIN_DEPOSIT_IDR = MIN_DEPOSIT_USD * USD_RATE; // 89,520

type DepositPaymentMethod = "qris" | "usdt_bnb" | "usdt_tron" | "solana" | "ton";

const PAYMENT_METHODS: {
  id: DepositPaymentMethod;
  name: { id: string; en: string; zh: string };
  desc: { id: string; en: string; zh: string };
  icon: string;
  network?: string;
  address?: string;
}[] = [
  {
    id: "qris",
    name: {
      id: "QRIS (Semua Bank & E-Wallet)",
      en: "QRIS (Banks & E-Wallets)",
      zh: "QRIS 极速扫码（所有银行/钱包）",
    },
    desc: {
      id: "BCA, Mandiri, BRI, GoPay, OVO, Dana",
      en: "Instant Automated Verification",
      zh: "秒级全自动入账",
    },
    icon: "/logos/qris-icon.svg",
  },
  {
    id: "usdt_bnb",
    name: {
      id: "USDT / BNB (BEP-20)",
      en: "USDT / BNB (BEP-20)",
      zh: "USDT / BNB (BEP-20)",
    },
    desc: {
      id: "BNB Smart Chain · Fee Rendah",
      en: "BNB Smart Chain Network",
      zh: "币安智能链低 Gas 费",
    },
    icon: "/logos/bnb.svg",
    network: "BNB Smart Chain (BEP-20)",
    address: "0x141b43fCDb8D17c09e7b4235b2527309db674A27",
  },
  {
    id: "usdt_tron",
    name: {
      id: "USDT TRC-20 (Tron)",
      en: "USDT TRC-20 (Tron)",
      zh: "USDT TRC-20 (Tron)",
    },
    desc: {
      id: "Tron Network · Transfer Cepat",
      en: "Tron Network · Fast Transfer",
      zh: "波场网络极速转账",
    },
    icon: "/logos/tron.svg",
    network: "Tron (TRC-20)",
    address: "TQTpRn6j1Pfwf38xP8CxqxJi18YX4v8Wcm",
  },
  {
    id: "solana",
    name: {
      id: "Solana / SOL (SPL)",
      en: "Solana / SOL (SPL)",
      zh: "Solana / SOL (SPL)",
    },
    desc: {
      id: "Solana Network · Instan",
      en: "Solana Network · Instant",
      zh: "Solana 极速主网",
    },
    icon: "/logos/solana.svg",
    network: "Solana (SPL)",
    address: "7JKwQ81LiXgKw4ekSCurNeqXk3jYv3vDMJcDyCLyW64Y",
  },
  {
    id: "ton",
    name: {
      id: "TON (Telegram Wallet)",
      en: "TON (Telegram Wallet)",
      zh: "TON (Telegram 钱包)",
    },
    desc: {
      id: "The Open Network · Telegram",
      en: "The Open Network",
      zh: "Telegram 开放网络",
    },
    icon: "/logos/ton.svg",
    network: "The Open Network (TON)",
    address: "UQA2ka2a3umUuzmr3ymBM6x7FV3DZOLQ92fRsS_KdElex77P",
  },
];

const PRESETS = [
  { usd: 5, idr: 5 * USD_RATE, popular: false },
  { usd: 10, idr: 10 * USD_RATE, popular: true },
  { usd: 25, idr: 25 * USD_RATE, popular: false },
  { usd: 50, idr: 50 * USD_RATE, popular: false },
  { usd: 100, idr: 100 * USD_RATE, popular: false },
  { usd: 200, idr: 200 * USD_RATE, popular: false },
];

export function TopUpModal() {
  const { user, balance, balanceUsd, deposit, isTopUpOpen, closeTopUp, topUpNeeded } = useAuth();
  const { lang } = useTranslation();

  // Amount state
  const [selectedUsd, setSelectedUsd] = useState<number>(10);
  const [customInput, setCustomInput] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<DepositPaymentMethod>("qris");

  // Step state
  const [step, setStep] = useState<1 | 2>(1);
  const [orderCode, setOrderCode] = useState(() => `DEP-${Date.now().toString().slice(-6)}`);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [txId, setTxId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);

  // BorderPay Dynamic QRIS state
  const [borderpayData, setBorderpayData] = useState<{
    qr_string?: string;
    pay_url?: string;
    customer_pays?: number;
  } | null>(null);

  const [uniqueCode] = useState(() => Math.floor(Math.random() * 800 + 100));

  // Initialize amount based on topUpNeeded if provided
  useEffect(() => {
    if (isTopUpOpen) {
      if (topUpNeeded && topUpNeeded > 0) {
        const calcUsd = Math.ceil(topUpNeeded / USD_RATE);
        setSelectedUsd(Math.max(MIN_DEPOSIT_USD, calcUsd));
      } else {
        setSelectedUsd(10);
      }
      setStep(1);
      setIsSuccess(false);
      setCustomInput("");
      setErrorMessage("");
      setOrderCode(`DEP-${Date.now().toString().slice(-6)}`);
    }
  }, [isTopUpOpen, topUpNeeded]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isTopUpOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTopUp();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isTopUpOpen, closeTopUp]);

  const amountIdr = selectedUsd * USD_RATE;
  const usdtDecimalUnique = (uniqueCode % 100) / 10000;
  const totalUsdt = Number((selectedUsd + usdtDecimalUnique).toFixed(4));
  const totalPayIdr = paymentMethod === "qris" ? (borderpayData?.customer_pays || amountIdr) : amountIdr;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSelectPreset = (usd: number) => {
    setSelectedUsd(usd);
    setCustomInput("");
    setErrorMessage("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= MIN_DEPOSIT_USD) {
      setSelectedUsd(num);
      setErrorMessage("");
    }
  };

  const handleProceedToPayment = async () => {
    if (!user) {
      setErrorMessage(
        lang === "en"
          ? "Please sign in or create an account to proceed with top-up."
          : lang === "zh"
          ? "请先登录或注册账号后再进行充值付款。"
          : "Silakan masuk atau daftar akun terlebih dahulu untuk melanjutkan pembayaran."
      );
      return;
    }

    if (selectedUsd < MIN_DEPOSIT_USD) {
      setErrorMessage(
        lang === "en"
          ? `Minimum deposit is $${MIN_DEPOSIT_USD} (approx ${formatRupiah(MIN_DEPOSIT_IDR)}).`
          : lang === "zh"
          ? `最低充值金额为 $${MIN_DEPOSIT_USD}（约合 ${formatRupiah(MIN_DEPOSIT_IDR)}）。`
          : `Minimal isi saldo adalah $${MIN_DEPOSIT_USD} (sekitar ${formatRupiah(MIN_DEPOSIT_IDR)}).`
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const newCode = `DEP-${Date.now().toString().slice(-6)}`;
    setOrderCode(newCode);

    if (paymentMethod === "qris") {
      try {
        const res = await fetch("/api/payments/borderpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountIdr,
            reference_id: newCode,
            customer_name: user?.name || "Member",
            customer_email: user?.email || "member@texasai.com",
          }),
        });
        const json = await res.json();
        if (json.ok && json.data) {
          setBorderpayData(json.data);
        }
      } catch (err) {
        console.warn("QRIS fallback to static:", err);
      }
    }

    setStep(2);
    setLoading(false);
  };

  const handleConfirmPayment = async () => {
    setCheckingStatus(true);
    if (supabaseReady && supabase) {
      try {
        await supabase.from("orders").insert({
          order_code: orderCode,
          customer_name: user?.name || "Member",
          customer_email: user?.email || "member@texasai.com",
          customer_phone: "-",
          total_price: amountIdr,
          payment_method: paymentMethod,
          status: "lunas",
          items: [{ name: `Isi Saldo $${selectedUsd} USD`, price: amountIdr, platform: "Wallet" }],
        });
      } catch (err) {
        console.warn("DB insert error:", err);
      }
    }

    deposit(amountIdr, `Isi Saldo $${selectedUsd} USD via ${paymentMethod.toUpperCase()}`, orderCode);
    setIsSuccess(true);
    setCheckingStatus(false);
  };

  return (
    <AnimatePresence>
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop with Apple Liquid Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeTopUp}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Liquid Glass Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Isi Saldo Akun"
            className="bg-surface border-4 border-border relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-6 shadow-[8px_8px_0_0_var(--color-border)] z-10 text-left"
          >


            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.1] pb-3.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 border border-border text-fg">
                  <Wallet size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-fg">
                    {lang === "en" ? "Top Up Wallet Balance" : lang === "zh" ? "充值账户余额" : "Isi Saldo Akun"}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-fg-muted">Saldo Saat Ini:</span>
                    <span className="text-xs font-bold text-accent tabular-nums">{formatRupiah(balance)}</span>
                    <span className="text-[11px] font-medium text-fg-muted">(${balanceUsd.toFixed(2)} USD)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeTopUp}
                aria-label="Tutup Dialog"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] dark:bg-white/[0.1] hover:bg-black/[0.1] dark:hover:bg-white/[0.15] text-fg-muted hover:text-fg transition-all active:scale-90 cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>

            {/* Content: Auth Required, Success, or Steps */}
            {!user ? (
              /* AUTH REQUIRED STATE */
              <div className="py-7 px-2 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft border border-accent/25 text-accent shadow-xs">
                  <LogIn size={32} strokeWidth={2.2} />
                </div>

                <h4 className="mt-4 text-xl font-black tracking-tight text-fg">
                  {lang === "en"
                    ? "Sign In Required to Top Up"
                    : lang === "zh"
                    ? "充值前请先登录账号"
                    : "Wajib Masuk untuk Isi Saldo"}
                </h4>

                <p className="mt-2 text-xs sm:text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
                  {lang === "en"
                    ? "To ensure your top-up balance is safely linked to your personal wallet and ready for purchases, please sign in or register an account."
                    : lang === "zh"
                    ? "为了确保充值余额自动计入您的个人专属钱包并随时可用，请先登录或注册账号。"
                    : "Untuk memastikan saldo deposit otomatis masuk ke dompet akun Anda dan dapat langsung digunakan, silakan masuk atau daftar akun terlebih dahulu."}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/masuk?next=/isi-saldo"
                    onClick={closeTopUp}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent hover:opacity-90 px-6 py-2.5 text-xs font-bold text-accent-fg shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <LogIn size={15} />
                    <span>{lang === "en" ? "Sign In Now" : lang === "zh" ? "立即登录" : "Masuk Sekarang"}</span>
                  </Link>

                  <Link
                    href="/daftar?next=/isi-saldo"
                    onClick={closeTopUp}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-surface-2 hover:bg-surface-3 border border-border px-6 py-2.5 text-xs font-bold text-fg transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{lang === "en" ? "Create New Account" : lang === "zh" ? "注册新账号" : "Daftar Akun Baru"}</span>
                  </Link>
                </div>
              </div>
            ) : isSuccess ? (
              /* SUCCESS STATE */
              <div className="py-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 border border-success/20 text-success">
                  <CheckCircle2 size={36} strokeWidth={2} />
                </div>

                <span className="mt-4 inline-block rounded-full bg-success/10 border border-success/20 px-3.5 py-1 text-xs font-bold text-success">
                  {lang === "en" ? "Top Up Successful!" : lang === "zh" ? "充值成功！" : "Isi Saldo Berhasil!"}
                </span>

                <h4 className="mt-2 text-2xl font-black text-fg">
                  +{formatRupiah(amountIdr)}
                </h4>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-fg-muted">
                  +${selectedUsd} USD • Saldo Baru: <span className="text-accent font-bold">{formatRupiah(balance)}</span>
                </p>

                <p className="mt-3 text-xs text-fg-muted leading-relaxed max-w-sm mx-auto">
                  {lang === "en"
                    ? "Funds have been added to your wallet. You can now checkout any product with 1-click."
                    : lang === "zh"
                    ? "资金已存入您的账户，您现在可以使用余额秒级一键购买。"
                    : "Saldo telah berhasil ditambahkan ke akun Anda dan siap digunakan untuk belanja instan 1-klik."}
                </p>

                <div className="mt-6 flex justify-center gap-3">
                  <Button
                    size="lg"
                    onClick={closeTopUp}
                    className="rounded-full px-8 font-bold cursor-pointer bg-fg text-surface hover:opacity-90"
                  >
                    <span>Selesai & Tutup</span>
                  </Button>
                </div>
              </div>
            ) : step === 1 ? (
              /* STEP 1: PILIH NOMINAL & METODE */
              <div className="space-y-4">
                {/* Clean Info Helper */}
                <div className="flex items-center justify-between px-1 text-[11px] text-fg-muted">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>{lang === "en" ? "Instant Automated Processing" : lang === "zh" ? "秒级全自动充值入账" : "Proses Otomatis Instan"}</span>
                  </span>
                  <span className="font-medium bg-surface-2 border border-border px-2 py-0.5 rounded-md text-fg font-mono">
                    {lang === "en" || lang === "zh" ? "1 USDT ≈ 1 USD" : "1 USDT = Rp 17.904"}
                  </span>
                </div>

                {/* Section 1: Presets Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <label className="text-xs font-bold text-fg flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-fg text-[9px] font-black text-surface">1</span>
                      <span>{lang === "en" ? "Select Amount" : lang === "zh" ? "选择充值金额" : "Pilih Nominal Saldo"}</span>
                    </label>
                    <span className="text-[11px] text-fg-muted">Min. $5 USDT</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-3 mt-4">
                    {PRESETS.map((p) => {
                      const active = selectedUsd === p.usd && !customInput;
                      return (
                        <button
                          key={p.usd}
                          type="button"
                          onClick={() => handleSelectPreset(p.usd)}
                          className={cn(
                            "relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-150 cursor-pointer select-none active:scale-95",
                            active
                              ? "bg-fg border-fg text-surface shadow-md"
                              : "bg-surface hover:bg-surface-2 border-border text-fg hover:border-border-strong"
                          )}
                        >
                          <span className={cn("text-lg sm:text-xl font-black tracking-tight leading-none", active ? "text-surface" : "text-fg")}>
                            ${p.usd}
                          </span>
                          <span className={cn("text-[9.5px] sm:text-[11px] font-bold mt-1.5 tabular-nums", active ? "text-surface/80" : "text-fg-muted")}>
                            {lang === "id" ? formatRupiah(p.idr) : `${p.usd} USDT`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Clean Single Custom Input */}
                  <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-inner focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                    <span className="text-xs font-bold text-fg-muted select-none">
                      {lang === "en" ? "Custom Amount:" : lang === "zh" ? "自定义金额：" : "Nominal Lain:"}
                    </span>
                    <span className="text-xs font-black text-fg select-none">$</span>
                    <input
                      type="number"
                      min={5}
                      step={1}
                      placeholder={lang === "en" ? "Enter amount in USD..." : lang === "zh" ? "输入自定义金额 (USD)..." : "Ketik jumlah USD (min. 5)..."}
                      value={customInput}
                      onChange={handleCustomChange}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-fg placeholder:text-fg-faint focus:outline-hidden"
                    />
                    {customInput && lang === "id" && (
                      <span className="text-xs font-bold text-accent shrink-0 tabular-nums">
                        ≈ {formatRupiah(amountIdr)}
                      </span>
                    )}
                  </div>

                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs font-bold text-rose-500 flex items-center gap-1"
                    >
                      <AlertCircle size={13} />
                      {errorMessage}
                    </motion.p>
                  )}
                </div>

                {/* Section 2: Payment Methods (No Truncation, Clean and Readable) */}
                <div>
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <label className="text-xs font-bold text-fg flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-fg text-[9px] font-black text-surface">2</span>
                      <span>{lang === "en" ? "Select Payment Method" : lang === "zh" ? "选择支付方式" : "Pilih Metode Pembayaran"}</span>
                    </label>
                  </div>

                  <div className="space-y-1.5 max-h-[190px] overflow-y-auto no-scrollbar pr-0.5">
                    {PAYMENT_METHODS.map((pm) => {
                      const active = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={cn(
                            "flex w-full items-center justify-between gap-2.5 rounded-2xl p-2.5 text-left transition-all cursor-pointer border active:scale-[0.99]",
                            active
                              ? "bg-accent/5 border-accent ring-1 ring-accent/30 shadow-xs"
                              : "bg-surface hover:bg-surface-2 border-border hover:border-border-strong"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 border border-border/80 p-2 shadow-xs">
                              <img src={pm.icon} alt={pm.id} className="h-6 w-6 object-contain" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={cn("text-[13px] font-bold truncate", active ? "text-accent" : "text-fg")}>
                                {pm.name[lang as keyof typeof pm.name] || pm.name.id}
                              </p>
                              <p className="text-[11px] text-fg-muted truncate mt-0.5">
                                {pm.desc[lang as keyof typeof pm.desc] || pm.desc.id}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center shrink-0 pl-1">
                            <div className={cn(
                              "h-5 w-5 rounded-full flex items-center justify-center border transition-all",
                              active
                                ? "bg-accent border-accent text-accent-fg shadow-xs"
                                : "border-border-strong bg-surface"
                            )}>
                              {active && <Check size={11} strokeWidth={3} />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Total & Action Footer Bar */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-fg-muted block">
                      {lang === "en" ? "Total Payment" : lang === "zh" ? "总付款金额" : "Total Bayar"}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      {lang === "id" ? (
                        <>
                          <span className="text-lg sm:text-xl font-black text-fg tabular-nums tracking-tight">
                            {formatRupiah(amountIdr)}
                          </span>
                          <span className="text-xs font-bold text-accent">
                            (${selectedUsd} USD)
                          </span>
                        </>
                      ) : (
                        <span className="text-lg sm:text-xl font-black text-fg tabular-nums tracking-tight">
                          ${selectedUsd} USD
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleProceedToPayment}
                    disabled={loading || selectedUsd < MIN_DEPOSIT_USD}
                    loading={loading}
                    className="rounded-full px-7 font-black cursor-pointer text-xs bg-accent hover:opacity-90 text-accent-fg shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span>Lanjut Bayar</span>
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Button>
                </div>
              </div>
            ) : (
              /* STEP 2: TAMPILAN BAYAR (QRIS / CRYPTO) */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.1] pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">Invoice Deposit</span>
                    <p className="font-mono text-xs font-bold text-fg">{orderCode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-fg-muted hover:text-fg hover:underline cursor-pointer"
                  >
                    {lang === "en" ? "← Change Amount" : lang === "zh" ? "← 更改金额" : "← Ubah Nominal"}
                  </button>
                </div>

                {/* Total display */}
                <div className="bg-surface-2 border-2 border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider block">
                      {lang === "en" ? "Deposit Amount" : lang === "zh" ? "充值金额" : "Nominal Deposit"}
                    </span>
                    <span className="text-sm font-black text-fg">${selectedUsd} USD</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider block">
                      {lang === "en" ? "Total Payment" : lang === "zh" ? "总付款金额" : "Total Ditransfer"}
                    </span>
                    <span className="text-base font-black text-accent tabular-nums">
                      {paymentMethod === "qris" 
                        ? (lang === "id" ? formatRupiah(totalPayIdr) : `$${(totalPayIdr / USDT_RATE).toFixed(2)} USD`) 
                        : `${totalUsdt} ${paymentMethod === "solana" ? "SOL" : paymentMethod === "ton" ? "TON" : "USDT"}`}
                    </span>
                  </div>
                </div>

                {/* QRIS / Crypto specifics */}
                {paymentMethod === "qris" ? (
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface-2 border-2 border-border text-center">
                    <span className="text-xs font-black text-fg mb-1">
                      {lang === "en"
                        ? "Scan QRIS Using Your Mobile Banking or E-Wallet App"
                        : lang === "zh"
                        ? "使用支持的手机银行或电子钱包扫描 QRIS 二维码"
                        : "Pindai QRIS Menggunakan Aplikasi Bank atau E-Wallet Anda"}
                    </span>
                    <p className="text-[10.5px] text-fg-muted mb-3">
                      BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay
                    </p>
                    <div className="relative rounded-xl border border-border bg-white p-3 shadow-sm flex items-center justify-center">
                      <img
                        src="/qris.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                        }}
                        alt="QRIS TexasAi"
                        className="h-44 w-44 object-contain"
                      />
                    </div>
                    <div className="mt-4 bg-surface border-2 border-border rounded-full px-5 py-2 text-sm font-black text-fg tabular-nums shadow-[4px_4px_0_0_var(--color-border)]">
                      {lang === "en" ? "Amount:" : lang === "zh" ? "付款金额：" : "Nominal:"} {lang === "id" ? formatRupiah(totalPayIdr) : `$${(totalPayIdr / USDT_RATE).toFixed(2)}`}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Crypto address card */}
                    <div className="rounded-2xl border-2 border-border bg-surface-2 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-fg-muted tracking-wider">
                          {lang === "en"
                            ? "Destination Wallet Address"
                            : lang === "zh"
                            ? "充值目标钱包地址"
                            : "Alamat Wallet Tujuan"}
                        </span>
                        <span className="text-[10px] font-bold text-fg">
                          {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.network}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-3 p-2.5 border border-border">
                        <span className="font-mono text-xs font-bold text-fg break-all select-all">
                          {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.address}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.address || "", "crypto-addr")}
                          className="flex items-center gap-1 rounded-lg bg-surface px-2.5 py-1.5 text-xs font-bold text-fg border border-border shadow-xs shrink-0 cursor-pointer active:scale-95 transition-all"
                        >
                          {copiedField === "crypto-addr" ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} />}
                          <span>
                            {copiedField === "crypto-addr"
                              ? (lang === "en" ? "Copied" : lang === "zh" ? "已复制" : "Tersalin")
                              : (lang === "en" ? "Copy" : lang === "zh" ? "复制" : "Salin")}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* TxID */}
                    <div>
                      <label className="text-[11px] font-bold text-fg-muted block mb-1">
                        {lang === "en"
                          ? "Enter Transaction Hash / TxID (Optional):"
                          : lang === "zh"
                          ? "输入交易哈希 / TxID（可选）："
                          : "Masukkan TxID / Hash Transaksi (Opsional):"}
                      </label>
                      <input
                        type="text"
                        value={txId}
                        onChange={(e) => setTxId(e.target.value)}
                        placeholder={
                          lang === "en"
                            ? "e.g. 0xabc... or transaction hash"
                            : lang === "zh"
                            ? "例如：0xabc... 或交易哈希"
                            : "Contoh: 0xabc... atau hash transaksi"
                        }
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-fg focus:ring-2 focus:ring-border-strong focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Button */}
                <div className="pt-2 border-t border-black/[0.08] dark:border-white/[0.1]">
                  <Button
                    size="lg"
                    onClick={handleConfirmPayment}
                    loading={checkingStatus}
                    className="w-full rounded-full bg-fg hover:bg-fg/90 text-surface font-bold text-xs shadow-md cursor-pointer py-3"
                  >
                    <CheckCircle2 size={16} />
                    <span>Saya Sudah Melakukan Pembayaran</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Footer link to full page */}
            <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] text-center">
              <Link
                href="/isi-saldo"
                onClick={closeTopUp}
                className="text-[11px] font-semibold text-fg-muted hover:text-accent transition-colors inline-flex items-center gap-1"
              >
                <span>Buka halaman lengkap isi saldo</span>
                <ExternalLink size={11} />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
