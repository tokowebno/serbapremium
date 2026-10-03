import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";
import { RequireAuth } from "@/components/storefront/require-auth";

export const metadata: Metadata = {
  title: "Pembayaran & Top Up",
  description: "Selesaikan pembelian aplikasi & akun premium Anda di TexasAi.",
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
    <RequireAuth>
      <div className="tk-container pt-20 sm:pt-28 pb-20 sm:pb-24">
        <CheckoutForm
          initialSlug={sp.app}
          customTitle={sp.title}
          customPrice={sp.price ? Number(sp.price) : undefined}
          customPlatform={sp.platform}
        />
      </div>
    </RequireAuth>
  );
}