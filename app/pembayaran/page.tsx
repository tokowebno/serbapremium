import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Pembayaran",
  description: "Selesaikan pembelian aplikasi & akun premium Anda di SerbaPremium.",
};

interface Props {
  searchParams: Promise<{
    app?: string;
    variant?: string;
    price?: string;
    title?: string;
    platform?: string;
  }>;
}

export default async function PembayaranPage({ searchParams }: Props) {
  const sp = await searchParams;
  return (
    <div className="tk-container pt-20 sm:pt-28 pb-20 sm:pb-24">
      <CheckoutForm
        initialSlug={sp.app}
        customTitle={sp.title}
        customPrice={sp.price ? Number(sp.price) : undefined}
        customPlatform={sp.platform}
      />
    </div>
  );
}