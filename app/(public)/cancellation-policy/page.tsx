import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Cancellation Policy | BuzzieWorld",
  description:
    "Learn how BuzzieWorld order cancellations work, when an order can be cancelled and how refunds are handled after cancellation.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function CancellationPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Customer care"
      title="Cancellation Policy"
      description="Understand when a BuzzieWorld order can be cancelled and what happens to your payment when an order is cancelled."
      lastUpdated="27 August 2026"
      sections={[
        {
          title: "Cancelling an order",
          content: (
            <p>
              Customers may request cancellation of an order through the available account or
              support channels. Whether cancellation is possible depends on the order&apos;s
              processing and dispatch status.
            </p>
          ),
        },
        {
          title: "Before dispatch",
          content: (
            <p>
              Where an order has not yet entered a stage that prevents cancellation, we will make
              reasonable efforts to process a valid cancellation request.
            </p>
          ),
        },
        {
          title: "After dispatch",
          content: (
            <p>
              Once an order has been dispatched, cancellation may no longer be possible through the
              normal cancellation process. In such cases, the customer may need to follow the
              applicable return or delivery process.
            </p>
          ),
        },
        {
          title: "How to request cancellation",
          content: (
            <>
              <p>
                If you need to cancel an order, contact us as soon as possible through the{" "}
                <a href="/contact" className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]">
                  Contact Us
                </a>{" "}
                page with your order number and registered contact details.
              </p>

              <p>
                Cancellation requests are subject to verification so that we can protect customers
                and prevent unauthorised changes to orders.
              </p>
            </>
          ),
        },
        {
          title: "Refund after cancellation",
          content: (
            <p>
              If a cancellation is successfully processed for an order that has already been paid
              for, the applicable refund will be initiated according to our payment and refund
              procedures. The time taken for the amount to appear may depend on the payment provider
              or bank.
            </p>
          ),
        },
        {
          title: "Promotional and special orders",
          content: (
            <p>
              Promotional offers, customised products or other special orders may have additional
              cancellation conditions where those conditions are clearly communicated before
              purchase.
            </p>
          ),
        },
        {
          title: "Consumer rights",
          content: (
            <p>
              Nothing in this policy is intended to exclude or restrict any cancellation, refund or
              other consumer right that cannot legally be excluded or restricted.
            </p>
          ),
        },
      ]}
    />
  );
}
