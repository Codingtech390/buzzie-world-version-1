import CrazyDealsProducts from "@/components/crazy-deals/CrazyDealsProducts";

import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Crazy Deals",
  description:
    "Discover exciting offers and special deals on kids toys, games and learning products at BuzzieWorld.",
  path: "/crazy-deals",
});

export default function CrazyDealsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ================================================================
          SECTION 1 — CRAZY DEALS BANNER
      ================================================================= */}

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-3 pt-4 sm:px-5 sm:pt-6 lg:px-8 lg:pt-8">
          <div className="relative overflow-hidden rounded-[22px] sm:rounded-[30px] lg:rounded-[38px]">
            <img
              src="/images/banners/deals-2.png"
              alt="BuzzieWorld Crazy Deals — up to 50% off"
              className="
                block
                h-auto
                w-full
                object-cover
              "
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 2 — DEAL PRODUCTS
      ================================================================= */}

      <CrazyDealsProducts />
    </main>
  );
}
