"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const FORGOT_PASSWORD_ENDPOINT = "/api/auth/forgot-password";

const pageEase = [0.22, 1, 0.36, 1] as const;

/* ============================================================================
   ANIMATION VARIANTS
   ============================================================================ */

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

/* ============================================================================
   FORGOT PASSWORD PAGE
   ============================================================================ */

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [error, setError] = useState("");

  /* ==========================================================================
     SUBMIT
     ========================================================================== */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    /* ------------------------------------------------------------------------
       VALIDATION
       ------------------------------------------------------------------------ */

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
      /* ----------------------------------------------------------------------
         PASSWORD RECOVERY API

         Existing endpoint and payload are preserved.
         ---------------------------------------------------------------------- */

      const response = await fetch(FORGOT_PASSWORD_ENDPOINT, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      /*
       * Some API errors may not return JSON.
       * Safely handle both JSON and non-JSON responses.
       */

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

  /* ==========================================================================
     TRY AGAIN
     ========================================================================== */

  function handleTryAgain() {
    setIsSubmitted(false);
    setError("");
  }

  return (
    <main
      className="
        relative
        min-h-[100svh]
        w-full
        overflow-x-hidden
        bg-white
      "
    >
      {/* ======================================================================
          SHARED AUTH BACKGROUND

          IMPORTANT:
          This is intentionally a single background covering the entire
          authentication page.

          File:
          public/images/backgrounds/perfect-background.png

          A normal CSS background is used instead of next/image so Next.js
          does not generate the problematic imagesrcset/querySelector
          selector that previously caused runtime errors.
      ====================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-white
          bg-[url('/images/backgrounds/perfect-background.png')]
          bg-cover
          bg-center
          bg-no-repeat
        "
      />

      {/* ======================================================================
          PAGE CONTENT
      ====================================================================== */}

      <div className="relative z-10 min-h-[100svh] w-full">
        <div
          className="
            mx-auto
            flex
            min-h-[100svh]
            w-full
            max-w-[1600px]
            flex-col
            lg:grid
            lg:grid-cols-2
          "
        >
          {/* ==================================================================
              LEFT SIDE
          ================================================================== */}

          <motion.section
            aria-label="BuzzieWorld adventure"
            initial="hidden"
            animate="visible"
            variants={artworkVariants}
            className="
              relative
              flex
              w-full
              items-center
              justify-center
              overflow-hidden
              bg-transparent
              px-4
              py-5
              sm:px-7
              sm:py-7
              md:px-10
              md:py-9
              lg:min-h-[100svh]
              lg:px-8
              lg:py-8
              xl:px-12
              2xl:px-16
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.05,
                ease: pageEase,
              }}
              className="
                relative
                flex
                w-full
                max-w-[720px]
                items-center
                justify-center
              "
            >
              {/* =================================================================
                  FORGOT PASSWORD ARTWORK

                  If you have a dedicated forgot-password image, replace the
                  source below.

                  The fallback currently uses the existing login artwork so
                  the component never points to a nonexistent asset.
              ================================================================= */}

              <motion.img
                src="/images/login/login-1.png"
                alt="BuzzieWorld password recovery"
                draggable={false}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: pageEase,
                }}
                className="
                  block
                  h-auto
                  w-full
                  max-w-[720px]
                  select-none
                  object-contain
                "
              />
            </motion.div>
          </motion.section>

          {/* ==================================================================
              RIGHT SIDE — PASSWORD RECOVERY
          ================================================================== */}

          <section
            aria-label="Forgot password"
            className="
              relative
              flex
              w-full
              items-center
              justify-center
              overflow-hidden
              bg-transparent
              px-4
              pb-8
              sm:px-6
              sm:pb-10
              md:px-8
              md:pb-12
              lg:min-h-[100svh]
              lg:px-10
              lg:py-8
              xl:px-14
              2xl:px-16
            "
          >
            {/* ==================================================================
                FORM CONTAINER
            ================================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                delay: 0.15,
                ease: pageEase,
              }}
              className="
                w-full
                max-w-[530px]
              "
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="
                  w-full
                  rounded-[28px]
                  border
                  border-[#eee8dc]
                  bg-white
                  px-5
                  py-7
                  shadow-[0_20px_60px_rgba(45,35,20,0.09)]
                  sm:rounded-[30px]
                  sm:px-8
                  sm:py-8
                  md:px-10
                  md:py-9
                  lg:px-11
                  lg:py-10
                "
              >
                <AnimatePresence mode="wait">
                  {/* ==========================================================
                      FORM STATE
                  ========================================================== */}

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
                      {/* ========================================================
                          ICON
                      ======================================================== */}

                      <motion.div variants={itemVariants} className="flex justify-center">
                        <motion.div
                          aria-hidden="true"
                          className="
                            flex
                            size-12
                            items-center
                            justify-center
                            rounded-[15px]
                            bg-[#fff5dc]
                            text-[#285bd8]
                            shadow-[0_6px_18px_rgba(231,190,87,0.14)]
                            sm:size-[56px]
                            sm:rounded-[17px]
                          "
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
                          <Mail className="size-6 sm:size-7" strokeWidth={1.8} />
                        </motion.div>
                      </motion.div>

                      {/* ========================================================
                          HEADING
                      ======================================================== */}

                      <motion.div variants={itemVariants} className="mt-4 text-center sm:mt-5">
                        <h1
                          className="
                            font-[var(--font-roboto)]
                            text-[1.75rem]
                            font-black
                            leading-tight
                            tracking-[-0.045em]
                            text-[#14244b]
                            sm:text-[2rem]
                            md:text-[2.15rem]
                          "
                        >
                          Forgot your password?
                        </h1>

                        <p
                          className="
                            mx-auto
                            mt-2
                            max-w-[390px]
                            font-[var(--font-poppins)]
                            text-[12.5px]
                            font-medium
                            leading-5
                            text-[#69738a]
                            sm:text-sm
                            sm:leading-6
                          "
                        >
                          No worries. Enter the email address associated with your account and
                          we&apos;ll send you a link to reset your password.
                        </p>
                      </motion.div>

                      {/* ========================================================
                          ERROR
                      ======================================================== */}

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
                            className="
                              mt-5
                              overflow-hidden
                              sm:mt-6
                            "
                          >
                            <div
                              className="
                                rounded-2xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                font-[var(--font-poppins)]
                                text-sm
                                font-medium
                                leading-5
                                text-red-700
                              "
                            >
                              {error}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      {/* ========================================================
                          FORM
                      ======================================================== */}

                      <motion.form
                        variants={containerVariants}
                        onSubmit={handleSubmit}
                        className="
                          mt-6
                          sm:mt-7
                        "
                        noValidate
                      >
                        {/* ======================================================
                            EMAIL
                        ====================================================== */}

                        <motion.div variants={itemVariants}>
                          <label
                            htmlFor="forgot-password-email"
                            className="
                              block
                              font-[var(--font-poppins)]
                              text-sm
                              font-bold
                              text-[#202b43]
                            "
                          >
                            Email address
                          </label>

                          <div className="relative mt-2.5">
                            <Mail
                              aria-hidden="true"
                              className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                size-[18px]
                                -translate-y-1/2
                                text-[#758096]
                              "
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
                              className="
                                h-[50px]
                                w-full
                                rounded-[14px]
                                border
                                border-[#d9dce3]
                                bg-white
                                pl-11
                                pr-4
                                font-[var(--font-poppins)]
                                text-[14px]
                                font-medium
                                text-[#1c2947]
                                outline-none
                                placeholder:text-[#929aaa]
                                transition
                                duration-200
                                focus:border-[#285bd8]
                                focus:ring-4
                                focus:ring-[#285bd8]/10
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                sm:h-[52px]
                                sm:text-[15px]
                              "
                            />
                          </div>

                          <p
                            className="
                              mt-2.5
                              font-[var(--font-poppins)]
                              text-[11px]
                              leading-5
                              text-[#8992A2]
                            "
                          >
                            We&apos;ll only use this email to help you recover your account.
                          </p>
                        </motion.div>

                        {/* ======================================================
                            SEND RESET LINK
                        ====================================================== */}

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
                          className="
                            mt-5
                            flex
                            h-[50px]
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-[14px]
                            bg-[#285be0]
                            px-5
                            font-[var(--font-poppins)]
                            text-[14px]
                            font-bold
                            text-white
                            shadow-[0_10px_22px_rgba(40,91,224,0.22)]
                            transition-all
                            duration-200
                            hover:bg-[#2252cf]
                            hover:shadow-[0_13px_26px_rgba(40,91,224,0.28)]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            focus-visible:outline-none
                            focus-visible:ring-4
                            focus-visible:ring-[#285bd8]/20
                            sm:mt-6
                            sm:h-[52px]
                            sm:text-[15px]
                          "
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="
                                  size-4
                                  animate-spin
                                  rounded-full
                                  border-2
                                  border-white/35
                                  border-t-white
                                "
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

                      {/* ========================================================
                          BACK TO LOGIN
                      ======================================================== */}

                      <motion.div
                        variants={itemVariants}
                        className="mt-6 flex justify-center sm:mt-7"
                      >
                        <Link
                          href="/login"
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-4
                            py-2
                            font-[var(--font-poppins)]
                            text-sm
                            font-bold
                            text-[#526078]
                            transition
                            hover:bg-[#fff6e5]
                            hover:text-[#285bd8]
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#3f6ff5]
                            focus-visible:ring-offset-2
                          "
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
                      className="
                        flex
                        flex-col
                        items-center
                        text-center
                      "
                    >
                      {/* ======================================================
                          SUCCESS ICON
                      ====================================================== */}

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
                        className="
                          flex
                          size-[62px]
                          items-center
                          justify-center
                          rounded-[20px]
                          bg-[#EAF5EA]
                          text-[#4C8152]
                          shadow-[0_8px_24px_rgba(76,129,82,0.12)]
                          sm:size-[68px]
                          sm:rounded-[22px]
                        "
                      >
                        <CheckCircle2 className="size-8 sm:size-9" strokeWidth={1.7} />
                      </motion.div>

                      {/* ======================================================
                          SUCCESS HEADING
                      ====================================================== */}

                      <motion.h1
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
                        className="
                          mt-5
                          font-[var(--font-roboto)]
                          text-[1.85rem]
                          font-black
                          tracking-[-0.045em]
                          text-[#14244b]
                          sm:mt-6
                          sm:text-[2.2rem]
                        "
                      >
                        Check your inbox
                      </motion.h1>

                      {/* ======================================================
                          SUCCESS DESCRIPTION
                      ====================================================== */}

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
                        className="
                          mt-3
                          max-w-[400px]
                          font-[var(--font-poppins)]
                          text-[13px]
                          leading-5
                          text-[#69738a]
                          sm:text-sm
                          sm:leading-6
                        "
                      >
                        If an account exists for{" "}
                        <span className="font-bold text-[#27334c]">{email.trim()}</span>, we&apos;ve
                        sent instructions to reset your password.
                      </motion.p>

                      {/* ======================================================
                          EMAIL INFORMATION
                      ====================================================== */}

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
                        className="
                          mt-6
                          w-full
                          rounded-[18px]
                          border
                          border-[#EEDDBB]/70
                          bg-[#FFF8EC]
                          px-4
                          py-4
                          sm:mt-7
                          sm:rounded-[20px]
                          sm:px-5
                        "
                      >
                        <div className="flex items-start gap-3 text-left">
                          <div
                            className="
                              flex
                              size-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-white
                              text-[#285bd8]
                              shadow-sm
                            "
                          >
                            <Mail className="size-4" strokeWidth={2} />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                font-[var(--font-poppins)]
                                text-sm
                                font-bold
                                text-[#27334c]
                              "
                            >
                              Didn&apos;t receive it?
                            </p>

                            <p
                              className="
                                mt-1
                                font-[var(--font-poppins)]
                                text-[11px]
                                leading-5
                                text-[#7A8495]
                              "
                            >
                              Check your spam or promotions folder. It may take a few minutes to
                              arrive.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* ======================================================
                          ACTIONS
                      ====================================================== */}

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
                        className="
                          mt-6
                          flex
                          w-full
                          flex-col
                          gap-2.5
                          sm:mt-7
                          sm:gap-3
                        "
                      >
                        <Link
                          href="/login"
                          className="
                            flex
                            h-[50px]
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-[14px]
                            bg-[#285be0]
                            px-5
                            font-[var(--font-poppins)]
                            text-[14px]
                            font-bold
                            text-white
                            shadow-[0_10px_22px_rgba(40,91,224,0.22)]
                            transition
                            hover:-translate-y-0.5
                            hover:bg-[#2252cf]
                            hover:shadow-[0_13px_26px_rgba(40,91,224,0.28)]
                            sm:h-[52px]
                            sm:rounded-[15px]
                            sm:text-[15px]
                          "
                        >
                          Back to Sign In
                          <ArrowRight className="size-[18px]" strokeWidth={2} />
                        </Link>

                        <button
                          type="button"
                          onClick={handleTryAgain}
                          className="
                            flex
                            h-[46px]
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-[14px]
                            border
                            border-[#d9dce3]
                            bg-white
                            px-5
                            font-[var(--font-poppins)]
                            text-sm
                            font-bold
                            text-[#526078]
                            transition
                            hover:-translate-y-0.5
                            hover:border-[#c8ccd5]
                            hover:bg-[#fffdf8]
                            hover:text-[#285bd8]
                            sm:h-[48px]
                            sm:rounded-[15px]
                          "
                        >
                          <RefreshCw className="size-4" strokeWidth={2} />
                          Try another email
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}

