"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogIn, Lock, Zap } from "lucide-react";
import { useAuth } from "./providers";
import { ButtonLink } from "@/components/ui/button";

/**
 * Wrapper akses halaman: Wajib login untuk mengakses konten.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-surface/90 p-6 sm:p-8 text-center shadow-lg backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent ring-1 ring-accent/20">
            <Lock size={26} strokeWidth={2.2} />
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-fg">Wajib Masuk Akun</h2>
          <p className="mt-2 text-sm text-fg-muted leading-relaxed">
            Anda harus masuk ke akun TexasAi terlebih dahulu untuk mengakses menu ini, mengisi saldo, atau melakukan transaksi.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <ButtonLink
              href={`/masuk?next=${encodeURIComponent(pathname)}`}
              size="lg"
              className="w-full justify-center"
            >
              <LogIn size={17} strokeWidth={2.2} />
              Masuk Sekarang
            </ButtonLink>
            <ButtonLink
              href={`/daftar?next=${encodeURIComponent(pathname)}`}
              variant="secondary"
              size="lg"
              className="w-full justify-center"
            >
              Daftar Akun Baru
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
