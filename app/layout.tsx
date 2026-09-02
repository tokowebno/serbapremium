import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/storefront/providers";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { I18nProvider } from "@/components/storefront/i18n-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { syncFromSupabase } from "@/lib/data-cache";
import { getServerTranslation } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL("https://serbapremium.my.id"),
  title: {
    default: "SerbaPremium — Marketplace Aplikasi & Lisensi Digital Premium",
    template: "%s · SerbaPremium",
  },
  description:
    "Temukan aplikasi dan lisensi digital premium untuk berbagai perangkat. Pembelian satu kali, tanpa biaya langganan.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "SerbaPremium — Marketplace Aplikasi & Lisensi Digital Premium",
    description:
      "Temukan aplikasi dan lisensi digital premium untuk berbagai perangkat. Pembelian satu kali, tanpa biaya langganan.",
    type: "website",
    locale: "id_ID",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Isi cache produk dari database Supabase (fallback: mock lokal).
  await syncFromSupabase();
  const { lang } = await getServerTranslation();

  return (
    <html lang={lang} className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("serbapremium:theme")||localStorage.getItem("tokono:theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-[100dvh] flex-col">
        <I18nProvider lang={lang}>
          <Providers>
            <StorefrontShell>{children}</StorefrontShell>
            <LanguageSelector />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}