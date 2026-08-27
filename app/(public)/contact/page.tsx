import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Mail, MessageCircle, ShieldCheck } from "lucide-react";

import Reveal from "@/components/home/Reveal";

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#15121C]">
      {/* =========================================================
          CONTACT HERO BANNER
         ========================================================= */}
      <section className="px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8 lg:pt-10">
        <Reveal>
          <div className="mx-auto w-full max-w-[1380px] overflow-hidden rounded-[28px] border border-[#EEE9E4] bg-[#FFF9F5] sm:rounded-[34px] lg:rounded-[42px]">
            <div className="relative w-full">
              <Image
                src="/images/banners/contact-banner.png"
                alt="We'd love to hear from you"
                width={1920}
                height={1080}
                priority
                sizes="100vw"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================
          CONTACT INTRO
         ========================================================= */}
      <section className="px-4 py-12 sm:px-6 sm:py-18 lg:px-8 lg:py-22">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="h-[2px] w-8 rounded-full bg-[#E72D5A]" />

              <span className="font-[var(--font-poppins)] text-[9px] font-black uppercase tracking-[0.18em] text-[#E72D5A] sm:text-[10px]">
                Let&apos;s connect
              </span>

              <span className="size-1.5 rounded-full bg-[#F59A23]" />
            </div>

            <h1 className="mx-auto mt-5 max-w-[700px] font-[var(--font-roboto)] text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em] text-[#111111]">
              Have something
              <br />
              <span className="text-[#E72D5A]">to tell us?</span>
            </h1>

            <p className="mx-auto mt-7 max-w-[600px] font-[var(--font-poppins)] text-[13px] leading-7 text-[#687489] sm:text-[14px] sm:leading-8">
              Whether you have a question about an order, need help choosing something, or simply
              want to say hello, we&apos;d love to hear from you.
            </p>
          </div>
        </Reveal>
      </section>

      {/* =========================================================
    CONTACT OPTIONS
   ========================================================= */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <Reveal>
          <div className="mx-auto grid w-full max-w-[1180px] gap-5 md:grid-cols-3 lg:gap-6">
            <ContactCard
              icon={<Mail />}
              eyebrow="Email us"
              title="Drop us a message"
              description="Send us your question and our team will get back to you."
              action="hello@buzzieworld.com"
              href="mailto:hello@buzzieworld.com"
              iconClass="bg-[#FFF0F4] text-[#E72D5A]"
            />

            <ContactCard
              icon={<MessageCircle />}
              eyebrow="Need help?"
              title="We're here for you"
              description="Tell us what you need help with and we'll point you in the right direction."
              action="Contact support"
              href="#contact-form"
              iconClass="bg-[#F3EAFF] text-[#6F32F5]"
            />

            <ContactCard
              icon={<Clock3 />}
              eyebrow="Response time"
              title="We'll get back soon"
              description="Our team will do their best to respond to your message as quickly as possible."
              action="Send a message"
              href="#contact-form"
              iconClass="bg-[#FFF3DF] text-[#F59A23]"
            />
          </div>
        </Reveal>
      </section>

      {/* =========================================================
          CONTACT FORM
         ========================================================= */}
      <section
        id="contact-form"
        className="scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-22 lg:px-8 lg:pb-28"
      >
        <Reveal>
          <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[30px] border border-[#ECE9E7] bg-[#FFFBF8] sm:rounded-[38px]">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
              {/* =====================================================
                  FORM INTRO
                 ===================================================== */}
              <div className="relative overflow-hidden bg-[#15121C] px-7 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-[#E72D5A]/15 blur-3xl"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-[#6F32F5]/15 blur-3xl"
                />

                <div className="relative">
                  <div className="mb-5 flex items-center gap-2">
                    <span className="h-[2px] w-8 rounded-full bg-[#E72D5A]" />

                    <span className="font-[var(--font-poppins)] text-[9px] font-black uppercase tracking-[0.18em] text-[#F5B5C5] sm:text-[10px]">
                      Send a message
                    </span>

                    <span className="size-1.5 rounded-full bg-[#F59A23]" />
                  </div>

                  <h2 className="max-w-[470px] font-[var(--font-roboto)] text-[clamp(2.5rem,5vw,4.3rem)] font-black leading-[0.92] tracking-[-0.06em] text-white">
                    Let&apos;s start a
                    <br />
                    <span className="text-[#E72D5A]">conversation.</span>
                  </h2>

                  <p className="mt-7 max-w-[430px] font-[var(--font-poppins)] text-[13px] leading-7 text-white/65 sm:text-[14px] sm:leading-8">
                    Fill in the details and tell us what&apos;s on your mind. We&apos;ll take it
                    from there.
                  </p>

                  <div className="mt-9 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/8 text-[#F5B5C5]">
                      <ShieldCheck className="size-5" strokeWidth={1.7} />
                    </div>

                    <p className="max-w-[280px] font-[var(--font-poppins)] text-[10px] leading-5 text-white/55 sm:text-[11px]">
                      Your information stays private and is only used to respond to your message.
                    </p>
                  </div>
                </div>
              </div>

              {/* =====================================================
                  FORM
                 ===================================================== */}
              <div className="bg-white px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                <form className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="name"
                      label="Your name"
                      placeholder="Enter your name"
                      type="text"
                    />

                    <FormField
                      id="email"
                      label="Email address"
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>

                  <FormField
                    id="subject"
                    label="Subject"
                    placeholder="What can we help you with?"
                    type="text"
                  />

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block font-[var(--font-poppins)] text-[10px] font-bold text-[#343847] sm:text-[11px]"
                    >
                      Your message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell us a little more..."
                      className="
                        w-full
                        resize-none
                        rounded-[16px]
                        border
                        border-[#E8E4E1]
                        bg-[#FFFCFA]
                        px-4
                        py-3.5
                        font-[var(--font-poppins)]
                        text-[12px]
                        leading-6
                        text-[#15121C]
                        outline-none
                        transition-all
                        duration-200
                        placeholder:text-[#A1A0A5]
                        focus:border-[#C391EE]
                        focus:ring-4
                        focus:ring-[#C391EE]/10
                      "
                    />
                  </div>

                  <button
                    type="submit"
                    className="
                      group
                      inline-flex
                      min-h-[50px]
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-full
                      bg-[#C391EE]
                      px-7
                      font-[var(--font-poppins)]
                      text-[11px]
                      font-black
                      uppercase
                      tracking-[0.08em]
                      !text-white
                      shadow-[0_12px_30px_rgba(195,145,238,0.22)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#A96FDB]
                      hover:shadow-[0_16px_35px_rgba(169,111,219,0.28)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#C391EE]
                      focus-visible:ring-offset-4
                    "
                  >
                    Send Message
                    <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={2.5}
                      />
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================
          FINAL CONTACT STRIP
         ========================================================= */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <Reveal>
          <div className="mx-auto max-w-[900px] text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="h-[2px] w-10 rounded-full bg-[#C391EE]" />
              <span className="h-[2px] w-3 rounded-full bg-[#E72D5A]" />
              <span className="h-[2px] w-2 rounded-full bg-[#F5B5C5]" />
            </div>

            <p className="mt-6 font-[var(--font-poppins)] text-[12px] leading-6 text-[#687489]">
              We&apos;re only a message away.
            </p>

            <Link
              href="/shop"
              className="
                group
                mt-5
                inline-flex
                items-center
                gap-2
                font-[var(--font-poppins)]
                text-[11px]
                font-black
                uppercase
                tracking-[0.08em]
                text-[#6F32F5]
                transition-colors
                hover:text-[#E72D5A]
              "
            >
              Continue exploring
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

/* ================================================================
   CONTACT CARD
   ================================================================ */

function ContactCard({
  icon,
  eyebrow,
  title,
  description,
  action,
  href,
  iconClass,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  href: string;
  iconClass: string;
}) {
  return (
    <div
      className="
        group
        flex
        min-h-[285px]
        flex-col
        rounded-[24px]
        border
        border-[#ECE9E7]
        bg-white
        p-6
        shadow-[0_10px_35px_rgba(21,18,28,0.04)]
        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(21,18,28,0.08)]

        sm:min-h-[295px]
        sm:p-7

        lg:rounded-[26px]
        lg:p-8
      "
    >
      {/* =========================================================
          ICON
         ========================================================= */}
      <div
        className={`
          mb-5
          flex
          size-12
          shrink-0
          items-center
          justify-center
          rounded-full
          ${iconClass}
        `}
      >
        {icon}
      </div>

      {/* =========================================================
          EYEBROW
         ========================================================= */}
      <p
        className="
          mt-8
          font-[var(--font-poppins)]
          text-[8px]
          font-black
          uppercase
          tracking-[0.17em]
          text-[#E72D5A]

          sm:mt-7
          sm:text-[9px]


          xl:mb-8
          xl:text-[12px]

        "
      >
        {eyebrow}
      </p>

      {/* =========================================================
          HEADING
         ========================================================= */}
      <h2
        className="
          mt-2
          max-w-[270px]
          font-[var(--font-roboto)]
          text-[22px]
          font-black
          leading-[1.02]
          tracking-[-0.035em]
          text-[#111111]

          sm:text-[23px]
          lg:text-[24px]
        "
      >
        {title}
      </h2>

      {/* =========================================================
          DESCRIPTION
         ========================================================= */}
      <p
        className="
          mt-3
          max-w-[300px]
          font-[var(--font-poppins)]
          text-[11px]
          leading-[1.75]
          text-[#687489]

          sm:mt-3.5
          sm:text-[12px]
          sm:leading-6
        "
      >
        {description}
      </p>

      {/* =========================================================
          ACTION
         ========================================================= */}
      <Link
        href={href}
        className="
          group/link
          mt-auto
          pt-6
          inline-flex
          w-fit
          items-center
          gap-2
          font-[var(--font-poppins)]
          text-[10px]
          font-black
          uppercase
          tracking-[0.07em]
          text-[#6F32F5]
          transition-colors
          duration-200
          hover:text-[#E72D5A]
        "
      >
        {action}

        <ArrowRight
          className="
            size-3.5
            transition-transform
            duration-300
            group-hover/link:translate-x-1
          "
          strokeWidth={2.5}
        />
      </Link>
    </div>
  );
}

/* ================================================================
   FORM FIELD
   ================================================================ */

function FormField({
  id,
  label,
  placeholder,
  type,
}: {
  id: string;
  label: string;
  placeholder: string;
  type: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-[var(--font-poppins)] text-[10px] font-bold text-[#343847] sm:text-[11px]"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className="
          h-[48px]
          w-full
          rounded-[16px]
          border
          border-[#E8E4E1]
          bg-[#FFFCFA]
          px-4
          font-[var(--font-poppins)]
          text-[12px]
          text-[#15121C]
          outline-none
          transition-all
          duration-200
          placeholder:text-[#A1A0A5]
          focus:border-[#C391EE]
          focus:ring-4
          focus:ring-[#C391EE]/10
        "
      />
    </div>
  );
}
