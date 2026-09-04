import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | BuzzieWorld",
  description:
    "Learn about BuzzieWorld order processing, shipping, delivery timelines, tracking, delivery delays, incorrect addresses and shipment issues.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Customer care"
      title="Shipping & Delivery"
      description="Everything you need to know about how BuzzieWorld orders are processed, shipped and delivered."
      lastUpdated="27 August 2026"
      sections={[
        {
          title: "Order processing",
          content: (
            <p>
              Orders are processed after successful order placement and payment confirmation,
              subject to product availability and applicable verification checks. Processing times
              may vary during weekends, holidays, promotional periods or unusually high order
              volumes.
            </p>
          ),
        },
        {
          title: "Delivery locations",
          content: (
            <p>
              BuzzieWorld delivery availability depends on the serviceable locations supported by
              our logistics partners. Available delivery options and charges, where applicable, will
              be shown during checkout.
            </p>
          ),
        },
        {
          title: "Estimated delivery times",
          content: (
            <p>
              Estimated delivery timelines are displayed or communicated during the ordering process
              where available. Delivery estimates are indicative and may be affected by logistics
              conditions, weather, public holidays, remote locations, operational disruptions or
              other circumstances outside our reasonable control.
            </p>
          ),
        },
        {
          title: "Shipping charges",
          content: (
            <p>
              Applicable shipping charges, if any, will be displayed before you complete your
              purchase. Promotional offers may provide free or reduced shipping subject to their
              stated conditions.
            </p>
          ),
        },
        {
          title: "Order tracking",
          content: (
            <p>
              Where tracking is available, tracking information may be provided through the
              logistics partner or through your BuzzieWorld account. Tracking information may take
              some time to update after an order has been dispatched.
            </p>
          ),
        },
        {
          title: "Delivery delays",
          content: (
            <p>
              Delivery may occasionally be delayed because of weather, transport disruption,
              operational issues, public holidays, incorrect address information, high demand or
              other circumstances. We will make reasonable efforts to assist when a delivery issue
              is brought to our attention.
            </p>
          ),
        },
        {
          title: "Incorrect or incomplete address",
          content: (
            <p>
              Customers are responsible for providing accurate and complete delivery information. If
              an order cannot be delivered because of incorrect or incomplete address information,
              additional delivery attempts or charges may apply depending on the circumstances and
              logistics provider.
            </p>
          ),
        },
        {
          title: "Damaged or incorrect delivery",
          content: (
            <>
              <p>
                If you receive a damaged, defective or incorrect product, please contact us as soon
                as reasonably possible with your order details and relevant photographs or other
                information requested by our support team.
              </p>

              <p>
                Eligibility for replacement or refund is governed by our{" "}
                <a
                  href="/returns-refunds"
                  className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]"
                >
                  Returns &amp; Refunds Policy
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: "Delivery confirmation",
          content: (
            <p>
              Delivery may be confirmed through the logistics provider&apos;s delivery records,
              tracking system, OTP verification, signature or another applicable delivery mechanism.
            </p>
          ),
        },
        {
          title: "Contact us about an order",
          content: (
            <p>
              If your order has not arrived within the applicable estimated delivery period or you
              have another delivery concern, please contact our support team through the{" "}
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
