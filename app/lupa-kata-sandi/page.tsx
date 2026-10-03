"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { TexasAiIcon } from "@/components/ui/logo";

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
      <div className="w-full max-w-sm rounded-lg border-2 border-border bg-surface p-8 shadow-[6px_6px_0px_var(--shadow-color)]">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="group mb-3 flex items-center justify-center" aria-label="TexasAi — Beranda">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/80 bg-surface shadow-xs transition-transform duration-200 group-hover:scale-105">
              <TexasAiIcon size={34} />
            </div>
          </Link>
          <p className="text-lg font-black tracking-tight text-fg">
            <span>Texas</span><span className="text-accent ml-0.5 font-extrabold">AI</span>
          </p>
          <h1 className="mt-2 text-xl font-black tracking-tight text-fg">Lupa Kata Sandi</h1>
          <p className="mt-1 text-xs font-medium text-fg-muted">Masukkan email Anda untuk menerima tautan pemulihan.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Field label="Alamat Email Akun" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
            />
            {error && <p className="text-xs font-bold text-discount">{error}</p>}
          </Field>

          <Button type="submit" className="mt-1 w-full">
            Kirim Tautan Pemulihan
          </Button>

          <Link
            href="/masuk"
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-accent-blue dark:text-accent hover:underline"
          >
            <ArrowLeft size={14} strokeWidth={2.5} /> Kembali ke halaman masuk
          </Link>
        </form>
      </div>
    </div>
  );
}
