import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/sidebar/page";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <AdminSidebar />

      <main>{children}</main>
    </div>
  );
}
