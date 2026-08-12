"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Landmark, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/form";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { useCart, useLibrary } from "@/components/storefront/providers";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

type PaymentMethod = "transfer" | "kartu" | "qris";

const methods: Array<{ value: PaymentMethod; label: string }> = [
  { value: "transfer", label: "Transfer Bank" },
  { value: "kartu", label: "Kartu Kredit" },
  { value: "qris", label: "QRIS" },
];

const steps = ["Informasi", "Pembayaran", "Konfirmasi"];

export function CheckoutForm({ initialSlug }: { initialSlug?: string }) {
  const router = useRouter();
  const cart = useCart();
  const library = useLibrary();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("transfer");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [transferDone, setTransferDone] = useState(false);
  const [qrisDone, setQrisDone] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Item beli-langsung dari ?app=slug (dibaca server, diteruskan via prop).
  // Prioritas tetap isi keranjang; item langsung hanya dipakai saat keranjang kosong.
  let directItem: CartItem | null = null;
  if (initialSlug) {
    const app = api.apps.getBySlug(initialSlug);
    if (app && !cart.items.some((i) => i.appId === app.id)) {
      directItem = {
        appId: app.id,
        name: app.name,
        icon: app.icon,
        platform: app.platforms[0],
        price: app.price,
      };
    }
  }

  const items: CartItem[] = cart.items.length > 0 ? cart.items : directItem ? [directItem] : [];
  const subtotal = items.reduce((s, i) => s + i.price, 0);

  if (items.length === 0) {
    return (
      <div className="tk-container pt-28 pb-20">
        <EmptyState
          icon={ShoppingBag}
          title="Belum ada item untuk dibeli."
          description="Pilih aplikasi yang Anda inginkan, lalu tekan Beli Sekarang untuk checkout langsung."
          action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
        />
      </div>
    );
  }

  const goNext = () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Nama lengkap wajib diisi.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Alamat email tidak valid.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep(2);
  };

  const completePayment = () => {
    if ((method === "transfer" && !transferDone) || (method === "qris" && !qrisDone)) return;
    const order = {
      id: "TK-84521",
      date: new Date().toISOString().slice(0, 10),
      items: items.map((i) => ({ name: i.name, platform: i.platform })),
      total: subtotal,
    };
    try {
      sessionStorage.setItem("tokono:last-order", JSON.stringify(order));
    } catch {
      /* penyimpanan penuh — abaikan */
    }
    items.forEach((i) => library.add(i.appId));
    cart.clear();
    toast.push({
      title: "Pembayaran berhasil",
      description: "Aplikasi Anda sudah masuk ke koleksi.",
    });
    router.push("/pembayaran/berhasil");
  };

  return (
    <div className="tk-container pt-28 pb-20">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Pembayaran</h1>

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
              <h2 className="text-[15px] font-semibold tracking-tight">Informasi Pembeli</h2>
              <Field label="Nama Lengkap" htmlFor="nama-lengkap">
                <Input
                  id="nama-lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
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
              <Field label="No. HP" hint="Opsional — untuk mengirim bukti pembelian." htmlFor="no-hp">
                <Input
                  id="no-hp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Metode Pembayaran" htmlFor="metode-pembayaran">
                <Select
                  id="metode-pembayaran"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                >
                  {methods.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="mt-2 flex justify-end">
                <Button onClick={goNext}>
                  Lanjut ke Pembayaran <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-[15px] font-semibold tracking-tight">Pembayaran</h2>

              {method === "transfer" && (
                <div className="rounded-lg border border-border bg-surface-2 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Landmark size={16} className="text-accent" /> Bank Nusantara
                  </div>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-fg-muted">Nomor Rekening</dt>
                      <dd className="font-mono tabular-nums">1234 5678 9012</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-fg-muted">Atas Nama</dt>
                      <dd>PT Tokono Digital</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-[13px] leading-5 text-fg-muted">
                    Transfer sejumlah total ke rekening di atas, lalu konfirmasi agar pesanan Anda diproses.
                  </p>
                  {transferDone ? (
                    <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-success">
                      <CheckCircle2 size={14} /> Transfer Anda tercatat.
                    </p>
                  ) : (
                    <Button className="mt-3 w-full" onClick={() => setTransferDone(true)}>
                      Saya Sudah Transfer
                    </Button>
                  )}
                </div>
              )}

              {method === "kartu" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CreditCard size={16} className="text-accent" /> Kartu Kredit
                  </div>
                  <Field label="Nomor Kartu" htmlFor="nomor-kartu">
                    <Input
                      id="nomor-kartu"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      autoComplete="cc-number"
                    />
                  </Field>
                  <Field label="Nama di Kartu" htmlFor="nama-kartu">
                    <Input
                      id="nama-kartu"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Nama pemegang kartu"
                      autoComplete="cc-name"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Kedaluwarsa" htmlFor="kedaluwarsa">
                      <Input
                        id="kedaluwarsa"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/BB"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                      />
                    </Field>
                    <Field label="CVC" htmlFor="cvc">
                      <Input
                        id="cvc"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                      />
                    </Field>
                  </div>
                  <p className="text-[13px] leading-5 text-fg-muted">
                    Data kartu hanya simulasi — tidak ada pembayaran sungguhan dalam mode demo.
                  </p>
                </div>
              )}

              {method === "qris" && (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-3 shadow-sm">
                    {/* ponytail: QRIS asli kamu — taruh di public/qris.png, placeholder dipakai sebelum ada */}
                    <img
                      src="/qris.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                      }}
                      alt="Kode QRIS Tokono — pindai dengan aplikasi e-wallet atau m-banking"
                      className="h-48 w-48 object-contain"
                    />
                  </div>
                  <p className="max-w-xs text-center text-[13px] leading-5 text-fg-muted">
                    Pindai kode QRIS dengan aplikasi e-wallet atau m-banking, lalu selesaikan
                    pembayaran sesuai total.
                  </p>
                  {qrisDone ? (
                    <p className="flex items-center gap-1.5 text-[13px] font-medium text-success">
                      <CheckCircle2 size={14} /> Pembayaran Anda tercatat.
                    </p>
                  ) : (
                    <Button className="w-full" onClick={() => setQrisDone(true)}>
                      Saya Sudah Bayar
                    </Button>
                  )}
                </div>
              )}

              <div className="mt-2 flex items-center justify-between gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Kembali
                </Button>
                <Button
                  onClick={completePayment}
                  disabled={(method === "transfer" && !transferDone) || (method === "qris" && !qrisDone)}
                  className="flex-1 sm:flex-none"
                >
                  Selesaikan Pembayaran
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
