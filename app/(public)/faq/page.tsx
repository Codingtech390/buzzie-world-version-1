"use client";

import {
  ArrowRight,
  ChevronDown,
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
import { useState } from "react";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our collection, choose the products you want, add them to your cart, and continue to checkout. Review your order details, enter your delivery information, select your payment method, and place your order.",
    icon: PackageCheck,
  },
  {
    question: "How long will it take to receive my order?",
    answer:
      "Once your order has been confirmed and dispatched, you will receive the available delivery information for your order. Delivery timelines can vary depending on your location and the shipping method selected.",
    icon: Truck,
  },
  {
    question: "What are the delivery charges?",
    answer:
      "Delivery charges depend on your order and delivery location. The applicable shipping charges will be shown during checkout before you complete your purchase.",
    icon: Truck,
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer:
      "Cash on Delivery availability depends on the delivery location and order eligibility. If COD is available for your order, you will see it as a payment option during checkout.",
    icon: CreditCard,
  },
  {
    question: "Are your products safe for children?",
    answer:
      "Our products are selected with age-appropriateness, play value, learning, and safety in mind. Always check the recommended age range and product-specific instructions before purchasing or using a product.",
    icon: ShieldCheck,
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Return and exchange eligibility depends on the product and the condition in which it is received. Please review our return policy or contact our support team if you need help with a specific order.",
    icon: RefreshCcw,
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order has been dispatched, tracking information will be made available when applicable. You can use the tracking details provided for your shipment to follow its progress.",
    icon: Clock3,
  },
  {
    question: "Do you offer bulk or gifting orders?",
    answer:
      "Yes, if you are planning a larger purchase, gifting order, school activity, or group requirement, please contact our team and share what you are looking for. We can help you with the next steps.",
    icon: UserRound,
  },
  {
    question: "I still have questions. How can I contact you?",
    answer:
      "If you cannot find the answer you are looking for, please reach out to the BuzzieWorld support team through the contact options available on the website. We will be happy to help.",
    icon: HelpCircle,
  },
];

const quickLinks = [
  {
    title: "Easy Instructions",
    description: "Simple steps to get started.",
    icon: PackageCheck,
  },
  {
    title: "Common Questions",
    description: "Answers to the things parents ask most.",
    icon: HelpCircle,
  },
  {
    title: "Tips & Guides",
    description: "Helpful information for better play.",
    icon: ShieldCheck,
  },
  {
    title: "Safe & Kid-Friendly",
    description: "Thoughtfully selected for growing minds.",
    icon: UserRound,
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-white text-[#15121C]">
      {/* =========================================================
          HERO BANNER
         ========================================================= */}
      <section className="w-full bg-[#FFF9EF]">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="relative overflow-hidden">
            <Image
              src="/images/banners/faq-banner-1.png"
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
          QUICK HELP STRIP
         ========================================================= */}
      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8 max-sm:mt-3">
        <div className="mx-auto max-w-[1180px]">
          <div
            className="
              grid
              overflow-hidden
              rounded-[24px]
              border
              border-[#ECE8F2]
              bg-white
              shadow-[0_18px_55px_rgba(21,18,28,0.07)]
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {quickLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`
                    flex
                    min-h-[118px]
                    items-center
                    gap-4
                    px-5
                    py-5
                    sm:px-6
                    lg:min-h-[130px]
                    lg:px-7
                    ${
                      index !== quickLinks.length - 1
                        ? "border-b border-[#EEEAF2] lg:border-b-0 lg:border-r"
                        : ""
                    }
                    ${index === 1 ? "sm:border-r-0 lg:border-r" : ""}
                  `}
                >
                  <div
                    className="
                      flex
                      size-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F3ECFF]
                      text-[#7B4DE8]
                    "
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        font-[var(--font-poppins)]
                        text-[12px]
                        font-extrabold
                        leading-[1.25]
                        text-[#15121C]
                        sm:text-[13px]
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-1.5
                        max-w-[190px]
                        font-[var(--font-poppins)]
                        text-[10px]
                        leading-[1.55]
                        text-[#737080]
                        sm:text-[11px]
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ INTRO
         ========================================================= */}
      <section className="px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-[900px] text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 rounded-full bg-[#E72D5A] sm:w-10" />

            <span
              className="
                font-[var(--font-poppins)]
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]
                text-[#E72D5A]
                sm:text-[10px]
              "
            >
              Frequently asked questions
            </span>

            <span className="size-1.5 rounded-full bg-[#F59A23]" />
          </div>

          <h2
            className="
              mx-auto
              mt-5
              max-w-[760px]
              font-[var(--font-roboto)]
              text-[clamp(2.25rem,5vw,4.4rem)]
              font-black
              leading-[0.92]
              tracking-[-0.055em]
              text-[#111111]
            "
          >
            Everything you
            <span className="text-[#E72D5A]"> need to know.</span>
          </h2>

          <p
            className="
              mx-auto
              mt-7
              max-w-[610px]
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
            {/* =====================================================
          RESPONSIVE CONTENT OVERLAY
         ===================================================== */}
            <div
              aria-hidden="true"
              className="
          pointer-events-none
          absolute
          inset-0
          bg-white/[0.04]
        "
            />

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
              <div className="mx-auto max-w-[620px]">
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
              mt-3
              font-[var(--font-roboto)]
              text-[clamp(2rem,4.5vw,3.5rem)]
              font-black
              leading-[0.94]
              tracking-[-0.055em]
              text-[#17131F]
            "
                >
                  We&apos;re here to help.
                </h2>

                {/* Description */}
                <p
                  className="
              mx-auto
              mt-5
              max-w-[500px]
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

      {/* =========================================================
          BOTTOM NAVIGATION
         ========================================================= */}
      <section className="border-t border-[#EEEAF0] bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[980px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p
              className="
                font-[var(--font-poppins)]
                text-[10px]
                font-black
                uppercase
                tracking-[0.15em]
                text-[#9A94A3]
              "
            >
              BuzzieWorld Help Center
            </p>

            <p
              className="
                mt-1
                font-[var(--font-poppins)]
                text-[11px]
                text-[#77727F]
              "
            >
              Play · Learn · Grow
            </p>
          </div>

          <Link
            href="/shop"
            className="
              group
              inline-flex
              items-center
              gap-2
              font-[var(--font-poppins)]
              text-[11px]
              font-extrabold
              text-[#6F32F5]
              transition-colors
              hover:text-[#E72D5A]
            "
          >
            Continue shopping
            <ArrowRight
              className="
                size-3.5
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
