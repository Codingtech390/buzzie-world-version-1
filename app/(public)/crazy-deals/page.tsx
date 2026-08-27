import CrazyDealsProducts from "@/components/crazy-deals/CrazyDealsProducts";

export const metadata = {
  title: "Crazy Deals | BuzzieWorld",
  description: "Discover amazing deals on games, learning activities and products at BuzzieWorld.",
};

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
              src="/images/banners/Buzzie-deals.png"
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
