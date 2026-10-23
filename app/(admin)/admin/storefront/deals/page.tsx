import DealsEditor from "@/components/admin/storefront/DealsEditor";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  await requireAdmin();

  return <DealsEditor />;
}
