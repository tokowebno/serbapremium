"use client";

import { motion } from "framer-motion";
import { Clock, Search, Library, PackageCheck, ShoppingBag } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useHydrated } from "@/lib/use-hydrated";
import { formatDate, formatPrice } from "@/lib/utils";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { OrderPaymentBox } from "@/components/storefront/order-payment-box";

interface LastOrder {
  id: string;
  date: string;
  items: Array<{ name: string; platform: string }>;
  total: number;
}

let cachedRaw: string | null = null;
let cachedOrder: LastOrder | null = null;

function readLastOrder(): LastOrder | null {
  try {
    const raw =
      sessionStorage.getItem("tokono:last-order") ||
      sessionStorage.getItem("serbapremium:last-order");
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedOrder = raw ? (JSON.parse(raw) as LastOrder) : null;
    }
    return cachedOrder;
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

export default function OrderSuccessPage() {
  const { lang } = useTranslation();
  const order = useSyncExternalStore(noopSubscribe, readLastOrder, () => null);
  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (!order) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={PackageCheck}
          title={lang === "en" ? "No recent orders" : lang === "zh" ? "无近期订单" : "Tidak ada pesanan terbaru"}
          description={lang === "en" ? "Complete a payment to see your order summary." : lang === "zh" ? "完成付款以查看订单摘要。" : "Selesaikan pembayaran untuk melihat ringkasan pesanan Anda."}
          action={{ label: lang === "en" ? "Explore Apps" : lang === "zh" ? "浏览应用" : "Jelajahi Aplikasi", href: "/aplikasi" }}
        />
      </div>
    );
  }

  return (
    <div className="tk-container flex justify-center pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card w-full max-w-md rounded-2xl border border-border/80 bg-surface/90 p-6 sm:p-8 shadow-sm backdrop-blur-md"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
            <Clock size={28} strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-fg">
            {lang === "en" ? "Payment is being processed." : lang === "zh" ? "支付正在处理中。" : "Pembayaran sedang diproses."}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-normal leading-relaxed text-fg-muted">
            {lang === "en"
              ? "Thank you! We are verifying your payment. Apps will appear in your collection once verified."
              : lang === "zh"
              ? "谢谢！我们正在核实您的付款。验证完成后，应用将存入您的收藏。"
              : "Terima kasih! Kami memverifikasi pembayaran Anda. Aplikasi akan masuk ke koleksi setelah terverifikasi."}
          </p>
        </div>

        <dl className="mt-6 divide-y divide-border/60 rounded-xl border border-border/70 bg-surface-2/70 px-4 text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-medium uppercase text-fg-muted">{lang === "en" ? "Order Number" : lang === "zh" ? "订单编号" : "Nomor Pesanan"}</dt>
            <dd className="font-mono font-bold tabular-nums text-fg">{order.id}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-medium uppercase text-fg-muted">{lang === "en" ? "Date" : lang === "zh" ? "日期" : "Tanggal"}</dt>
            <dd className="text-xs font-normal tabular-nums text-fg-muted">{formatDate(order.date)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-medium uppercase text-fg-muted">{lang === "en" ? "Total" : lang === "zh" ? "总额" : "Total"}</dt>
            <dd className="font-bold tabular-nums text-accent">{formatPrice(order.total, lang)}</dd>
          </div>
        </dl>

        <ul className="mt-4 divide-y divide-border/60 rounded-xl border border-border/70 px-4 text-sm bg-surface/80">
          {order.items.map((item) => (
            <li key={item.name + item.platform} className="flex items-center justify-between gap-3 py-3">
              <span className="font-semibold text-xs sm:text-sm text-fg">{item.name}</span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-fg-muted ring-1 ring-border/50">{item.platform}</span>
            </li>
          ))}
        </ul>

        {/* Kotak Info Pembayaran QRIS & USDT jika belum bayar / sedang proses */}
        <OrderPaymentBox orderId={order.id} total={order.total} lang={lang} />

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <ButtonLink href={`/cek-pesanan?id=${order.id}`} size="lg" className="w-full rounded-full">
            <Search size={16} strokeWidth={2} /> {lang === "en" ? "Check Order Status" : lang === "zh" ? "查询订单状态" : "Cek Status Pesanan"}
          </ButtonLink>
          <ButtonLink href="/akun/koleksi" variant="secondary" size="lg" className="w-full rounded-full">
            <Library size={16} strokeWidth={2} /> {lang === "en" ? "Open My Collection" : lang === "zh" ? "打开我的收藏" : "Buka Koleksi Saya"}
          </ButtonLink>
          <ButtonLink href="/aplikasi" variant="ghost" size="sm" className="w-full text-xs font-medium text-fg-muted hover:text-fg">
            <ShoppingBag size={14} /> {lang === "en" ? "Continue Shopping" : lang === "zh" ? "继续选购" : "Lanjut Belanja"}
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
