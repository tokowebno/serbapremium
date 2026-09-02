"use client";

import type { ReactNode } from "react";

/**
 * Wrapper akses halaman: Langsung tampilkan konten tanpa login.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
