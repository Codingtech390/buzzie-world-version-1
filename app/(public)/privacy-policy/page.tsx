import type { Metadata } from "next";

import PolicyPage from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | BuzzieWorld",
  description:
    "Learn how BuzzieWorld collects, uses, stores and protects personal information when you browse, create an account, place orders or contact us.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Your privacy"
      title="Privacy Policy"
      description="We believe customers should understand what information is collected, why it is used and how it is handled when they use BuzzieWorld."
      lastUpdated="27 August 2026"
      sections={[
        {
          title: "About this policy",
          content: (
            <>
              <p>
                This Privacy Policy explains how BuzzieWorld may collect, use, store and otherwise
                process personal information when you visit our website, create an account, purchase
                products, contact us or otherwise interact with our services.
              </p>

              <p>
                We aim to handle personal data responsibly and transparently and to process
                information only for legitimate and relevant purposes.
              </p>
            </>
          ),
        },
        {
          title: "Information we may collect",
          items: [
            "Name and contact information such as email address and phone number.",
            "Account information, including login-related information where an account is created.",
            "Shipping and billing information needed to fulfil an order.",
            "Order, transaction and customer-support information.",
            "Information you voluntarily provide through forms, messages or other communications.",
            "Technical information such as browser, device, approximate location, IP address and website interaction data where collected by our technology or service providers.",
            "Cookie and similar technology information where applicable.",
          ],
        },
        {
          title: "How we use personal information",
          items: [
            "To create and manage customer accounts.",
            "To process and fulfil orders.",
            "To communicate about purchases, deliveries, returns, refunds and support requests.",
            "To provide customer service.",
            "To maintain, secure and improve the website and our services.",
            "To detect, prevent and investigate fraud, abuse, security incidents and other unlawful activity.",
            "To comply with applicable legal and regulatory obligations.",
            "To send promotional communications where permitted and where the required consent or other lawful basis applies.",
          ],
        },
        {
          title: "Payments",
          content: (
            <p>
              Payments may be processed by third-party payment providers. We may receive
              transaction-related information necessary to confirm and manage your order, but
              payment providers may independently process payment credentials under their own
              privacy policies and terms.
            </p>
          ),
        },
        {
          title: "Cookies and similar technologies",
          content: (
            <>
              <p>
                BuzzieWorld and its service providers may use cookies or similar technologies for
                functionality, security, preferences, analytics and other website operations.
              </p>

              <p>
                Where consent is required for a particular category of processing, we will seek
                consent in accordance with applicable requirements.
              </p>
            </>
          ),
        },
        {
          title: "Sharing of information",
          content: (
            <>
              <p>
                We may share information with service providers who help us operate BuzzieWorld,
                such as hosting providers, payment processors, shipping and logistics partners,
                customer-support providers, analytics providers and technology providers.
              </p>

              <p>
                We may also disclose information where required by applicable law, legal process,
                governmental authority or to protect our rights, customers, systems or property.
              </p>
            </>
          ),
        },
        {
          title: "Data security",
          content: (
            <p>
              We use reasonable technical and organisational measures designed to protect personal
              information against unauthorised access, misuse, alteration, disclosure or
              destruction. However, no internet-based system can be guaranteed to be completely
              secure.
            </p>
          ),
        },
        {
          title: "Data retention",
          content: (
            <p>
              We retain personal information for as long as reasonably necessary for the purposes
              for which it was collected, including fulfilling transactions, maintaining records,
              resolving disputes, preventing fraud and meeting applicable legal or regulatory
              requirements.
            </p>
          ),
        },
        {
          title: "Your privacy rights",
          content: (
            <>
              <p>
                Depending on applicable law and the circumstances of the processing, you may have
                rights relating to your personal information, including rights to access
                information, request correction, withdraw consent where consent is the basis for
                processing, and raise a grievance.
              </p>

              <p>
                The Digital Personal Data Protection Act, 2023 provides a framework concerning
                processing of digital personal data and includes requirements relating to notice,
                consent and individual rights. Applicable provisions and their enforcement will be
                handled in accordance with the law and applicable commencement rules.
              </p>
            </>
          ),
        },
        {
          title: "Children's privacy",
          content: (
            <p>
              BuzzieWorld may offer products intended for children, but our online services are not
              intended to encourage children to independently provide personal information. Where
              applicable, personal information relating to children will be handled in accordance
              with applicable law and required consent or authorisation requirements.
            </p>
          ),
        },
        {
          title: "Third-party websites",
          content: (
            <p>
              Our website may contain links to third-party websites or services. Their privacy
              practices are governed by their own policies, and we encourage you to review them
              before providing personal information.
            </p>
          ),
        },
        {
          title: "Changes to this policy",
          content: (
            <p>
              We may update this Privacy Policy when our practices, technologies, services or legal
              obligations change. The latest version will be published on this page with the
              applicable update date.
            </p>
          ),
        },
        {
          title: "Privacy questions and grievances",
          content: (
            <>
              <p>
                If you have a privacy question, request or grievance, please contact us through our{" "}
                <a href="/contact" className="font-semibold text-[#6F32F5] hover:text-[#E72D5A]">
                  Contact Us
                </a>{" "}
                page.
              </p>

              <p>
                Before launch, ensure the website displays the legally required
                grievance/data-protection contact details applicable to your business.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
