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
        <h1 className="text-[26px] font-semibold tracking-[-0.025em] sm:text-3xl">Cek Pesanan</h1>
        <p className="mt-2 text-sm leading-6 text-fg-muted">
          Masukkan nomor pesanan Anda (contoh: TK-123456) untuk melihat status pembayaran dan pesanan.
        </p>

        <form onSubmit={cari} className="mt-6 flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="TK-123456"
            className="font-mono uppercase"
            aria-label="Nomor pesanan"
          />
          <Button type="submit" disabled={loading}>
            <Search size={15} />
            {loading ? "Mencari…" : "Cari"}
          </Button>
        </form>

        {notFound && (
          <EmptyState
            icon={Search}
            title="Pesanan tidak ditemukan."
            description="Periksa kembali nomor pesanan Anda. Pastikan nomor yang dimasukkan sudah benar."
            className="mt-4"
          />
        )}

        {result && (
          <div className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-lg font-semibold tracking-tight">{result.id}</p>
                <p className="text-[13px] text-fg-muted">{result.user_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={result.payment_status} />
                <StatusBadge status={result.order_status} />
              </div>
            </div>

            <ul className="mt-4 divide-y divide-border">
              {result.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-fg-muted">
                    {item.platform} · {formatRupiah(item.price)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-2 flex justify-between border-t border-border pt-3 text-sm">
              <span className="text-fg-muted">Total dibayar</span>
              <span className="font-semibold tabular-nums">{formatRupiah(result.total)}</span>
            </div>

            <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-[13px] leading-5 text-accent">
              {result.payment_status === "menunggu"
                ? "Pembayaran sedang diverifikasi. Pesanan diproses setelah pembayaran terkonfirmasi."
                : result.payment_status === "dibayar"
                  ? "Pembayaran telah dikonfirmasi. Aplikasi bisa diunduh dari Koleksi Saya."
                  : "Status pesanan Anda diperbarui oleh admin."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}