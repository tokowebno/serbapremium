"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input } from "@/components/ui/form";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { useCart, useLibrary } from "@/components/storefront/providers";
import { useToast } from "@/components/ui/toast";
import { cn, formatPrice } from "@/lib/utils";
import { supabase, supabaseReady } from "@/lib/supabase";
import { useTranslation } from "@/components/storefront/i18n-provider";
import type { CartItem, Platform, App } from "@/types";

/** Simpan pesanan ke Supabase (tabel orders). Gagal diam-diam — bukan blokir checkout. */
async function saveOrderToDb(order: Record<string, unknown>) {
  if (!supabaseReady) return;
  try {
    await supabase.from("orders").insert(order);
  } catch {
    /* database tidak tersedia — checkout tetap jalan */
  }
}

export function CheckoutForm({
  initialSlug,
  initialApp,
  customTitle,
  customPrice,
  customPlatform,
}: {
  initialSlug?: string;
  initialApp?: App;
  customTitle?: string;
  customPrice?: number;
  customPlatform?: string;
}) {
  const router = useRouter();
  const cart = useCart();
  const library = useLibrary();
  const toast = useToast();
  const { lang } = useTranslation();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qrisDone, setQrisDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const steps = [
    lang === "en" ? "Information" : lang === "zh" ? "信息" : "Informasi",
    lang === "en" ? "Payment" : lang === "zh" ? "付款" : "Pembayaran",
    lang === "en" ? "Confirmation" : lang === "zh" ? "确认" : "Konfirmasi",
  ];

  // Item beli-langsung dari ?app=slug
  let directItem: CartItem | null = null;
  const targetApp =
    initialApp ||
    (initialSlug ? api.apps.getBySlug(initialSlug) || api.apps.getById(initialSlug) : undefined);

  if (targetApp && !cart.items.some((i) => i.appId === targetApp.id)) {
    const finalPlatform: Platform =
      (customPlatform && targetApp.platforms.includes(customPlatform as Platform))
        ? (customPlatform as Platform)
        : targetApp.platforms[0] || "Web";

    directItem = {
      appId: targetApp.id,
      name: customTitle || targetApp.name,
      icon: targetApp.icon,
      platform: finalPlatform,
      price: customPrice !== undefined && customPrice > 0 ? customPrice : targetApp.price,
    };
  }

  const rawItems: CartItem[] = cart.items.length > 0 ? cart.items : directItem ? [directItem] : [];
  const items: CartItem[] = rawItems.map((item) => {
    if (directItem && item.appId === directItem.appId && (customTitle || customPrice !== undefined)) {
      return {
        ...item,
        name: customTitle || item.name,
        price: customPrice !== undefined && customPrice > 0 ? customPrice : item.price,
      };
    }
    return item;
  });

  const subtotal = items.reduce((s, i) => s + i.price, 0);

  // Kode unik 3 digit (001–999) — pembeli mentransfer total + kode unik,
  // sehingga pesanan mudah diidentifikasi dari nominalnya.
  const [uniqueCode] = useState(() => {
    const seed = (subtotal * 7 + items.length * 13 + Date.now()) % 999;
    return String(seed + 1).padStart(3, "0");
  });
  const totalBayar = subtotal + Number(uniqueCode);

  if (items.length === 0) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={ShoppingBag}
          title={lang === "en" ? "No items to buy." : lang === "zh" ? "暂无待结算商品。" : "Belum ada item untuk dibeli."}
          description={lang === "en" ? "Select the app you want, then click Buy Now." : lang === "zh" ? "请选择您心仪的应用，然后点击 立即购买。" : "Pilih aplikasi yang Anda inginkan, lalu tekan Beli Sekarang untuk checkout langsung."}
          action={{ label: lang === "en" ? "Explore Apps" : lang === "zh" ? "浏览应用" : "Jelajahi Aplikasi", href: "/aplikasi" }}
        />
      </div>
    );
  }

  const goNext = () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = lang === "en" ? "Full name is required." : lang === "zh" ? "请填写姓名。" : "Nama lengkap wajib diisi.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = lang === "en" ? "Valid email address is required." : lang === "zh" ? "请填写有效邮箱。" : "Alamat email tidak valid.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 400);
  };

  const completePayment = () => {
    if (!qrisDone || loading) return;
    setLoading(true);
    const orderId = `TK-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      date: new Date().toISOString().slice(0, 10),
      items: items.map((i) => ({ name: i.name, platform: i.platform })),
      total: totalBayar,
      uniqueCode,
    };
    try {
      sessionStorage.setItem("tokono:last-order", JSON.stringify(order));
      sessionStorage.setItem("serbapremium:last-order", JSON.stringify(order));
    } catch {
      /* penyimpanan penuh — abaikan */
    }
    // Simpan pesanan ke database supaya bisa dicek lewat nomor pesanan.
    saveOrderToDb({
      id: orderId,
      user_name: name,
      customer_email: email,
      customer_phone: phone,
      items: items.map((i) => ({ appId: i.appId, name: i.name, platform: i.platform, price: i.price })),
      subtotal,
      discount: 0,
      total: totalBayar,
      payment_method: "qris",
      payment_status: "menunggu",
      order_status: "diproses",
      date: new Date().toISOString().slice(0, 10),
    });
    items.forEach((i) => library.add(i.appId));
    cart.clear();
    toast.push({
      title: lang === "en" ? "Payment is being processed" : lang === "zh" ? "正在处理支付" : "Pembayaran sedang diproses",
      description: lang === "en" ? "We are verifying your payment. Apps will be added to your collection." : lang === "zh" ? "我们正在核验您的付款，应用核验后将存入您的收藏。" : "Kami memverifikasi pembayaran Anda. Aplikasi masuk ke koleksi setelah terverifikasi.",
    });
    setTimeout(() => {
      router.push("/pembayaran/berhasil");
    }, 800);
  };

  return (
    <div className="tk-container pt-28 pb-20">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {lang === "en" ? "Payment" : lang === "zh" ? "支付结算" : "Pembayaran"}
      </h1>

      {/* Indikator langkah */}
      <ol className="mt-6 flex items-center gap-2" aria-label="Langkah pembayaran">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-accent text-accent-fg",
                  active && "bg-accent-soft text-accent ring-1 ring-accent/40",
                  !done && !active && "bg-surface-3 text-fg-faint",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <CheckCircle2 size={13} /> : n}
              </span>
              <span
                className={cn(
                  "text-[13px] font-medium",
                  active ? "text-fg" : done ? "text-fg-muted" : "text-fg-faint",
                )}
              >
                {label}
              </span>
              {n < steps.length && <span className="mx-1 h-px w-8 bg-border-strong" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-[15px] font-semibold tracking-tight">
                {lang === "en" ? "Buyer Information" : lang === "zh" ? "买家信息" : "Informasi Pembeli"}
              </h2>
              <Field label={lang === "en" ? "Full Name" : lang === "zh" ? "姓名" : "Nama Lengkap"} htmlFor="nama-lengkap">
                <Input
                  id="nama-lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "en" ? "Your name" : lang === "zh" ? "您的姓名" : "Nama Anda"}
                  autoComplete="name"
                />
                {errors.name && <p className="text-xs text-discount">{errors.name}</p>}
              </Field>
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs text-discount">{errors.email}</p>}
              </Field>
              <Field label={lang === "en" ? "Phone Number" : lang === "zh" ? "手机号" : "No. HP"} hint={lang === "en" ? "Optional — for proof of purchase." : lang === "zh" ? "可选 — 用于发送购买凭证。" : "Opsional — untuk mengirim bukti pembelian."} htmlFor="no-hp">
                <Input
                  id="no-hp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <div className="mt-2 flex justify-end">
                <Button onClick={goNext} disabled={loading}>
                  {loading ? (lang === "en" ? "Processing…" : lang === "zh" ? "处理中…" : "Memproses…") : (lang === "en" ? "Proceed to Payment" : lang === "zh" ? "前往付款" : "Lanjut ke Pembayaran")}
                  {!loading && <ArrowRight size={16} />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-[15px] font-semibold tracking-tight">
                {lang === "en" ? "QRIS Payment" : lang === "zh" ? "QRIS 支付" : "Pembayaran QRIS"}
              </h2>
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <p className="text-[13px] text-fg-muted">
                  {lang === "en" ? "Total amount to pay" : lang === "zh" ? "应付总额" : "Total yang harus dibayar"}
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                  {formatPrice(totalBayar, lang)}
                </p>
                <p className="mt-2 text-[13px] leading-5 text-fg-muted">
                  <span className="font-medium text-fg">
                    {lang === "en" ? `Unique code ${uniqueCode}` : lang === "zh" ? `唯一识别码 ${uniqueCode}` : `Kode unik ${uniqueCode}`}
                  </span>{" "}
                  {lang === "en"
                    ? "is included in the amount above — please transfer the exact amount so your order can be recognized immediately."
                    : lang === "zh"
                    ? "已包含在上方金额中 — 请按该精确金额转账，以便系统识别订单。"
                    : "sudah termasuk di nominal di atas — bayar persis sejumlah itu agar pesanan mudah dikenali."}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 py-2">
                <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-3 shadow-sm">
                  <img
                    src="/qris.png"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                    }}
                    alt="Kode QRIS — pindai dengan aplikasi e-wallet atau m-banking"
                    className="h-52 w-52 object-contain"
                  />
                </div>
                <p className="max-w-xs text-center text-[13px] leading-5 text-fg-muted">
                  {lang === "en" ? (
                    <>Scan QRIS above, pay according to the nominal <span className="font-medium text-fg">{formatPrice(totalBayar, lang)}</span>, then press the button below.</>
                  ) : lang === "zh" ? (
                    <>扫描上方 QRIS，按金额 <span className="font-medium text-fg">{formatPrice(totalBayar, lang)}</span> 付款，然后点击下方按钮。</>
                  ) : (
                    <>Pindai QRIS di atas, bayar sesuai nominal <span className="font-medium text-fg">{formatPrice(totalBayar, lang)}</span>, lalu tekan tombol di bawah.</>
                  )}
                </p>
                {qrisDone ? (
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-success">
                    <CheckCircle2 size={14} /> {lang === "en" ? "Your payment is recorded." : lang === "zh" ? "已记录您的付款。" : "Pembayaran Anda tercatat."}
                  </p>
                ) : (
                  <Button className="w-full" onClick={() => setQrisDone(true)}>
                    {lang === "en" ? "I Have Paid" : lang === "zh" ? "我已完成支付" : "Saya Sudah Bayar"}
                  </Button>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> {lang === "en" ? "Back" : lang === "zh" ? "返回" : "Kembali"}
                </Button>
                <Button
                  onClick={completePayment}
                  disabled={!qrisDone || loading}
                  className="flex-1 sm:flex-none"
                >
                  {loading ? (lang === "en" ? "Processing…" : lang === "zh" ? "处理中…" : "Memproses…") : (lang === "en" ? "Complete Payment" : lang === "zh" ? "完成支付" : "Selesaikan Pembayaran")}
                </Button>
              </div>
            </div>
          )}
        </section>

        <aside>
          <CheckoutSummary items={items} subtotal={subtotal} discount={0} />
        </aside>
      </div>
    </div>
  );
}
