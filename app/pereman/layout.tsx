import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dasbor Admin",
    template: "%s · Tokono Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-bg">
      <AdminSidebar />
      <div className="lg:pl-60">
        <div className="min-h-[100dvh] px-5 py-6 sm:px-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
