import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service | BuzzieWorld",
  description:
    "Read the BuzzieWorld Terms of Service covering website use, accounts, orders, payments, products, cancellations, returns, refunds and other terms.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms explain the rules that apply when you use the BuzzieWorld website, create an account, purchase products or interact with our services."
      lastUpdated="27 August 2026"
      sections={[
        {
          title: "Acceptance of these terms",
          content: (
            <>
              <p>
                Welcome to BuzzieWorld. By accessing or using our website, creating an account,
                placing an order or using any service provided through the website, you agree to
                these Terms of Service.
              </p>

              <p>
                If you do not agree with these terms, please do not use the website or place an
                order through it.
              </p>
            </>
          ),
        },
        {
          title: "About BuzzieWorld",
          content: (
            <>
              <p>
                BuzzieWorld is an online retail platform offering products intended for children,
                families and other customers. Product availability, pricing, specifications and
                other information may change from time to time.
              </p>

              <p>
                The business details displayed on the website, including contact information and
                applicable policies, form part of the information available to customers before and
                after purchase.
              </p>
            </>
          ),
        },
        {
          title: "Using our website",
          items: [
            "Use the website only for lawful purposes.",
            "Do not attempt to interfere with the security, functionality or availability of the website.",
            "Do not use automated methods to scrape, copy or systematically collect website content without permission.",
            "Do not submit false, misleading or fraudulent information.",
            "Do not attempt to gain unauthorised access to accounts, systems or data.",
          ],
        },
        {
          title: "Accounts and account information",
          content: (
            <>
              <p>
                Some BuzzieWorld features may require you to create an account. You are responsible
                for providing accurate information and keeping your account credentials secure.
              </p>

              <p>
                If you believe that your account has been accessed without permission, please
                contact us promptly.
              </p>
            </>
          ),
        },
        {
          title: "Products and product information",
          content: (
            <>
              <p>
                We make reasonable efforts to present product descriptions, images, prices,
                availability and other product information accurately.
              </p>

              <p>
                Product images may vary slightly from the physical product due to photography,
                display settings, manufacturing variations or packaging changes.
              </p>

              <p>
                We reserve the right to correct genuine errors in product information, pricing or
                availability.
              </p>
            </>
          ),
        },
        {
          title: "Prices, payments and taxes",
          content: (
            <>
              <p>
                Product prices and applicable charges are displayed on the website at the time of
                purchase. Applicable taxes, delivery charges and other costs, where applicable, will
                be communicated during the purchase process.
              </p>

              <p>
                Payments may be processed through third-party payment providers. Your use of a
                payment provider may also be subject to that provider&apos;s own terms and policies.
              </p>
            </>
          ),
        },
        {
          title: "Orders and order acceptance",
          content: (
            <>
              <p>
                Placing an order constitutes a request to purchase the selected products. An order
                may be subject to availability, payment verification, pricing verification and other
                checks.
              </p>

              <p>
                We may cancel or decline an order where there is a genuine issue involving
                availability, pricing, payment, suspected fraud, technical error or another
                legitimate reason. Where payment has already been received for an order that we
                cancel, the applicable refund will be processed according to our refund policy.
              </p>
            </>
          ),
        },
        {
          title: "Shipping, returns and refunds",
          content: (
            <>
              <p>
                Shipping and delivery terms are described in our{" "}
                <a
                  href="/shipping-policy"
                  className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]"
                >
                  Shipping &amp; Delivery Policy
                </a>
                .
              </p>

              <p>
                Return and refund eligibility is described in our{" "}
                <a
                  href="/returns-refunds"
                  className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]"
                >
                  Returns &amp; Refunds Policy
                </a>
                .
              </p>

              <p>
                Order cancellation is governed by our{" "}
                <a
                  href="/cancellation-policy"
                  className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]"
                >
                  Cancellation Policy
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: "Intellectual property",
          content: (
            <>
              <p>
                Unless otherwise stated, the BuzzieWorld website and its original content, branding,
                graphics, text, designs, images, logos and other materials are owned by or licensed
                to BuzzieWorld.
              </p>

              <p>
                You may not reproduce, modify, distribute, publicly display or commercially exploit
                our protected content without appropriate permission.
              </p>
            </>
          ),
        },
        {
          title: "Third-party services and links",
          content: (
            <>
              <p>
                Our website may use or link to third-party services, including payment, analytics,
                hosting, authentication or social-media services.
              </p>

              <p>
                Third-party services are governed by their own terms and policies. BuzzieWorld is
                not responsible for independent third-party websites or services.
              </p>
            </>
          ),
        },
        {
          title: "Limitation of liability",
          content: (
            <>
              <p>
                To the extent permitted by applicable law, BuzzieWorld will not be responsible for
                indirect, incidental or consequential losses arising from your use of the website or
                services.
              </p>

              <p>
                Nothing in these terms is intended to exclude or limit any consumer right or
                liability that cannot lawfully be excluded or limited.
              </p>
            </>
          ),
        },
        {
          title: "Changes to these terms",
          content: (
            <p>
              We may update these Terms of Service when our services, operations, technology or
              applicable legal requirements change. Updated terms will be published on this page
              with a revised update date.
            </p>
          ),
        },
        {
          title: "Governing law and jurisdiction",
          content: (
            <p>
              These terms are intended to be governed by the laws applicable to the operation of
              BuzzieWorld in India, subject to applicable consumer-protection rights and other
              mandatory legal requirements.
            </p>
          ),
        },
        {
          title: "Contact",
          content: (
            <>
              <p>
                If you have questions about these Terms of Service, please contact the BuzzieWorld
                team through our{" "}
                <a href="/contact" className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]">
                  Contact Us
                </a>{" "}
                page.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

