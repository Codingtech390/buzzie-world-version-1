"use client";

import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  HelpCircle,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import type { StorefrontProduct } from "@/types/storefront";

const faqs = [
  {
    question: "Can I return or exchange product?",
    answer:
      "Product can be exchanged in case of defective or missing parts received. Kindly share 360 degree unboxing video (without any editing) on lookwhatagift@gmail.com and we will gwt back to you after investigation",
    icon: PackageCheck,
  },
  {
    question: "Do you offer bulk or gifting orders or customised orders?",
    answer:
      "Yes, if you are planning a larger purchase, gifting order, school activity, or group requirement, please contact our team @ 8826345978 or drop us an email at lookwhatagift@gmail.com and share what you are looking for. We can help you with the next steps.",
    icon: Truck,
  },
  {
    question: "I still have questions. How can I contact you?",
    answer:
      "If you cannot find the answer you are looking for, please reach out to BuzzieWorld support team @ 8826345978 or drop us an email at lookwhatagift@gmail.com. We will be happy to help.",
    icon: PackageCheck,
  },
];

function HowToPlayCarousel({ products }: { products: StorefrontProduct[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  /*
   * Do NOT filter by product.howToPlay here.
   *
   * The current StorefrontProduct data does not guarantee
   * that field is true for your catalog.
   *
   * We only need products that have a usable image.
   */
  const howToPlayProducts = products.filter((product) =>
    product.images?.some((image) => image?.url),
  );

  const scrollCarousel = (direction: "left" | "right") => {
    const container = carouselRef.current;

    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-how-to-play-card]");

    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 20;

    container.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  if (howToPlayProducts.length === 0) {
    return (
      <div
        className="
          rounded-[24px]
          border
          border-[#ECE8F2]
          bg-[#FCFAFF]
          px-6
          py-12
          text-center
        "
      >
        <p
          className="
            font-[var(--font-poppins)]
            text-[12px]
            font-semibold
            text-[#77727F]
          "
        >
          No games are currently available.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ===================================================
          LEFT ARROW
         =================================================== */}
      <button
        type="button"
        aria-label="Previous games"
        onClick={() => scrollCarousel("left")}
        className="
          absolute
          left-[-18px]
          top-[42%]
          z-20
          hidden
          size-[42px]
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-[#E7DFF0]
          bg-white
          text-[#17213D]
          shadow-[0_8px_25px_rgba(21,18,28,0.10)]
          transition-all
          duration-300
          hover:-translate-x-0.5
          hover:border-[#CDBAE0]
          hover:bg-[#FAF7FD]
          lg:flex
        "
      >
        <ChevronLeft className="size-5" strokeWidth={1.8} />
      </button>

      {/* ===================================================
          CARDS
         =================================================== */}
      <div
        ref={carouselRef}
        className="
          flex
          snap-x
          snap-mandatory
          gap-4
          overflow-x-auto
          pb-3
          scrollbar-none
          sm:gap-5
          lg:gap-5
          lg:overflow-hidden
        "
      >
        {howToPlayProducts.map((product) => {
          const image = product.images?.find((item) => item?.url)?.url;

          if (!image) return null;

          return (
            <article
              key={product._id}
              data-how-to-play-card
              className="
                group
                relative
                min-w-[255px]
                snap-start
                overflow-hidden
                rounded-[24px]
                bg-white
                sm:min-w-[285px]
                lg:min-w-[calc((100%-60px)/4)]
                lg:flex-1
              "
            >
              {/* =========================================
                  PRODUCT IMAGE
                 ========================================= */}
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-t-[50%]
                  bg-[#EEE9F7]
                "
              >
                <div
                  className="
                    relative
                    aspect-[1/0.88]
                    overflow-hidden
                    rounded-t-[50%]
                    bg-[#EEE9F7]
                  "
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 42vw, 82vw"
                    className="
                      object-contain
                      px-4
                      pb-3
                      pt-4
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-[1.035]
                    "
                  />
                </div>
              </div>

              {/* =========================================
                  CONTENT
                 ========================================= */}
              <div
                className="
                  px-4
                  pb-5
                  pt-4
                  text-center
                  sm:px-5
                  sm:pb-6
                "
              >
                {/* Product Name */}
                <h3
                  className="
                    line-clamp-2
                    min-h-[34px]
                    font-playpen
                    text-[14px]
                    font-black
                    leading-[1.2]
                    tracking-[-0.02em]
                    text-[#17213D]
                    sm:text-[15px]
                    xl:text-[15px]
                  "
                >
                  {product.name}
                </h3>

                {/* Product Description */}
                <p
                  className="
                    mx-auto
                    mt-2
                    line-clamp-2
                    min-h-[32px]
                    max-w-[255px]
                    font-[var(--font-poppins)]
                    text-[9px]
                    leading-[1.55]
                    text-[#77727F]
                    sm:text-[10px]
                    xl:text-[13px]
                  "
                >
                  {product.description}
                </p>

                {/* =======================================
                    HOW TO PLAY BUTTON
                   ======================================= */}
                <Link
                  href={`/how-to-play/${product.slug}`}
                  className="
    group/button
    mt-5
    inline-flex
    min-h-[44px]
    items-center
    justify-center
    gap-2.5
    rounded-full
    bg-[#A092CD]
    px-7
    font-[var(--font-poppins)]
    text-[10px]
    font-black

    tracking-[0.025em]
    text-white
    shadow-[0_9px_20px_rgba(160,146,205,0.24)]
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:bg-[#8E7BBE]
    hover:shadow-[0_12px_25px_rgba(160,146,205,0.30)]
    sm:min-h-[46px]
    sm:px-8
    sm:text-[10px]
    lg:text-[13px]
  "
                >
                  <span className="text-white">How to Play</span>

                  <ArrowRight
                    className="
      size-4
      shrink-0
      text-white
      transition-transform
      duration-300
      group-hover/button:translate-x-1
    "
                    strokeWidth={2.5}
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* ===================================================
          RIGHT ARROW
         =================================================== */}
      <button
        type="button"
        aria-label="Next games"
        onClick={() => scrollCarousel("right")}
        className="
          absolute
          right-[-18px]
          top-[42%]
          z-20
          hidden
          size-[42px]
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-[#E7DFF0]
          bg-white
          text-[#17213D]
          shadow-[0_8px_25px_rgba(21,18,28,0.10)]
          transition-all
          duration-300
          hover:translate-x-0.5
          hover:border-[#CDBAE0]
          hover:bg-[#FAF7FD]
          lg:flex
        "
      >
        <ChevronRight className="size-5" strokeWidth={1.8} />
      </button>
    </div>
  );
}


export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const response = await fetch("/api/products?status=active&limit=20&sort=newest", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message ?? "Unable to load products.");
        }

        setProducts(data.products ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setProductsError(error instanceof Error ? error.message : "Unable to load products.");
      } finally {
        if (!controller.signal.aborted) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-white text-[#15121C]">
      {/* =========================================================
          HERO BANNER
         ========================================================= */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="relative overflow-hidden">
            <Image
              src="/images/banners/faq-1.png"
              alt="BuzzieWorld How to Play and FAQ"
              width={1920}
              height={1080}
              priority
              sizes="100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
    HOW TO PLAY — PRODUCT CAROUSEL
   ========================================================= */}
      <section className="relative z-10 mt-0 px-4 pb-2 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1320px]">
          {/* =====================================================
        SECTION HEADER
       ===================================================== */}
          <div className="mb-7 flex items-end justify-between gap-6 sm:mb-8 lg:mb-12">
            <div>
              <p
                className="
            font-[var(--font-poppins)]
            text-[9px]
            font-extrabold
            uppercase
            tracking-[0.16em]
            text-[#7B4DE8]
            sm:text-[10px]
          "
              >
                Learn the game
              </p>

              <h2
                className="
            mt-1

            font-playpen
            text-[24px]
            font-black
            leading-[1]
            tracking-[-0.035em]
            text-[#15121C]
            sm:text-[28px]
            lg:text-[32px]
          "
              >
                How to Play
              </h2>

              <p
                className="
            mt-4
            max-w-[560px]
            font-[var(--font-poppins)]
            text-[10px]
            leading-[1.6]
            text-[#77727F]
            sm:text-[11px]
            lg:text-[13px]
          "
              >
                Pick a game and discover how to play it.
              </p>
            </div>
          </div>

          {/* =====================================================
        LOADING STATE
       ===================================================== */}
          {productsLoading && (
            <div
              className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-4
          lg:gap-6
        "
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="
              overflow-hidden
              rounded-[24px]
              bg-white
            "
                >
                  <div
                    className="
                aspect-[0.88]
                animate-pulse
                rounded-t-[50%]
                bg-[#EEE9F7]
              "
                  />

                  <div className="px-4 pb-5 pt-4">
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#EEEAF2]" />
                    <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-[#F1EEF5]" />
                    <div className="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-[#F1EEF5]" />
                    <div className="mt-4 h-10 w-32 animate-pulse rounded-full bg-[#D8C9EB]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =====================================================
        ERROR STATE
       ===================================================== */}
          {!productsLoading && productsError && (
            <div
              className="
          rounded-[24px]
          border
          border-[#F0D9E0]
          bg-[#FFF8FA]
          px-6
          py-10
          text-center
        "
            >
              <p
                className="
            font-[var(--font-poppins)]
            text-[12px]
            font-semibold
            text-[#8B5361]
          "
              >
                {productsError}
              </p>
            </div>
          )}

          {/* =====================================================
        PRODUCT CAROUSEL
       ===================================================== */}
          {!productsLoading && !productsError && <HowToPlayCarousel products={products} />}
        </div>
      </section>

      {/* =========================================================
          FAQ INTRO
         ========================================================= */}
      <section className="px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24 lg:px-8 lg:pt-12">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          {/* Heading */}
          <h2
            className="
        mt-5
        w-full
        max-w-[760px]
        text-center
        font-[var(--font-roboto)]
        text-[clamp(2.25rem,5vw,4.4rem)]
        font-black
        uppercase
        leading-[0.92]
        tracking-[-0.055em]
        text-[#111111]
      "
          >
            Everything you
            <span className="text-[#E72D5A]"> need to know.</span>
          </h2>

          {/* Description */}
          <p
            className="
        mx-auto
        mt-7
        w-full
        max-w-[610px]
        text-center
        font-[var(--font-poppins)]
        text-[13px]
        leading-[1.8]
        text-[#666474]
        sm:text-[14px]
        lg:text-[15px]
      "
          >
            From ordering and delivery to product safety and returns, find clear answers to the
            questions that matter before and after purchase.
          </p>
        </div>
      </section>

      {/* =========================================================
          ACCORDION
         ========================================================= */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-[980px]">
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`
                    overflow-hidden
                    rounded-[18px]
                    border
                    transition-all
                    duration-300
                    ${
                      isOpen
                        ? "border-[#E8DDF7] bg-[#FCFAFF] shadow-[0_12px_35px_rgba(111,50,245,0.07)]"
                        : "border-[#ECEAF0] bg-white hover:border-[#DDD7E8]"
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="
                      flex
                      w-full
                      items-center
                      gap-4
                      px-5
                      py-5
                      text-left
                      sm:px-6
                      sm:py-6
                    "
                  >
                    <span
                      className={`
                        flex
                        size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition-colors
                        duration-300
                        sm:size-11
                        ${isOpen ? "bg-[#F0E7FF] text-[#6F32F5]" : "bg-[#F7F5FA] text-[#8A7F9D]"}
                      `}
                    >
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                    </span>

                    <span
                      className="
                        flex-1
                        pr-2
                        font-[var(--font-poppins)]
                        text-[12px]
                        font-extrabold
                        leading-[1.4]
                        text-[#17141F]
                        sm:text-[14px]
                        lg:text-[15px]
                      "
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`
                        flex
                        size-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300
                        ${isOpen ? "bg-[#6F32F5] text-white" : "bg-[#F6F4F8] text-[#625A6E]"}
                      `}
                    >
                      <ChevronDown
                        className={`
                          size-4
                          transition-transform
                          duration-300
                          ${isOpen ? "rotate-180" : ""}
                        `}
                        strokeWidth={2}
                      />
                    </span>
                  </button>

                  <div
                    className={`
                      grid
                      transition-[grid-template-rows]
                      duration-300
                      ease-out
                      ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                    `}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#EEEAF2] px-5 pb-6 pt-5 pl-[76px] sm:px-6 sm:pb-7 sm:pl-[82px]">
                        <p
                          className="
                            max-w-[720px]
                            font-[var(--font-poppins)]
                            text-[11px]
                            leading-[1.8]
                            text-[#686573]
                            sm:text-[12px]
                            lg:text-[13px]
                          "
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
    STILL NEED HELP
   ========================================================= */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div
            className="
        relative
        isolate
        min-h-[360px]
        overflow-hidden
        rounded-[28px]
        bg-[#F4ECFF]
        bg-cover
        bg-center
        bg-no-repeat
        sm:min-h-[390px]
        lg:min-h-[430px]
        lg:rounded-[34px]
      "
            style={{
              backgroundImage: "url('/images/banners/faq-bottom-banner.png')",
            }}
          >
            {/* Background overlay */}
            <div
              aria-hidden="true"
              className="
          pointer-events-none
          absolute
          inset-0
          bg-white/[0.04]
        "
            />

            {/* Centered content */}
            <div
              className="
          relative
          z-10
          flex
          min-h-[360px]
          items-center
          justify-center
          px-6
          py-12
          text-center
          sm:min-h-[390px]
          sm:px-10
          lg:min-h-[430px]
          lg:px-16
        "
            >
              <div className="mx-auto flex w-full max-w-[620px] flex-col items-center text-center">
                {/* Eyebrow */}
                <p
                  className="
              font-[var(--font-poppins)]
              text-[9px]
              font-black
              uppercase
              tracking-[0.18em]
              text-[#E72D5A]
              sm:text-[10px]
            "
                >
                  Still need help?
                </p>

                {/* Heading */}
                <h2
                  className="
              mt-5
        w-full
        max-w-[760px]
        text-center
        font-[var(--font-roboto)]
        text-[clamp(2.25rem,5vw,4.4rem)]
        font-black
        uppercase
        leading-[0.92]
        tracking-[-0.055em]
        text-[#111111]
            "
                >
                  We&apos;re here to <span className="text-[#E72D5A]">help.</span>
                </h2>

                {/* Description */}
                <p
                  className="
              mx-auto
              mt-5
              max-w-[500px]
              text-center
              font-[var(--font-poppins)]
              text-[12px]
              leading-[1.75]
              text-[#686273]
              sm:text-[13px]
              sm:leading-7
            "
                >
                  Couldn&apos;t find what you were looking for? Reach out to our team and we&apos;ll
                  help you find the right answer.
                </p>

                {/* CTA */}
                <Link
                  href="/contact"
                  className="
              group
              mt-7
              inline-flex
              min-h-[48px]
              items-center
              justify-center
              gap-3
              rounded-full
              bg-[#C391EE]
              px-6
              font-[var(--font-poppins)]
              text-[11px]
              font-black
              text-white
              shadow-[0_10px_25px_rgba(195,145,238,0.25)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#A96FDB]
              hover:shadow-[0_14px_30px_rgba(169,111,219,0.28)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C391EE]
              focus-visible:ring-offset-4
              focus-visible:ring-offset-white
              sm:min-h-[50px]
              sm:px-7
              sm:text-[12px]
            "
                >
                  <span className="text-white">Contact Support</span>

                  <span
                    className="
                flex
                size-7
                items-center
                justify-center
                rounded-full
                bg-white/20
                text-white
                sm:size-8
              "
                  >
                    <ArrowRight
                      className="
                  size-3.5
                  text-white
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  sm:size-4
                "
                      strokeWidth={2.5}
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
