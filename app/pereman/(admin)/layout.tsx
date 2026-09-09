import type { Metadata } from "next";
import { headers } from "next/headers";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminGuard } from "@/components/admin/admin-guard";

export const metadata: Metadata = {
  title: {
    default: "Dasbor Admin",
    template: "%s · Tokono Admin",
  },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Halaman masuk dirender full-screen tanpa sidebar.
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const isLoginPage = pathname === "/pereman/masuk" || pathname.endsWith("/pereman/masuk");

  if (isLoginPage) {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="min-h-[100dvh] bg-bg">
        <AdminSidebar />
        <div className="lg:pl-60">
          <div className="min-h-[100dvh] px-5 py-6 sm:px-8 lg:px-10">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}