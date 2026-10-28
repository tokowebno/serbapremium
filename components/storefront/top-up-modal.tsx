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
  Loader2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { formatRupiah, formatPrice, cn, USDT_RATE } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { supabase, supabaseReady } from "@/lib/supabase";

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
  const [isCryptoVerified, setIsCryptoVerified] = useState(false);
  const [verifiedAmountUsd, setVerifiedAmountUsd] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setIsCryptoVerified(false);
      setVerifiedAmountUsd(0);
      setIsProcessing(false);
      setCustomInput("");
      setTxId("");
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
  const usdtDecimalUnique = Number(((uniqueCode % 800 + 101) / 10000).toFixed(4));
  const totalUsdt = Number((selectedUsd + usdtDecimalUnique).toFixed(4));
  const totalPayIdr = paymentMethod === "qris" ? (borderpayData?.customer_pays || (amountIdr + uniqueCode)) : amountIdr;

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
          ? `Minimum deposit is $${MIN_DEPOSIT_USD} (approx ${formatPrice(MIN_DEPOSIT_IDR, lang)}).`
          : lang === "zh"
          ? `最低充值金额为 $${MIN_DEPOSIT_USD}（约合 ${formatPrice(MIN_DEPOSIT_IDR, lang)}）。`
          : `Minimal isi saldo adalah $${MIN_DEPOSIT_USD} (sekitar ${formatPrice(MIN_DEPOSIT_IDR, lang)}).`
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
    setErrorMessage("");

    // 1. KHUSUS CRYPTO: WAJIB TXID, VERIFIKASI STRICT TIMESTAMP & NOMINAL ON-CHAIN
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

      // Client-side anti-replay check
      const rawClaimed = localStorage.getItem("texasai:claimed_tx_ids") || "[]";
      let claimedList: string[] = [];
      try { claimedList = JSON.parse(rawClaimed); } catch {}
      if (claimedList.includes(cleanTx.toLowerCase())) {
        setErrorMessage(
          lang === "en"
            ? "This transaction hash has already been used for a deposit! Re-using past transactions is strictly prohibited."
            : lang === "zh"
            ? "该交易哈希已被使用过，严禁重复提交旧交易！"
            : "Hash transaksi ini SUDAH PERNAH DIGUNAKAN untuk deposit sebelumnya! Dilarang memakai transaksi lama atau milik orang lain."
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
            expected_amount_usd: totalUsdt, // Nominal unik 4 desimal
            order_id: orderCode,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.ok || !json.verified) {
          setIsProcessing(false);
          setCheckingStatus(false);
          let displayError = json.message;
          if (lang === "en") {
            if (json.message?.includes("kedaluwarsa") || json.message?.includes("KEDALUWARSA")) {
              displayError = "Transaction has expired (must be within the last 20 minutes).";
            } else if (json.message?.includes("tidak sesuai") || json.message?.includes("tidak cocok") || json.message?.includes("TIDAK COCOK")) {
              displayError = "Transferred crypto amount does not match the invoice amount.";
            } else if (json.message?.includes("sudah pernah") || json.message?.includes("SUDAH PERNAH")) {
              displayError = "This transaction hash has already been used for a previous deposit.";
            } else if (json.message?.includes("tidak valid") || json.message?.includes("Format")) {
              displayError = "Invalid TxID format. Please enter a valid transaction hash.";
            } else if (json.message?.includes("tidak ditemukan")) {
              displayError = "Transaction not found on the blockchain or still pending.";
            }
          } else if (lang === "zh") {
            if (json.message?.includes("kedaluwarsa") || json.message?.includes("KEDALUWARSA")) {
              displayError = "交易已过期（须在最近20分钟内完成）。";
            } else if (json.message?.includes("tidak sesuai") || json.message?.includes("tidak cocok") || json.message?.includes("TIDAK COCOK")) {
              displayError = "转账金额与账单金额不符，请核对。";
            } else if (json.message?.includes("sudah pernah") || json.message?.includes("SUDAH PERNAH")) {
              displayError = "该交易哈希已被使用过，无法重复提交。";
            } else if (json.message?.includes("tidak valid") || json.message?.includes("Format")) {
              displayError = "TxID 格式不正确，请填写有效哈希。";
            } else if (json.message?.includes("tidak ditemukan")) {
              displayError = "未在区块链上检测到该交易或仍在确认中。";
            }
          }
          setErrorMessage(displayError || json.message);
          return; // STOP! JANGAN TAMBAH SALDO!
        }

        // Record locally as claimed
        claimedList.push(cleanTx.toLowerCase());
        localStorage.setItem("texasai:claimed_tx_ids", JSON.stringify(claimedList));

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
      // ignore storage full
    }

    setIsCryptoVerified(false);
    setIsProcessing(false);
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
                    <span className="text-xs text-fg-muted">
                      {lang === "en" ? "Current Balance:" : lang === "zh" ? "当前余额：" : "Saldo Saat Ini:"}
                    </span>
                    <span className="text-xs font-bold text-accent tabular-nums">{formatPrice(balance, lang)}</span>
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
            ) : isProcessing ? (
              /* PROCESSING STATE */
              <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-accent" size={48} strokeWidth={2} />
                <h4 className="text-xl font-black tracking-tight text-fg">
                  {paymentMethod !== "qris" 
                    ? (lang === "en" ? "Verifying Transaction On-Chain..." : lang === "zh" ? "正在链上验证交易..." : "Memverifikasi Transaksi On-Chain...") 
                    : (lang === "en" ? "Processing Payment..." : lang === "zh" ? "正在处理付款..." : "Sedang Memproses...")}
                </h4>
                <p className="text-xs text-fg-muted max-w-[280px] mx-auto text-center">
                  {paymentMethod !== "qris" 
                    ? (lang === "en" ? "Verifying block timestamp and transferred amount directly with blockchain nodes..." : lang === "zh" ? "正在向区块链节点核验出块时间与准确金额..." : "Sistem sedang memeriksa status hash transaksi, waktu transfer, dan nominal ke node blockchain...")
                    : (lang === "en" ? "Please wait a moment while we verify your payment with the network." : lang === "zh" ? "请稍候，我们正在核对您的付款。" : "Mohon tunggu sebentar, kami sedang memverifikasi pembayaran Anda.")}
                </p>
              </div>
            ) : isSuccess ? (
              /* SUCCESS / PENDING STATE */
              isCryptoVerified ? (
                /* CRYPTO ON-CHAIN VERIFIED STATE */
                <div className="py-6 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>

                  <span className="mt-4 inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {lang === "en" ? "Deposit Verified On-Chain!" : lang === "zh" ? "链上核验成功，已自动入账！" : "Deposit Berhasil Terverifikasi On-Chain!"}
                  </span>

                  <h4 className="mt-2 text-2xl sm:text-3xl font-black text-fg">
                    +{lang === "id" ? formatRupiah((verifiedAmountUsd || selectedUsd) * USD_RATE) : `$${(verifiedAmountUsd || selectedUsd).toFixed(2)} USD`}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {lang === "en" 
                      ? `+$${verifiedAmountUsd || selectedUsd} USD Added Automatically to Your Balance!`
                      : lang === "zh"
                      ? `+$${verifiedAmountUsd || selectedUsd} USD 余额已全自动存入账户！`
                      : `+$${verifiedAmountUsd || selectedUsd} USD Saldo Otomatis Masuk ke Akun Anda!`}
                  </p>

                  <div className="mt-5 mx-auto max-w-sm rounded-xl border border-border bg-surface-2 p-3.5 text-left space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-fg-muted">{lang === "en" ? "Status:" : lang === "zh" ? "状态：" : "Status:"}</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <Check size={13} strokeWidth={3} /> {lang === "en" ? "Auto Verified" : lang === "zh" ? "自动核验成功" : "Berhasil Otomatis"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-fg-muted">{lang === "en" ? "Invoice:" : lang === "zh" ? "账单号：" : "Invoice:"}</span>
                      <span className="font-mono font-bold text-fg">{orderCode}</span>
                    </div>
                    <div className="text-xs pt-2 border-t border-border">
                      <span className="text-fg-muted block mb-1">{lang === "en" ? "Transaction Hash (TxID):" : lang === "zh" ? "交易哈希 (TxID)：" : "Hash Transaksi (TxID):"}</span>
                      <span className="font-mono text-[10.5px] font-bold text-fg break-all select-all block bg-surface p-2 rounded-lg border border-border">
                        {txId}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center gap-3">
                    <Button
                      size="lg"
                      onClick={closeTopUp}
                      className="rounded-full px-8 font-bold cursor-pointer bg-fg text-surface hover:opacity-90"
                    >
                      <span>{lang === "en" ? "Done & Use Balance" : lang === "zh" ? "完成并开始使用" : "Selesai & Gunakan Saldo"}</span>
                    </Button>
                  </div>
                </div>
              ) : (
                /* QRIS PENDING / WAITING STATE (UNTOUCHED) */
                <div className="py-6 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <Clock size={36} strokeWidth={2} />
                  </div>

                  <span className="mt-4 inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {lang === "en" ? "Waiting for Payment!" : lang === "zh" ? "等待付款！" : "Menunggu Pembayaran!"}
                  </span>

                  <h4 className="mt-2 text-2xl font-black text-fg">
                    {formatPrice(amountIdr, lang)}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-fg-muted">
                    +${selectedUsd} USD • Invoice: <span className="text-fg font-mono">{orderCode}</span>
                  </p>

                  <div className="mt-5 mx-auto max-w-sm text-left">
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-2 border border-border text-center">
                      <p className="text-xs font-bold text-fg mb-2">
                        {lang === "en" ? "Scan QRIS to Pay" : lang === "zh" ? "扫描 QRIS 付款" : "Scan QRIS untuk Membayar"}
                      </p>
                      <div className="relative rounded-lg border border-border bg-white p-2 shadow-sm">
                        <img
                          src="/qris.png"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                          }}
                          alt="QRIS"
                          className="h-32 w-32 object-contain"
                        />
                      </div>
                      <p className="text-[10px] text-fg-muted mt-2 px-2">
                        {lang === "en" ? "If you haven't paid yet, please complete your payment. Your balance will be added once confirmed." : lang === "zh" ? "如果您尚未付款，请完成付款。一旦确认将立即充值余额。" : "Jika Anda belum bayar, silakan selesaikan pembayaran ke QRIS di atas agar saldo dapat diproses."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center gap-3">
                    <Button
                      size="lg"
                      onClick={closeTopUp}
                      className="rounded-full px-8 font-bold cursor-pointer bg-fg text-surface hover:opacity-90"
                    >
                      <span>{lang === "en" ? "Done & Close" : lang === "zh" ? "完成并关闭" : "Selesai & Tutup"}</span>
                    </Button>
                  </div>
                </div>
              )
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
                          <span className={cn("text-[11px] font-semibold mt-1 tabular-nums", active ? "text-surface/80" : "text-fg-muted")}>
                            {formatRupiah(p.idr)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Input */}
                  <div className="mt-3">
                    <div className="relative flex items-center rounded-xl border border-border bg-surface shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-border-strong">
                      <span className="flex h-10 items-center px-3 bg-surface-2 border-r border-border text-xs font-bold text-fg select-none">
                        USD $
                      </span>
                      <input
                        type="number"
                        min={5}
                        step={1}
                        placeholder={
                          lang === "en"
                            ? "Custom USD (min $5)"
                            : lang === "zh"
                            ? "自定义金额（最低 $5）"
                            : "Ketik nominal custom (min $5)"
                        }
                        value={customInput}
                        onChange={handleCustomChange}
                        className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-bold text-fg focus:outline-hidden placeholder:text-fg-faint placeholder:font-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Payment Methods */}
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

                {errorMessage && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{errorMessage}</span>
                  </div>
                )}

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
                    <span>{lang === "en" ? "Continue Payment" : lang === "zh" ? "继续付款" : "Lanjut Bayar"}</span>
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Button>
                </div>
              </div>
            ) : (
              /* STEP 2: TAMPILAN BAYAR (QRIS / CRYPTO) */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.1] pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                      {lang === "en" ? "Deposit Invoice" : lang === "zh" ? "充值账单" : "Invoice Deposit"}
                    </span>
                    <p className="font-mono text-xs font-bold text-fg">{orderCode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMessage("");
                    }}
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
                      {lang === "en" ? "Total Payable" : lang === "zh" ? "总付款金额" : "Total Ditransfer"}
                    </span>
                    <span className="text-base font-black text-accent tabular-nums">
                      {paymentMethod === "qris" 
                        ? formatRupiah(totalPayIdr) 
                        : `${totalUsdt} ${paymentMethod === "solana" ? "SOL" : paymentMethod === "ton" ? "TON" : "USDT"}`}
                    </span>
                  </div>
                </div>

                {/* QRIS / Crypto specifics */}
                {paymentMethod === "qris" ? (
                  <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface-2 border-2 border-border text-center">
                    <span className="text-xs font-black text-fg mb-1">
                      {lang === "en" ? "Scan QRIS with Any Bank or E-Wallet App" : lang === "zh" ? "使用任何银行或电子钱包扫描 QRIS" : "Scan QRIS Menggunakan Aplikasi Bank atau E-Wallet Anda"}
                    </span>
                    <p className="text-[10.5px] text-fg-muted mb-3">
                      BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay
                    </p>
                    <p className="text-center text-[10.5px] font-bold text-accent px-2 mb-2">
                      {lang === "en" 
                        ? "Ensure exact amount transfer for automatic instant verification."
                        : lang === "zh"
                        ? "请确保转入准确金额，系统将在数秒内全自动入账。"
                        : "Pastikan transfer nominal sesuai hingga 3 digit terakhir (kode unik) agar saldo otomatis masuk."}
                    </p>
                    <div className="relative rounded-xl border border-border bg-white p-3 shadow-sm flex items-center justify-center">
                      <img
                        src="/qris.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                        }}
                        alt="QRIS Texas AI"
                        className="h-44 w-44 object-contain"
                      />
                    </div>
                    <div className="mt-4 bg-surface border-2 border-border rounded-full px-5 py-2 text-sm font-black text-fg tabular-nums shadow-[4px_4px_0_0_var(--color-border)]">
                      {lang === "en" ? "Amount:" : lang === "zh" ? "金额：" : "Nominal:"} {formatRupiah(totalPayIdr)}
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

                    {/* TxID WAJIB untuk Verifikasi Otomatis */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-black text-fg flex items-center gap-1">
                          <span>{lang === "en" ? "Transaction Hash / TxID" : lang === "zh" ? "交易哈希 / TxID" : "Hash Transaksi / TxID"}</span>
                          <span className="text-rose-500 font-bold">
                            {lang === "en" ? "*REQUIRED" : lang === "zh" ? "*必填" : "*WAJIB"}
                          </span>
                        </label>
                        <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
                          <Zap size={11} /> 
                          {lang === "en" ? "Instant On-Chain" : lang === "zh" ? "链上实时验证" : "Verifikasi Instan"}
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
                        className={cn(
                          "w-full rounded-xl border bg-surface px-3 py-2.5 text-xs font-mono font-medium text-fg focus:ring-2 focus:ring-border-strong focus:outline-hidden transition-all",
                          errorMessage ? "border-rose-500 ring-1 ring-rose-500/30" : "border-border"
                        )}
                      />
                      <p className="mt-1.5 text-[10px] text-fg-muted leading-tight">
                        {lang === "en"
                          ? "Instant on-chain verification. Please ensure the transfer matches the invoice amount (valid for 20 mins)."
                          : lang === "zh"
                          ? "区块链实时自动验证。请确保转账金额与账单一致（20分钟内有效）。"
                          : "Verifikasi otomatis via blockchain. Pastikan transfer sesuai nominal invoice (berlaku 20 menit)."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-start gap-2 animate-in fade-in">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
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
                    <span>{lang === "en" ? "I Have Paid" : lang === "zh" ? "我已完成付款" : "Saya Sudah Melakukan Pembayaran"}</span>
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
                <span>{lang === "en" ? "Open full top up page" : lang === "zh" ? "打开完整充值页面" : "Buka halaman lengkap isi saldo"}</span>
                <ExternalLink size={11} />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
