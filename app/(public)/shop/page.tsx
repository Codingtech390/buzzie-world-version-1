import { Suspense } from "react";

import ShopClient from "@/components/shop/ShopClient";

function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-48 rounded-[2rem] bg-[#F8EFD8]" />
        <div className="h-28 rounded-3xl bg-[#F8EFD8]" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-3xl bg-[#F8EFD8]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF9]">
      <Suspense fallback={<ShopLoading />}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <ShopClient />
        </div>
      </Suspense>
    </main>
  );
}
