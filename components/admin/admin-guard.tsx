"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Penjaga client area admin (/pereman): verifikasi sesi via API server,
 * lalu arahkan ke halaman masuk jika tidak valid.
 * ponytail: token httpOnly tidak bisa dibaca JS — verifikasi lewat API.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/pereman-cek")
      .then((r) => r.json())
      .then((data: { ok: boolean }) => {
        if (cancelled) return;
        if (!data.ok) {
          router.replace(`/pereman/masuk?next=${encodeURIComponent(pathname)}`);
          return;
        }
        setChecked(true);
      })
      .catch(() => {
        if (!cancelled) router.replace("/pereman/masuk");
      });
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="min-h-[100dvh] bg-bg">
        <div className="px-5 py-6 sm:px-8 lg:px-10">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-4 h-4 w-72 max-w-full" />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
