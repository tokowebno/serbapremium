import type { Metadata } from "next";
import { AccountNav } from "./account-nav";
import { getServerTranslation } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "My Account & Orders",
  description: "Manage your Texas AI collection, orders, and wishlist.",
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await getServerTranslation();
  const L = (en: string, id: string, zh: string) => (lang === "en" ? en : lang === "zh" ? zh : id);

  return (
    <div className="tk-container pt-28 pb-20">
      <div className="mb-8 border-b border-border/70 pb-4">
        <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold uppercase text-accent">
          {L("COLLECTION & ORDERS", "KOLEKSI & PESANAN", "收藏与订单")}
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-fg">
          {L("My Collection & Orders", "Koleksi & Pesanan Saya", "我的收藏与订单")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-normal text-fg-muted">
          {L(
            "Access all your digital licenses and order history in one place.",
            "Akses semua lisensi digital dan riwayat pesanan Anda di browser ini.",
            "在此查看您的所有数字授权与订单记录。",
          )}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
