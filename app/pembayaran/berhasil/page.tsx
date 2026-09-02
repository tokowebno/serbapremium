"use client";

import { motion } from "framer-motion";
import { Clock, Search, Library, PackageCheck, ShoppingBag } from "lucide-react";
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
        className="w-full max-w-md rounded-xl border-2 border-border bg-surface p-8 shadow-[5px_5px_0px_var(--shadow-color)]"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-accent-yellow shadow-[2px_2px_0px_var(--shadow-color)]">
            <Clock size={28} className="text-black" strokeWidth={2.5} />
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-fg">
            {lang === "en" ? "Payment is being processed." : lang === "zh" ? "支付正在处理中。" : "Pembayaran sedang diproses."}
          </h1>
          <p className="mt-1.5 text-xs font-bold leading-relaxed text-fg-muted">
            {lang === "en"
              ? "Thank you! We are verifying your payment. Apps will appear in your collection once verified."
              : lang === "zh"
              ? "谢谢！我们正在核实您的付款。验证完成后，应用将存入您的收藏。"
              : "Terima kasih! Kami memverifikasi pembayaran Anda. Aplikasi akan masuk ke koleksi setelah terverifikasi."}
          </p>
        </div>

        <dl className="mt-6 divide-y divide-border rounded-lg border-2 border-border bg-surface-2 px-4 text-sm shadow-[2px_2px_0px_var(--shadow-color)]">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-black uppercase text-fg-muted">{lang === "en" ? "Order Number" : lang === "zh" ? "订单编号" : "Nomor Pesanan"}</dt>
            <dd className="font-mono font-black tabular-nums text-fg">{order.id}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-black uppercase text-fg-muted">{lang === "en" ? "Date" : lang === "zh" ? "日期" : "Tanggal"}</dt>
            <dd className="text-xs font-bold tabular-nums text-fg">{formatDate(order.date)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-black uppercase text-fg-muted">{lang === "en" ? "Total" : lang === "zh" ? "总额" : "Total"}</dt>
            <dd className="font-black tabular-nums text-fg">{formatPrice(order.total, lang)}</dd>
          </div>
        </dl>

        <ul className="mt-4 divide-y divide-border rounded-lg border-2 border-border px-4 text-sm bg-surface">
          {order.items.map((item) => (
            <li key={item.name + item.platform} className="flex items-center justify-between gap-3 py-3">
              <span className="font-black text-xs text-fg">{item.name}</span>
              <span className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.2 text-[10px] font-bold text-fg-muted">{item.platform}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons: Cek Status Pesanan & Buka Koleksi */}
        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href={`/cek-pesanan?id=${order.id}`} size="lg" className="w-full">
            <Search size={16} strokeWidth={2.8} /> {lang === "en" ? "Check Order Status" : lang === "zh" ? "查询订单状态" : "Cek Status Pesanan"}
          </ButtonLink>
          <ButtonLink href="/akun/koleksi" variant="secondary" size="lg" className="w-full">
            <Library size={16} strokeWidth={2.5} /> {lang === "en" ? "Open My Collection" : lang === "zh" ? "打开我的收藏" : "Buka Koleksi Saya"}
          </ButtonLink>
          <ButtonLink href="/aplikasi" variant="ghost" size="sm" className="w-full text-xs font-bold text-fg-muted hover:text-fg">
            <ShoppingBag size={14} /> {lang === "en" ? "Continue Shopping" : lang === "zh" ? "继续选购" : "Lanjut Belanja"}
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
