"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/storefront/providers";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Isi email dan kata sandi Anda.");
      return;
    }
    setError(null);
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    login({ name: name.charAt(0).toUpperCase() + name.slice(1), email: email.trim() });
    toast.push({ title: "Berhasil masuk", description: "Selamat datang kembali di SerbaPremium." });
    const next = searchParams.get("next");
    router.push(next ?? "/akun");
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5 pt-32 pb-20">
      <div className="w-full max-w-sm rounded-lg border-2 border-border bg-surface p-8 shadow-[6px_6px_0px_var(--shadow-color)]">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-accent text-black shadow-[2px_2px_0px_var(--shadow-color)]">
            <Zap size={22} strokeWidth={2.8} className="fill-current" />
          </span>
          <p className="mt-3 text-lg font-black tracking-tighter uppercase text-fg">
            SERBA<span className="text-accent-blue dark:text-accent">PREMIUM</span>
          </p>
          <h1 className="mt-2 text-xl font-black tracking-tight text-fg">Masuk Akun</h1>
          <p className="mt-1 text-xs font-medium text-fg-muted">Lanjutkan ke akun SerbaPremium Anda.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Field label="Alamat Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Kata Sandi" htmlFor="kata-sandi">
            <div className="relative">
              <Input
                id="kata-sandi"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi akun"
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-xs p-1 text-fg-faint transition-colors hover:text-fg"
              >
                {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
              </button>
            </div>
          </Field>

          {error && <p className="text-xs font-bold text-discount">{error}</p>}

          <Button type="submit" className="mt-1 w-full">
            Masuk Sekarang
          </Button>

          <div className="flex justify-end">
            <Link href="/lupa-kata-sandi" className="text-xs font-bold text-accent-blue dark:text-accent hover:underline">
              Lupa kata sandi?
            </Link>
          </div>

          <div className="flex items-center gap-3" role="separator" aria-label="atau">
            <span className="h-0.5 flex-1 bg-border" />
            <span className="text-xs font-black uppercase text-fg-faint">atau</span>
            <span className="h-0.5 flex-1 bg-border" />
          </div>

          <p className="text-center text-xs font-semibold text-fg-muted">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-bold text-accent-blue dark:text-accent hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
