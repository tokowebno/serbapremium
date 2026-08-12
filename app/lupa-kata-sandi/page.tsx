"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Alamat email tidak valid.");
      return;
    }
    setError(null);
    toast.push({ title: "Tautan pemulihan terkirim", description: "Cek kotak masuk email Anda." });
    router.push("/masuk");
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5 pt-32 pb-20">
      <GlassCard className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-fg">
            <span className="block h-5 w-5 rounded-[5px] border-2 border-bg" />
          </span>
          <p className="mt-3 text-lg font-semibold tracking-tight">Tokono</p>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Lupa Kata Sandi</h1>
          <p className="mt-1 text-sm text-fg-muted">Masukkan email Anda, kami akan kirim tautan pemulihan.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
            />
            {error && <p className="text-xs text-discount">{error}</p>}
          </Field>

          <Button type="submit" className="mt-1 w-full">
            Kirim Tautan
          </Button>

          <Link
            href="/masuk"
            className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-hover"
          >
            <ArrowLeft size={14} /> Kembali ke halaman masuk
          </Link>
        </form>
      </GlassCard>
    </div>
  );
}
