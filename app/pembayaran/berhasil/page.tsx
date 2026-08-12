"use client";

import { motion } from "framer-motion";
import { Clock, Download, Library, PackageCheck } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useHydrated } from "@/lib/use-hydrated";
import { formatDate, formatRupiah } from "@/lib/utils";

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
    const raw = sessionStorage.getItem("tokono:last-order");
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
  const order = useSyncExternalStore(noopSubscribe, readLastOrder, () => null);
  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (!order) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={PackageCheck}
          title="Tidak ada pesanan terbaru"
          description="Selesaikan pembayaran untuk melihat ringkasan pesanan Anda."
          action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
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
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Pembayaran sedang diproses.</h1>
          <p className="mt-1.5 text-sm text-fg-muted">
            Terima kasih! Kami memverifikasi pembayaran Anda. Aplikasi akan masuk ke koleksi setelah
            terverifikasi.
          </p>
        </div>

        <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface-2 px-4 text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">Nomor Pesanan</dt>
            <dd className="font-mono font-semibold tabular-nums">{order.id}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">Tanggal</dt>
            <dd className="tabular-nums">{formatDate(order.date)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">Total</dt>
            <dd className="font-semibold tabular-nums">{formatRupiah(order.total)}</dd>
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
            <Download size={16} /> Unduh
          </ButtonLink>
          <ButtonLink href="/akun/koleksi" variant="secondary">
            <Library size={16} /> Buka Koleksi
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
