import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";

import Reveal from "@/components/home/Reveal";
import { siteConfig } from "@/config/site";

type PolicySection = {
  title: string;
  content?: React.ReactNode;
  items?: string[];
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
};

export default function PolicyPage({
  eyebrow,
  title,
  description,
  lastUpdated,
  sections,
}: PolicyPageProps) {
  return (
    <main id="main-content" className="min-h-screen overflow-hidden bg-white text-[#15121C]">
      {/* =========================================================
          HERO
         ========================================================= */}
      <section className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-16">
        <Reveal>
          <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[30px] bg-[#FFF8F5] sm:rounded-[36px] lg:rounded-[42px]">
            <div className="relative px-7 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              {/* Decorative shapes */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  size-64
                  rounded-full
                  bg-[#E72D5A]/8
                  blur-3xl
                "
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  -left-20
                  size-72
                  rounded-full
                  bg-[#C391EE]/10
                  blur-3xl
                "
              />

              <div className="relative z-10 max-w-[850px]">
                <div className="flex items-center gap-2">
                  <span className="h-[2px] w-8 rounded-full bg-[#E72D5A] sm:w-10" />

                  <span className="font-[var(--font-poppins)] text-[9px] font-black uppercase tracking-[0.18em] text-[#E72D5A] sm:text-[10px]">
                    {eyebrow}
                  </span>

                  <span className="size-1.5 rounded-full bg-[#F59A23]" />
                </div>

                <h1
                  className="
                    mt-6
                    max-w-[800px]
                    font-[var(--font-roboto)]
                    text-[clamp(2.7rem,6vw,5.4rem)]
                    font-black
                    leading-[0.9]
                    tracking-[-0.06em]
                    text-[#111111]
                  "
                >
                  {title}
                </h1>

                <p
                  className="
                    mt-7
                    max-w-[680px]
                    font-[var(--font-poppins)]
                    text-[13px]
                    leading-7
                    text-[#687489]
                    sm:text-[14px]
                    sm:leading-8
                  "
                >
                  {description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-[#6F32F5]" strokeWidth={1.8} />

                    <span className="font-[var(--font-poppins)] text-[10px] font-bold text-[#596276] sm:text-[11px]">
                      Last updated: {lastUpdated}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden h-1 w-1 rounded-full bg-[#C391EE] sm:block"
                  />

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-[#E72D5A]" strokeWidth={1.8} />

                    <span className="font-[var(--font-poppins)] text-[10px] font-bold text-[#596276] sm:text-[11px]">
                      BuzzieWorld
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================
          POLICY CONTENT
         ========================================================= */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-22 lg:px-8 lg:pb-28">
        <Reveal>
          <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
            {/* =====================================================
                CONTENT NAVIGATION
               ===================================================== */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-[22px] border border-[#ECE9E7] bg-[#FFFCFA] p-5">
                <p className="font-[var(--font-poppins)] text-[9px] font-black uppercase tracking-[0.17em] text-[#E72D5A]">
                  On this page
                </p>

                <nav className="mt-4 space-y-1.5">
                  {sections.map((section, index) => (
                    <a
                      key={section.title}
                      href={`#section-${index + 1}`}
                      className="
                        block
                        rounded-xl
                        px-3
                        py-2
                        font-[var(--font-poppins)]
                        text-[11px]
                        leading-5
                        text-[#687489]
                        transition-colors
                        hover:bg-white
                        hover:text-[#15121C]
                      "
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* =====================================================
                CONTENT
               ===================================================== */}
            <article className="min-w-0">
              <div className="space-y-10 sm:space-y-12">
                {sections.map((section, index) => (
                  <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-28">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F7EEFF] text-[#6F32F5]">
                        <span className="font-[var(--font-poppins)] text-[10px] font-black">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2
                          className="
                            font-[var(--font-roboto)]
                            text-[24px]
                            font-black
                            leading-[1.05]
                            tracking-[-0.035em]
                            text-[#111111]
                            sm:text-[28px]
                          "
                        >
                          {section.title}
                        </h2>

                        {section.content && (
                          <div
                            className="
                              mt-4
                              space-y-4
                              font-[var(--font-poppins)]
                              text-[12px]
                              leading-7
                              text-[#687489]
                              sm:text-[13px]
                              sm:leading-7
                            "
                          >
                            {section.content}
                          </div>
                        )}

                        {section.items && section.items.length > 0 && (
                          <ul className="mt-4 space-y-3">
                            {section.items.map((item) => (
                              <li
                                key={item}
                                className="
                                  flex
                                  items-start
                                  gap-3
                                  font-[var(--font-poppins)]
                                  text-[12px]
                                  leading-6
                                  text-[#687489]
                                  sm:text-[13px]
                                "
                              >
                                <CheckCircle2
                                  className="mt-1 size-4 shrink-0 text-[#E72D5A]"
                                  strokeWidth={1.8}
                                />

                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              {/* =====================================================
                  CONTACT / QUESTIONS
                 ===================================================== */}
              <div className="mt-14 rounded-[24px] bg-[#F7EEFF] p-6 sm:mt-16 sm:p-8">
                <p className="font-[var(--font-poppins)] text-[9px] font-black uppercase tracking-[0.17em] text-[#E72D5A]">
                  Questions?
                </p>

                <h2 className="mt-2 font-[var(--font-roboto)] text-[25px] font-black leading-tight tracking-[-0.035em] text-[#111111]">
                  We&apos;re here to help.
                </h2>

                <p className="mt-3 max-w-[620px] font-[var(--font-poppins)] text-[12px] leading-6 text-[#687489] sm:text-[13px]">
                  If you have questions about this policy or need help with your BuzzieWorld order,
                  please contact our team.
                </p>

                <Link
                  href="/contact"
                  className="
                    group
                    mt-6
                    inline-flex
                    min-h-[46px]
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#C391EE]
                    px-6
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.08em]
                    !text-white
                    shadow-[0_10px_25px_rgba(195,145,238,0.22)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#A96FDB]
                    hover:shadow-[0_14px_30px_rgba(169,111,219,0.28)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#C391EE]
                    focus-visible:ring-offset-4
                  "
                >
                  Contact Us
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </Link>
              </div>

              {/* =====================================================
                  RELATED POLICIES
                 ===================================================== */}
              <div className="mt-10 border-t border-[#ECE9E7] pt-8">
                <p className="font-[var(--font-poppins)] text-[9px] font-black uppercase tracking-[0.17em] text-[#E72D5A]">
                  BuzzieWorld policies
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                  <PolicyLink href="/privacy-policy">Privacy Policy</PolicyLink>

                  <PolicyLink href="/terms">Terms of Service</PolicyLink>

                  <PolicyLink href="/shipping-policy">Shipping &amp; Delivery</PolicyLink>

                  <PolicyLink href="/returns-refunds">Returns &amp; Refunds</PolicyLink>

                  <PolicyLink href="/cancellation-policy">Cancellation Policy</PolicyLink>

                  <PolicyLink href="/disclaimer">Disclaimer</PolicyLink>
                </div>
              </div>

              <p className="mt-8 font-[var(--font-poppins)] text-[10px] leading-5 text-[#98959E]">
                © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
              </p>
            </article>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

/* ================================================================
   POLICY LINK
   ================================================================ */

function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="
        group
        inline-flex
        items-center
        gap-1.5
        font-[var(--font-poppins)]
        text-[11px]
        font-bold
        text-[#596276]
        transition-colors
        hover:text-[#E72D5A]
      "
    >
      {children}

      <ArrowRight
        className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
        strokeWidth={2}
      />
    </Link>
  );
}
