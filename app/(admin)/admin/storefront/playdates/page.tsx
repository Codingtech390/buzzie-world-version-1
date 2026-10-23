
import { requireAdmin } from "@/lib/auth";
import PlaydatesEditor from "@/components/admin/storefront/PlaydatesEditor";

export const dynamic = "force-dynamic";

export default async function PlaydatesPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PlaydatesEditor />
    </div>
  );
}
