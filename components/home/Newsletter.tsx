"use client";

import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import Reveal from "./Reveal";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = email.trim();

    if (!value) {
      setError("Please enter your email address.");
      setValidated(false);
      return;
    }

    if (!isValidEmail(value)) {
      setError("Please enter a valid email address.");
      setValidated(false);
      return;
    }

    setError(null);
    setValidated(true);

    toast.info(
      "Your email is valid. Newsletter signup will activate once the backend endpoint is connected.",
    );
  }

  return (
    <section className="section relative overflow-hidden bg-[#FFFDF9]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9rem] top-8 size-80 rounded-full bg-[#F8C83B]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-9rem] bottom-0 size-96 rounded-full bg-[#3F7DFF]/8 blur-3xl"
      />

      <div className="container relative">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-[#EEDDBB]/75 bg-white px-6 py-10 shadow-[0_24px_65px_rgba(39,52,74,0.075)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div
              aria-hidden="true"
              className="absolute right-8 top-8 flex size-14 rotate-6 items-center justify-center rounded-[18px] bg-[#F8C83B]/18 text-[#A67A00]"
            >
              <Sparkles className="size-6" />
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#3F7DFF]">
                  <Mail className="size-3.5" />
                  Stay in the loop
                </div>

                <h2 className="mt-4 font-[var(--font-roboto)] text-[clamp(2rem,4vw,3.2rem)] font-black leading-[1] tracking-[-0.045em] text-[#27344A]">
                  A little wonder, delivered.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#687489] sm:text-base">
                  Keep up with new products, playful discoveries and the next chapter of
                  BuzzieWorld.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 flex flex-col gap-2 sm:max-w-xl sm:flex-row"
                  noValidate
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>

                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (error) {
                        setError(null);
                      }

                      if (validated) {
                        setValidated(false);
                      }
                    }}
                    placeholder="Your email address"
                    autoComplete="email"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "newsletter-error" : "newsletter-note"}
                    className="min-h-12 min-w-0 flex-1 rounded-full border border-[#EEDDBB] bg-[#FFFDF9] px-5 text-sm text-[#27344A] outline-none transition-all placeholder:text-[#99A1AF] focus:border-[#3F7DFF] focus:ring-4 focus:ring-[#3F7DFF]/10"
                  />

                  <button
                    type="submit"
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#3F7DFF] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(63,125,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#326DE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                  >
                    Join the adventure
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>

                {error ? (
                  <p
                    id="newsletter-error"
                    className="mt-2 text-xs font-medium text-[#C44770]"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : (
                  <p id="newsletter-note" className="mt-2 text-xs text-[#687489]">
                    No spam. Just the occasional bit of BuzzieWorld magic.
                  </p>
                )}

                {validated ? (
                  <p className="mt-3 text-xs font-semibold text-[#4D9A38]" role="status">
                    Email validated. The newsletter service will activate once its backend endpoint
                    is connected.
                  </p>
                ) : null}
              </div>

              <div
                aria-hidden="true"
                className="hidden size-40 items-center justify-center rounded-[38%_62%_42%_58%] bg-[linear-gradient(145deg,#FFF8EC,#F1F5FF)] shadow-inner lg:flex"
              >
                <div className="relative flex size-24 items-center justify-center rounded-[30px] bg-white shadow-[0_18px_40px_rgba(39,52,74,0.08)]">
                  <Mail className="size-9 text-[#3F7DFF]" strokeWidth={1.6} />

                  <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-[#F8C83B] text-[#5B4300] shadow-sm">
                    <Sparkles className="size-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
