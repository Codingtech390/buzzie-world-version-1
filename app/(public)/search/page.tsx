import type { Metadata } from "next";
import { Suspense } from "react";

import SearchClient from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search | BuzzieWorld",
  description: "Find toys, games, learning kits, books and more at BuzzieWorld.",
};

function SearchPageFallback() {
  return (
    <main className="min-h-[70vh] bg-[#FFFCF8]">
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-18 lg:px-8 lg:pt-22">
        <div className="mx-auto max-w-3xl animate-pulse text-center">
          <div className="mx-auto h-4 w-32 rounded-full bg-[#F1E8DD]" />
          <div className="mx-auto mt-5 h-12 w-72 rounded-2xl bg-[#F1E8DD] sm:h-14 sm:w-96" />
          <div className="mx-auto mt-4 h-5 w-full max-w-xl rounded-full bg-[#F1E8DD]" />

          <div className="mt-9 h-16 rounded-[22px] bg-white shadow-sm ring-1 ring-[#EEE4D8]" />
        </div>
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchClient />
    </Suspense>
  );
}
