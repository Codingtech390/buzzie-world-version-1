"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";

const RESET_PASSWORD_ENDPOINT = "/api/auth/reset-password";

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
   PASSWORD STRENGTH
   ============================================================================ */

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return {
      label: "Weak",
      width: "25%",
      barClass: "bg-[#E76D75]",
      textClass: "text-[#C94E59]",
    };
  }

  if (score === 2) {
    return {
      label: "Fair",
      width: "50%",
      barClass: "bg-[#E5B64D]",
      textClass: "text-[#A47712]",
    };
  }

  if (score === 3) {
    return {
      label: "Good",
      width: "75%",
      barClass: "bg-[#6DAA72]",
      textClass: "text-[#4C8152]",
    };
  }

  return {
    label: "Strong",
    width: "100%",
    barClass: "bg-[#3F7DFF]",
    textClass: "text-[#2D63D0]",
  };
}

/* ============================================================================
   RESET PASSWORD CONTENT
   ============================================================================ */

function ResetPasswordContent() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isReset, setIsReset] = useState(false);

  const [error, setError] = useState("");

  /* ==========================================================================
     PASSWORD STRENGTH
     ========================================================================== */

  const passwordStrength = useMemo(() => {
    if (!password) {
      return null;
    }

    return getPasswordStrength(password);
  }, [password]);

  /* ==========================================================================
     PASSWORD MATCH
     ========================================================================== */

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  /* ==========================================================================
     SUBMIT RESET REQUEST
     ========================================================================== */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    /* ------------------------------------------------------------------------
       TOKEN VALIDATION
       ------------------------------------------------------------------------ */

    if (!token) {
      setError("This password reset link is missing or invalid. Please request a new one.");

      return;
    }

    /* ------------------------------------------------------------------------
       PASSWORD VALIDATION
       ------------------------------------------------------------------------ */

    if (!password) {
      setError("Please create a new password.");

      return;
    }

    if (password.length < 8) {
      setError("Your new password must be at least 8 characters.");

      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");

      return;
    }

    setIsSubmitting(true);

    try {
      /* ----------------------------------------------------------------------
         PASSWORD RESET API

         IMPORTANT:
         The existing API contract is preserved.

         Payload:
         {
           token: string,
           password: string
         }

         The backend is responsible for:
         1. Validating the token.
         2. Checking token expiry.
         3. Finding the account.
         4. Hashing the password.
         5. Updating the password.
         6. Invalidating the reset token.
         ---------------------------------------------------------------------- */

      const response = await fetch(RESET_PASSWORD_ENDPOINT, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token,
          password,
        }),
      });

      /*
       * Safely handle APIs that don't return JSON.
       */

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "We couldn't reset your password. The link may have expired.",
        );
      }

      setIsReset(true);
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
          COMPLETE AUTH BACKGROUND

          One continuous background for the entire page.

          File:
          public/images/backgrounds/perfect-background.png

          CSS background is intentionally used instead of next/image to avoid
          the problematic imagesrcset/querySelector runtime issue.
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

      <div
        className="
          relative
          z-10
          min-h-[100svh]
          w-full
        "
      >
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
              LEFT ADVENTURE PANEL
          ================================================================== */}

          <motion.section
            aria-label="BuzzieWorld password reset adventure"
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
              {/* ==============================================================
                  EXISTING AUTH ARTWORK

                  Using the existing login-1 artwork because this component
                  did not contain a dedicated reset-password image.
              ============================================================== */}

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
              RIGHT RESET PASSWORD PANEL
          ================================================================== */}

          <section
            aria-label="Reset your password"
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
                RESET CARD
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
                  {!isReset ? (
                    /* ==========================================================
                       RESET FORM STATE
                    ========================================================== */

                    <motion.div
                      key="reset-form"
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
                            rotate: 2,
                            scale: 1.04,
                          }}
                          transition={{
                            duration: 0.25,
                            ease: pageEase,
                          }}
                        >
                          <KeyRound className="size-6 sm:size-7" strokeWidth={1.8} />
                        </motion.div>
                      </motion.div>

                      {/* ========================================================
                          HEADING
                      ======================================================== */}

                      <motion.div
                        variants={itemVariants}
                        className="
                          mt-4
                          text-center
                          sm:mt-5
                        "
                      >
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
                          Reset your password
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
                          Create a new password for your BuzzieWorld account.
                        </p>
                      </motion.div>

                      {/* ========================================================
                          ERROR
                      ======================================================== */}

                      <AnimatePresence mode="wait">
                        {error ? (
                          <motion.div
                            key="reset-error"
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
                          RESET FORM
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
                            NEW PASSWORD
                        ====================================================== */}

                        <motion.div variants={itemVariants}>
                          <div className="flex items-center justify-between gap-3">
                            <label
                              htmlFor="reset-password"
                              className="
                                block
                                font-[var(--font-poppins)]
                                text-sm
                                font-bold
                                text-[#202b43]
                              "
                            >
                              New password
                            </label>

                            {passwordStrength ? (
                              <motion.span
                                key={passwordStrength.label}
                                initial={{
                                  opacity: 0,
                                  x: 5,
                                }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                }}
                                className={`
                                  font-[var(--font-poppins)]
                                  text-[11px]
                                  font-bold
                                  ${passwordStrength.textClass}
                                `}
                              >
                                {passwordStrength.label}
                              </motion.span>
                            ) : null}
                          </div>

                          <div className="relative mt-2.5">
                            <LockKeyhole
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
                              id="reset-password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Enter your new password"
                              value={password}
                              onChange={(event) => {
                                setPassword(event.target.value);

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
                                pr-12
                                font-[var(--font-poppins)]
                                text-[14px]
                                font-medium
                                text-[#1c2947]
                                outline-none
                                placeholder:text-[#929aaa]
                                transition
                                duration-200
                                focus:border-[#285bd8]
                                focus:bg-white
                                focus:ring-4
                                focus:ring-[#285bd8]/10
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                sm:h-[52px]
                                sm:text-[15px]
                              "
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword((current) => !current)}
                              disabled={isSubmitting}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              className="
                                absolute
                                right-2
                                top-1/2
                                flex
                                size-9
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                text-[#758096]
                                transition
                                hover:bg-[#f2f4f8]
                                hover:text-[#1c2947]
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#285bd8]
                                disabled:pointer-events-none
                              "
                            >
                              {showPassword ? (
                                <EyeOff className="size-[18px]" strokeWidth={1.8} />
                              ) : (
                                <Eye className="size-[18px]" strokeWidth={1.8} />
                              )}
                            </button>
                          </div>

                          {/* ====================================================
                              PASSWORD STRENGTH
                          ==================================================== */}

                          <AnimatePresence>
                            {password ? (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  height: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                  height: "auto",
                                }}
                                exit={{
                                  opacity: 0,
                                  height: 0,
                                }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2.5">
                                  <div
                                    className="
                                      h-1
                                      overflow-hidden
                                      rounded-full
                                      bg-[#ECEEF2]
                                    "
                                  >
                                    <motion.div
                                      className={`
                                        h-full
                                        rounded-full
                                        ${passwordStrength?.barClass}
                                      `}
                                      initial={{
                                        width: 0,
                                      }}
                                      animate={{
                                        width: passwordStrength?.width ?? "0%",
                                      }}
                                      transition={{
                                        duration: 0.3,
                                        ease: pageEase,
                                      }}
                                    />
                                  </div>

                                  <p
                                    className="
                                      mt-1.5
                                      font-[var(--font-poppins)]
                                      text-[10.5px]
                                      font-medium
                                      text-[#8790A0]
                                    "
                                  >
                                    Use at least 8 characters with a mix of letters, numbers and
                                    symbols.
                                  </p>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </motion.div>

                        {/* ======================================================
                            CONFIRM PASSWORD
                        ====================================================== */}

                        <motion.div variants={itemVariants} className="mt-5">
                          <label
                            htmlFor="reset-confirm-password"
                            className="
                              block
                              font-[var(--font-poppins)]
                              text-sm
                              font-bold
                              text-[#202b43]
                            "
                          >
                            Confirm new password
                          </label>

                          <div className="relative mt-2.5">
                            <LockKeyhole
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
                              id="reset-confirm-password"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Re-enter your new password"
                              value={confirmPassword}
                              onChange={(event) => {
                                setConfirmPassword(event.target.value);

                                if (error) {
                                  setError("");
                                }
                              }}
                              disabled={isSubmitting}
                              className={[
                                `
                                  h-[50px]
                                  w-full
                                  rounded-[14px]
                                  border
                                  bg-white
                                  pl-11
                                  pr-12
                                  font-[var(--font-poppins)]
                                  text-[14px]
                                  font-medium
                                  text-[#1c2947]
                                  outline-none
                                  placeholder:text-[#929aaa]
                                  transition
                                  duration-200
                                  focus:bg-white
                                  focus:ring-4
                                  disabled:cursor-not-allowed
                                  disabled:opacity-60
                                  sm:h-[52px]
                                  sm:text-[15px]
                                `,

                                confirmPassword && passwordsMatch
                                  ? `
                                    border-[#78B47D]
                                    focus:border-[#5C9B63]
                                    focus:ring-[#5C9B63]/10
                                  `
                                  : `
                                    border-[#d9dce3]
                                    focus:border-[#285bd8]
                                    focus:ring-[#285bd8]/10
                                  `,
                              ].join(" ")}
                            />

                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((current) => !current)}
                              disabled={isSubmitting}
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                              className="
                                absolute
                                right-2
                                top-1/2
                                flex
                                size-9
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                text-[#758096]
                                transition
                                hover:bg-[#f2f4f8]
                                hover:text-[#1c2947]
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#285bd8]
                                disabled:pointer-events-none
                              "
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="size-[18px]" strokeWidth={1.8} />
                              ) : (
                                <Eye className="size-[18px]" strokeWidth={1.8} />
                              )}
                            </button>

                            {/* ==================================================
                                MATCH INDICATOR
                            ================================================== */}

                            <AnimatePresence>
                              {passwordsMatch ? (
                                <motion.span
                                  initial={{
                                    opacity: 0,
                                    scale: 0.7,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    scale: 0.7,
                                  }}
                                  className="
                                    absolute
                                    right-12
                                    top-1/2
                                    flex
                                    size-5
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#EAF5EA]
                                    text-[#4C8152]
                                  "
                                  aria-label="Passwords match"
                                >
                                  <Check className="size-3.5" strokeWidth={2.5} />
                                </motion.span>
                              ) : null}
                            </AnimatePresence>
                          </div>

                          {/* ====================================================
                              MISMATCH MESSAGE
                          ==================================================== */}

                          {confirmPassword && !passwordsMatch ? (
                            <motion.p
                              initial={{
                                opacity: 0,
                                y: -3,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              className="
                                mt-2
                                font-[var(--font-poppins)]
                                text-[11px]
                                font-medium
                                text-[#C94E59]
                              "
                            >
                              Passwords do not match.
                            </motion.p>
                          ) : null}
                        </motion.div>

                        {/* ======================================================
                            RESET BUTTON
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
                            mt-6
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
                            focus-visible:ring-[#285be0]/20
                            sm:mt-7
                            sm:h-[52px]
                            sm:rounded-[15px]
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
                              Updating password...
                            </>
                          ) : (
                            <>
                              Reset Password
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
                        className="
                          mt-6
                          flex
                          justify-center
                          sm:mt-7
                        "
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
                      key="reset-success"
                      initial={{
                        opacity: 0,
                        x: 12,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
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
                          rotate: -8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                        }}
                        transition={{
                          duration: 0.5,
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
                          delay: 0.13,
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
                        Password updated!
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
                          delay: 0.19,
                          ease: pageEase,
                        }}
                        className="
                          mt-3
                          max-w-[390px]
                          font-[var(--font-poppins)]
                          text-[13px]
                          leading-5
                          text-[#69738a]
                          sm:text-sm
                          sm:leading-6
                        "
                      >
                        Your password has been changed successfully. You&apos;re all set to continue
                        your BuzzieWorld adventure.
                      </motion.p>

                      {/* ======================================================
                          SUCCESS INFORMATION
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
                          delay: 0.27,
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
                              text-[#4C8152]
                              shadow-sm
                            "
                          >
                            <Check className="size-4" strokeWidth={2.4} />
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
                              You&apos;re ready to go
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
                              Use your new password the next time you sign in.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* ======================================================
                          CONTINUE TO LOGIN
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
                          delay: 0.34,
                          ease: pageEase,
                        }}
                        className="
                          mt-6
                          w-full
                          sm:mt-7
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
                          Continue to Sign In
                          <ArrowRight className="size-[18px]" strokeWidth={2} />
                        </Link>
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

/* ============================================================================
   PAGE WRAPPER

   useSearchParams() requires Suspense in the App Router.
   ============================================================================ */

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main
          className="
            flex
            min-h-[100svh]
            items-center
            justify-center
            bg-white
            bg-[url('/images/backgrounds/perfect-background.png')]
            bg-cover
            bg-center
            bg-no-repeat
            px-4
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              flex
              flex-col
              items-center
              text-center
            "
          >
            <motion.div
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                flex
                size-14
                items-center
                justify-center
                rounded-[18px]
                bg-[#fff5dc]
                text-[#285bd8]
                shadow-[0_8px_22px_rgba(231,190,87,0.14)]
              "
            >
              <KeyRound className="size-7" strokeWidth={1.8} />
            </motion.div>

            <p
              className="
                mt-4
                font-[var(--font-poppins)]
                text-sm
                font-semibold
                text-[#526078]
              "
            >
              Preparing your password reset...
            </p>
          </motion.div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

