"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/storefront/providers";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Nama lengkap wajib diisi.";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) next.email = "Alamat email tidak valid.";
    if (password.length < 8) next.password = "Kata sandi minimal 8 karakter.";
    if (confirm !== password) next.confirm = "Konfirmasi kata sandi tidak cocok.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    login({ name: name.trim(), email: email.trim() });
    toast.push({ title: "Akun berhasil dibuat", description: "Selamat datang di SerbaPremium!" });
    const nextUrl = searchParams.get("next");
    router.push(nextUrl ?? "/akun");
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
          <h1 className="mt-2 text-xl font-black tracking-tight text-fg">Daftar Akun Baru</h1>
          <p className="mt-1 text-xs font-medium text-fg-muted">Mulai koleksi aplikasi & tools premium Anda.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Field label="Nama Lengkap" htmlFor="nama-lengkap">
            <Input
              id="nama-lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Lengkap Anda"
              autoComplete="name"
            />
            {errors.name && <p className="text-xs font-bold text-discount">{errors.name}</p>}
          </Field>

          <Field label="Alamat Email" htmlFor="email">
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

          <Field label="Kata Sandi" htmlFor="kata-sandi">
            <div className="relative">
              <Input
                id="kata-sandi"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
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
            {errors.password && <p className="text-xs font-bold text-discount">{errors.password}</p>}
          </Field>

          <Field label="Konfirmasi Kata Sandi" htmlFor="konfirmasi-kata-sandi">
            <Input
              id="konfirmasi-kata-sandi"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi kata sandi"
              autoComplete="new-password"
            />
            {errors.confirm && <p className="text-xs font-bold text-discount">{errors.confirm}</p>}
          </Field>

          <Button type="submit" className="mt-1 w-full">
            Daftar Sekarang
          </Button>

          <p className="text-center text-xs font-semibold text-fg-muted">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-bold text-accent-blue dark:text-accent hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
