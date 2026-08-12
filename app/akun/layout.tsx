import type { Metadata } from "next";
import { AccountNav } from "./account-nav";
import { RequireAuth } from "@/components/storefront/require-auth";

export const metadata: Metadata = {
  title: "Akun Saya",
  description: "Kelola koleksi, pesanan, daftar keinginan, dan pengaturan akun Tokono Anda.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="tk-container pt-28 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Akun Saya</h1>
          <p className="mt-1 text-sm text-fg-muted">Kelola semua aktivitas Anda di Tokono.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <AccountNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
