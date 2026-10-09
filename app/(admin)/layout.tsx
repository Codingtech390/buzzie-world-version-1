
import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/sidebar/page";
import AdminScrollableContent from "@/components/admin/AdminScrollableContent";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#FCFAF7]">
      <AdminSidebar />

      <AdminScrollableContent>
        {children}
      </AdminScrollableContent>
    </div>
  );
}
