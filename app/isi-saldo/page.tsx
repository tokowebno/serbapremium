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
import { formatRupiah, formatPrice, USDT_RATE } from "@/lib/utils";
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
  const [isCryptoVerified, setIsCryptoVerified] = useState(false);
  const [verifiedAmountUsd, setVerifiedAmountUsd] = useState<number>(0);
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
    setErrorMessage("");

    // 1. KHUSUS CRYPTO: WAJIB TXID DAN VERIFIKASI ON-CHAIN OTOMATIS
    if (paymentMethod !== "qris") {
      const cleanTx = txId.trim();
      if (!cleanTx) {
        setErrorMessage(
          lang === "en"
            ? "Transaction Hash / TxID is REQUIRED for crypto deposits."
            : lang === "zh"
            ? "加密货币充值必须填写交易哈希 / TxID！"
            : "Hash Transaksi / TxID WAJIB diisi untuk verifikasi otomatis deposit crypto. Silakan salin TxID dari wallet pengirim Anda."
        );
        return;
      }

      setCheckingStatus(true);
      setIsProcessing(true);

      try {
        const res = await fetch("/api/payments/verify-crypto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            network: paymentMethod,
            tx_hash: cleanTx,
            expected_amount_usd: selectedUsd,
            order_id: orderCode,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.ok || !json.verified) {
          setIsProcessing(false);
          setCheckingStatus(false);
          let displayError = json.message;
          if (lang === "en") {
            if (json.message?.includes("tidak valid") || json.message?.includes("asal-asalan")) {
              displayError = "Invalid TxID. Please enter a valid transaction hash from your sending wallet.";
            } else if (json.message?.includes("tidak ditemukan")) {
              displayError = "Transaction not found on the blockchain or still pending. Please verify your transfer succeeded.";
            } else if (json.message?.includes("sudah pernah")) {
              displayError = "This transaction hash has already been used for a previous deposit.";
            } else if (json.message?.includes("kurang") || json.message?.includes("lebih kecil")) {
              displayError = "The transferred crypto amount is less than the requested deposit amount.";
            }
          } else if (lang === "zh") {
            if (json.message?.includes("tidak valid") || json.message?.includes("asal-asalan")) {
              displayError = "TxID 无效。请输入付款钱包中的有效交易哈希。";
            } else if (json.message?.includes("tidak ditemukan")) {
              displayError = "未在区块链上检测到该交易或仍在确认中，请确保已成功转账。";
            } else if (json.message?.includes("sudah pernah")) {
              displayError = "该交易哈希已被使用过，无法重复充值。";
            }
          }
          setErrorMessage(displayError || json.message);
          return; // STOP! JANGAN TAMBAH SALDO!
        }

        // VERIFIKASI BERHASIL! DANA BENAR-BENAR MASUK ON-CHAIN
        const actualUsd = json.amount_usd || selectedUsd;
        const creditedIdr = actualUsd * USD_RATE;

        // Auto credit saldo ke user
        deposit(
          creditedIdr,
          `Deposit $${actualUsd} USD via ${paymentMethod.toUpperCase()} (Tx: ${cleanTx.slice(0, 10)}...)`,
          orderCode
        );

        const orderData = {
          id: orderCode,
          user_name: user?.name || "Member",
          items: [{ name: `Isi Saldo $${actualUsd} USD`, price: creditedIdr, platform: "Wallet" }],
          subtotal: creditedIdr,
          discount: 0,
          total: creditedIdr,
          payment_method: paymentMethod,
          payment_status: "berhasil",
          order_status: "selesai",
          tx_id: cleanTx,
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
          // ignore
        }

        setVerifiedAmountUsd(actualUsd);
        setIsCryptoVerified(true);
        setIsSuccess(true);
        setIsProcessing(false);
        setCheckingStatus(false);
        return;
      } catch (err: any) {
        setIsProcessing(false);
        setCheckingStatus(false);
        setErrorMessage(
          lang === "en"
            ? "Connection error while verifying blockchain. Please try again."
            : lang === "zh"
            ? "连接区块链验证网络时出错，请重试。"
            : "Gagal memverifikasi transaksi ke blockchain. Pastikan koneksi internet stabil dan coba lagi."
        );
        return;
      }
    }

    // 2. KHUSUS QRIS: BIARKAN SEPERTI APA ADANYA
    setCheckingStatus(true);
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

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
      // ignore
    }

    setIsCryptoVerified(false);
    setIsProcessing(false);
    setIsSuccess(true);
    setCheckingStatus(false);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20">
      <div className="tk-container max-w-3xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={returnApp ? `/app/${returnApp}` : "/"}
            className="liquid-glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-fg-muted hover:text-fg transition-all active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>
              {returnApp
                ? (lang === "en" ? "Back to Checkout" : lang === "zh" ? "返回购买" : "Kembali ke Pembelian")
                : (lang === "en" ? "Back to Store" : lang === "zh" ? "返回商店" : "Kembali ke Toko")}
            </span>
          </Link>
        </div>

        {/* Liquid Glass Showcase Header */}
        <div className="mb-8">
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
                  {formatPrice(balance, lang)}
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
              {paymentMethod !== "qris" 
                ? (lang === "en" ? "Verifying Transaction On-Chain..." : lang === "zh" ? "正在链上验证交易..." : "Memverifikasi Transaksi On-Chain...") 
                : (lang === "en" ? "Processing Payment..." : lang === "zh" ? "正在处理付款..." : "Sedang Memproses...")}
            </h4>
            <p className="text-sm text-fg-muted max-w-[350px] mx-auto leading-relaxed">
              {paymentMethod !== "qris"
                ? (lang === "en" ? "Connecting to blockchain nodes to verify transaction status in real-time..." : lang === "zh" ? "正在连接区块链节点实时核查交易状态..." : "Sistem sedang memeriksa status hash transaksi ke node blockchain secara langsung...")
                : (lang === "en" ? "Please wait a moment while we verify your payment with the network." : lang === "zh" ? "请稍候，我们正在核对您的付款。" : "Mohon tunggu sebentar, kami sedang memverifikasi pembayaran Anda.")}
            </p>
          </motion.div>
        ) : isSuccess ? (
          /* SUCCESS STATE */
          isCryptoVerified ? (
            /* CRYPTO ON-CHAIN VERIFIED SUCCESS */
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="liquid-glass rounded-2xl p-8 sm:p-10 text-center shadow-sm"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>

              <span className="mt-5 inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {lang === "en" ? "Deposit Verified On-Chain!" : lang === "zh" ? "链上核验成功，已自动入账！" : "Deposit Berhasil Terverifikasi On-Chain!"}
              </span>

              <h2 className="mt-2 text-3xl sm:text-4xl font-black text-fg tracking-tight">
                +{lang === "id" ? formatRupiah((verifiedAmountUsd || selectedUsd) * USD_RATE) : `$${(verifiedAmountUsd || selectedUsd).toFixed(2)} USD`}
              </h2>
              <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {lang === "en"
                  ? `+$${verifiedAmountUsd || selectedUsd} USD Added Automatically to Your Balance!`
                  : lang === "zh"
                  ? `+$${verifiedAmountUsd || selectedUsd} USD 余额已全自动存入账户！`
                  : `+$${verifiedAmountUsd || selectedUsd} USD Saldo Otomatis Masuk ke Akun Anda!`}
              </p>

              <div className="mt-6 mx-auto max-w-sm text-left">
                <div className="rounded-2xl border border-border bg-surface-2 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">{lang === "en" ? "Status:" : lang === "zh" ? "状态：" : "Status:"}</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Check size={14} strokeWidth={3} /> {lang === "en" ? "Auto Verified" : lang === "zh" ? "自动核验成功" : "Berhasil Otomatis"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">{lang === "en" ? "Invoice:" : lang === "zh" ? "账单号：" : "Invoice:"}</span>
                    <span className="font-mono font-bold text-fg">{orderCode}</span>
                  </div>
                  <div className="text-xs pt-2 border-t border-border">
                    <span className="text-fg-muted block mb-1">{lang === "en" ? "Transaction Hash (TxID):" : lang === "zh" ? "交易哈希 (TxID)：" : "Hash Transaksi (TxID):"}</span>
                    <span className="font-mono text-[11px] font-bold text-fg break-all select-all block bg-surface p-2.5 rounded-xl border border-border">
                      {txId}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <ButtonLink
                  href={returnApp ? `/app/${returnApp}` : "/"}
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-fg text-surface font-bold text-sm px-8"
                >
                  <span>
                    {returnApp 
                      ? (lang === "en" ? "Continue App Purchase" : lang === "zh" ? "继续购买软件" : "Lanjut Pembelian Aplikasi")
                      : (lang === "en" ? "Return to Store" : lang === "zh" ? "返回商店" : "Kembali ke Toko")}
                  </span>
                  <ArrowRight size={15} />
                </ButtonLink>
              </div>
            </motion.div>
          ) : (
            /* QRIS PENDING STATE (UNTOUCHED) */
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
                {formatPrice(amountIdr, lang)}
              </h2>
              <p className="mt-1 text-sm font-semibold text-fg-muted">
                +${selectedUsd} USD • Invoice: <span className="text-fg font-mono font-bold">{orderCode}</span>
              </p>

              <div className="mt-6 mx-auto max-w-sm text-left">
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
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <ButtonLink
                  href={returnApp ? `/app/${returnApp}` : "/"}
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-fg text-surface font-bold text-sm px-8"
                >
                  <span>{returnApp ? "Lanjut Pembelian" : (lang === "en" ? "Done & Return" : lang === "zh" ? "完成并返回" : "Selesai & Ke Dashboard")}</span>
                </ButtonLink>
              </div>
            </motion.div>
          )
        ) : step === 1 ? (
          /* STEP 1: PILIH NOMINAL & METODE PEMBAYARAN */
          <div className="space-y-6">
            {/* Apple Liquid Glass Notice Banner */}
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
                    ? "Automatic credit upon verified blockchain payment."
                    : lang === "zh"
                    ? "付款链上核对后秒级自动存入账户。"
                    : "Kurs acuan 1 USD = Rp 17.904. Saldo langsung masuk otomatis setelah pembayaran terverifikasi on-chain."}
                </p>
              </div>
            </motion.div>

            {/* Presets Grid */}
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
                <span className="text-[11px] font-semibold text-fg-muted font-mono">
                  {lang === "en" || lang === "zh" ? "1 USDT ≈ 1 USD" : "Kurs 1 USDT = Rp 17.904"}
                </span>
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

              {/* Custom Input */}
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
                    <span className="text-xs uppercase font-bold text-fg-muted block mb-1">
                      {lang === "en" ? "IDR Equivalent" : lang === "zh" ? "折合印尼盾" : "Estimasi Rupiah"}
                    </span>
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

            {/* Payment Methods */}
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
                <span className="text-[11px] font-semibold text-fg-muted">
                  {lang === "en" ? "Instant Automated Verification" : lang === "zh" ? "秒级全自动核验" : "Verifikasi Otomatis"}
                </span>
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
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 border border-border/80 p-2 shadow-xs group-hover:scale-105 transition-transform">
                          <img src={pm.icon} alt={pm.id} className="h-7 w-7 object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold tracking-tight truncate ${active ? "text-accent" : "text-fg"}`}>
                            {pm.name[lang as keyof typeof pm.name] || pm.name.id}
                          </p>
                          <p className="text-xs text-fg-muted truncate mt-0.5">
                            {pm.desc[lang as keyof typeof pm.desc] || pm.desc.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                          active
                            ? "bg-accent border-accent text-accent-fg shadow-xs scale-105"
                            : "border-border-strong bg-surface"
                        }`}>
                          {active && <Check size={13} strokeWidth={3} />}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <Button
                size="lg"
                onClick={handleProceedToPayment}
                disabled={loading || selectedUsd < MIN_DEPOSIT_USD}
                loading={loading}
                className="w-full rounded-full bg-accent hover:opacity-90 text-accent-fg font-black text-sm shadow-md hover:scale-[1.01] active:scale-95 cursor-pointer py-4 transition-all flex items-center justify-center gap-2"
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
                  <span className="text-[11px] font-bold text-fg-muted uppercase tracking-wider">
                    {lang === "en" ? "Deposit Invoice" : lang === "zh" ? "充值账单" : "Kode Invoice Deposit"}
                  </span>
                  <p className="font-mono text-base font-black text-fg mt-0.5">{orderCode}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage("");
                  }}
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
                      {lang === "en"
                        ? `Ensure exact transfer of ${formatRupiah(totalPayIdr)} for automatic verification within 10-60s.`
                        : lang === "zh"
                        ? `请确保准确转账 ${formatRupiah(totalPayIdr)}，系统将在 10-60 秒内全自动入账。`
                        : `Pastikan mentransfer nominal pas ${formatRupiah(totalPayIdr)} agar sistem otomatis mengenali dana Anda dalam 10-60 detik.`}
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
                        <span>
                          {copiedField === "crypto-amt" 
                            ? (lang === "en" ? "Copied!" : lang === "zh" ? "已复制！" : "Disalin!") 
                            : (lang === "en" ? "Copy" : lang === "zh" ? "复制" : "Salin")}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  {(() => {
                    const pm = PAYMENT_METHODS.find((p) => p.id === paymentMethod);
                    return (
                      <div className="rounded-2xl liquid-tile p-4 space-y-2.5">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                          {lang === "en" ? "Network: " : lang === "zh" ? "网络: " : "Jaringan: "}{pm?.network}
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
                          <span>
                            {copiedField === "crypto-addr"
                              ? (lang === "en" ? "Wallet Address Copied!" : lang === "zh" ? "钱包地址已成功复制！" : "Alamat Wallet Berhasil Disalin!")
                              : (lang === "en" ? "Copy Wallet Address" : lang === "zh" ? "复制钱包地址" : "Salin Alamat Wallet")}
                          </span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* TxID WAJIB untuk Verifikasi Otomatis */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-fg flex items-center gap-1">
                        <span>{lang === "en" ? "Transaction Hash / TxID" : lang === "zh" ? "交易哈希 / TxID" : "Hash Transaksi / TxID Bukti Transfer"}</span>
                        <span className="text-rose-500 font-extrabold">
                          {lang === "en" ? "*REQUIRED" : lang === "zh" ? "*必填" : "*WAJIB"}
                        </span>
                      </label>
                      <span className="text-[11px] text-accent font-semibold flex items-center gap-1">
                        <Zap size={12} /> 
                        {lang === "en" ? "Auto On-Chain Verification" : lang === "zh" ? "区块链链上全自动验证" : "Auto On-Chain Blockchain"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={txId}
                      onChange={(e) => {
                        setTxId(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder={
                        paymentMethod === "usdt_bnb"
                          ? (lang === "en" ? "e.g. 0x123abc... (66-char BSC hash)" : lang === "zh" ? "例如：0x123abc... (66位 BSC 哈希)" : "Contoh: 0x123abc... (66 karakter hash BSC)")
                          : paymentMethod === "usdt_tron"
                          ? (lang === "en" ? "e.g. 84a7bc... (64-char TRON hash)" : lang === "zh" ? "例如：84a7bc... (64位 TRON 哈希)" : "Contoh: 84a7bc... (64 karakter hash TRON)")
                          : (lang === "en" ? "Paste transaction hash (TxID) from your wallet..." : lang === "zh" ? "粘贴钱包中的交易哈希 (TxID)..." : "Tempel hash transaksi (TxID) dari wallet Anda...")
                      }
                      className={`w-full rounded-xl border bg-surface px-4 py-3 text-xs font-mono font-medium text-fg focus:border-border-strong focus:outline-hidden transition-all ${
                        errorMessage ? "border-rose-500 ring-1 ring-rose-500/30" : "border-border"
                      }`}
                    />
                    <p className="mt-1.5 text-[11px] text-fg-muted leading-relaxed">
                      {lang === "en"
                        ? "⚡ Texas AI automatically verifies this transaction directly on the blockchain in real-time. If the TxID is invalid or not yet sent, the deposit will be rejected."
                        : lang === "zh"
                        ? "⚡ Texas AI 系统将实时直连区块链验证此交易真实性。如果 TxID 伪造或未转账，充值将被自动驳回。"
                        : "⚡ Sistem Texas AI akan memeriksa keaslian transaksi ini langsung ke blockchain secara real-time. Jika TxID palsu atau belum ditransfer, deposit otomatis ditolak."}
                    </p>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
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
                  {!checkingStatus && (
                    <span>
                      {lang === "en" ? "I Have Paid" : lang === "zh" ? "我已完成付款" : "Saya Sudah Melakukan Pembayaran"}
                    </span>
                  )}
                </Button>

                <p className="text-center text-[11.5px] text-fg-muted mt-1">
                  {lang === "en"
                    ? "Your balance will be credited instantly once the blockchain transaction is confirmed."
                    : lang === "zh"
                    ? "区块链交易确认后，充值金额将立即全自动计入您的账户余额。"
                    : "Saldo akun akan langsung otomatis bertambah setelah pembayaran terverifikasi di blockchain."}
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
