"use client";

import { Search } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/form";
import { StatusBadge } from "@/components/admin/status-badge";
import { supabase, supabaseReady } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "@/components/storefront/i18n-provider";

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
  const { lang, t } = useTranslation();
  const searchParams = useSearchParams();
  const queryId = searchParams?.get("id") || searchParams?.get("orderId") || "";

  const [code, setCode] = useState(queryId);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async (orderId: string) => {
    const id = orderId.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      if (!supabaseReady) throw new Error("db not ready");
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

  useEffect(() => {
    if (queryId) {
      setCode(queryId);
      fetchOrder(queryId);
    }
  }, [queryId]);

  const cari = (e: FormEvent) => {
    e.preventDefault();
    fetchOrder(code);
  };

  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mx-auto max-w-xl">
        <div className="mb-2">
          <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
            {lang === "en" ? "ORDER TRACKER" : lang === "zh" ? "订单实时追踪" : "LACAK TRANSAKSI"}
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-fg sm:text-3xl">
          {t.navbar?.checkOrder || "Cek Status Pesanan"}
        </h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-fg-muted">
          {lang === "en"
            ? "Enter your order ID (e.g. SP-123456 or TK-123456) to check realtime payment verification and license delivery status."
            : lang === "zh"
            ? "请输入您的订单号（例如 SP-123456 或 TK-123456）以查询支付核验状态与数字授权交付进度。"
            : "Masukkan nomor pesanan Anda (contoh: SP-123456 atau TK-123456) untuk melihat status pembayaran dan pengiriman lisensi."}
        </p>

        <form onSubmit={cari} className="mt-6 flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SP-123456"
            className="font-mono uppercase font-bold"
            aria-label="Nomor pesanan"
          />
          <Button type="submit" disabled={loading}>
            <Search size={16} strokeWidth={2.5} />
            {loading ? (lang === "en" ? "Searching…" : lang === "zh" ? "查询中…" : "Mencari…") : (lang === "en" ? "Track Order" : lang === "zh" ? "查询订单" : "Cari Pesanan")}
          </Button>
        </form>

        {notFound && (
          <EmptyState
            icon={Search}
            title={lang === "en" ? "Order not found" : lang === "zh" ? "未找到该订单" : "Pesanan tidak ditemukan"}
            description={lang === "en" ? "Please verify your order ID. Make sure it matches the receipt from your checkout." : lang === "zh" ? "请检查您输入的订单号是否与结账时的凭据一致。" : "Periksa kembali nomor pesanan Anda. Pastikan kode yang dimasukkan sudah sesuai dengan bukti checkout."}
            className="mt-6"
          />
        )}

        {result && (
          <div className="mt-6 rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border pb-4">
              <div>
                <p className="font-mono text-xl font-black tracking-tight text-fg">{result.id}</p>
                <p className="text-xs font-bold text-fg-muted">{lang === "en" ? "Customer:" : lang === "zh" ? "客户姓名:" : "Nama:"} {result.user_name}</p>
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
                    {item.platform} · {formatPrice(item.price, lang)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between border-t-2 border-border pt-4 text-base font-black">
              <span className="text-fg-muted">{t.checkout?.total || "Total Pembayaran"}</span>
              <span className="tabular-nums text-fg">{formatPrice(result.total, lang)}</span>
            </div>

            <p className="mt-4 rounded-sm border-2 border-border bg-accent px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0px_var(--shadow-color)]">
              {result.payment_status === "menunggu"
                ? (lang === "en" ? "Payment is being verified. Your order will be processed shortly after confirmation." : lang === "zh" ? "付款正在核验中，确认收到款项后将立即为您处理发货。" : "Pembayaran sedang diverifikasi. Pesanan akan segera diproses setelah dana terkonfirmasi.")
                : result.payment_status === "dibayar"
                  ? (lang === "en" ? "Payment confirmed! Your digital license and credentials are ready in My Collection." : lang === "zh" ? "付款已确认！您的账号与数字授权已可在 我的收藏 中查看。" : "Pembayaran telah dikonfirmasi! Akun/lisensi Anda siap diakses di menu Koleksi Saya.")
                  : (lang === "en" ? "Your order status has been updated by SerbaPremium." : lang === "zh" ? "您的订单状态已由 SerbaPremium 系统更新。" : "Status pesanan Anda telah diperbarui oleh sistem SerbaPremium.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}