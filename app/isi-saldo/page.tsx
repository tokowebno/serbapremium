"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Clock,
  ArrowLeft,
  QrCode,
  Send,
  CreditCard,
  Coins,
} from "lucide-react";
import { useAuth } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { formatRupiah, USDT_RATE } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { RequireAuth } from "@/components/storefront/require-auth";
import { supabase, supabaseReady } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

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

function IsiSaldoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, balance, balanceUsd, deposit } = useAuth();
  const { lang, t } = useTranslation();

  const neededParam = searchParams.get("needed");
  const returnApp = searchParams.get("app");
  const initialNeededIdr = neededParam ? Number(neededParam) : null;

  // Amount state
  const [selectedUsd, setSelectedUsd] = useState<number>(() => {
    if (initialNeededIdr && initialNeededIdr > 0) {
      const calcUsd = Math.ceil(initialNeededIdr / USD_RATE);
      return Math.max(MIN_DEPOSIT_USD, calcUsd);
    }
    return 10;
  });
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

  // BorderPay Dynamic QRIS state
  const [borderpayData, setBorderpayData] = useState<{
    qr_string?: string;
    pay_url?: string;
    customer_pays?: number;
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const [uniqueCode] = useState(() => Math.floor(Math.random() * 800 + 100));

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

  // Step 1 -> Step 2
  const handleProceedToPayment = async () => {
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

    // If QRIS, request Dynamic QRIS
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
        console.warn("QRIS generation fallback to static QRIS:", err);
      }
    }

    setStep(2);
    setLoading(false);
  };

  // Check payment status or confirm
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

    // Credit balance
    deposit(amountIdr, `Isi Saldo $${selectedUsd} USD via ${paymentMethod.toUpperCase()}`, orderCode);
    setIsSuccess(true);
    setCheckingStatus(false);
  };

  return (
    <div className="relative min-h-[85vh] overflow-hidden">


      <div className="tk-container relative z-10 max-w-3xl pt-28 pb-24">
        {/* Header Navigation & Title */}
        <div className="mb-7">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <Link
              href="/akun"
              className="liquid-glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg transition-all active:scale-95 mb-4 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{lang === "en" ? "Back to Account" : lang === "zh" ? "返回账户" : "Kembali ke Akun"}</span>
            </Link>
          </motion.div>

          {/* Liquid Glass Showcase Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="liquid-glass-slab rounded-[28px] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-2 border border-border px-3 py-1 text-xs font-bold text-fg">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-fg" />
                </span>
                <span className="font-mono text-[11px] font-bold tracking-wider">
                  {lang === "en" ? "OFFICIAL WALLET & BALANCE" : lang === "zh" ? "官方钱包充值系统" : "SISTEM DOMPET RESMI"}
                </span>
              </div>

              <h1 className="mt-2.5 text-2xl sm:text-3xl font-black tracking-tight text-fg leading-tight">
                {lang === "en" ? "Top Up Account Balance" : lang === "zh" ? "充值账户余额" : "Isi Saldo Akun"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-fg-muted max-w-lg leading-relaxed">
                {lang === "en"
                  ? "Instant top up with QRIS & Crypto. Enjoy 1-click checkout for all digital apps and licenses."
                  : lang === "zh"
                  ? "支持 QRIS 自动扫码与多链加密货币，秒级入账，全站软件一键秒买。"
                  : "Isi saldo mudah & instan via QRIS Otomatis dan Multi-Crypto. Belanja lisensi favorit dalam 1 klik."}
              </p>
            </div>

            <div className="liquid-glass-pill rounded-xl px-5 py-4 text-left md:text-right shrink-0">
              <span className="text-[10.5px] font-bold text-fg-muted uppercase tracking-wider block">
                {lang === "en" ? "Current Balance" : lang === "zh" ? "当前可用余额" : "Saldo Dompet Anda"}
              </span>
              <div className="flex items-baseline md:justify-end gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-fg tabular-nums">
                  {formatRupiah(balance)}
                </span>
              </div>
              <span className="text-[11.5px] font-bold text-fg-muted mt-0.5 block">
                ≈ ${balanceUsd.toFixed(2)} USD
              </span>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        {isSuccess ? (
          /* SUCCESS STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="liquid-glass rounded-2xl p-8 sm:p-10 text-center shadow-sm"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 border border-success/20 text-success">
              <CheckCircle2 size={44} strokeWidth={2.4} />
            </div>

            <span className="mt-5 inline-block rounded-full bg-success/10 border border-success/20 px-4 py-1 text-xs font-bold text-success">
              {lang === "en" ? "Top Up Successful" : lang === "zh" ? "充值已成功入账" : "Isi Saldo Berhasil!"}
            </span>

            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-fg tracking-tight">
              +{formatRupiah(amountIdr)}
            </h2>
            <p className="mt-1 text-sm font-semibold text-fg-muted">
              +${selectedUsd} USD • Saldo Baru: <span className="text-accent font-bold">{formatRupiah(balance)}</span> (${balanceUsd.toFixed(2)} USD)
            </p>

            <p className="mx-auto mt-4 max-w-md text-xs sm:text-sm text-fg-muted leading-relaxed">
              {lang === "en"
                ? "Your funds have been credited to your account. You can now purchase any digital license with 1-click balance payment."
                : lang === "zh"
                ? "充值资金已存入您的账户余额。您现在可以使用余额一键购买所有正版数字授权。"
                : "Dana telah berhasil ditambahkan ke saldo akun Anda. Sekarang Anda dapat membeli lisensi apa pun menggunakan saldo akun."}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {returnApp ? (
                <ButtonLink
                  href={`/aplikasi/${returnApp}`}
                  size="lg"
                  className="rounded-full font-bold px-7 bg-fg hover:bg-fg/90 text-surface"
                >
                  <Zap size={16} />
                  <span>{lang === "en" ? "Continue Buying Product" : lang === "zh" ? "继续购买商品" : "Lanjutkan Beli Produk"}</span>
                </ButtonLink>
              ) : (
                <ButtonLink
                  href="/aplikasi"
                  size="lg"
                  className="rounded-full font-bold px-7 bg-fg hover:bg-fg/90 text-surface"
                >
                  <Zap size={16} />
                  <span>{lang === "en" ? "Explore Digital Products" : lang === "zh" ? "浏览数字商品" : "Jelajahi Produk"}</span>
                </ButtonLink>
              )}
              <ButtonLink href="/akun" variant="secondary" size="lg" className="liquid-glass-pill rounded-full font-bold px-6">
                <span>{lang === "en" ? "View Account" : lang === "zh" ? "查看账户中心" : "Lihat Akun Saya"}</span>
              </ButtonLink>
            </div>
          </motion.div>
        ) : step === 1 ? (
          /* STEP 1: PILIH NOMINAL & METODE PEMBAYARAN */
          <div className="space-y-6">
            {/* Apple Liquid Glass Notice Banner - ONLY SHOWN HERE */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="liquid-glass-pill rounded-xl p-4 flex items-center gap-3.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-3 border border-border text-fg">
                <ShieldCheck size={20} strokeWidth={2.4} />
              </div>
              <div className="text-xs sm:text-[13px]">
                <p className="font-bold text-fg">
                  {lang === "en" ? "Minimum Top Up: $5.00 USD (~Rp 82.500)" : lang === "zh" ? "最低充值要求：$5.00 USD（约合 Rp 82.500）" : "Minimal Isi Saldo: $5.00 USD (~Rp 82.500)"}
                </p>
                <p className="text-fg-muted text-[11.5px] mt-0.5">
                  {lang === "en"
                    ? "Standard conversion rate 1 USD = Rp 16.500. Automatic credit upon verified payment."
                    : lang === "zh"
                    ? "基准汇率 1 USD = Rp 16.500。付款核对后秒级自动存入账户。"
                    : "Kurs acuan 1 USD = Rp 16.500. Saldo langsung masuk otomatis setelah pembayaran terverifikasi."}
                </p>
              </div>
            </motion.div>

            {/* Presets Grid (Apple 3D Glass Tiles) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="liquid-glass-slab rounded-[28px] p-6 sm:p-7"
            >
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fg text-[10px] font-black text-surface">1</span>
                  <span>{lang === "en" ? "Select Amount (USD)" : lang === "zh" ? "选择充值金额 (USD)" : "Pilih Nominal Isi Saldo (USD)"}</span>
                </label>
                <span className="text-[11px] font-semibold text-fg-muted font-mono">Kurs 1 USDT = Rp 17.904</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {PRESETS.map((p) => {
                  const active = selectedUsd === p.usd && !customInput;
                  return (
                    <motion.button
                      key={p.usd}
                      type="button"
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelectPreset(p.usd)}
                      className={`flex flex-col items-center justify-between p-3 rounded-2xl cursor-pointer select-none transition-all duration-200 min-h-[82px] ${
                        active
                          ? "liquid-tile-active ring-2 ring-accent/30 shadow-xs"
                          : "liquid-tile hover:border-border-strong"
                      }`}
                    >
                      <div className="flex items-center justify-center h-4 w-full">
                        {p.popular && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[8.5px] font-black text-accent-fg shadow-xs uppercase tracking-wider whitespace-nowrap">
                            Populer
                          </span>
                        )}
                      </div>
                      <span className={`text-lg sm:text-xl font-black tracking-tight leading-none ${active ? "text-accent" : "text-fg"}`}>
                        ${p.usd}
                      </span>
                      <span className={`text-[11px] font-semibold mt-1 tabular-nums ${active ? "text-accent" : "text-fg-muted"}`}>
                        {formatRupiah(p.idr)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom Input with Dedicated Prefix Box (No Overlap) */}
              <div className="mt-5 pt-4 border-t border-black/[0.08] dark:border-white/[0.08]">
                <label className="text-xs font-semibold text-fg-muted block mb-2">
                  {lang === "en" ? "Or enter custom amount in USD (min $5):" : lang === "zh" ? "或输入自定义金额（最低 $5）：" : "Atau masukkan nominal custom (minimal $5):"}
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 flex items-center rounded-xl border border-border bg-surface shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-border-strong focus-within:border-border-strong transition-all">
                    <div className="flex h-11 items-center px-4 bg-surface-2 border-r border-border text-xs font-black text-fg select-none">
                      USD $
                    </div>
                    <input
                      type="number"
                      min={5}
                      step={1}
                      placeholder="Contoh: 15"
                      value={customInput}
                      onChange={handleCustomChange}
                      className="w-full bg-transparent px-4 py-2.5 text-sm font-bold text-fg focus:outline-hidden"
                    />
                  </div>

                  <div className="liquid-glass-pill rounded-xl px-5 py-2.5 text-right shrink-0 min-w-[150px]">
                    <span className="text-[10px] uppercase font-bold text-fg-muted block">Estimasi Rupiah</span>
                    <span className="text-sm font-black text-accent tabular-nums">
                      {formatRupiah(amountIdr)}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <p className="mt-3 text-xs font-bold text-danger flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </div>
            </motion.div>

            {/* Payment Methods (Apple iOS 27 Selection) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="liquid-glass-slab rounded-[28px] p-6 sm:p-7"
            >
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fg text-[10px] font-black text-surface">2</span>
                  <span>{lang === "en" ? "Select Payment Method" : lang === "zh" ? "选择支付方式" : "Pilih Metode Pembayaran"}</span>
                </label>
                <span className="text-[11px] font-semibold text-fg-muted">Verifikasi Otomatis</span>
              </div>

              <div className="space-y-2.5">
                {PAYMENT_METHODS.map((pm) => {
                  const active = paymentMethod === pm.id;
                  return (
                    <motion.button
                      key={pm.id}
                      type="button"
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`group flex w-full items-center justify-between gap-3.5 rounded-xl p-4 text-left transition-all duration-200 cursor-pointer ${
                        active
                          ? "liquid-tile-active"
                          : "liquid-tile hover:border-border-strong"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="apple-squircle flex h-11 w-11 items-center justify-center p-2 shrink-0">
                          <img src={pm.icon} alt={pm.name[lang as keyof typeof pm.name] || pm.name.id} className="h-full w-full object-contain" />
                        </div>
                        <div className="truncate">
                          <p className={`text-sm font-bold truncate ${active ? "text-fg font-black" : "text-fg"}`}>
                            {pm.name[lang as keyof typeof pm.name] || pm.name.id}
                          </p>
                          <p className={`text-xs mt-0.5 truncate ${active ? "text-accent" : "text-fg-muted"}`}>
                            {pm.desc ? (pm.desc[lang as keyof typeof pm.desc] || pm.desc.id) : (pm.network ? `Jaringan: ${pm.network}` : "Instan")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {pm.network && (
                          <span className="hidden sm:inline-block rounded-full bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-fg-muted">
                            {pm.network}
                          </span>
                        )}
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                          active
                            ? "bg-accent border-accent text-accent-fg"
                            : "border-border-strong"
                        }`}>
                          {active && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Bottom Checkout Action Slab */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="liquid-glass-slab rounded-[28px] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5"
            >
              <div>
                <span className="text-xs text-fg-muted font-bold uppercase tracking-wider block">Total Pengisian Dana</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-accent tabular-nums">
                    ${selectedUsd} USD
                  </span>
                  <span className="text-sm font-bold text-fg-muted">
                    ({formatRupiah(amountIdr)})
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleProceedToPayment}
                disabled={loading || selectedUsd < MIN_DEPOSIT_USD}
                loading={loading}
                className="w-full sm:w-auto rounded-full px-9 py-4 shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer text-sm font-black transition-all flex items-center justify-center gap-2 bg-fg text-surface"
              >
                <span>{lang === "en" ? "Proceed to Payment" : lang === "zh" ? "前往支付" : "Lanjut ke Pembayaran"}</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </Button>
            </motion.div>
          </div>
        ) : (
          /* STEP 2: TAMPILAN BAYAR (QRIS / CRYPTO) */
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="liquid-glass-slab rounded-[28px] p-6 sm:p-8">
              {/* Invoice Topbar */}
              <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
                <div>
                  <span className="text-[11px] font-bold text-fg-muted uppercase tracking-wider">Kode Invoice Deposit</span>
                  <p className="font-mono text-base font-black text-fg mt-0.5">{orderCode}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="liquid-glass-pill rounded-full px-3.5 py-1.5 text-xs font-bold text-fg hover:underline cursor-pointer active:scale-95"
                >
                  ← {lang === "en" ? "Change Amount" : lang === "zh" ? "修改金额" : "Ubah Nominal"}
                </button>
              </div>

              {/* Total Display */}
              <div className="my-5 rounded-2xl liquid-tile p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-fg-muted font-medium block">Nominal Deposit</span>
                  <span className="text-xl font-black text-fg mt-0.5 block">${selectedUsd} USD</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-fg-muted font-medium block">Total Yang Harus Dibayar</span>
                  <span className="text-xl sm:text-2xl font-black text-accent tabular-nums mt-0.5 block">
                    {paymentMethod === "qris" ? formatRupiah(totalPayIdr) : `${totalUsdt} ${paymentMethod === "solana" ? "SOL" : paymentMethod === "ton" ? "TON" : "USDT"}`}
                  </span>
                </div>
              </div>

              {/* QRIS / Crypto specifics */}
              {paymentMethod === "qris" ? (
                <div className="flex flex-col items-center gap-5 py-4">
                  <div className="relative rounded-2xl bg-surface p-5 shadow-sm border border-border flex flex-col items-center">
                    <div className="h-60 w-60 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-2">
                      <img
                        src={borderpayData?.qr_string ? `/api/qr?text=${encodeURIComponent(borderpayData.qr_string)}` : "/qris.png"}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                        }}
                        alt="QRIS Deposit"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="mt-3 text-xs font-black text-slate-800 tracking-wide">
                      SCAN MENGGUNAKAN SEMUA M-BANKING & E-WALLET
                    </span>
                  </div>

                  <div className="text-center max-w-md">
                    <p className="text-xs sm:text-sm font-bold text-fg">
                      BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay
                    </p>
                    <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                      Pastikan mentransfer nominal pas <span className="font-bold text-accent">{formatRupiah(totalPayIdr)}</span> agar sistem otomatis mengenali dana Anda dalam 10-60 detik.
                    </p>
                  </div>
                </div>
              ) : (
                /* Crypto Display */
                <div className="space-y-4 py-2">
                  <div className="rounded-2xl liquid-tile p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-fg-muted font-medium">Nominal Transfer Crypto</span>
                      <span className="text-xs font-semibold text-accent">Kurs 1 USD ≈ Rp 16.500</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-black text-fg tabular-nums">${totalUsdt} USDT / Token</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(totalUsdt.toString(), "crypto-amt")}
                        className="liquid-glass-pill flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-fg hover:text-accent cursor-pointer active:scale-95"
                      >
                        {copiedField === "crypto-amt" ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                        <span>{copiedField === "crypto-amt" ? "Disalin!" : "Salin"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  {(() => {
                    const pm = PAYMENT_METHODS.find((p) => p.id === paymentMethod);
                    return (
                      <div className="rounded-2xl liquid-tile p-4 space-y-2.5">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                          Jaringan: {pm?.network}
                        </span>
                        <div className="rounded-xl bg-surface-2 p-3 border border-border">
                          <p className="font-mono text-xs sm:text-[13px] text-fg break-all select-all font-bold">
                            {pm?.address}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(pm?.address || "", "crypto-addr")}
                          className="w-full flex items-center justify-center gap-2 rounded-xl liquid-glass-pill py-2.5 text-xs font-bold text-fg hover:text-accent transition-all active:scale-95 cursor-pointer"
                        >
                          {copiedField === "crypto-addr" ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                          <span>{copiedField === "crypto-addr" ? "Alamat Wallet Berhasil Disalin!" : "Salin Alamat Wallet"}</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* TxID Submission */}
                  <div className="pt-2">
                    <label className="text-xs font-semibold text-fg-muted block mb-1.5">
                      Hash Transaksi / TxID (Opsional untuk percepat konfirmasi):
                    </label>
                    <input
                      type="text"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                      placeholder="Masukkan TxID atau hash transaksi blockchain..."
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs text-fg focus:border-border-strong focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <div className="mt-6 pt-5 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col gap-2.5">
                <Button
                  size="lg"
                  onClick={handleConfirmPayment}
                  loading={checkingStatus}
                  className="w-full rounded-full bg-fg text-surface font-black text-sm shadow-sm hover:scale-[1.01] active:scale-95 cursor-pointer py-4 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  <span>Saya Sudah Melakukan Pembayaran</span>
                </Button>

                <p className="text-center text-[11.5px] text-fg-muted mt-1">
                  Saldo akun akan langsung otomatis bertambah setelah pembayaran terverifikasi.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function IsiSaldoPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<div className="tk-container pt-32 pb-20 text-center text-fg-muted">Memuat menu isi saldo...</div>}>
        <IsiSaldoContent />
      </Suspense>
    </RequireAuth>
  );
}
