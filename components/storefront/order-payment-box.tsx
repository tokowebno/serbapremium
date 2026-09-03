"use client";

import { useState } from "react";
import { Copy, Check, QrCode, Wallet, MessageSquare, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderPaymentBoxProps {
  orderId: string;
  total: number;
  lang?: string;
}

export function OrderPaymentBox({ orderId, total, lang = "id" }: OrderPaymentBoxProps) {
  const [tab, setTab] = useState<"qris" | "usdt">("qris");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const usdtAddressTRC20 = "TTCkK7WjK4V9vHkZ3C5U6D2R1F8A9B3E";
  const usdtAddressBEP20 = "0x71C5e2c589647eeBBFFB7fc4691Ba95A78833974";
  const usdtAmount = (total / 16000).toFixed(2);

  const waMessage = encodeURIComponent(
    `Halo Admin SerbaPremium, saya ingin konfirmasi pembayaran untuk nomor pesanan: ${orderId} (Total: Rp ${total.toLocaleString("id-ID")})`
  );
  const waUrl = `https://wa.me/6281234567890?text=${waMessage}`;

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
            {lang === "en"
              ? "If you haven't transferred or completed the scan yet, please make your payment using the QRIS or USDT address below so your order can be fulfilled immediately."
              : lang === "zh"
              ? "如果您尚未完成转账或扫码，请使用下方的 QRIS 二维码或 USDT 地址完成付款，以便系统快速为您核对并交付。"
              : "Jika Anda belum sempat transfer atau ingin menyelesaikan pembayaran, silakan bayar melalui QRIS atau alamat USDT di bawah ini dengan nominal pas."}
          </p>
        </div>
      </div>

      {/* Tabs Pilihan Metode */}
      <div className="mt-4 flex rounded-xl bg-surface-2 p-1 border border-border/80">
        <button
          type="button"
          onClick={() => setTab("qris")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            tab === "qris"
              ? "bg-surface text-fg shadow-xs"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          <QrCode size={14} />
          <span>QRIS (IDR)</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("usdt")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            tab === "usdt"
              ? "bg-surface text-fg shadow-xs"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          <Wallet size={14} />
          <span>USDT / Crypto (USD)</span>
        </button>
      </div>

      {/* Konten QRIS */}
      {tab === "qris" && (
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

      {/* Konten USDT */}
      {tab === "usdt" && (
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

          {/* TRC20 Address */}
          <div className="rounded-xl bg-surface p-3 border border-border/80">
            <span className="text-[11px] font-semibold text-accent block">Network: TRC20 (Tron)</span>
            <p className="mt-1 font-mono text-[11px] text-fg break-all select-all">{usdtAddressTRC20}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(usdtAddressTRC20, "usdt-trc20")}
              className="mt-2 w-full flex items-center justify-center gap-1 rounded-lg bg-surface-2 py-1.5 text-xs font-semibold text-fg hover:bg-surface-3 transition-colors active:scale-95"
            >
              {copiedField === "usdt-trc20" ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{lang === "en" ? "TRC20 Address Copied!" : "Alamat TRC20 Disalin!"}</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>{lang === "en" ? "Copy TRC20 Address" : "Salin Alamat TRC20"}</span>
                </>
              )}
            </button>
          </div>

          {/* BEP20 Address */}
          <div className="rounded-xl bg-surface p-3 border border-border/80">
            <span className="text-[11px] font-semibold text-accent block">Network: BEP20 (BSC)</span>
            <p className="mt-1 font-mono text-[11px] text-fg break-all select-all">{usdtAddressBEP20}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(usdtAddressBEP20, "usdt-bep20")}
              className="mt-2 w-full flex items-center justify-center gap-1 rounded-lg bg-surface-2 py-1.5 text-xs font-semibold text-fg hover:bg-surface-3 transition-colors active:scale-95"
            >
              {copiedField === "usdt-bep20" ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{lang === "en" ? "BEP20 Address Copied!" : "Alamat BEP20 Disalin!"}</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>{lang === "en" ? "Copy BEP20 Address" : "Salin Alamat BEP20"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Help / Confirmation Button */}
      <div className="mt-3.5 pt-3 border-t border-amber-500/20">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors active:scale-98"
        >
          <MessageSquare size={14} />
          <span>{lang === "en" ? "Confirm Payment via WhatsApp" : lang === "zh" ? "通过 WhatsApp 联系客服确认" : "Konfirmasi Pembayaran via WhatsApp"}</span>
        </a>
      </div>
    </div>
  );
}
