"use client";

import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/form";
import { StatusBadge } from "@/components/admin/status-badge";
import { supabase, supabaseReady } from "@/lib/supabase";
import { formatRupiah } from "@/lib/utils";

interface OrderResult {
  id: string;
  user_name: string;
  items: Array<{ name: string; platform: string; price: number }>;
  total: number;
  payment_status: string;
  order_status: string;
  date: string;
}

export default function CekPesananPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const cari = async (e: FormEvent) => {
    e.preventDefault();
    const id = code.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      if (!supabaseReady) throw new Error("db tidak tersedia");
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setResult(data as unknown as OrderResult);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mx-auto max-w-xl">
        <div className="mb-2">
          <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
            LACAK TRANSAKSI
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-fg sm:text-3xl">Cek Status Pesanan</h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-fg-muted">
          Masukkan nomor pesanan Anda (contoh: TK-123456 atau SP-123456) untuk melihat status pembayaran dan pengiriman lisensi.
        </p>

        <form onSubmit={cari} className="mt-6 flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="TK-123456"
            className="font-mono uppercase font-bold"
            aria-label="Nomor pesanan"
          />
          <Button type="submit" disabled={loading}>
            <Search size={16} strokeWidth={2.5} />
            {loading ? "Mencari…" : "Cari Pesanan"}
          </Button>
        </form>

        {notFound && (
          <EmptyState
            icon={Search}
            title="Pesanan tidak ditemukan"
            description="Periksa kembali nomor pesanan Anda. Pastikan kode yang dimasukkan sudah sesuai dengan bukti checkout."
            className="mt-6"
          />
        )}

        {result && (
          <div className="mt-6 rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border pb-4">
              <div>
                <p className="font-mono text-xl font-black tracking-tight text-fg">{result.id}</p>
                <p className="text-xs font-bold text-fg-muted">Nama: {result.user_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={result.payment_status} />
                <StatusBadge status={result.order_status} />
              </div>
            </div>

            <ul className="mt-4 divide-y-2 divide-border">
              {result.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="font-bold text-fg">{item.name}</span>
                  <span className="text-xs font-bold text-fg-muted">
                    {item.platform} · {formatRupiah(item.price)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between border-t-2 border-border pt-4 text-base font-black">
              <span className="text-fg-muted">Total Pembayaran</span>
              <span className="tabular-nums text-fg">{formatRupiah(result.total)}</span>
            </div>

            <p className="mt-4 rounded-sm border-2 border-border bg-accent px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0px_var(--shadow-color)]">
              {result.payment_status === "menunggu"
                ? "Pembayaran sedang diverifikasi. Pesanan akan segera diproses setelah dana terkonfirmasi."
                : result.payment_status === "dibayar"
                  ? "Pembayaran telah dikonfirmasi! Akun/lisensi Anda siap diakses di menu Koleksi Saya."
                  : "Status pesanan Anda telah diperbarui oleh sistem SerbaPremium."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}