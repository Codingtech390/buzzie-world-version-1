import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/sidebar/page";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#FCFAF7]">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Admin Content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
