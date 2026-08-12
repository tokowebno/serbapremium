"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "./providers";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Penjaga halaman akun: belum login → arahkan ke /masuk.
 * ponytail: session dari localStorage; ganti dengan token backend saat API tersedia.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const hydrated = useHydrated();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Tunggu hidrasi localStorage selesai agar tidak redirect kilat.
    if (!hydrated) return;
    if (!user) {
      router.replace(`/masuk?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, user, pathname, router]);

  if (!hydrated || !user) return null;
  return <>{children}</>;
}
