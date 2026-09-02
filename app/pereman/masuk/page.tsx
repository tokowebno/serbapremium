"use client";

import { Suspense } from "react";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";

export default function PeremanMasukPage() {
  return (
    <Suspense>
      <MasukForm />
    </Suspense>
  );
}

function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Isi email dan kata sandi Anda.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/pereman-masuk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Email atau kata sandi salah.");
        setLoading(false);
        return;
      }
      toast.push({ title: "Berhasil masuk", description: "Selamat datang di area admin." });
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/pereman") ? next : "/pereman");
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-bg px-5">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-surface p-8 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#191916]">
              <Lock size={18} className="text-white/85" />
            </span>
            <p className="mt-3 text-[15px] font-semibold tracking-tight">Area Admin</p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight">Masuk</h1>
            <p className="mt-1 text-sm text-fg-muted">Akses terbatas untuk pengelola SerbaPremium.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@serbapremium.id"
                autoComplete="username"
                autoFocus
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

            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? "Memeriksa…" : "Masuk"}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-fg-faint">
          Area ini hanya untuk pengelola SerbaPremium.
        </p>
      </div>
    </div>
  );
}