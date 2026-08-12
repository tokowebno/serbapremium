"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
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
    // ponytail: validasi sungguhan via backend saat API tersedia.
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    login({ name: name.charAt(0).toUpperCase() + name.slice(1), email: email.trim() });
    toast.push({ title: "Berhasil masuk", description: "Selamat datang kembali di Tokono." });
    const next = searchParams.get("next");
    router.push(next ?? "/akun");
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5 pt-32 pb-20">
      <GlassCard className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-fg">
            <span className="block h-5 w-5 rounded-[5px] border-2 border-bg" />
          </span>
          <p className="mt-3 text-lg font-semibold tracking-tight">Tokono</p>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Masuk</h1>
          <p className="mt-1 text-sm text-fg-muted">Lanjutkan ke akun Tokono Anda.</p>
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
          </Field>

          <Field label="Kata Sandi" htmlFor="kata-sandi">
            <div className="relative">
              <Input
                id="kata-sandi"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi Anda"
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-fg-faint transition-colors hover:text-fg"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {error && <p className="text-xs text-discount">{error}</p>}

          <Button type="submit" className="mt-1 w-full">
            Masuk
          </Button>

          <div className="flex justify-end">
            <Link href="/lupa-kata-sandi" className="text-[13px] font-medium text-accent hover:text-accent-hover">
              Lupa kata sandi?
            </Link>
          </div>

          <div className="flex items-center gap-3" role="separator" aria-label="atau">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-fg-faint">atau</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="text-center text-sm text-fg-muted">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-medium text-accent hover:text-accent-hover">
              Daftar
            </Link>
          </p>
        </form>
      </GlassCard>
    </div>
  );
}
