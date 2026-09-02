"use client";

import { CheckCircle2, Copy, Check, ShoppingBag, Zap, ShieldCheck, AlertTriangle } from "lucide-react";
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(lang === "id" ? "qris" : "usdt_bnb");
  const [isCopied, setIsCopied] = useState(false);
  const [isAmountCopied, setIsAmountCopied] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (lang !== "id" && paymentMethod === "qris") {
      setPaymentMethod("usdt_bnb");
    }
  }, [lang]);

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
    const seed = (subtotal * 7 + items.length * 13 + Date.now()) % 900 + 100;
    return String(seed);
  });
  const totalBayar = subtotal + (paymentMethod === "qris" ? Number(uniqueCode) : 0);

  if (items.length === 0) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={ShoppingBag}
          title={t.checkout?.noItems || (lang === "en" ? "No items in cart." : lang === "zh" ? "暂无待结算商品。" : "Belum ada item untuk dibeli.")}
          description={t.checkout?.noItemsDesc || (lang === "en" ? "Select the application you want, then click Buy Now." : lang === "zh" ? "请选择您心仪的应用，然后点击 立即购买。" : "Pilih aplikasi yang Anda inginkan, lalu tekan Beli Sekarang untuk checkout langsung.")}
          action={{ label: t.navbar?.apps || (lang === "en" ? "Explore Apps" : lang === "zh" ? "浏览应用" : "Jelajahi Aplikasi"), href: "/aplikasi" }}
        />
      </div>
    );
  }

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
      description: lang === "en" ? `Rp ${amount.toLocaleString("id-ID")} (includes unique code)` : `Rp ${amount.toLocaleString("id-ID")} (sudah termasuk kode unik)`,
      tone: "success",
    });
    setTimeout(() => setIsAmountCopied(false), 2000);
  };

  const completePayment = () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) {
      nextErrors.name = lang === "en" ? "Full name is required." : lang === "zh" ? "请填写您的姓名。" : "Nama lengkap wajib diisi.";
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = lang === "en" ? "Valid email address is required for license delivery." : lang === "zh" ? "请填写有效的邮箱地址以接收数字授权。" : "Alamat email wajib diisi untuk pengiriman lisensi.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.push({
        title: lang === "en" ? "Please fill your name and email" : lang === "zh" ? "请完整填写姓名与邮箱" : "Mohon lengkapi nama dan email Anda",
        tone: "error",
      });
      return;
    }

    if (!paymentDone) {
      toast.push({
        title: lang === "en" ? "Please complete transfer & confirm below" : lang === "zh" ? "请先完成转账并勾选确认" : "Mohon selesaikan transfer & centang konfirmasi pembayaran",
        tone: "info",
      });
      return;
    }

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
      title: lang === "en" ? "Payment submitted!" : lang === "zh" ? "订单已成功提交！" : "Pembayaran terkirim!",
      description: lang === "en" ? "Your order is being processed by SerbaPremium." : lang === "zh" ? "系统正在处理您的订单并安排自动发货。" : "Pesanan Anda sedang diverifikasi otomatis oleh robot SerbaPremium.",
    });
    setTimeout(() => {
      router.push("/pembayaran/berhasil");
    }, 600);
  };

  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mb-6">
        <span className="rounded-xs border border-border bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[1px_1px_0px_var(--shadow-color)]">
          {lang === "en" ? "INSTANT CHECKOUT" : lang === "zh" ? "极速结账" : "CHECKOUT INSTAN"}
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-fg sm:text-3xl">
          {t.checkout?.title || (lang === "en" ? "Complete Payment" : lang === "zh" ? "完成订单支付" : "Proses Pembayaran")}
        </h1>
        <p className="mt-1 text-sm font-medium text-fg-muted">
          {lang === "en"
            ? "Choose your payment method and enter license delivery details below."
            : lang === "zh"
            ? "选择您的付款方式并填写下方授权接收信息。"
            : "Pilih metode pembayaran dan lengkapi data penerima lisensi di bawah ini."}
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        {/* Kolom Kiri: Form Checkout Terpadu */}
        <div className="space-y-6">
          {/* Section 1: PILIH METODE PEMBAYARAN LANGSUNG */}
          <section className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
            <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-4">
              <h2 className="text-base font-black uppercase tracking-tight text-fg">
                {lang === "en" ? "1. Choose Payment Method" : lang === "zh" ? "1. 选择付款方式" : "1. Pilih Metode Pembayaran"}
              </h2>
              <span className="flex items-center gap-1 rounded-xs border border-border bg-accent px-2 py-0.5 text-xs font-black text-black shadow-[1px_1px_0px_var(--shadow-color)]">
                <ShieldCheck size={13} strokeWidth={2.5} /> {lang === "en" ? "Automated & Verified" : lang === "zh" ? "自动核验" : "Verifikasi Otomatis"}
              </span>
            </div>

            {/* Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          </section>

          {/* Section 2: DATA PEMBELI */}
          <section className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
            <h2 className="text-base font-black uppercase tracking-tight text-fg border-b-2 border-border pb-3 mb-4">
              {lang === "en" ? "2. Buyer & License Info" : lang === "zh" ? "2. 填写接收人信息" : "2. Data Pembeli & Pengiriman"}
            </h2>
            <div className="space-y-4">
              <Field label={t.checkout?.name || (lang === "en" ? "Full Name" : lang === "zh" ? "您的姓名" : "Nama Lengkap")} htmlFor="nama-lengkap">
                <Input
                  id="nama-lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "en" ? "Your full name" : lang === "zh" ? "姓名 / 昵称" : "Nama Lengkap Anda"}
                  autoComplete="name"
                  required
                />
                {errors.name && <p className="text-xs font-bold text-discount">{errors.name}</p>}
              </Field>

              <Field label={t.checkout?.emailLabel || (lang === "en" ? "Email Address (For License Delivery)" : lang === "zh" ? "电子邮箱 (用于接收授权与凭据)" : "Alamat Email (Untuk Pengiriman Lisensi)")} htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  autoComplete="email"
                  required
                />
                {errors.email && <p className="text-xs font-bold text-discount">{errors.email}</p>}
              </Field>

              <Field label={t.checkout?.phoneLabel || (lang === "en" ? "WhatsApp / Phone (Optional)" : lang === "zh" ? "WhatsApp / 手机号 (可选)" : "Nomor WhatsApp / HP")} hint={lang === "en" ? "Optional for instant status notifications." : lang === "zh" ? "可选，用于接收即时订单状态通知。" : "Opsional — untuk notifikasi instan status pesanan."} htmlFor="no-hp">
                <Input
                  id="no-hp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 8xxxxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
            </div>
          </section>

          {/* Section 3: DETAIL PEMBAYARAN & KODE UNIK PROMINENT */}
          <section className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
            <h2 className="text-base font-black uppercase tracking-tight text-fg border-b-2 border-border pb-3 mb-4">
              {lang === "en" ? "3. Payment Details" : lang === "zh" ? "3. 支付转账详情" : "3. Detail Pembayaran & Transfer"}
            </h2>

            {paymentMethod === "qris" ? (
              <div className="space-y-5">
                {/* Highlight Kotak Kode Unik Super Jelas */}
                <div className="rounded-md border-2 border-border bg-accent-yellow p-4 text-black shadow-[3px_3px_0px_var(--shadow-color)]">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={20} strokeWidth={2.8} className="mt-0.5 shrink-0 text-black" />
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">
                        {lang === "en"
                          ? "IMPORTANT: TRANSFER EXACT AMOUNT INCLUDING UNIQUE CODE"
                          : lang === "zh"
                          ? "重要提醒：请务必转账包含唯一识别码的准确金额"
                          : "PENTING: TRANSFER TEPAT SAMPAI 3 DIGIT KODE UNIK"}
                      </p>
                      <p className="mt-1 text-xs font-bold leading-relaxed text-black/90">
                        {lang === "en"
                          ? `Your 3-digit unique verification code is +${uniqueCode}. Our automated robot uses this code to instantly verify your payment within 1–3 minutes.`
                          : lang === "zh"
                          ? `您的 3 位唯一识别码为 +${uniqueCode}。系统机器人将通过该尾数在 1–3 分钟内全自动识别并处理发货。`
                          : `Kode unik Anda adalah +Rp ${uniqueCode}. Robot sistem otomatis SerbaPremium membaca 3 digit ini agar pesanan Anda langsung aktif 1–3 menit tanpa perlu konfirmasi manual!`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rincian Nominal Transfer */}
                <div className="rounded-md border-2 border-border bg-surface-2 p-5 shadow-[2px_2px_0px_var(--shadow-color)]">
                  <div className="space-y-2 text-sm font-bold border-b border-border pb-3">
                    <div className="flex justify-between text-fg-muted">
                      <span>{lang === "en" ? "Item Subtotal" : lang === "zh" ? "商品原价" : "Harga Produk"}</span>
                      <span className="tabular-nums text-fg">Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-black bg-accent-yellow px-2 py-1 rounded-xs font-black">
                      <span>⚡ {lang === "en" ? "Unique Code (Automated Verification)" : lang === "zh" ? "唯一识别码 (全自动核验)" : "Kode Unik (Verifikasi Otomatis)"}</span>
                      <span className="tabular-nums">+Rp {uniqueCode}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-xs font-black uppercase text-fg-muted">
                        {lang === "en" ? "EXACT TOTAL TO TRANSFER" : lang === "zh" ? "应付精确转账总额" : "TOTAL NOMINAL TRANSFER"}
                      </p>
                      <p className="text-3xl font-black tracking-tight text-fg tabular-nums mt-0.5">
                        Rp {totalBayar.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyAmount(totalBayar)}
                      className="flex items-center gap-1.5 rounded-sm border-2 border-border bg-accent px-3 py-2 text-xs font-black text-black shadow-[2px_2px_0px_var(--shadow-color)] hover:bg-accent-hover active:translate-x-0.5 active:translate-y-0.5"
                    >
                      {isAmountCopied ? <Check size={15} strokeWidth={3} /> : <Copy size={15} strokeWidth={2.5} />}
                      {isAmountCopied
                        ? (lang === "en" ? "Nominal Copied!" : lang === "zh" ? "金额已复制！" : "Nominal Disalin!")
                        : (lang === "en" ? `Copy Rp ${totalBayar.toLocaleString("id-ID")}` : lang === "zh" ? `复制 Rp ${totalBayar.toLocaleString("id-ID")}` : `Salin Rp ${totalBayar.toLocaleString("id-ID")}`)}
                    </button>
                  </div>
                </div>

                {/* Gambar QRIS */}
                <div className="flex flex-col items-center gap-3 py-3">
                  <div className="relative overflow-hidden rounded-md border-2 border-border bg-white p-3 shadow-[4px_4px_0px_var(--shadow-color)]">
                    <img
                      src="/qris.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                      }}
                      alt="Kode QRIS SerbaPremium"
                      className="h-56 w-56 object-contain"
                    />
                  </div>
                  <p className="max-w-sm text-center text-xs font-bold leading-5 text-fg-muted">
                    {lang === "en"
                      ? "Scan QRIS above with BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, or any supported m-banking."
                      : lang === "zh"
                      ? "使用支持的手机银行或电子钱包（BCA、Mandiri、GoPay、OVO、DANA 等）扫描上方 QRIS 二维码。"
                      : "Pindai QRIS di atas dengan m-Banking BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, atau e-wallet lainnya."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Total Nominal USDT */}
                <div className="rounded-md border-2 border-border bg-surface-2 p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
                  <p className="text-xs font-black uppercase text-fg-muted">
                    {lang === "en" ? "TOTAL USDT TO TRANSFER" : lang === "zh" ? "应付 USDT 总额" : "TOTAL NOMINAL USDT"}
                  </p>
                  <p className="text-3xl font-black text-fg tabular-nums mt-0.5">
                    ${(totalBayar / 16000).toFixed(2)} USDT
                  </p>
                  <p className="text-xs font-bold text-fg-muted mt-1">
                    Rate: 1 USDT ≈ Rp 16.000 ({formatPrice(totalBayar, lang)})
                  </p>
                </div>

                {/* Alamat Wallet */}
                <div className="rounded-md border-2 border-border bg-surface p-4 shadow-[2px_2px_0px_var(--shadow-color)]">
                  <p className="text-xs font-black uppercase text-fg-muted">
                    {lang === "en" ? "Wallet Address" : lang === "zh" ? "接收钱包地址" : "Alamat Wallet"} ({PAYMENT_INFO[paymentMethod].badge}):
                  </p>
                  <div className="mt-2 flex items-center gap-2">
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
                      {isCopied ? (lang === "en" ? "Copied" : lang === "zh" ? "已复制" : "Disalin") : (lang === "en" ? "Copy" : lang === "zh" ? "复制" : "Salin")}
                    </button>
                  </div>
                  <p className="mt-2.5 text-xs font-bold text-fg-muted">
                    {lang === "en" ? "Network: " : lang === "zh" ? "转账网络: " : "Jaringan: "}
                    <span className="rounded-xs border border-border bg-accent-soft px-1.5 py-0.2 text-fg font-black">
                      {PAYMENT_INFO[paymentMethod].network}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Checkbox Konfirmasi & Tombol Selesaikan */}
            <div className="mt-6 border-t-2 border-border pt-5 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer rounded-md border-2 border-border bg-surface p-3.5 shadow-[2px_2px_0px_var(--shadow-color)] hover:bg-surface-2">
                <input
                  type="checkbox"
                  checked={paymentDone}
                  onChange={(e) => setPaymentDone(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-2 border-border cursor-pointer accent-accent"
                />
                <span className="text-xs font-black text-fg leading-5">
                  {lang === "en"
                    ? "I have completed the exact payment/transfer according to the instructions above."
                    : lang === "zh"
                    ? "我已按照上方说明完成准确金额的转账/付款。"
                    : "Saya sudah menyelesaikan transfer sesuai nominal tepat di atas (termasuk kode unik jika via QRIS)."}
                </span>
              </label>

              <Button
                size="lg"
                className="w-full text-base py-4"
                onClick={completePayment}
                disabled={loading}
              >
                <Zap size={18} strokeWidth={3} className="fill-current" />
                {loading
                  ? (lang === "en" ? "Verifying & Processing..." : lang === "zh" ? "正在核验并提交..." : "Memverifikasi Pesanan…")
                  : (lang === "en" ? "Complete Order Now 🚀" : lang === "zh" ? "立即完成订单 🚀" : "Selesaikan Pesanan Sekarang 🚀")}
              </Button>
            </div>
          </section>
        </div>

        {/* Kolom Kanan: Summary */}
        <aside className="lg:sticky lg:top-28">
          <CheckoutSummary items={items} subtotal={subtotal} discount={0} />
        </aside>
      </div>
    </div>
  );
}
