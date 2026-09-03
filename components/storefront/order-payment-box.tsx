"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle, Send } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderPaymentBoxProps {
  orderId: string;
  total: number;
  paymentMethod?: string;
  lang?: string;
}

export function OrderPaymentBox({
  orderId,
  total,
  paymentMethod = "qris",
  lang = "id",
}: OrderPaymentBoxProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isUsdt = paymentMethod?.toLowerCase().startsWith("usdt");
  const isBep20 = paymentMethod?.toLowerCase().includes("bep20");
  const usdtAddress = isBep20
    ? "0x71C5e2c589647eeBBFFB7fc4691Ba95A78833974"
    : "TTCkK7WjK4V9vHkZ3C5U6D2R1F8A9B3E";
  const usdtNetwork = isBep20 ? "BEP20 (BSC)" : "TRC20 (Tron)";
  const usdtAmount = (total / 16000).toFixed(2);

  return (
    <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 text-left">
      {/* Alert Header */}
      <div className="flex items-start gap-2.5">
        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-fg">
            {lang === "en"
              ? "Payment Verification in Progress"
              : lang === "zh"
              ? "款项核验处理中"
              : "Status: Sedang Dalam Proses Verifikasi"}
          </h4>
          <p className="mt-1 text-xs font-normal leading-relaxed text-fg-muted">
            {isUsdt
              ? lang === "en"
                ? "If you haven't completed the transfer yet, please send USDT to the wallet address below with the exact amount so your order can be fulfilled immediately."
                : lang === "zh"
                ? "如果您尚未完成转账，请使用下方的 USDT 钱包地址按准确金额转账，以便系统快速为您核对并交付。"
                : "Jika Anda belum sempat transfer atau ingin menyelesaikan pembayaran, silakan kirim ke alamat USDT di bawah ini dengan nominal pas agar pesanan dapat segera diproses."
              : lang === "en"
              ? "If you haven't completed the scan or transfer yet, please make your payment by scanning the QRIS below with the exact amount so your order can be fulfilled immediately."
              : lang === "zh"
              ? "如果您尚未完成扫码或转账，请使用下方的 QRIS 二维码按准确金额完成付款，以便系统快速为您核对并交付。"
              : "Jika Anda belum sempat transfer atau ingin menyelesaikan pembayaran, silakan scan QRIS di bawah ini dengan nominal pas agar pesanan dapat segera diproses."}
          </p>
        </div>
      </div>

      {/* Konten QRIS (Hanya muncul jika metode pembayaran QRIS) */}
      {!isUsdt && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="w-full flex items-center justify-between rounded-xl bg-surface px-3.5 py-2.5 border border-border/80">
            <div>
              <span className="text-[11px] font-medium text-fg-muted block">
                {lang === "en" ? "Amount to Pay" : lang === "zh" ? "应付金额" : "Nominal yang Harus Dibayar"}
              </span>
              <span className="text-base font-bold text-accent tabular-nums">
                {formatPrice(total, lang)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(total.toString(), "qris-nominal")}
              className="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-fg hover:bg-surface-3 transition-colors active:scale-95"
            >
              {copiedField === "qris-nominal" ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{lang === "en" ? "Copied" : "Disalin"}</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>{lang === "en" ? "Copy" : "Salin"}</span>
                </>
              )}
            </button>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-border/80 bg-white p-2 shadow-xs">
            <img
              src="/qris.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
              }}
              alt="QRIS SerbaPremium"
              className="h-44 w-44 object-contain"
            />
          </div>

          <p className="text-center text-[11px] font-normal text-fg-muted leading-relaxed max-w-xs">
            {lang === "en"
              ? "Scan with any Indonesian Mobile Banking or E-Wallet (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay)."
              : lang === "zh"
              ? "支持印尼所有主流网银与电子钱包扫码（BCA、Mandiri、GoPay、OVO、DANA、ShopeePay）。"
              : "Pindai menggunakan aplikasi m-Banking atau e-Wallet (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, dll)."}
          </p>
        </div>
      )}

      {/* Konten USDT (Hanya muncul jika metode pembayaran USDT) */}
      {isUsdt && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-surface p-3 border border-border/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-fg-muted">
                {lang === "en" ? "Total USDT" : lang === "zh" ? "应付 USDT" : "Jumlah USDT"}
              </span>
              <span className="text-[11px] font-semibold text-accent">1 USDT ≈ $1 USD</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-base font-bold text-fg tabular-nums">{usdtAmount} USDT</span>
              <button
                type="button"
                onClick={() => copyToClipboard(usdtAmount, "usdt-amount")}
                className="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-fg hover:bg-surface-3 transition-colors active:scale-95"
              >
                {copiedField === "usdt-amount" ? (
                  <Check size={12} className="text-emerald-500" />
                ) : (
                  <Copy size={12} />
                )}
                <span>{copiedField === "usdt-amount" ? (lang === "en" ? "Copied" : "Disalin") : (lang === "en" ? "Copy" : "Salin")}</span>
              </button>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="rounded-xl bg-surface p-3 border border-border/80">
            <span className="text-[11px] font-semibold text-accent block">Network: {usdtNetwork}</span>
            <p className="mt-1 font-mono text-[11px] text-fg break-all select-all">{usdtAddress}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(usdtAddress, "usdt-wallet")}
              className="mt-2 w-full flex items-center justify-center gap-1 rounded-lg bg-surface-2 py-1.5 text-xs font-semibold text-fg hover:bg-surface-3 transition-colors active:scale-95"
            >
              {copiedField === "usdt-wallet" ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{lang === "en" ? "Address Copied!" : "Alamat Disalin!"}</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>{lang === "en" ? "Copy Wallet Address" : "Salin Alamat Wallet"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Telegram Admin Contact */}
      <div className="mt-3.5 pt-3 border-t border-amber-500/20 text-center">
        <a
          href="https://t.me/serbapremiumy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#229ED9] hover:underline"
        >
          <Send size={12} className="fill-current" />
          <span>{lang === "en" ? "Need help? Contact Admin on Telegram: @serbapremiumy" : lang === "zh" ? "需要协助？联系 Telegram 客服：@serbapremiumy" : "Butuh bantuan? Hubungi Admin Telegram: @serbapremiumy"}</span>
        </a>
      </div>
    </div>
  );
}
