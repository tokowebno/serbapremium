"use client";

import { motion } from "framer-motion";
import { Clock, Download, Library, PackageCheck } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useHydrated } from "@/lib/use-hydrated";
import { formatDate, formatPrice } from "@/lib/utils";
import { useTranslation } from "@/components/storefront/i18n-provider";

interface LastOrder {
  id: string;
  date: string;
  items: Array<{ name: string; platform: string }>;
  total: number;
}

// Snapshot di-cache agar referensi stabil — syarat useSyncExternalStore.
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
        className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
            <Clock size={24} className="text-warning" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            {lang === "en" ? "Payment is being processed." : lang === "zh" ? "支付正在处理中。" : "Pembayaran sedang diproses."}
          </h1>
          <p className="mt-1.5 text-sm text-fg-muted">
            {lang === "en"
              ? "Thank you! We are verifying your payment. Apps will be added to your collection once verified."
              : lang === "zh"
              ? "谢谢！我们正在核实您的付款。验证完成后，应用将存入您的收藏。"
              : "Terima kasih! Kami memverifikasi pembayaran Anda. Aplikasi akan masuk ke koleksi setelah terverifikasi."}
          </p>
        </div>

        <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface-2 px-4 text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">{lang === "en" ? "Order Number" : lang === "zh" ? "订单编号" : "Nomor Pesanan"}</dt>
            <dd className="font-mono font-semibold tabular-nums">{order.id}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">{lang === "en" ? "Date" : lang === "zh" ? "日期" : "Tanggal"}</dt>
            <dd className="tabular-nums">{formatDate(order.date)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">{lang === "en" ? "Total" : lang === "zh" ? "总额" : "Total"}</dt>
            <dd className="font-semibold tabular-nums">{formatPrice(order.total, lang)}</dd>
          </div>
        </dl>

        <ul className="mt-4 divide-y divide-border rounded-lg border border-border px-4 text-sm">
          {order.items.map((item) => (
            <li key={item.name + item.platform} className="flex items-center justify-between gap-3 py-3">
              <span className="font-medium">{item.name}</span>
              <span className="text-fg-muted">{item.platform}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href="/akun/koleksi">
            <Download size={16} /> {lang === "en" ? "Download" : lang === "zh" ? "下载" : "Unduh"}
          </ButtonLink>
          <ButtonLink href="/akun/koleksi" variant="secondary">
            <Library size={16} /> {lang === "en" ? "Open Collection" : lang === "zh" ? "打开我的收藏" : "Buka Koleksi"}
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
