import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/storefront/providers";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { I18nProvider } from "@/components/storefront/i18n-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { syncFromSupabase } from "@/lib/data-cache";
import { getServerTranslation } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL("https://texasai.site"),
  title: {
    default: "Texas AI — Instant AI Workspaces & Developer Licenses",
    template: "%s · Texas AI",
  },
  description:
    "Official digital licensing platform with automated on-chain crypto settlement. Instant access to ChatGPT, Claude, Gemini, Cursor, and 40+ flagship tools.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Texas AI — Instant AI Workspaces & Developer Licenses",
    description:
      "Automated on-chain crypto settlement & 1-click wallet checkout for flagship AI workspaces and developer subscriptions.",
    type: "website",
    locale: "en_US",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Isi cache produk dari database Supabase (fallback: mock lokal).
  await syncFromSupabase();
  const { lang } = await getServerTranslation();

  return (
    <html lang={lang} className="h-full antialiased">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("texasai:theme")||localStorage.getItem("serbapremium:theme")||localStorage.getItem("tokono:theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
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
