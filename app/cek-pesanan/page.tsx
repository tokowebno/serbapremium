"use client";

import { Search, ShoppingBag, Library } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/form";
import { StatusBadge } from "@/components/admin/status-badge";
import { supabase, supabaseReady } from "@/lib/supabase";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { OrderPaymentBox } from "@/components/storefront/order-payment-box";

interface OrderResult {
  id: string;
  user_name: string;
  items: Array<{ name: string; platform: string; price: number }>;
  total: number;
  payment_method?: string;
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

    // 1. Cek Supabase (jika terhubung)
    if (supabaseReady) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .ilike("id", id)
          .maybeSingle();

        if (!error && data) {
          const items = Array.isArray(data.items)
            ? data.items.map((it: any) => ({
                name: it.name || it.appId || "Item Digital",
                platform: it.platform || "Web",
                price: Number(it.price) || 0,
              }))
            : [];

          setResult({
            id: data.id,
            user_name: data.user_name || "Pelanggan",
            items,
            total: Number(data.total) || 0,
            payment_method: data.payment_method || "qris",
            payment_status: data.payment_status || "menunggu",
            order_status: data.order_status || "diproses",
            date: data.date || new Date().toISOString().slice(0, 10),
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Supabase fetch order failed, using local fallback:", err);
      }
    }

    // 2. Cek LocalStorage pesanan yang pernah dibuat di browser ini
    try {
      const localRaw =
        localStorage.getItem("serbapremium:orders") ||
        localStorage.getItem("tokono:orders");
      if (localRaw) {
        const list = JSON.parse(localRaw);
        if (Array.isArray(list)) {
          const match = list.find((o: any) => o.id && o.id.toUpperCase() === id);
          if (match) {
            setResult({
              id: match.id,
              user_name: match.user_name || "Pelanggan",
              items: Array.isArray(match.items)
                ? match.items.map((it: any) => ({
                    name: it.name || it.appId || "Item Digital",
                    platform: it.platform || "Web",
                    price: Number(it.price) || 0,
                  }))
                : [],
              total: Number(match.total) || 0,
              payment_method: match.payment_method || "qris",
              payment_status: match.payment_status || "menunggu",
              order_status: match.order_status || "diproses",
              date: match.date || new Date().toISOString().slice(0, 10),
            });
            setLoading(false);
            return;
          }
        }
      }

      // Cek sessionStorage last-order
      const lastRaw =
        sessionStorage.getItem("serbapremium:last-order") ||
        sessionStorage.getItem("tokono:last-order");
      if (lastRaw) {
        const last = JSON.parse(lastRaw);
        if (last && last.id && last.id.toUpperCase() === id) {
          setResult({
            id: last.id,
            user_name: last.user_name || "Pelanggan",
            items: Array.isArray(last.items)
              ? last.items.map((it: any) => ({
                  name: it.name || it.appId || "Item Digital",
                  platform: it.platform || "Web",
                  price: Number(it.price) || 0,
                }))
              : [],
            total: Number(last.total) || 0,
            payment_method: last.payment_method || "qris",
            payment_status: last.payment_status || "menunggu",
            order_status: last.order_status || "diproses",
            date: last.date || new Date().toISOString().slice(0, 10),
          });
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore parse error
    }

    // 3. Cek Mock Orders (untuk demo ID seperti TK-84521, dll)
    const mockMatch = api.orders.list().find((o) => o.id.toUpperCase() === id);
    if (mockMatch) {
      setResult({
        id: mockMatch.id,
        user_name: mockMatch.userName,
        items: mockMatch.items.map((it) => ({
          name: api.apps.getById(it.appId)?.name || it.appId,
          platform: it.platform,
          price: it.price,
        })),
        total: mockMatch.total,
        payment_method: (mockMatch as any).paymentMethod || "qris",
        payment_status: mockMatch.paymentStatus,
        order_status: mockMatch.orderStatus,
        date: mockMatch.date,
      });
      setLoading(false);
      return;
    }

    // 4. Tidak ditemukan
    setNotFound(true);
    setLoading(false);
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
          <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold uppercase text-accent">
            {lang === "en" ? "ORDER TRACKER" : lang === "zh" ? "订单实时追踪" : "LACAK TRANSAKSI"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
          {t.navbar?.checkOrder || (lang === "en" ? "Check Order Status" : lang === "zh" ? "查询订单状态" : "Cek Status Pesanan")}
        </h1>
        <p className="mt-2 text-sm font-normal leading-relaxed text-fg-muted">
          {lang === "en"
            ? "Enter your order ID (e.g. SP-123456 or TK-84521) to check realtime payment verification and license delivery status."
            : lang === "zh"
            ? "请输入您的订单号（例如 SP-123456 或 TK-84521）以查询支付核验状态与数字授权交付进度。"
            : "Masukkan nomor pesanan Anda (contoh: SP-123456 atau TK-84521) untuk melihat status pembayaran dan pengiriman lisensi."}
        </p>

        <form onSubmit={cari} className="mt-6 flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SP-123456"
            className="font-mono uppercase font-semibold"
            aria-label="Nomor pesanan"
          />
          <Button type="submit" disabled={loading} className="rounded-full shrink-0 px-6">
            <Search size={16} strokeWidth={2} />
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
          <div className="glass-card mt-6 rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-4">
              <div>
                <p className="font-mono text-xl font-bold tracking-tight text-fg">{result.id}</p>
                <p className="text-xs font-medium text-fg-muted mt-0.5">{lang === "en" ? "Customer:" : lang === "zh" ? "客户姓名:" : "Nama:"} {result.user_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={result.payment_status} />
                <StatusBadge status={result.order_status} />
              </div>
            </div>

            <ul className="mt-4 divide-y divide-border/60">
              {result.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="font-semibold text-fg">{item.name}</span>
                  <span className="text-xs font-medium text-fg-muted">
                    {item.platform} · {formatPrice(item.price, lang)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between border-t border-border/70 pt-4 text-base font-bold">
              <span className="text-fg-muted">{t.checkout?.total || (lang === "en" ? "Total Payment" : lang === "zh" ? "总计支付" : "Total Pembayaran")}</span>
              <span className="tabular-nums text-accent">{formatPrice(result.total, lang)}</span>
            </div>

            {/* Kotak Bayar QRIS / USDT sesuai metode awal jika status sedang proses / menunggu */}
            {(result.payment_status === "menunggu" || result.order_status === "diproses") && (
              <OrderPaymentBox
                orderId={result.id}
                total={result.total}
                paymentMethod={result.payment_method || "qris"}
                lang={lang}
              />
            )}

            <div className="mt-5 flex gap-2.5">
              <ButtonLink href="/akun/koleksi" variant="secondary" size="sm" className="flex-1 rounded-full text-xs">
                <Library size={14} /> {lang === "en" ? "My Collection" : lang === "zh" ? "我的收藏" : "Koleksi Saya"}
              </ButtonLink>
              <ButtonLink href="/aplikasi" variant="ghost" size="sm" className="flex-1 rounded-full text-xs text-fg-muted hover:text-fg">
                <ShoppingBag size={14} /> {lang === "en" ? "Explore Apps" : lang === "zh" ? "浏览应用" : "Jelajahi Aplikasi"}
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}