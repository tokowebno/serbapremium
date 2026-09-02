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
import { cn, formatPrice } from "@/lib/utils";
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
      en: "QRIS (Indonesian E-Wallet & Banks)",
      zh: "QRIS (印尼电子钱包与网银)",
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

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(lang === "id" ? "qris" : "usdt_bnb");
  const [isCopied, setIsCopied] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (lang !== "id" && paymentMethod === "qris") {
      setPaymentMethod("usdt_bnb");
    }
  }, [lang]);

  const steps = [
    t.checkout?.step1 || "1. Data Pembeli",
    t.checkout?.step2 || "2. Pembayaran",
    t.checkout?.step3 || "3. Konfirmasi",
  ];

  // Item beli-langsung dari ?app=slug atau initialApp
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

  const [uniqueCode] = useState(() => {
    const seed = (subtotal * 7 + items.length * 13 + Date.now()) % 999;
    return String(seed + 1).padStart(3, "0");
  });
  const totalBayar = subtotal + (lang === "id" && paymentMethod === "qris" ? Number(uniqueCode) : 0);

  if (items.length === 0) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={ShoppingBag}
          title={t.checkout?.noItems || "Belum ada item untuk dibeli."}
          description={t.checkout?.noItemsDesc || "Pilih aplikasi yang Anda inginkan, lalu tekan Beli Sekarang untuk checkout langsung."}
          action={{ label: t.navbar?.apps || "Jelajahi Aplikasi", href: "/aplikasi" }}
        />
      </div>
    );
  }

  const goNext = () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = lang === "en" ? "Full name is required." : lang === "zh" ? "请填写姓名。" : "Nama lengkap wajib diisi.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = lang === "en" ? "Valid email address is required." : lang === "zh" ? "请输入有效的邮箱地址。" : "Alamat email tidak valid.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 300);
  };

  const copyAddress = (addr?: string) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setIsCopied(true);
    toast.push({
      title: lang === "en" ? "USDT Address copied" : lang === "zh" ? "已复制 USDT 地址" : "Alamat USDT disalin",
      tone: "info"
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const completePayment = () => {
    if (!paymentDone || loading) return;
    setLoading(true);
    const orderId = `SP-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      date: new Date().toISOString().slice(0, 10),
      items: items.map((i) => ({ name: i.name, platform: i.platform })),
      total: totalBayar,
      uniqueCode,
      paymentMethod,
    };
    try {
      sessionStorage.setItem("serbapremium:last-order", JSON.stringify(order));
      sessionStorage.setItem("tokono:last-order", JSON.stringify(order));
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
      title: lang === "en" ? "Payment submitted" : lang === "zh" ? "付款已提交" : "Pembayaran terkirim",
      description: lang === "en" ? "Your order is being processed by SerbaPremium." : lang === "zh" ? "系统正在处理您的订单并安排发货。" : "Pesanan Anda sedang diverifikasi oleh sistem SerbaPremium.",
    });
    setTimeout(() => {
      router.push("/pembayaran/berhasil");
    }, 600);
  };

  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mb-4">
        <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
          CHECKOUT
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-fg sm:text-3xl">
          {t.checkout.title || "Proses Pembayaran"}
        </h1>
      </div>

      {/* Indikator langkah */}
      <ol className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Langkah pembayaran">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-xs border-2 border-border text-xs font-black shadow-[1.5px_1.5px_0px_var(--shadow-color)]",
                  done && "bg-accent-yellow text-black",
                  active && "bg-accent text-black",
                  !done && !active && "bg-surface-2 text-fg-muted",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <CheckCircle2 size={15} strokeWidth={3} /> : n}
              </span>
              <span
                className={cn(
                  "text-[13px] font-bold",
                  active ? "text-fg" : done ? "text-fg-muted" : "text-fg-faint",
                )}
              >
                {label}
              </span>
              {n < steps.length && <span className="mx-1 h-0.5 w-6 bg-border" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-black uppercase tracking-tight text-fg">
                {t.checkout.personalInfo || "1. Data Pembeli"}
              </h2>
              <Field label={t.checkout.name || "Nama Lengkap"} htmlFor="nama-lengkap">
                <Input
                  id="nama-lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "en" ? "Your full name" : lang === "zh" ? "您的姓名" : "Nama Lengkap Anda"}
                  autoComplete="name"
                />
                {errors.name && <p className="text-xs font-bold text-discount">{errors.name}</p>}
              </Field>
              <Field label={t.checkout.emailLabel || "Alamat Email (Untuk Pengiriman Lisensi)"} htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs font-bold text-discount">{errors.email}</p>}
              </Field>
              <Field label={t.checkout.phoneLabel || "Nomor WhatsApp / HP"} hint={lang === "en" ? "Optional for instant status notifications." : lang === "zh" ? "可选，用于接收即时订单通知。" : "Opsional — untuk notifikasi instan pesanan."} htmlFor="no-hp">
                <Input
                  id="no-hp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 8xxxxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <div className="mt-2 flex justify-end">
                <Button onClick={goNext} disabled={loading} size="lg">
                  {loading ? (t.checkout.processing || "Memproses…") : (t.checkout.proceedToPayment || "Lanjut ke Pembayaran")}
                  {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b-2 border-border pb-3">
                <h2 className="text-base font-black uppercase tracking-tight text-fg">
                  {t.checkout.paymentMethod || "2. Metode Pembayaran"}
                </h2>
                <span className="flex items-center gap-1 rounded-xs border border-border bg-accent px-2 py-0.5 text-xs font-black text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                  <ShieldCheck size={13} strokeWidth={2.5} /> {lang === "en" ? "Verified & Secure" : lang === "zh" ? "安全已验证" : "Terverifikasi"}
                </span>
              </div>

              {/* Selector Metode Pembayaran */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                      <p className="text-xs font-black uppercase">{info.badge}</p>
                      <p className="text-[11px] font-semibold opacity-80 mt-0.5 truncate">
                        {info.name[lang] || info.name.id}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Total Nominal Transfer Card */}
              <div className="rounded-md border-2 border-border bg-surface-2 p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
                <p className="text-xs font-black tracking-wider text-fg-muted uppercase">
                  {t.checkout.total || "Total Nominal Pembayaran"}
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight tabular-nums text-fg">
                  {formatPrice(totalBayar, lang)}
                </p>
                {paymentMethod === "qris" ? (
                  <p className="mt-2 text-xs font-semibold leading-5 text-fg-muted">
                    {lang === "en"
                      ? `Unique code included automatically for instant automated verification.`
                      : lang === "zh"
                      ? `已包含唯一验证码，支持全自动即时核验。`
                      : `Kode unik otomatis disertakan pada nominal di atas untuk verifikasi instan.`}
                  </p>
                ) : (
                  <p className="mt-2 text-xs font-semibold leading-5 text-fg-muted">
                    USDT: <span className="font-bold text-fg">{(totalBayar / 16000).toFixed(2)} USDT</span> (Rate: 1 USDT ≈ Rp16.000)
                  </p>
                )}
              </div>

              {/* Detail QRIS / Crypto */}
              {paymentMethod === "qris" ? (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="relative overflow-hidden rounded-md border-2 border-border bg-white p-3 shadow-[3px_3px_0px_var(--shadow-color)]">
                    <img
                      src="/qris.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                      }}
                      alt="Kode QRIS SerbaPremium"
                      className="h-52 w-52 object-contain"
                    />
                  </div>
                  <p className="max-w-xs text-center text-xs font-bold leading-5 text-fg-muted">
                    {lang === "en"
                      ? "Scan QRIS above using any supported e-wallet or mobile banking app."
                      : lang === "zh"
                      ? "使用任意支持的电子钱包或银行 App 扫描上方 QRIS 二维码完成付款。"
                      : "Pindai QRIS di atas dengan aplikasi BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, dsb."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-md border-2 border-border bg-surface p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
                    <p className="text-xs font-black uppercase text-fg-muted">
                      {lang === "en" ? "Wallet Address" : lang === "zh" ? "收款钱包地址" : "Alamat Wallet"} ({PAYMENT_INFO[paymentMethod].badge}):
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        readOnly
                        value={PAYMENT_INFO[paymentMethod].address}
                        className="w-full rounded-sm border border-border bg-surface-2 px-2.5 py-1.5 font-mono text-xs font-bold text-fg outline-none"
                      />
                      <button
                        onClick={() => copyAddress(PAYMENT_INFO[paymentMethod].address)}
                        className="flex h-8 shrink-0 items-center gap-1 rounded-sm border-2 border-border bg-accent px-2.5 text-xs font-black text-black shadow-[1.5px_1.5px_0px_var(--shadow-color)] hover:bg-accent-hover active:translate-x-0.5 active:translate-y-0.5"
                      >
                        {isCopied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={2.5} />}
                        {isCopied ? (lang === "en" ? "Copied" : lang === "zh" ? "已复制" : "Disalin") : (lang === "en" ? "Copy" : lang === "zh" ? "复制" : "Salin")}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-fg-muted">
                    {lang === "en" ? "Please ensure network is " : lang === "zh" ? "请务必确认转账网络为 " : "Pastikan jaringan transfer menggunakan "}
                    <strong className="text-fg">{PAYMENT_INFO[paymentMethod].network}</strong>.
                  </p>
                </div>
              )}

              {paymentDone ? (
                <div className="flex items-center gap-2 rounded-sm border-2 border-border bg-accent px-3.5 py-2 text-xs font-black text-black shadow-[2px_2px_0px_var(--shadow-color)]">
                  <CheckCircle2 size={16} strokeWidth={3} /> {lang === "en" ? "Payment confirmed! Ready to submit." : lang === "zh" ? "已确认付款！即可提交订单。" : "Pembayaran Anda telah tercatat!"}
                </div>
              ) : (
                <Button className="w-full" onClick={() => setPaymentDone(true)}>
                  {t.checkout?.alreadyTransferred || "Saya Sudah Menyelesaikan Pembayaran"}
                </Button>
              )}

              <div className="mt-2 flex items-center justify-between gap-3 border-t-2 border-border pt-4">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} strokeWidth={2.5} /> {lang === "en" ? "Back" : lang === "zh" ? "返回" : "Kembali"}
                </Button>
                <Button
                  onClick={completePayment}
                  disabled={!paymentDone || loading}
                  className="flex-1 sm:flex-none"
                >
                  {loading ? (t.checkout.processing || "Memverifikasi…") : (t.checkout.confirmAndFinish || "Selesaikan Pesanan Sekarang 🚀")}
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
