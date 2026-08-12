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
import { cn, formatRupiah } from "@/lib/utils";
import type { CartItem } from "@/types";

type PaymentMethod = "qris";

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
    if (!qrisDone) return;
    const order = {
      id: `TK-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      items: items.map((i) => ({ name: i.name, platform: i.platform })),
      total: totalBayar,
      uniqueCode,
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
              <div className="mt-2 flex justify-end">
                <Button onClick={goNext}>
                  Lanjut ke Pembayaran <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-[15px] font-semibold tracking-tight">Pembayaran QRIS</h2>
              <div className="rounded-lg border border-border bg-surface-2 p-4">
                <p className="text-[13px] text-fg-muted">Total yang harus dibayar</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                  {formatRupiah(totalBayar)}
                </p>
                <p className="mt-2 text-[13px] leading-5 text-fg-muted">
                  <span className="font-medium text-fg">Kode unik {uniqueCode}</span> sudah termasuk di
                  nominal di atas — bayar persis sejumlah itu agar pesanan mudah dikenali.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 py-2">
                <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-3 shadow-sm">
                  <img
                    src="/qris.png"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/qris-placeholder.svg";
                    }}
                    alt="Kode QRIS Tokono — pindai dengan aplikasi e-wallet atau m-banking"
                    className="h-52 w-52 object-contain"
                  />
                </div>
                <p className="max-w-xs text-center text-[13px] leading-5 text-fg-muted">
                  Pindai QRIS di atas, bayar sesuai nominal{" "}
                  <span className="font-medium text-fg">{formatRupiah(totalBayar)}</span>, lalu tekan tombol di
                  bawah.
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

              <div className="mt-2 flex items-center justify-between gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Kembali
                </Button>
                <Button
                  onClick={completePayment}
                  disabled={!qrisDone}
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
