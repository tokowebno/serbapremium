"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle, Send } from "lucide-react";
import { formatPrice, USDT_RATE } from "@/lib/utils";

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

  const isSolana =
    paymentMethod?.toLowerCase().includes("solana") ||
    paymentMethod?.toLowerCase().includes("sol");
  const isTon =
    paymentMethod?.toLowerCase().includes("ton") ||
    paymentMethod?.toLowerCase().includes("gram");
  const isBep20 =
    paymentMethod?.toLowerCase().includes("bep20") ||
    paymentMethod?.toLowerCase().includes("bnb");
  const isCrypto =
    isSolana ||
    isTon ||
    paymentMethod?.toLowerCase().startsWith("usdt") ||
    paymentMethod?.toLowerCase().includes("bnb") ||
    paymentMethod?.toLowerCase().includes("tron");

  let cryptoNetwork = "Tron (TRC-20)";
  let cryptoAddress = "TQTpRn6j1Pfwf38xP8CxqxJi18YX4v8Wcm";
  let cryptoSymbol = "USDT";

  if (isSolana) {
    cryptoNetwork = "Solana (SPL)";
    cryptoAddress = "7JKwQ81LiXgKw4ekSCurNeqXk3jYv3vDMJcDyCLyW64Y";
    cryptoSymbol = "SOL / USDT";
  } else if (isTon) {
    cryptoNetwork = "The Open Network (TON)";
    cryptoAddress = "UQA2ka2a3umUuzmr3ymBM6x7FV3DZOLQ92fRsS_KdElex77P";
    cryptoSymbol = "TON / GRAM";
  } else if (isBep20) {
    cryptoNetwork = "BNB Smart Chain (BEP-20)";
    cryptoAddress = "0x141b43fCDb8D17c09e7b4235b2527309db674A27";
    cryptoSymbol = "BNB / USDT";
  }

  const rawUsd = total / USDT_RATE;
  const numId = parseInt((orderId || "").replace(/\D/g, "") || "123", 10);
  const decimalUnique = (numId % 100) / 10000;
  const usdtAmount = (rawUsd + decimalUnique).toFixed(4);

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
            {isCrypto
              ? lang === "en"
                ? "If you haven't completed the transfer yet, please send crypto to the wallet address below with the exact amount so your order can be fulfilled immediately."
                : lang === "zh"
                  ? "如果您尚未完成转账，请使用下方的钱包地址按准确金额转账，以便系统快速为您核对并交付。"
                  : "Jika Anda belum sempat transfer atau ingin menyelesaikan pembayaran, silakan kirim ke alamat wallet di bawah ini dengan nominal pas agar pesanan dapat segera diproses."
              : lang === "en"
                ? "If you haven't completed the scan or transfer yet, please make your payment by scanning the QRIS below with the exact amount so your order can be fulfilled immediately."
                : lang === "zh"
                  ? "如果您尚未完成扫码或转账，请使用下方的 QRIS 二维码按准确金额完成付款，以便系统快速为您核对并交付。"
                  : "Jika Anda belum sempat transfer atau ingin menyelesaikan pembayaran, silakan scan QRIS di bawah ini dengan nominal pas agar pesanan dapat segera diproses."}
          </p>
        </div>
      </div>

      {/* Konten QRIS */}
      {!isCrypto && (
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
              className="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-fg hover:bg-surface-3 transition-colors active:scale-95 cursor-pointer"
            >
              {copiedField === "qris-nominal" ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{lang === "en" ? "Copied" : lang === "zh" ? "已复制" : "Disalin"}</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>{lang === "en" ? "Copy" : lang === "zh" ? "复制" : "Salin"}</span>
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
              alt="QRIS TexasAi"
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

      {/* Konten Crypto (USDT, SOL, TON) */}
      {isCrypto && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-surface p-3 border border-border/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-fg-muted">
                {lang === "en"
                  ? `Total ${cryptoSymbol}`
                  : lang === "zh"
                  ? `应付 ${cryptoSymbol}`
                  : `Jumlah ${cryptoSymbol}`}
              </span>
              <span className="text-[11px] font-semibold text-accent">
                {lang === "en" || lang === "zh" ? "1 USDT ≈ 1 USD" : "1 USD ≈ Rp 16.500"}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-base font-bold text-fg tabular-nums">${usdtAmount} USD ({cryptoSymbol})</span>
              <button
                type="button"
                onClick={() => copyToClipboard(usdtAmount, "crypto-amount")}
                className="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-fg hover:bg-surface-3 transition-colors active:scale-95 cursor-pointer"
              >
                {copiedField === "crypto-amount" ? (
                  <Check size={12} className="text-emerald-500" />
                ) : (
                  <Copy size={12} />
                )}
                <span>{copiedField === "crypto-amount" ? (lang === "en" ? "Copied" : lang === "zh" ? "已复制" : "Disalin") : (lang === "en" ? "Copy" : lang === "zh" ? "复制" : "Salin")}</span>
              </button>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="rounded-xl bg-surface p-3 border border-border/80">
            <span className="text-[11px] font-semibold text-accent block">Network: {cryptoNetwork}</span>
            <p className="mt-1 font-mono text-[11px] text-fg break-all select-all">{cryptoAddress}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(cryptoAddress, "crypto-wallet")}
              className="mt-2 w-full flex items-center justify-center gap-1 rounded-lg bg-surface-2 py-1.5 text-xs font-semibold text-fg hover:bg-surface-3 transition-colors active:scale-95 cursor-pointer"
            >
              {copiedField === "crypto-wallet" ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{lang === "en" ? "Address Copied!" : lang === "zh" ? "地址已复制!" : "Alamat Disalin!"}</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>{lang === "en" ? "Copy Wallet Address" : lang === "zh" ? "复制钱包地址" : "Salin Alamat Wallet"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Telegram Admin Contact */}
      <div className="mt-3.5 pt-3 border-t border-amber-500/20 text-center">
        <a
          href="https://t.me/texxasai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#229ED9] hover:underline"
        >
          <Send size={12} className="fill-current" />
          <span>{lang === "en" ? "Need help? Contact Admin on Telegram: @texxasai" : lang === "zh" ? "需要协助？联系 Telegram 客服：@texxasai" : "Butuh bantuan? Hubungi Admin Telegram: @texxasai"}</span>
        </a>
      </div>
    </div>
  );
}
