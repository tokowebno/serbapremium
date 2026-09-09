import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Login Admin",
    template: "%s · Tokono Admin",
  },
  robots: { index: false, follow: false },
};

export default function PeremanRootLayout({ children }: { children: React.ReactNode }) {
  // Halaman /pereman/masuk dirender full-screen tanpa sidebar.
  return children;
}