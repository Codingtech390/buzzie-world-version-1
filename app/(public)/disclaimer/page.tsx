import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Disclaimer | BuzzieWorld",
  description:
    "Read the BuzzieWorld website disclaimer covering product information, images, availability, pricing, third-party services and website content.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
  return (
    <PolicyPage
      eyebrow="Important information"
      title="Disclaimer"
      description="This page explains some important limitations and considerations regarding information, products and services available through BuzzieWorld."
      lastUpdated="27 August 2026"
      sections={[
        {
          title: "General information",
          content: (
            <p>
              Information published on BuzzieWorld is provided for general informational and
              commercial purposes. We make reasonable efforts to keep website information accurate
              and current, but information may change as products, suppliers, prices, services and
              business operations change.
            </p>
          ),
        },
        {
          title: "Product images and appearance",
          content: (
            <p>
              Product photographs and other visual materials are intended to represent products as
              accurately as reasonably possible. Actual colours, packaging, dimensions and
              appearance may vary because of manufacturing changes, photography, lighting and
              individual device displays.
            </p>
          ),
        },
        {
          title: "Product suitability",
          content: (
            <p>
              Product descriptions and age recommendations are provided to help customers make
              informed purchasing decisions. Customers should review the product-specific
              information, warnings, instructions and recommended age range before purchase and use.
            </p>
          ),
        },
        {
          title: "Availability and pricing",
          content: (
            <p>
              Product availability and pricing may change without prior notice. We may correct
              genuine technical, typographical or pricing errors where appropriate and subject to
              applicable law.
            </p>
          ),
        },
        {
          title: "Third-party services",
          content: (
            <p>
              BuzzieWorld may rely on third-party providers for payments, delivery, hosting,
              analytics, authentication and other technology services. Third-party services may have
              their own terms, policies and limitations.
            </p>
          ),
        },
        {
          title: "External links",
          content: (
            <p>
              Links to external websites are provided for convenience. We do not control independent
              third-party websites and are not responsible for their content, availability or
              privacy practices.
            </p>
          ),
        },
        {
          title: "Website availability",
          content: (
            <p>
              We aim to keep BuzzieWorld available and functional, but temporary interruptions may
              occur because of maintenance, technical problems, network issues, security incidents
              or other circumstances.
            </p>
          ),
        },
        {
          title: "No exclusion of mandatory rights",
          content: (
            <p>
              Nothing on this page or elsewhere on the website is intended to exclude, restrict or
              override any consumer right, warranty, liability or other protection that cannot
              legally be excluded or restricted.
            </p>
          ),
        },
        {
          title: "Questions",
          content: (
            <p>
              If you have a question about information on the website or a product you are
              considering, please contact the BuzzieWorld team through our{" "}
              <a href="/contact" className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]">
                Contact Us
              </a>{" "}
              page.
            </p>
          ),
        },
      ]}
    />
  );
}
