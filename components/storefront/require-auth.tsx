"use client";

import { type ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogIn, Lock } from "lucide-react";
import { useAuth } from "./providers";
import { useTranslation } from "./i18n-provider";
import { ButtonLink } from "@/components/ui/button";

/**
 * Wrapper akses halaman: Wajib login untuk mengakses konten.
 * Di Telegram Mini App, otomatis menunggu sesi Telegram terhubung tanpa menampilkan layar login.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isAuthReady } = useAuth();
  const { lang } = useTranslation();
  const L = (en: string, id: string, zh: string) => (lang === "en" ? en : lang === "zh" ? zh : id);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAuthReady) {
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
          <h2 className="mt-4 text-xl font-bold tracking-tight text-fg">{L("Sign In Required", "Wajib Masuk Akun", "需要登录")}</h2>
          <p className="mt-2 text-sm text-fg-muted leading-relaxed">
            {L(
              "Please sign in to your Texas AI account first to access this menu, top up your balance, or make a purchase.",
              "Anda harus masuk ke akun Texas AI terlebih dahulu untuk mengakses menu ini, mengisi saldo, atau melakukan transaksi.",
              "请先登录您的 Texas AI 账户，才能访问此菜单、充值或进行交易。",
            )}
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <ButtonLink
              href={`/masuk?next=${encodeURIComponent(pathname)}`}
              size="lg"
              className="w-full justify-center"
            >
              <LogIn size={17} strokeWidth={2.2} />
              {L("Sign In Now", "Masuk Sekarang", "立即登录")}
            </ButtonLink>
            <ButtonLink
              href={`/daftar?next=${encodeURIComponent(pathname)}`}
              variant="secondary"
              size="lg"
              className="w-full justify-center"
            >
              {L("Create New Account", "Daftar Akun Baru", "注册新账户")}
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
