import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface OrderSuccessPageProps {
  searchParams: Promise<{
    order?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl bg-[#FFF8EC] p-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-[#79D45C]" />

        <p className="mt-6 text-sm font-medium text-[#3F7DFF]">BUZZIEWORLD</p>

        <h1 className="mt-2 text-3xl font-semibold">Order Confirmed!</h1>

        <p className="mt-4 text-black/60">
          Thank you for shopping with BuzzieWorld. Your payment has been successfully verified.
        </p>

        {params.order && (
          <div className="mt-6 rounded-xl bg-white px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-black/40">Order Number</p>

            <p className="mt-1 font-semibold">{params.order}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/shop" className="rounded-xl bg-[#3F7DFF] px-5 py-3 font-medium text-white">
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-black/10 bg-white px-5 py-3 font-medium"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
