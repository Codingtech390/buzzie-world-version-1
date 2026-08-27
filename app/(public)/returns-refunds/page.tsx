import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy | BuzzieWorld",
  description:
    "Read the BuzzieWorld Returns & Refunds Policy covering eligible returns, damaged products, wrong products, replacements and refund processing.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReturnsRefundsPage() {
  return (
    <PolicyPage
      eyebrow="Customer care"
      title="Returns & Refunds"
      description="Our return and refund guidelines explain what to do when a product is damaged, defective, incorrect or otherwise eligible for a return."
      lastUpdated="27 August 2026"
      sections={[
        {
          title: "Our approach to returns",
          content: (
            <p>
              We want customers to have a clear and fair process when something goes wrong with an
              order. Return and refund eligibility depends on the product, condition, reason for
              return and applicable consumer rights.
            </p>
          ),
        },
        {
          title: "When you may request a return",
          items: [
            "The product received is damaged or defective.",
            "The wrong product has been delivered.",
            "The product received materially differs from the product ordered, where applicable.",
            "Another return reason is specifically permitted by the product or promotional terms.",
            "A return is otherwise required under applicable consumer-protection law.",
          ],
        },
        {
          title: "Return condition",
          content: (
            <p>
              Where a return is permitted, products may need to be returned in the condition
              specified for that product, including applicable packaging, accessories, tags, manuals
              or other included components. Certain products may be subject to specific return
              conditions.
            </p>
          ),
        },
        {
          title: "Products that may have special conditions",
          content: (
            <p>
              Some products may have special return restrictions because of hygiene, safety,
              consumable, personalised, digital or other characteristics. Any applicable restriction
              should be disclosed on the relevant product page or during the purchase process.
            </p>
          ),
        },
        {
          title: "How to request a return",
          content: (
            <>
              <p>
                Contact BuzzieWorld through our{" "}
                <a href="/contact" className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]">
                  Contact Us
                </a>{" "}
                page and provide your order number, the product concerned and a description of the
                issue.
              </p>

              <p>
                We may request photographs, videos or other information where reasonably necessary
                to assess the issue.
              </p>
            </>
          ),
        },
        {
          title: "Replacement",
          content: (
            <p>
              Where appropriate and subject to availability, we may offer a replacement for an
              eligible damaged, defective or incorrect product. If a replacement is unavailable,
              another appropriate resolution may be offered in accordance with applicable policy and
              law.
            </p>
          ),
        },
        {
          title: "Refunds",
          content: (
            <p>
              Approved refunds will generally be processed through the applicable payment method or
              another permitted method. The time required for the refund to appear in the
              customer&apos;s account may depend on the payment provider or financial institution.
            </p>
          ),
        },
        {
          title: "Return shipping",
          content: (
            <p>
              Responsibility for return shipping may depend on the reason for the return and the
              applicable return terms. Where a product is returned because it is damaged, defective
              or incorrect, the applicable resolution will be determined based on the circumstances.
            </p>
          ),
        },
        {
          title: "Inspection and verification",
          content: (
            <p>
              Returned products may be inspected to verify the reported issue, product condition and
              eligibility. This does not limit any consumer rights that cannot legally be excluded.
            </p>
          ),
        },
        {
          title: "Refund timing",
          content: (
            <p>
              Refund timing may vary depending on the resolution, payment provider, bank and other
              processing requirements. We will communicate applicable refund information when your
              request is approved.
            </p>
          ),
        },
        {
          title: "Consumer rights",
          content: (
            <p>
              Nothing in this policy is intended to remove or restrict any mandatory consumer right
              available under applicable law.
            </p>
          ),
        },
      ]}
    />
  );
}
