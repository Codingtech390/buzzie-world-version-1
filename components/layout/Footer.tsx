import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";

import { siteConfig } from "@/config/site";

const FOOTER_LOGO = "/images/hero/buzzieLogo.png";

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
    <footer
      id="footer"
      className="
        relative
        isolate
        overflow-hidden
        bg-[#1D1B22]
        text-white
      "
    >
      {/* ============================================================
    FOOTER BACKGROUND VIDEO
============================================================ */}

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
        <video
          className="
    absolute
    inset-0
    h-full
    w-full
    object-cover
    object-[center_28%]
    opacity-[0.58]
    translate-y-[5%]
    scale-[1.15]
    sm:translate-y-[5%]
    sm:scale-[1.16]
    lg:translate-y-[4%]
    lg:scale-[1.18]
    xl:translate-y-[4%]
    xl:scale-[1.2]
  "
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/images/hero/video/footer-video.mp4" type="video/mp4" />
        </video>

        {/* Soft readability overlay */}
        <div
          className="
      absolute
      inset-0
      bg-[#1D1B22]/20
    "
        />
      </div>

      {/* ============================================================
          NATURAL WAVY BOUNDARY
      ============================================================ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-20
          h-[105px]
          overflow-hidden
          sm:h-[125px]
          lg:h-[150px]
          xl:h-[165px]
        "
      >
        {/* ==========================================================
            MAIN CREAM WAVE
        ========================================================== */}

        <div
          className="
            footer-wave
            absolute
            inset-y-0
            left-0
            w-[200%]
            min-w-[1800px]
          "
          style={{
            animationDuration: "32s",
          }}
        >
          <svg viewBox="0 0 2880 170" preserveAspectRatio="none" className="h-full w-full">
            <g>
              <path
                d="M0 0H1440V52C1260 18 1115 15 950 42C755 74 655 121 472 126C285 131 150 94 0 62Z"
                fill="#FFF8E8"
              >
                <animate
                  attributeName="d"
                  dur="10s"
                  repeatCount="indefinite"
                  values="
                    M0 0H1440V52C1260 18 1115 15 950 42C755 74 655 121 472 126C285 131 150 94 0 62Z;
                    M0 0H1440V46C1265 25 1115 10 950 37C760 68 650 112 470 120C285 128 145 89 0 56Z;
                    M0 0H1440V58C1255 12 1110 22 948 48C755 81 650 126 475 132C288 138 150 99 0 67Z;
                    M0 0H1440V52C1260 18 1115 15 950 42C755 74 655 121 472 126C285 131 150 94 0 62Z
                  "
                  calcMode="spline"
                  keyTimes="0;0.33;0.66;1"
                  keySplines="
                    0.42 0 0.58 1;
                    0.42 0 0.58 1;
                    0.42 0 0.58 1
                  "
                />
              </path>
            </g>

            <g transform="translate(1440 0)">
              <path
                d="M0 0H1440V52C1260 18 1115 15 950 42C755 74 655 121 472 126C285 131 150 94 0 62Z"
                fill="#FFF8E8"
              >
                <animate
                  attributeName="d"
                  dur="10s"
                  repeatCount="indefinite"
                  values="
                    M0 0H1440V52C1260 18 1115 15 950 42C755 74 655 121 472 126C285 131 150 94 0 62Z;
                    M0 0H1440V46C1265 25 1115 10 950 37C760 68 650 112 470 120C285 128 145 89 0 56Z;
                    M0 0H1440V58C1255 12 1110 22 948 48C755 81 650 126 475 132C288 138 150 99 0 67Z;
                    M0 0H1440V52C1260 18 1115 15 950 42C755 74 655 121 472 126C285 131 150 94 0 62Z
                  "
                  calcMode="spline"
                  keyTimes="0;0.33;0.66;1"
                  keySplines="
                    0.42 0 0.58 1;
                    0.42 0 0.58 1;
                    0.42 0 0.58 1
                  "
                />
              </path>
            </g>
          </svg>
        </div>

        {/* ==========================================================
            LAVENDER WAVE
        ========================================================== */}

        <div
          className="
            footer-wave
            absolute
            inset-y-0
            left-0
            w-[200%]
            min-w-[1800px]
          "
          style={{
            animationDuration: "43s",
            animationDelay: "-11s",
          }}
        >
          <svg viewBox="0 0 2880 170" preserveAspectRatio="none" className="h-full w-full">
            <g>
              <path
                d="M0 0H1440V64C1250 31 1110 27 942 54C760 84 640 133 465 138C275 143 135 105 0 74Z"
                fill="#C9B8EA"
                fillOpacity="0.42"
              >
                <animate
                  attributeName="d"
                  dur="13s"
                  repeatCount="indefinite"
                  values="
                    M0 0H1440V64C1250 31 1110 27 942 54C760 84 640 133 465 138C275 143 135 105 0 74Z;
                    M0 0H1440V56C1240 40 1100 19 940 47C755 78 635 121 460 130C275 139 130 96 0 67Z;
                    M0 0H1440V72C1260 20 1100 35 945 61C760 91 650 140 470 145C280 150 145 113 0 81Z;
                    M0 0H1440V64C1250 31 1110 27 942 54C760 84 640 133 465 138C275 143 135 105 0 74Z
                  "
                  calcMode="spline"
                  keyTimes="0;0.33;0.66;1"
                  keySplines="
                    0.42 0 0.58 1;
                    0.42 0 0.58 1;
                    0.42 0 0.58 1
                  "
                />
              </path>
            </g>

            <g transform="translate(1440 0)">
              <path
                d="M0 0H1440V64C1250 31 1110 27 942 54C760 84 640 133 465 138C275 143 135 105 0 74Z"
                fill="#C9B8EA"
                fillOpacity="0.42"
              >
                <animate
                  attributeName="d"
                  dur="13s"
                  repeatCount="indefinite"
                  values="
                    M0 0H1440V64C1250 31 1110 27 942 54C760 84 640 133 465 138C275 143 135 105 0 74Z;
                    M0 0H1440V56C1240 40 1100 19 940 47C755 78 635 121 460 130C275 139 130 96 0 67Z;
                    M0 0H1440V72C1260 20 1100 35 945 61C760 91 650 140 470 145C280 150 145 113 0 81Z;
                    M0 0H1440V64C1250 31 1110 27 942 54C760 84 640 133 465 138C275 143 135 105 0 74Z
                  "
                  calcMode="spline"
                  keyTimes="0;0.33;0.66;1"
                  keySplines="
                    0.42 0 0.58 1;
                    0.42 0 0.58 1;
                    0.42 0 0.58 1
                  "
                />
              </path>
            </g>
          </svg>
        </div>

        {/* ==========================================================
            FINE HIGHLIGHT WAVE
        ========================================================== */}

        <div
          className="
            footer-wave
            absolute
            inset-y-0
            left-0
            w-[200%]
            min-w-[1800px]
          "
          style={{
            animationDuration: "52s",
            animationDelay: "-19s",
          }}
        >
          <svg viewBox="0 0 2880 170" preserveAspectRatio="none" className="h-full w-full">
            <g>
              <path
                d="M0 0H1440V47C1275 25 1120 28 958 48C785 69 660 110 480 116C295 122 150 91 0 57Z"
                fill="#FFF8E8"
                fillOpacity="0.98"
              >
                <animate
                  attributeName="d"
                  dur="15s"
                  repeatCount="indefinite"
                  values="
                    M0 0H1440V47C1275 25 1120 28 958 48C785 69 660 110 480 116C295 122 150 91 0 57Z;
                    M0 0H1440V53C1270 20 1115 34 955 53C780 74 655 102 475 121C295 128 150 97 0 63Z;
                    M0 0H1440V43C1280 30 1110 21 960 44C790 65 665 117 485 111C300 118 145 84 0 53Z;
                    M0 0H1440V47C1275 25 1120 28 958 48C785 69 660 110 480 116C295 122 150 91 0 57Z
                  "
                  calcMode="spline"
                  keyTimes="0;0.33;0.66;1"
                  keySplines="
                    0.42 0 0.58 1;
                    0.42 0 0.58 1;
                    0.42 0 0.58 1
                  "
                />
              </path>
            </g>

            <g transform="translate(1440 0)">
              <path
                d="M0 0H1440V47C1275 25 1120 28 958 48C785 69 660 110 480 116C295 122 150 91 0 57Z"
                fill="#FFF8E8"
                fillOpacity="0.98"
              >
                <animate
                  attributeName="d"
                  dur="15s"
                  repeatCount="indefinite"
                  values="
                    M0 0H1440V47C1275 25 1120 28 958 48C785 69 660 110 480 116C295 122 150 91 0 57Z;
                    M0 0H1440V53C1270 20 1115 34 955 53C780 74 655 102 475 121C295 128 150 97 0 63Z;
                    M0 0H1440V43C1280 30 1110 21 960 44C790 65 665 117 485 111C300 118 145 84 0 53Z;
                    M0 0H1440V47C1275 25 1120 28 958 48C785 69 660 110 480 116C295 122 150 91 0 57Z
                  "
                  calcMode="spline"
                  keyTimes="0;0.33;0.66;1"
                  keySplines="
                    0.42 0 0.58 1;
                    0.42 0 0.58 1;
                    0.42 0 0.58 1
                  "
                />
              </path>
            </g>
          </svg>
        </div>
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
          top-[100px]
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
          z-10
          mt-6
          pt-[105px]
          sm:mt-7
          sm:pt-[120px]
          lg:mt-8
          lg:pt-[145px]
          xl:pt-[155px]
        "
      >
        <div
          className="
            grid
            grid-cols-2
            gap-x-6
            gap-y-10
            pb-10
            sm:gap-x-8
            sm:gap-y-12
            sm:pb-12
            lg:grid-cols-[1.45fr_repeat(5,minmax(0,1fr))]
            lg:gap-x-8
            lg:gap-y-0
            lg:pb-16
            xl:gap-x-10
          "
        >
          {/* ==============================================================
              BRAND
          ============================================================== */}

          <div
            className="
              col-span-2
              max-w-md
              lg:col-span-1
              lg:pr-6
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
                text-white
                sm:mt-6
                sm:text-[24px]
              "
            >
              Your Daily Dose of Vitamin L
            </p>

            <p
              className="
                mt-3
                max-w-sm
                font-[var(--font-playpen)]
                text-[13px]
                font-medium
                leading-6
                text-white/60
                sm:text-sm
              "
            >
              We curate playful products that help children explore, create and grow.
            </p>

            <div
              className="
                mt-6
                space-y-3
                font-[var(--font-playpen)]
                text-[13px]
                font-medium
                text-white/65
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
              NAVIGATION
          ============================================================== */}

          <FooterColumn title="Shop">
            {shopLinks.map((item) => (
              <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {companyLinks.map((item) => (
              <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Customer Care">
            {customerCareLinks.map((item) => (
              <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Your Account">
            {accountLinks.map((item) => (
              <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Legal">
            {legalLinks.map((item) => (
              <FooterLink key={`${item.href}-${item.label}`} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        {/* ================================================================
            COPYRIGHT / LEGAL
        ================================================================ */}

        <div className="border-t border-white/10 py-5 sm:py-6">
          <div
            className="
              flex
              flex-col
              gap-3
              font-[var(--font-playpen)]
              text-[11px]
              font-medium
              leading-5
              text-white/45
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
            text-white/35
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
              text-white/45
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

      {/* ================================================================
          WAVE MOVEMENT
      ================================================================ */}
    </footer>
  );
}

/* ================================================================
   FOOTER COLUMN
   ================================================================ */

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="
        min-w-0
        mt-28
      "
    >
      <h2
        className="
    font-[var(--font-playpen-sans)]
    text-[17px]
    font-semibold
    leading-[1.35]
    tracking-[0.02em]
    text-white
    sm:text-[18px]
    lg:text-[20px]
  "
      >
        {title}
      </h2>

      <div
        className="
          mt-3
          space-y-2
          sm:mt-4
          sm:space-y-2.5
        "
      >
        {children}
      </div>
    </div>
  );
}

/* ================================================================
   FOOTER LINK
   ================================================================ */

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        w-fit
        max-w-full
        items-center
        gap-1
        font-[var(--font-playpen)]
        text-[12px]
        leading-5
        text-white/60
        transition-colors
        hover:text-white
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#E72D5A]
        sm:text-[13px]
        lg:text-[13.5px]
      "
    >
      <span>{children}</span>

      <ArrowUpRight
        className="
          size-3
          shrink-0
          -translate-y-0.5
          translate-x-[-2px]
          opacity-0
          transition-all
          duration-200
          group-hover:translate-x-0
          group-hover:opacity-70
          sm:size-3.5
        "
        strokeWidth={1.8}
      />
    </Link>
  );
}
