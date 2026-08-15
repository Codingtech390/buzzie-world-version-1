import { ArrowUpRight,Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import Link from "next/link";

import { accountNavigation, mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const shopLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/shop" },
  { label: "Search", href: "/search" },
] as const;

const supportLinks = [
  { label: "Contact", href: "/contact" },
  { label: "My Account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
] as const;

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

function SocialIcon({ type }: { type: "instagram" | "facebook" | "youtube" }) {
  if (type === "instagram") {
    return <FaInstagram className="size-4" strokeWidth={1.9} />;
  }

  if (type === "facebook") {
    return <FaFacebook className="size-4" strokeWidth={1.9} />;
  }

  return <FaYoutube className="size-4" strokeWidth={1.9} />;
}

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

  const companyLinks = mainNavigation.filter(
    (item) => item.label === "About" || item.label === "Blog" || item.label === "Contact",
  );

  const accountLinks = accountNavigation.filter(
    (item) => item.label === "Overview" || item.label === "Orders" || item.label === "Wishlist",
  );

  return (
    <footer className="relative overflow-hidden border-t border-[#EEDDBB]/80 bg-[#27344A] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#3F7DFF]/18 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[-5rem] size-80 rounded-full bg-[#F8C83B]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 size-44 -translate-x-1/2 rounded-full border border-white/5"
      />

      <div className="container relative">
        <div className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))] lg:gap-8 lg:py-20">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79D45C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27344A]"
              aria-label="BuzzieWorld home"
            >
              <span
                aria-hidden="true"
                className="relative flex size-11 items-center justify-center overflow-hidden rounded-[16px] bg-[linear-gradient(145deg,#3F7DFF_0%,#79D45C_100%)] shadow-[0_12px_28px_rgba(63,125,255,0.22)]"
              >
                <span className="absolute -right-1 -top-1 size-5 rounded-full bg-[#F8C83B]" />
                <span className="absolute bottom-1 left-1 size-2 rounded-full bg-white/80" />
                <span className="size-5 rounded-full bg-white shadow-sm" />
              </span>

              <span className="font-[var(--font-roboto)] text-xl font-black tracking-[-0.05em]">
                BuzzieWorld
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              {siteConfig.description} We curate playful products that help children explore, create
              and grow.
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/70">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79D45C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27344A]"
              >
                <Mail className="size-4 shrink-0" strokeWidth={1.9} />
                <span>{siteConfig.email}</span>
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
              <div className="mt-7 flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79D45C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27344A]"
                  >
                    <SocialIcon type={social.type} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <FooterColumn title="Shop">
            {shopLinks.map((item) => (
              <FooterLink key={item.href + item.label} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {companyLinks.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Customer Care">
            {supportLinks.map((item) => (
              <FooterLink key={item.href + item.label} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Your Account">
            {accountLinks.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}

            <FooterLink href="/contact">Need help?</FooterLink>
          </FooterColumn>
        </div>

        <div className="border-t border-white/10 py-5 sm:py-6">
          <div className="flex flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {policyLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79D45C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27344A]"
                >
                  {item.label}
                </Link>
              ))}

              <span className="hidden text-white/20 sm:inline">•</span>

              <span>
                {siteConfig.currency} · {siteConfig.locale}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-8 pt-2 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between sm:pb-10">
          <p>Built for curious minds, creative hands and happy families.</p>

          <Link
            href="#main-content"
            className="inline-flex items-center gap-1.5 font-semibold text-white/45 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79D45C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27344A]"
          >
            Back to top
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-[var(--font-roboto)] text-sm font-bold tracking-[-0.01em] text-white">
        {title}
      </h2>

      <div className="mt-4 space-y-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center gap-1 text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79D45C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27344A]"
    >
      <span>{children}</span>

      <ArrowUpRight
        className="size-3.5 -translate-y-0.5 translate-x-[-2px] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-70"
        strokeWidth={1.8}
      />
    </Link>
  );
}
