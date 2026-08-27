import { Suspense } from "react";

import ShopClient from "@/components/shop/ShopClient";

function ShopLoading() {
  return (
    <main className="min-h-screen bg-[#FBF8F1]">
      {/* Hero skeleton */}
      <section className="h-[315px] bg-[#071A3D]">
        <div className="mx-auto h-full max-w-[1500px] px-6 py-12">
          <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />

          <div className="mt-6 h-16 w-[390px] max-w-full animate-pulse rounded-2xl bg-white/10" />

          <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-xl bg-white/10" />
        </div>
      </section>

      {/* Category skeleton */}
      <section className="relative z-20 mx-auto -mt-[38px] max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="h-[145px] animate-pulse rounded-[24px] border border-[#E7DDCA] bg-[#FFFDF8] shadow-[0_12px_35px_rgba(60,50,30,0.10)]" />
      </section>

      {/* Content skeleton */}
      <section className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[216px_minmax(0,1fr)]">
          <div className="hidden h-[680px] animate-pulse rounded-[20px] bg-[#F2EBDD] lg:block" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[0.82] animate-pulse rounded-[18px] bg-[#F2EBDD]"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopClient />
    </Suspense>
  );
}
