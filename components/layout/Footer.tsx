import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import Link from "next/link";

import { siteConfig } from "@/config/site";

const FOOTER_VIDEO =
  "/images/hero/video/night-sky-rockets-stars-loop-v2.mp4";

const FOOTER_LOGO = "/images/hero/buzzie-logo.png";

/* ================================================================
   FOOTER NAVIGATION
   Keep these routes explicit so the footer remains stable even if
   the main navbar/navigation configuration changes.
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

function SocialIcon({
  type,
}: {
  type: "instagram" | "facebook" | "youtube";
}) {
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
    <footer
      id="footer"
      className="
        relative
        isolate
        overflow-hidden
        border-t
        border-white/10
        text-white
      "
    >
      {/* ================================================================
          VIDEO BACKGROUND
      ================================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          overflow-hidden
        "
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
          "
        >
          <source src={FOOTER_VIDEO} type="video/mp4" />
        </video>
      </div>

      {/* ================================================================
          VIDEO OVERLAYS
      ================================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-[#10182A]/55
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-gradient-to-b
          from-[#10182A]/35
          via-[#10182A]/55
          to-[#10182A]/80
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-gradient-to-r
          from-[#10182A]/55
          via-transparent
          to-[#10182A]/40
        "
      />

      {/* ================================================================
          ATMOSPHERIC DECORATION
      ================================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          -z-5
          size-80
          rounded-full
          bg-[#6F32F5]/15
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-24
          -z-5
          size-96
          rounded-full
          bg-[#E72D5A]/10
          blur-3xl
        "
      />

      {/* ================================================================
          MAIN FOOTER
      ================================================================= */}

      <div className="container relative">
        <div
          className="
            grid
            gap-10
            py-14
            sm:py-16
            lg:grid-cols-[1.35fr_repeat(5,minmax(0,1fr))]
            lg:gap-8
            lg:py-20
          "
        >
          {/* ============================================================
              BRAND / CONTACT
          ============================================================ */}

          <div className="max-w-md">
            <Link
              href="/"
              className="
                inline-flex
                items-center
                rounded-2xl
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E72D5A]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#10182A]
              "
              aria-label="BuzzieWorld home"
            >
              <Image
                src={FOOTER_LOGO}
                alt="BuzzieWorld"
                width={180}
                height={60}
                className="
                  h-auto
                  w-[150px]
                  object-contain
                  sm:w-[170px]
                "
                priority={false}
              />
            </Link>

            <p
              className="
                mt-5
                max-w-sm
                font-[var(--font-roboto)]
                text-lg
                font-bold
                leading-7
                tracking-[-0.02em]
                text-white
              "
            >
              Your daily dose of vitamin L
            </p>

            <p
              className="
                mt-2
                max-w-sm
                font-[var(--font-poppins)]
                text-sm
                leading-6
                text-white/65
              "
            >
              We curate playful products that help children explore, create
              and grow.
            </p>

            {/* ==========================================================
                CONTACT DETAILS
            ========================================================== */}

            <div
              className="
                mt-6
                space-y-3
                font-[var(--font-poppins)]
                text-sm
                text-white/70
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
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E72D5A]
                "
              >
                <Mail
                  className="size-4 shrink-0"
                  strokeWidth={1.9}
                />

                <span>{siteConfig.email}</span>
              </a>

              <div className="flex items-center gap-3">
                <MapPin
                  className="size-4 shrink-0"
                  strokeWidth={1.9}
                />

                <span>{siteConfig.country}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="size-4 shrink-0"
                  strokeWidth={1.9}
                />

                <span>Customer care coming soon</span>
              </div>
            </div>

            {/* ==========================================================
                SOCIAL LINKS
            ========================================================== */}

            {socialLinks.length > 0 ? (
              <div className="mt-7 flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`BuzzieWorld ${social.label}`}
                    className="
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-white/10
                      text-white/80
                      backdrop-blur-md
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-white/25
                      hover:bg-white/20
                      hover:text-white
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#E72D5A]
                    "
                  >
                    <SocialIcon type={social.type} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* ============================================================
              SHOP
          ============================================================ */}

          <FooterColumn title="Shop">
            {shopLinks.map((item) => (
              <FooterLink
                key={`${item.href}-${item.label}`}
                href={item.href}
              >
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* ============================================================
              COMPANY
          ============================================================ */}

          <FooterColumn title="Company">
            {companyLinks.map((item) => (
              <FooterLink
                key={`${item.href}-${item.label}`}
                href={item.href}
              >
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* ============================================================
              CUSTOMER CARE
          ============================================================ */}

          <FooterColumn title="Customer Care">
            {customerCareLinks.map((item) => (
              <FooterLink
                key={`${item.href}-${item.label}`}
                href={item.href}
              >
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* ============================================================
              ACCOUNT
          ============================================================ */}

          <FooterColumn title="Your Account">
            {accountLinks.map((item) => (
              <FooterLink
                key={`${item.href}-${item.label}`}
                href={item.href}
              >
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* ============================================================
              LEGAL
          ============================================================ */}

          <FooterColumn title="Legal">
            {legalLinks.map((item) => (
              <FooterLink
                key={`${item.href}-${item.label}`}
                href={item.href}
              >
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        {/* ================================================================
            COPYRIGHT / POLICIES
        ================================================================= */}

        <div className="border-t border-white/10 py-5 sm:py-6">
          <div
            className="
              flex
              flex-col
              gap-4
              font-[var(--font-poppins)]
              text-xs
              text-white/50
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-2
              "
            >
              <Link
                href="/privacy-policy"
                className="
                  transition-colors
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E72D5A]
                "
              >
                Privacy Policy
              </Link>

              <span className="hidden text-white/20 sm:inline">
                •
              </span>

              <Link
                href="/terms"
                className="
                  transition-colors
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E72D5A]
                "
              >
                Terms of Service
              </Link>

              <span className="hidden text-white/20 sm:inline">
                •
              </span>

              <Link
                href="/disclaimer"
                className="
                  transition-colors
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E72D5A]
                "
              >
                Disclaimer
              </Link>

              <span className="hidden text-white/20 sm:inline">
                •
              </span>

              <span>
                {siteConfig.currency} · {siteConfig.locale}
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================
            FOOTER TAGLINE / BACK TO TOP
        ================================================================= */}

        <div
          className="
            flex
            flex-col
            gap-3
            pb-8
            pt-2
            font-[var(--font-poppins)]
            text-xs
            text-white/40
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:pb-10
          "
        >
          <p>
            Built for curious minds, creative hands and happy families.
          </p>

          <Link
            href="#main-content"
            className="
              inline-flex
              items-center
              gap-1.5
              font-semibold
              text-white/50
              transition-colors
              hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#E72D5A]
            "
          >
            Back to top

            <ArrowUpRight
              className="size-3.5"
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   FOOTER COLUMN
   ================================================================ */

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="
          font-[var(--font-roboto)]
          text-sm
          font-bold
          tracking-[-0.01em]
          text-white
        "
      >
        {title}
      </h2>

      <div className="mt-4 space-y-2.5">
        {children}
      </div>
    </div>
  );
}

/* ================================================================
   FOOTER LINK
   ================================================================ */

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        w-fit
        items-center
        gap-1
        font-[var(--font-poppins)]
        text-sm
        text-white/60
        transition-colors
        hover:text-white
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#E72D5A]
      "
    >
      <span>{children}</span>

      <ArrowUpRight
        className="
          size-3.5
          -translate-y-0.5
          translate-x-[-2px]
          opacity-0
          transition-all
          duration-200
          group-hover:translate-x-0
          group-hover:opacity-70
        "
        strokeWidth={1.8}
      />
    </Link>
  );
}
