"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Copy, Check, ShoppingBag, Zap, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input } from "@/components/ui/form";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { useCart, useLibrary } from "@/components/storefront/providers";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { supabase, supabaseReady } from "@/lib/supabase";
import { useTranslation } from "@/components/storefront/i18n-provider";
import type { CartItem, Platform, App } from "@/types";

export type PaymentMethod = "qris" | "usdt_bnb" | "usdt_tron";

const PAYMENT_INFO: Record<PaymentMethod, {
  name: Record<string, string>;
  network: string;
  address?: string;
  badge: string;
}> = {
  qris: {
    name: {
      id: "QRIS (Semua E-Wallet & Bank)",
      en: "QRIS (Indonesian Banks & E-Wallets)",
      zh: "QRIS (印尼全境电子钱包与银行转账)",
    },
    network: "BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay",
    badge: "IDR QRIS",
  },
  usdt_bnb: {
    name: {
      id: "USDT (BNB Smart Chain / BEP-20)",
      en: "USDT (BNB Smart Chain / BEP-20)",
      zh: "USDT (币安智能链 / BEP-20)",
    },
    network: "BNB Smart Chain (BEP-20 / BSC)",
    address: "0x141b43fCDb8D17c09e7b4235b2527309db674A27",
    badge: "USDT BEP-20",
  },
  usdt_tron: {
    name: {
      id: "USDT (Tron Network / TRC-20)",
      en: "USDT (Tron Network / TRC-20)",
      zh: "USDT (波场 / TRC-20)",
    },
    network: "TRON (TRC-20)",
    address: "TQTpRn6j1Pfwf38xP8CxqxJi18YX4v8Wcm",
    badge: "USDT TRC-20",
  },
};

/** Simpan pesanan ke Supabase (tabel orders). */
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
  const { lang, t } = useTranslation();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(lang === "id" ? "qris" : "usdt_bnb");
  const [qrisDone, setQrisDone] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAmountCopied, setIsAmountCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (lang !== "id" && paymentMethod === "qris") {
      setPaymentMethod("usdt_bnb");
    }
  }, [lang]);

  const steps = [
    lang === "en" ? "1. Information" : lang === "zh" ? "1. 填写信息" : "1. Informasi",
    lang === "en" ? "2. Payment" : lang === "zh" ? "2. 付款转账" : "2. Pembayaran",
    lang === "en" ? "3. Confirmation" : lang === "zh" ? "3. 完成确认" : "3. Konfirmasi",
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

  // Kode unik 3 digit (001–999)
  const [uniqueCode] = useState(() => {
    const seed = (subtotal * 7 + items.length * 13 + Date.now()) % 999;
    return String(seed + 1).padStart(3, "0");
  });
  const totalBayar = subtotal + (paymentMethod === "qris" ? Number(uniqueCode) : 0);

  if (items.length === 0) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={ShoppingBag}
          title={lang === "en" ? "No items in cart." : lang === "zh" ? "暂无待结算商品。" : "Belum ada item untuk dibeli."}
          description={lang === "en" ? "Select the app you want, then click Buy Now." : lang === "zh" ? "请选择您心仪的应用，然后点击 立即购买。" : "Pilih aplikasi yang Anda inginkan, lalu tekan Beli Sekarang untuk checkout langsung."}
          action={{ label: lang === "en" ? "Explore Apps" : lang === "zh" ? "浏览应用" : "Jelajahi Aplikasi", href: "/aplikasi" }}
        />
      </div>
    );
  }

  const goNext = () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = lang === "en" ? "Full name is required." : lang === "zh" ? "请填写您的姓名。" : "Nama lengkap wajib diisi.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = lang === "en" ? "Valid email address is required for license delivery." : lang === "zh" ? "请填写有效邮箱。" : "Alamat email tidak valid.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  };

  const copyAddress = (addr?: string) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setIsCopied(true);
    toast.push({
      title: lang === "en" ? "USDT Address copied!" : lang === "zh" ? "USDT 钱包地址已复制！" : "Alamat USDT disalin!",
      tone: "info",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const copyAmount = (amount: number) => {
    navigator.clipboard.writeText(String(amount));
    setIsAmountCopied(true);
    toast.push({
      title: lang === "en" ? "Exact payment amount copied!" : lang === "zh" ? "精确转账金额已复制！" : "Nominal transfer disalin!",
      description: `Rp ${amount.toLocaleString("id-ID")} (${lang === "en" ? "includes unique code" : "termasuk kode unik"})`,
      tone: "success",
    });
    setTimeout(() => setIsAmountCopied(false), 2000);
  };

  const completePayment = () => {
    if (!qrisDone || loading) {
      toast.push({
        title: lang === "en" ? "Please complete transfer & confirm" : lang === "zh" ? "请先点击 我已完成支付" : "Mohon klik tombol Saya Sudah Bayar terlebih dahulu",
        tone: "info",
      });
      return;
    }
    setLoading(true);
    const orderId = `TK-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      date: new Date().toISOString().slice(0, 10),
      items: items.map((i) => ({ name: i.name, platform: i.platform })),
      total: totalBayar,
      uniqueCode,
      paymentMethod,
    };
    try {
      sessionStorage.setItem("tokono:last-order", JSON.stringify(order));
      sessionStorage.setItem("serbapremium:last-order", JSON.stringify(order));
    } catch {
      /* storage full */
    }
    saveOrderToDb({
      id: orderId,
      user_name: name,
      customer_email: email,
      customer_phone: phone,
      items: items.map((i) => ({ appId: i.appId, name: i.name, platform: i.platform, price: i.price })),
      subtotal,
      discount: 0,
      total: totalBayar,
      payment_method: paymentMethod,
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
      {/* Title */}
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-fg">
        {lang === "en" ? "Payment" : lang === "zh" ? "支付结算" : "Pembayaran"}
      </h1>

      {/* Indikator Langkah */}
      <div className="mt-6 flex items-center gap-3">
        {steps.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (done) setStep(1);
                }}
                className={`flex items-center gap-2 rounded-md border-2 px-3 py-1.5 text-xs font-black transition-all ${
                  active
                    ? "border-border bg-accent text-black shadow-[2px_2px_0px_var(--shadow-color)]"
                    : done
                    ? "border-border bg-surface text-fg shadow-[1px_1px_0px_var(--shadow-color)] cursor-pointer"
                    : "border-border/40 bg-surface-2 text-fg-muted opacity-60 cursor-default"
                }`}
              >
                <span className={`flex h-4.5 w-4.5 items-center justify-center rounded-xs text-[10px] font-black ${active || done ? "bg-black text-white" : "bg-border text-fg-muted"}`}>
                  {done ? <Check size={11} strokeWidth={3} /> : n}
                </span>
                <span>{label}</span>
              </button>
              {i < steps.length - 1 && <span className="text-fg-muted text-xs font-bold">→</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        {/* Kolom Kiri */}
        <section className="rounded-xl border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
          {step === 1 ? (
            /* STEP 1: PILIH METODE PEMBAYARAN + DATA PEMBELI */
            <div className="flex flex-col gap-5">
              <div>
                <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                  {lang === "en" ? "STEP 1" : lang === "zh" ? "步骤 1" : "LANGKAH 1"}
                </span>
                <h2 className="mt-1.5 text-lg font-black tracking-tight text-fg">
                  {lang === "en" ? "Buyer Information & Payment Method" : lang === "zh" ? "选择付款方式与填写信息" : "Informasi Pembeli & Metode Pembayaran"}
                </h2>
              </div>

              {/* Pilihan Metode Pembayaran */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-fg-muted">
                  {lang === "en" ? "Select Payment Method" : lang === "zh" ? "选择付款方式" : "Metode Pembayaran"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(["qris", "usdt_bnb", "usdt_tron"] as PaymentMethod[]).map((method) => {
                    const info = PAYMENT_INFO[method];
                    const active = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-md border-2 p-3 text-left transition-all duration-100 ${
                          active
                            ? "border-border bg-accent text-black font-black shadow-[3px_3px_0px_var(--shadow-color)] -translate-x-0.5 -translate-y-0.5"
                            : "border-border bg-surface text-fg hover:bg-surface-2 shadow-[1.5px_1.5px_0px_var(--shadow-color)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black uppercase">{info.badge}</p>
                          {active && <Check size={14} strokeWidth={3} className="text-black" />}
                        </div>
                        <p className="text-[11px] font-semibold opacity-85 mt-1">
                          {info.name[lang] || info.name.id}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Form */}
              <div className="space-y-4 pt-2 border-t-2 border-border">
                <Field label={lang === "en" ? "Full Name" : lang === "zh" ? "姓名" : "Nama Lengkap"} htmlFor="nama-lengkap">
                  <Input
                    id="nama-lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === "en" ? "Your full name" : lang === "zh" ? "您的姓名" : "Nama Anda"}
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-xs font-bold text-discount">{errors.name}</p>}
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
                  {errors.email && <p className="text-xs font-bold text-discount">{errors.email}</p>}
                </Field>

                <Field label={lang === "en" ? "Phone / WhatsApp" : lang === "zh" ? "手机号 / WhatsApp" : "No. HP"} hint={lang === "en" ? "Optional — for proof of purchase." : lang === "zh" ? "可选 — 用于发送购买凭证。" : "Opsional — untuk mengirim bukti pembelian."} htmlFor="no-hp">
                  <Input
                    id="no-hp"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </Field>
              </div>

              <div className="mt-2 flex justify-end">
                <Button size="lg" onClick={goNext} disabled={loading} className="w-full sm:w-auto">
                  {loading ? (lang === "en" ? "Processing…" : lang === "zh" ? "处理中…" : "Memproses…") : (lang === "en" ? "Proceed to Payment" : lang === "zh" ? "前往付款" : "Lanjut ke Pembayaran")}
                  {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: DETAIL PEMBAYARAN, KODE UNIK, QRIS / USDT */
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b-2 border-border pb-3">
                <div>
                  <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                    {PAYMENT_INFO[paymentMethod].badge}
                  </span>
                  <h2 className="mt-1 text-lg font-black tracking-tight text-fg">
                    {paymentMethod === "qris" ? "Pembayaran QRIS" : `Pembayaran ${PAYMENT_INFO[paymentMethod].badge}`}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-black text-fg-muted hover:text-fg underline"
                >
                  {lang === "en" ? "← Change Info" : lang === "zh" ? "← 修改信息" : "← Ubah Data"}
                </button>
              </div>

              {paymentMethod === "qris" ? (
                <>
                  <div className="rounded-lg border-2 border-border bg-surface-2 p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
                    <p className="text-xs font-black uppercase text-fg-muted">
                      {lang === "en" ? "Total amount to pay" : lang === "zh" ? "应付总额" : "Total yang harus dibayar"}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <p className="text-3xl font-black tracking-tight text-fg tabular-nums">
                        {formatPrice(totalBayar, lang)}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyAmount(totalBayar)}
                        className="flex items-center gap-1 rounded-xs border border-border bg-accent px-2.5 py-1 text-[11px] font-black text-black shadow-[1px_1px_0px_var(--shadow-color)] hover:bg-accent-hover"
                      >
                        {isAmountCopied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.5} />}
                        {isAmountCopied ? "Disalin!" : "Salin Nominal"}
                      </button>
                    </div>
                    <p className="mt-2.5 text-xs font-bold leading-5 text-fg-muted border-t border-border pt-2">
                      <span className="font-black text-fg">Kode unik {uniqueCode}</span> sudah termasuk di nominal di atas — bayar persis sejumlah itu agar pesanan mudah dikenali dan diproses otomatis oleh robot SerbaPremium.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="relative overflow-hidden rounded-lg border-2 border-border bg-white p-3 shadow-[3px_3px_0px_var(--shadow-color)]">
                      <img
                        src="/qris.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                        }}
                        alt="Kode QRIS — pindai dengan aplikasi e-wallet atau m-banking"
                        className="h-56 w-56 object-contain"
                      />
                    </div>
                    <p className="max-w-xs text-center text-xs font-bold leading-5 text-fg-muted">
                      Pindai QRIS di atas, bayar sesuai nominal{" "}
                      <span className="font-black text-fg">{formatPrice(totalBayar, lang)}</span>, lalu tekan tombol di bawah.
                    </p>

                    <div className="w-full pt-1">
                      {qrisDone ? (
                        <div className="flex items-center justify-center gap-2 rounded-md border-2 border-border bg-accent/20 p-3 text-sm font-black text-fg shadow-[2px_2px_0px_var(--shadow-color)]">
                          <CheckCircle2 size={18} className="text-success" /> Pembayaran Anda tercatat.
                        </div>
                      ) : (
                        <Button size="lg" className="w-full" onClick={() => setQrisDone(true)}>
                          Saya Sudah Bayar
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg border-2 border-border bg-surface-2 p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
                    <p className="text-xs font-black uppercase text-fg-muted">
                      {lang === "en" ? "Total USDT to transfer" : lang === "zh" ? "应付 USDT 总额" : "Total Nominal USDT"}
                    </p>
                    <p className="text-3xl font-black tracking-tight text-fg tabular-nums mt-0.5">
                      ${(totalBayar / 16000).toFixed(2)} USDT
                    </p>
                    <p className="text-xs font-bold text-fg-muted mt-1">
                      Rate: 1 USDT ≈ Rp 16.000 ({formatPrice(totalBayar, lang)})
                    </p>
                  </div>

                  <div className="rounded-lg border-2 border-border bg-surface p-4 shadow-[2px_2px_0px_var(--shadow-color)] space-y-2">
                    <p className="text-xs font-black uppercase text-fg-muted">
                      {lang === "en" ? "Wallet Address" : "Alamat Wallet"} ({PAYMENT_INFO[paymentMethod].badge}):
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={PAYMENT_INFO[paymentMethod].address}
                        className="w-full rounded-sm border border-border bg-surface-2 px-3 py-2 font-mono text-xs font-bold text-fg outline-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => copyAddress(PAYMENT_INFO[paymentMethod].address)}
                        className="flex h-9 shrink-0 items-center gap-1.5 rounded-sm border-2 border-border bg-accent px-3 text-xs font-black text-black shadow-[1.5px_1.5px_0px_var(--shadow-color)] hover:bg-accent-hover active:translate-x-0.5 active:translate-y-0.5"
                      >
                        {isCopied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={2.5} />}
                        {isCopied ? "Disalin" : "Salin"}
                      </button>
                    </div>
                    <p className="text-xs font-bold text-fg-muted">
                      Jaringan: <span className="rounded-xs border border-border bg-accent-soft px-1.5 py-0.2 text-fg font-black">{PAYMENT_INFO[paymentMethod].network}</span>
                    </p>
                  </div>

                  <div className="w-full pt-2">
                    {qrisDone ? (
                      <div className="flex items-center justify-center gap-2 rounded-md border-2 border-border bg-accent/20 p-3 text-sm font-black text-fg shadow-[2px_2px_0px_var(--shadow-color)]">
                        <CheckCircle2 size={18} className="text-success" /> Transfer USDT telah dikonfirmasi.
                      </div>
                    ) : (
                      <Button size="lg" className="w-full" onClick={() => setQrisDone(true)}>
                        Saya Sudah Transfer USDT
                      </Button>
                    )}
                  </div>
                </>
              )}

              {/* Tombol Aksi Bawah */}
              <div className="mt-2 flex items-center justify-between gap-3 border-t-2 border-border pt-4">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> {lang === "en" ? "Back" : lang === "zh" ? "返回" : "Kembali"}
                </Button>
                <Button
                  size="lg"
                  onClick={completePayment}
                  disabled={!qrisDone || loading}
                  className="flex-1 sm:flex-none"
                >
                  <Zap size={16} strokeWidth={3} className="fill-current" />
                  {loading ? (lang === "en" ? "Processing…" : lang === "zh" ? "处理中…" : "Memproses…") : (lang === "en" ? "Complete Payment" : lang === "zh" ? "完成支付" : "Selesaikan Pembayaran")}
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Kolom Kanan */}
        <aside>
          <CheckoutSummary items={items} subtotal={subtotal} discount={0} />
        </aside>
      </div>
    </div>
  );
}
