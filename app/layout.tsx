import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/storefront/providers";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tokono.example"),
  title: {
    default: "Tokono — Marketplace Aplikasi Premium",
    template: "%s · Tokono",
  },
  description:
    "Temukan aplikasi premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.",
  openGraph: {
    title: "Tokono — Marketplace Aplikasi Premium",
    description:
      "Temukan aplikasi premium untuk berbagai perangkat. Pembelian satu kali, tanpa langganan.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("tokono:theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-[100dvh] flex-col">
        <Providers>
          <StorefrontShell>{children}</StorefrontShell>
        </Providers>
      </body>
    </html>
  );
}
