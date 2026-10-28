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
  Loader2,
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

type DepositPaymentMethod = "qris" | "usdt_bnb" | "usdt_tron" | "solana" | "ton" | "btc";

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
    address: "0xb8E8C7a85942475752755ff1E6c33529Eced4E91",
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
    address: "TEZ6JFy2Ew6ayPYgdj1xY36WWdahYkBxat",
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
    address: "FNNgq27hNuwddakAeZJiWUEJYjE13CtsS3YHRJjGMwpP",
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
    address: "UQAG_A_1Ay9QcSqJifY_W9hQr0ZRW0WwcALCLm_hVRx6LWbz",
  },
  {
    id: "btc",
    name: {
      id: "Bitcoin (BTC)",
      en: "Bitcoin (BTC)",
      zh: "比特币 (BTC)",
    },
    desc: {
      id: "Bitcoin Network",
      en: "Bitcoin Network",
      zh: "比特币网络",
    },
    icon: "/logos/btc.svg",
    network: "Bitcoin",
    address: "bc1qmgxfm23zpnenmgmu55q03n9k0dd9mpaaygxjjg",
  },
];

const PRESETS = [
  { usd: 5, idr: 5 * USD_RATE, popular: false },
  { usd: 10, idr: 10 * USD_RATE, popular: true },
  { usd: 50, idr: 50 * USD_RATE, popular: false },
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
  const [isProcessing, setIsProcessing] = useState(false);

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
          ? `Minimum deposit is $${MIN_DEPOSIT_USD}.`
          : lang === "zh"
          ? `最低充值金额为 $${MIN_DEPOSIT_USD}。`
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

  const handleConfirmPayment = async () => {
    setLoading(true);
    setIsProcessing(true);
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const orderData = {
      id: orderCode,
      user_name: user?.name || "Member",
      items: [{ name: `Isi Saldo $${selectedUsd} USD`, price: amountIdr, platform: "Wallet" }],
      subtotal: amountIdr,
      discount: 0,
      total: amountIdr,
      payment_method: paymentMethod,
      payment_status: "menunggu",
      order_status: "menunggu",
      date: new Date().toISOString().slice(0, 10),
    };

    if (supabaseReady && supabase) {
      try {
        await supabase.from("orders").insert([orderData]);
      } catch (err) {
        console.warn("DB insert error:", err);
      }
    }

    try {
      sessionStorage.setItem("tokono:last-order", JSON.stringify(orderData));
      sessionStorage.setItem("serbapremium:last-order", JSON.stringify(orderData));
      const raw = localStorage.getItem("tokono:orders") || localStorage.getItem("serbapremium:orders") || "[]";
      const existing = JSON.parse(raw);
      const list = Array.isArray(existing) ? existing : [];
      const updated = [orderData, ...list.filter((o: any) => o.id !== orderCode)];
      localStorage.setItem("tokono:orders", JSON.stringify(updated));
      localStorage.setItem("serbapremium:orders", JSON.stringify(updated));
    } catch {
      // ignore storage full
    }

    // Remove direct deposit for manual confirmation flow
    // deposit(amountIdr, `Isi Saldo $${selectedUsd} USD via ${paymentMethod.toUpperCase()}`, orderCode);
    setIsProcessing(false);
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
        {isProcessing ? (
          /* PROCESSING STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="liquid-glass rounded-2xl p-16 sm:p-20 text-center shadow-sm flex flex-col items-center justify-center space-y-5"
          >
            <Loader2 className="animate-spin text-accent" size={60} strokeWidth={2} />
            <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-fg">
              {lang === "en" ? "Processing Payment..." : lang === "zh" ? "正在处理付款..." : "Sedang Memproses..."}
            </h4>
            <p className="text-sm text-fg-muted max-w-[350px] mx-auto leading-relaxed">
              {lang === "en" ? "Please wait a moment while we verify your payment with the network." : lang === "zh" ? "请稍候，我们正在核对您的付款。" : "Mohon tunggu sebentar, kami sedang memverifikasi pembayaran Anda."}
            </p>
          </motion.div>
        ) : isSuccess ? (
          /* PENDING STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="liquid-glass rounded-2xl p-8 sm:p-10 text-center shadow-sm"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Clock size={44} strokeWidth={2.4} />
            </div>

            <span className="mt-5 inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              {lang === "en" ? "Waiting for Payment" : lang === "zh" ? "等待付款中" : "Menunggu Pembayaran!"}
            </span>

            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-fg tracking-tight">
              {formatRupiah(amountIdr)}
            </h2>
            <p className="mt-1 text-sm font-semibold text-fg-muted">
              +${selectedUsd} USD • Invoice: <span className="text-fg font-mono font-bold">{orderCode}</span>
            </p>

            <div className="mt-6 mx-auto max-w-sm text-left">
              {paymentMethod === "qris" ? (
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface-2 border border-border text-center">
                  <p className="text-sm font-bold text-fg mb-3">
                    {lang === "en" ? "Scan QRIS to Pay" : lang === "zh" ? "扫描 QRIS 付款" : "Scan QRIS untuk Membayar"}
                  </p>
                  <div className="relative rounded-xl border border-border bg-white p-3 shadow-sm">
                    <img
                      src="/qris.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                      }}
                      alt="QRIS"
                      className="h-40 w-40 object-contain"
                    />
                  </div>
                  <p className="text-xs text-fg-muted mt-3 px-2">
                    {lang === "en" ? "If you haven't paid yet, please complete your payment. Your balance will be added once confirmed." : lang === "zh" ? "如果您尚未付款，请完成付款。一旦确认将立即充值余额。" : "Jika Anda belum bayar, silakan selesaikan pembayaran ke QRIS di atas agar saldo dapat diproses."}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-surface-2 p-4 space-y-3">
                  <p className="text-xs font-bold text-fg-muted text-center mb-1">
                    {lang === "en" ? "Send exactly" : lang === "zh" ? "发送" : "Kirimkan persis"} <span className="text-accent text-sm">{totalUsdt} {paymentMethod === "solana" ? "SOL" : paymentMethod === "ton" ? "TON" : "USDT"}</span> {lang === "en" ? "to:" : lang === "zh" ? "到：" : "ke:"}
                  </p>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3 border border-border shadow-xs">
                    <span className="font-mono text-xs font-bold text-fg break-all select-all">
                      {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.address}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.address || "", "crypto-addr-success")}
                      className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors shrink-0"
                    >
                      {copiedField === "crypto-addr-success" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-center text-fg-muted mt-2 px-1">
                    {lang === "en" ? "If you haven't paid yet, please complete your payment. Your balance will be added once confirmed." : lang === "zh" ? "如果您尚未付款，请完成付款。一旦确认将立即充值余额。" : "Jika Anda belum bayar, silakan transfer ke alamat di atas agar saldo dapat diproses."}
                  </p>
                </div>
              )}
            </div>

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
                  {lang === "en" ? "Minimum Top Up: $5.00 USD" : lang === "zh" ? "最低充值要求：$5.00 USD" : "Minimal Isi Saldo: $5.00 USD (~Rp 89.520)"}
                </p>
                <p className="text-fg-muted text-[11.5px] mt-0.5">
                  {lang === "en"
                    ? "Automatic credit upon verified payment."
                    : lang === "zh"
                    ? "付款核对后秒级自动存入账户。"
                    : "Kurs acuan 1 USD = Rp 17.904. Saldo langsung masuk otomatis setelah pembayaran terverifikasi."}
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

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
                  <div className="relative flex-1 flex items-center rounded-2xl border-2 border-border bg-surface shadow-inner overflow-hidden focus-within:ring-4 focus-within:ring-accent/20 focus-within:border-accent transition-all">
                    <div className="flex h-16 sm:h-20 items-center px-5 sm:px-6 bg-surface-2 border-r-2 border-border text-sm sm:text-lg font-black text-fg select-none">
                      USD $
                    </div>
                    <input
                      type="number"
                      min={5}
                      step={1}
                      placeholder="0"
                      value={customInput}
                      onChange={handleCustomChange}
                      className="w-full h-full bg-transparent px-5 sm:px-6 py-4 text-xl sm:text-3xl font-black text-fg focus:outline-hidden placeholder:text-fg-faint"
                    />
                  </div>

                  <div className="liquid-glass-pill flex flex-col justify-center rounded-2xl px-6 py-4 text-right shrink-0 min-w-[160px] sm:min-w-[200px]">
                    <span className="text-xs uppercase font-bold text-fg-muted block mb-1">Estimasi Rupiah</span>
                    <span className="text-lg sm:text-xl font-black text-accent tabular-nums">
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
                {!loading && <span>{lang === "en" ? "Proceed to Payment" : lang === "zh" ? "前往支付" : "Lanjut ke Pembayaran"}</span>}
                {!loading && <ArrowRight size={17} strokeWidth={2.5} />}
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
                  <span className="text-xs text-fg-muted font-medium block">{lang === "en" ? "Deposit Amount" : lang === "zh" ? "充值金额" : "Nominal Deposit"}</span>
                  <span className="text-xl font-black text-fg mt-0.5 block">${selectedUsd} USD</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-fg-muted font-medium block">{lang === "en" ? "Total Payable" : lang === "zh" ? "应付总额" : "Total Yang Harus Dibayar"}</span>
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
                      <span className="text-xs text-fg-muted font-medium">
                        {lang === "en" ? "Crypto Transfer Amount" : lang === "zh" ? "加密货币转账金额" : "Nominal Transfer Crypto"}
                      </span>
                      <span className="text-xs font-semibold text-accent">
                        {lang === "en" || lang === "zh" ? "1 USDT ≈ 1 USD" : "Kurs 1 USD ≈ Rp 17.904"}
                      </span>
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
                  {!checkingStatus && <CheckCircle2 size={18} />}
                  {!checkingStatus && <span>Saya Sudah Melakukan Pembayaran</span>}
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
