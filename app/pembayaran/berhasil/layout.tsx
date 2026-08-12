import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pembelian Berhasil" };

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
