"use client";

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";

import { siteConfig } from "@/config/site";

const FOOTER_LOGO = "/images/hero/buzzie-logo-1.png";

/* ================================================================
   FOOTER NAVIGATION
================================================================ */

const shopLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Shop by Age", href: "/shop/age/1-3-years" },
  { label: "Categories", href: "/shop" },
  { label: "Crazy Deals", href: "/crazy-deals" },
] as const;

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "How to Play / FAQ", href: "/faq" },
] as const;

const customerCareLinks = [
  { label: "Shipping & Delivery", href: "/shipping-policy" },
  { label: "Returns & Refunds", href: "/returns-refunds" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
  { label: "Need Help?", href: "/contact" },
] as const;

const accountLinks = [
  { label: "My Account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
] as const;

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
] as const;

/* ================================================================
   SOCIAL ICON
================================================================ */

function SocialIcon({ type }: { type: "instagram" | "facebook" | "youtube" }) {
  if (type === "instagram") {
    return <FaInstagram className="size-4" />;
  }

  if (type === "facebook") {
    return <FaFacebook className="size-4" />;
  }

  return <FaYoutube className="size-4" />;
}

/* ================================================================
   FOOTER
================================================================ */

export default function Footer() {
  const socialLinks = [
    {
      label: "Instagram",
      href: siteConfig.social.instagram,
      type: "instagram" as const,
    },
    {
      label: "Facebook",
      href: siteConfig.social.facebook,
      type: "facebook" as const,
    },
    {
      label: "YouTube",
      href: siteConfig.social.youtube,
      type: "youtube" as const,
    },
  ].filter((social) => Boolean(social.href));

  return (
    <>
      <footer
        id="footer"
        className="
    relative
    isolate
    min-h-[760px]
    overflow-hidden
    bg-[#1D1B22]
    text-white

    sm:min-h-[780px]

    md:min-h-[820px]

    lg:min-h-[900px]

    xl:min-h-[960px]

    2xl:min-h-[1020px]
  "
      >
        {/* ================================================================
            FOOTER BACKGROUND IMAGE
        ================================================================ */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
            overflow-hidden
          "
        >
          <Image
            src="/images/backgrounds/footer-img.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* ================================================================
            SOFT COLOUR ATMOSPHERE
        ================================================================ */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-40
            top-[180px]
            -z-10
            size-[32rem]
            rounded-full
            bg-[#7B61C9]/10
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-32
            -z-10
            size-[30rem]
            rounded-full
            bg-[#E83D59]/[0.07]
            blur-3xl
          "
        />

        {/* ================================================================
            FOOTER CONTENT
        ================================================================ */}

        <div
          className="
            container
            relative
            z-30


            sm:mt-7
            sm:pt-[155px]

            md:pt-[170px]

            lg:mt-8
            lg:pt-[175px]


          "
        >
          {/* ==============================================================
              MAIN FOOTER LAYOUT

              Desktop:
              - Left = brand/contact
              - Right = centered five-column navigation group
          ============================================================== */}

          <div
            className="
              grid
              grid-cols-1
              gap-10
              pb-10

              sm:gap-12
              sm:pb-12

              lg:grid-cols-[1.2fr_3.8fr]
              lg:items-start
              lg:gap-x-10
              lg:gap-y-0
              lg:pb-16

              xl:grid-cols-[1.15fr_3.85fr]
              xl:gap-x-12
            "
          >
            {/* ==========================================================
                BRAND / CONTACT
            ========================================================== */}

            <div
              className="
                w-full
                max-w-md
                lg:pr-4
              "
            >
              <Link
                href="/"
                aria-label="BuzzieWorld home"
                className="
                  inline-flex
                  items-center
                  rounded-2xl
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                "
              >
                <Image
                  src={FOOTER_LOGO}
                  alt="BuzzieWorld"
                  width={180}
                  height={60}
                  className="
                    h-auto
                    w-[140px]
                    object-contain

                    sm:w-[160px]

                    lg:w-[170px]
                  "
                />
              </Link>

              <p
                className="
                  mt-5
                  max-w-sm
                  font-[var(--font-poppins-brand)]
                  text-[20px]
                  font-bold
                  leading-[1.05]
                  tracking-[-0.035em]
                  text-black

                  sm:mt-6
                  sm:text-[24px]
                "
              >
                Your Daily Dose of Vitamin L
              </p>

              <p
                className="
                  mt-4
                  max-w-sm
                  font-[var(--font-playpen)]
                  text-[13px]
                  font-medium
                  leading-6
                  text-black

                  sm:text-sm
                "
              >
                We curate playful products that help children explore, create and grow.
              </p>

              {/* ==========================================================
                  CONTACT DETAILS
              ========================================================== */}

              <div
                className="
                  mt-6
                  space-y-3
                  font-[var(--font-playpen)]
                  text-[13px]
                  font-medium
                  text-black

                  sm:mt-7
                  sm:text-sm
                "
              >
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="
                    flex
                    items-center
                    gap-3
                    transition-colors
                    hover:text-white
                  "
                >
                  <Mail className="size-4 shrink-0" strokeWidth={1.9} />

                  <span className="break-all sm:break-normal">{siteConfig.email}</span>
                </a>

                <div className="flex items-center gap-3">
                  <MapPin className="size-4 shrink-0" strokeWidth={1.9} />

                  <span>{siteConfig.country}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0" strokeWidth={1.9} />

                  <span>Customer care coming soon</span>
                </div>
              </div>

              {/* ==========================================================
                  SOCIAL LINKS
              ========================================================== */}

              {socialLinks.length > 0 ? (
                <div className="mt-6 flex items-center gap-2 sm:mt-7">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`BuzzieWorld ${social.label}`}
                      className="
                        flex
                        size-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/15
                        bg-white/[0.06]
                        text-white/75
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-[#C391EE]/60
                        hover:bg-[#C391EE]/15
                        hover:text-white
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#E83D59]

                        sm:size-10
                      "
                    >
                      <SocialIcon type={social.type} />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            {/* ==============================================================
                CENTERED NAVIGATION GROUP
            ============================================================== */}

            <div
              className="
                grid
                w-full
                grid-cols-2
                gap-x-5
                gap-y-10

                sm:grid-cols-3
                sm:gap-x-8
                sm:gap-y-12

                lg:grid-cols-5
                lg:items-start
                lg:justify-items-center
                lg:gap-x-3
                lg:gap-y-0

                xl:gap-x-7
              "
            >
              {/* SHOP */}

              <FooterColumn title="Shop">
                {shopLinks.map((item) => (
                  <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </FooterColumn>

              {/* COMPANY */}

              <FooterColumn title="Company">
                {companyLinks.map((item) => (
                  <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </FooterColumn>

              {/* CUSTOMER CARE */}

              <FooterColumn title="Customer Care">
                {customerCareLinks.map((item) => (
                  <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </FooterColumn>

              {/* ACCOUNT */}

              <FooterColumn title="Your Account">
                {accountLinks.map((item) => (
                  <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </FooterColumn>

              {/* LEGAL */}

              <FooterColumn title="Legal">
                {legalLinks.map((item) => (
                  <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </FooterColumn>
            </div>
          </div>

          {/* ================================================================
              COPYRIGHT / LEGAL
          ================================================================ */}

          <div className="border-t border-black py-5 sm:py-6">
            <div
              className="
                flex
                flex-col
                gap-3
                font-[var(--font-playpen)]
                text-[11px]
                font-medium
                leading-5
                text-black

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:gap-4
                sm:text-xs
              "
            >
              <p>
                © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2

                  sm:gap-x-5
                "
              >
                <Link href="/privacy-policy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>

                <span className="hidden text-white/20 sm:inline">•</span>

                <Link href="/terms" className="transition-colors hover:text-white">
                  Terms of Service
                </Link>

                <span className="hidden text-white/20 sm:inline">•</span>

                <Link href="/disclaimer" className="transition-colors hover:text-white">
                  Disclaimer
                </Link>

                <span className="hidden text-white/20 sm:inline">•</span>

                <span>
                  {siteConfig.currency} · {siteConfig.locale}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================
              FOOTER SIGN-OFF
          ================================================================ */}

          <div
            className="
              flex
              flex-col
              gap-3
              pb-7
              pt-2
              font-[var(--font-playpen)]
              text-[11px]
              font-medium
              leading-5
              text-black

              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:pb-9
              sm:text-xs
            "
          >
            <p>Built for curious minds, creative hands and happy families.</p>

            <Link
              href="#main-content"
              className="
                inline-flex
                w-fit
                items-center
                gap-1.5
                font-[var(--font-playpen)]
                font-semibold
                text-black
                transition-colors
                hover:text-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E83D59]
              "
            >
              Back to top
              <ArrowUpRight className="size-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ================================================================
   FOOTER COLUMN
================================================================ */

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="
        flex
        w-full
        min-w-0
        flex-col
        items-center
        justify-start
        text-center
      "
    >
      <h2
        className="
          m-0
          w-full
          text-center
          font-playpen
          text-[17px]
          font-semibold
          leading-[1.35]
          tracking-[0.01em]
          text-black

          sm:text-[18px]

          lg:text-[19px]

          xl:text-[20px]
        "
      >
        {title}
      </h2>

      <nav
        aria-label={`${title} navigation`}
        className="
        text-black
          mt-3
          flex
          w-full
          flex-col
          items-center
          justify-start
          gap-2
          text-center

          sm:mt-4
          sm:gap-2.5
        "
      >
        {children}
      </nav>
    </div>
  );
}

/* ================================================================
   FOOTER LINK
================================================================ */

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        block
        w-full
        max-w-full
        px-1
        text-center
        font-[var(--font-playpen-sans)]
        text-[12px]
        font-medium
        leading-5
        text-white/65
        transition-colors
        duration-200
        hover:text-white

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#E72D5A]

        sm:text-[13px]

        lg:text-[13px]

        xl:text-[13.5px]
      "
    >
      {/* Text is independently centered */}
      <span
        className="
          block
          w-full
          text-center
          transition-transform
          duration-200
        "
      >
        {children}
      </span>

      {/* Arrow stays outside the text centering calculation */}
      <ArrowUpRight
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[calc(50%+4.5rem)]
          top-1/2
          size-3
          -translate-y-1/2
          translate-x-[-4px]
          opacity-0
          transition-all
          duration-200
          group-hover:translate-x-0
          group-hover:opacity-70

          sm:size-3.5
          sm:left-[calc(50%+5rem)]
        "
        strokeWidth={1.8}
      />
    </Link>
  );
}
