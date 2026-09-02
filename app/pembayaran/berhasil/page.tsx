"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, Library, PackageCheck } from "lucide-react";
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

let cachedRaw: string | null = null;
let cachedOrder: LastOrder | null = null;

function readLastOrder(): LastOrder | null {
  try {
    const raw = sessionStorage.getItem("serbapremium:last-order") || sessionStorage.getItem("tokono:last-order");
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
          description="Selesaikan proses checkout untuk melihat ringkasan pesanan Anda."
          action={{ label: "Jelajahi Katalog", href: "/aplikasi" }}
        />
      </div>
    );
  }

  return (
    <div className="tk-container flex justify-center pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md rounded-lg border-2 border-border bg-surface p-8 shadow-[6px_6px_0px_var(--shadow-color)]"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-sm border-2 border-border bg-accent text-black shadow-[2px_2px_0px_var(--shadow-color)]">
            <CheckCircle2 size={30} strokeWidth={2.5} />
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-fg">Pesanan Berhasil Diproses!</h1>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-fg-muted">
            Terima kasih telah berbelanja di SerbaPremium. Lisensi/akun Anda akan segera aktif dan dapat diakses dari menu Koleksi Saya.
          </p>
        </div>

        <dl className="mt-6 divide-y-2 divide-border rounded-md border-2 border-border bg-surface-2 px-4 text-sm font-bold">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">Nomor Pesanan</dt>
            <dd className="font-mono font-black tabular-nums text-fg">{order.id}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">Tanggal Transaksi</dt>
            <dd className="tabular-nums text-fg">{formatDate(order.date)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-fg-muted">Total Bayar</dt>
            <dd className="font-black tabular-nums text-fg">{formatRupiah(order.total)}</dd>
          </div>
        </dl>

        <ul className="mt-4 divide-y-2 divide-border rounded-md border-2 border-border bg-surface px-4 text-sm font-bold">
          {order.items.map((item) => (
            <li key={item.name + item.platform} className="flex items-center justify-between gap-3 py-3">
              <span className="font-black text-fg">{item.name}</span>
              <span className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.2 text-xs text-fg-muted">
                {item.platform}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href="/akun/koleksi">
            <Download size={16} strokeWidth={2.5} /> Buka Koleksi Saya
          </ButtonLink>
          <ButtonLink href="/aplikasi" variant="secondary">
            <Library size={16} strokeWidth={2.5} /> Lanjut Belanja
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  );
}
