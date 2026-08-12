import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Pembayaran",
  description: "Selesaikan pembelian aplikasi Anda di Tokono.",
};

interface Props {
  searchParams: Promise<{ app?: string }>;
}

export default async function PembayaranPage({ searchParams }: Props) {
  const { app } = await searchParams;
  // Item beli-langsung dibaca di server — andal di semua environment (dev, worker).
  return <CheckoutForm initialSlug={app} />;
}