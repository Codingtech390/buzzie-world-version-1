"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const FORGOT_PASSWORD_ENDPOINT = "/api/auth/forgot-password";

const pageEase = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: pageEase,
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: pageEase,
    },
  },
};

const artworkVariants = {
  hidden: {
    opacity: 0,
    scale: 1.025,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: pageEase,
    },
  },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Backend-ready password recovery request.
       *
       * Expected payload:
       *
       * {
       *   email: string
       * }
       *
       * The backend should send the password-reset email
       * and return a successful response without revealing
       * whether the email exists in the database.
       */

      const response = await fetch(FORGOT_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "We couldn't process your request. Please try again.",
        );
      }

      setIsSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleTryAgain() {
    setIsSubmitted(false);
    setError("");
  }

  return (
    <main className="w-full overflow-x-hidden bg-[#fffaf0]">
      <div className="grid min-h-[calc(100svh-4.7rem)] w-full lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2">
        {/* ================================================================
            LEFT ADVENTURE PANEL
        ================================================================ */}

        <motion.section
          aria-label="BuzzieWorld adventure"
          className="relative min-h-[400px] overflow-hidden bg-[#061b48] bg-[url('/images/login/login-left-background.jpg')] bg-cover bg-center bg-no-repeat sm:min-h-[500px] lg:min-h-0"
          initial="hidden"
          animate="visible"
          variants={artworkVariants}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/[0.02]"
          />

          {/* Mobile-only readable message */}

          <motion.div
            className="relative z-10 flex min-h-[400px] items-end px-5 pb-7 sm:min-h-[500px] sm:px-10 sm:pb-10 lg:hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="max-w-md rounded-[28px] border border-white/10 bg-[#061b48]/40 p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-[3px]"
            >
              <p className="font-[var(--font-poppins)] text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                We've got you
              </p>

              <h1 className="mt-2 font-[var(--font-roboto)] text-3xl font-black leading-[1.08] tracking-[-0.04em] sm:text-4xl">
                Let's get you
                <span className="block text-[#ffc83d]">back in.</span>
              </h1>

              <p className="mt-3 max-w-sm font-[var(--font-poppins)] text-sm leading-6 text-white/90">
                Don't worry. We'll help you get back to your BuzzieWorld adventure in just a few
                simple steps.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ================================================================
            RIGHT PASSWORD RECOVERY PANEL
        ================================================================ */}

        <section
          aria-label="Forgot password"
          className="relative flex min-h-[650px] items-center justify-center overflow-hidden bg-[#fff9ed] bg-[url('/images/login/login-right-background.jpg')] bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6 sm:py-12 lg:min-h-0 lg:px-10 lg:py-12 xl:px-16"
        >
          {/* Background depth */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-[#fff4d8]/10"
          />

          <motion.div
            className="relative z-10 w-full max-w-[530px] rounded-[32px] border border-white/90 bg-white/[0.94] px-6 py-8 shadow-[0_24px_70px_rgba(52,42,19,0.13)] backdrop-blur-[8px] sm:px-10 sm:py-10 md:px-12 md:py-11"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="forgot-form"
                  initial={{
                    opacity: 0,
                    x: -12,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -12,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: pageEase,
                  }}
                >
                  {/* ======================================================
                      ICON
                  ====================================================== */}

                  <motion.div variants={itemVariants} className="flex justify-center">
                    <motion.div
                      aria-hidden="true"
                      className="flex size-[58px] items-center justify-center rounded-[18px] bg-[#fff5dc] text-[#285bd8] shadow-[0_6px_18px_rgba(231,190,87,0.14)]"
                      whileHover={{
                        y: -3,
                        rotate: -2,
                        scale: 1.04,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: pageEase,
                      }}
                    >
                      <Mail className="size-7" strokeWidth={1.8} />
                    </motion.div>
                  </motion.div>

                  {/* ======================================================
                      HEADING
                  ====================================================== */}

                  <motion.div variants={itemVariants} className="mt-5 text-center">
                    <h2 className="font-[var(--font-roboto)] text-[1.95rem] font-black tracking-[-0.045em] text-[#14244b] sm:text-[2.2rem]">
                      Forgot your password?
                    </h2>

                    <p className="mx-auto mt-2 max-w-[390px] font-[var(--font-poppins)] text-[13px] font-medium leading-6 text-[#69738a] sm:text-sm">
                      No worries. Enter the email address associated with your account and we'll
                      send you a link to reset your password.
                    </p>
                  </motion.div>

                  {/* ======================================================
                      ERROR
                  ====================================================== */}

                  <AnimatePresence mode="wait">
                    {error ? (
                      <motion.div
                        key="forgot-error"
                        role="alert"
                        initial={{
                          opacity: 0,
                          height: 0,
                          y: -6,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          y: -6,
                        }}
                        transition={{
                          duration: 0.25,
                          ease: pageEase,
                        }}
                        className="mt-6 overflow-hidden"
                      >
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-[var(--font-poppins)] text-sm font-medium leading-5 text-red-700">
                          {error}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* ======================================================
                      FORM
                  ====================================================== */}

                  <motion.form
                    variants={containerVariants}
                    onSubmit={handleSubmit}
                    className="mt-8"
                    noValidate
                  >
                    <motion.div variants={itemVariants}>
                      <label
                        htmlFor="forgot-password-email"
                        className="block font-[var(--font-poppins)] text-sm font-bold text-[#202b43]"
                      >
                        Email address
                      </label>

                      <div className="relative mt-2.5">
                        <Mail
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 size-[19px] -translate-y-1/2 text-[#758096]"
                          strokeWidth={1.8}
                        />

                        <input
                          id="forgot-password-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);

                            if (error) {
                              setError("");
                            }
                          }}
                          disabled={isSubmitting}
                          className="h-[52px] w-full rounded-[15px] border border-[#d9dce3] bg-white/80 pl-12 pr-4 font-[var(--font-poppins)] text-[14px] font-medium text-[#1c2947] outline-none placeholder:text-[#929aaa] transition focus:border-[#3f6ff5] focus:bg-white focus:ring-4 focus:ring-[#3f6ff5]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[15px]"
                        />
                      </div>

                      <p className="mt-2.5 font-[var(--font-poppins)] text-[11px] leading-5 text-[#8992A2]">
                        We'll only use this email to help you recover your account.
                      </p>
                    </motion.div>

                    {/* ==================================================
                        SEND RESET LINK
                    ================================================== */}

                    <motion.button
                      variants={itemVariants}
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={
                        !isSubmitting
                          ? {
                              y: -2,
                            }
                          : undefined
                      }
                      whileTap={
                        !isSubmitting
                          ? {
                              scale: 0.99,
                            }
                          : undefined
                      }
                      className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#285be0] px-5 font-[var(--font-poppins)] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(40,91,224,0.22)] transition-colors duration-200 hover:bg-[#2252cf] hover:shadow-[0_13px_26px_rgba(40,91,224,0.28)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#285be0]/20"
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                            aria-hidden="true"
                          />
                          Sending reset link...
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="size-[18px]" strokeWidth={2} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>

                  {/* ======================================================
                      BACK TO LOGIN
                  ====================================================== */}

                  <motion.div variants={itemVariants} className="mt-7 flex justify-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-[var(--font-poppins)] text-sm font-bold text-[#526078] transition hover:bg-[#fff6e5] hover:text-[#285bd8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff5] focus-visible:ring-offset-2"
                    >
                      <ArrowLeft className="size-4" strokeWidth={2.2} />
                      Back to Sign In
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                /* ==========================================================
                   SUCCESS STATE
                ========================================================== */

                <motion.div
                  key="forgot-success"
                  initial={{
                    opacity: 0,
                    x: 12,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 12,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: pageEase,
                  }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Success icon */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.65,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: 0.05,
                      ease: pageEase,
                    }}
                    className="flex size-[68px] items-center justify-center rounded-[22px] bg-[#EAF5EA] text-[#4C8152] shadow-[0_8px_24px_rgba(76,129,82,0.12)]"
                  >
                    <CheckCircle2 className="size-9" strokeWidth={1.7} />
                  </motion.div>

                  <motion.h2
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.12,
                      ease: pageEase,
                    }}
                    className="mt-6 font-[var(--font-roboto)] text-[2rem] font-black tracking-[-0.045em] text-[#14244b] sm:text-[2.2rem]"
                  >
                    Check your inbox
                  </motion.h2>

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.18,
                      ease: pageEase,
                    }}
                    className="mt-3 max-w-[400px] font-[var(--font-poppins)] text-sm leading-6 text-[#69738a]"
                  >
                    If an account exists for{" "}
                    <span className="font-bold text-[#27334c]">{email.trim()}</span>, we've sent
                    instructions to reset your password.
                  </motion.p>

                  {/* Email illustration */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: 0.25,
                      ease: pageEase,
                    }}
                    className="mt-7 w-full rounded-[20px] border border-[#EEDDBB]/70 bg-[#FFF8EC] px-5 py-4"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#285bd8] shadow-sm">
                        <Mail className="size-4" strokeWidth={2} />
                      </div>

                      <div>
                        <p className="font-[var(--font-poppins)] text-sm font-bold text-[#27334c]">
                          Didn't receive it?
                        </p>

                        <p className="mt-1 font-[var(--font-poppins)] text-[11px] leading-5 text-[#7A8495]">
                          Check your spam or promotions folder. It may take a few minutes to arrive.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.32,
                      ease: pageEase,
                    }}
                    className="mt-7 flex w-full flex-col gap-3"
                  >
                    <Link
                      href="/login"
                      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#285be0] px-5 font-[var(--font-poppins)] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(40,91,224,0.22)] transition hover:-translate-y-0.5 hover:bg-[#2252cf] hover:shadow-[0_13px_26px_rgba(40,91,224,0.28)]"
                    >
                      Back to Sign In
                      <ArrowRight className="size-[18px]" strokeWidth={2} />
                    </Link>

                    <button
                      type="button"
                      onClick={handleTryAgain}
                      className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[15px] border border-[#d9dce3] bg-white px-5 font-[var(--font-poppins)] text-sm font-bold text-[#526078] transition hover:-translate-y-0.5 hover:border-[#c8ccd5] hover:bg-[#fffdf8] hover:text-[#285bd8]"
                    >
                      <RefreshCw className="size-4" strokeWidth={2} />
                      Try another email
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
