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

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

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

  const passwordStrength = useMemo(() => {
    if (!password) {
      return null;
    }

    return getPasswordStrength(password);
  }, [password]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("This password reset link is missing or invalid. Please request a new one.");
      return;
    }

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
      /*
       * Backend-ready password reset request.
       *
       * Expected payload:
       *
       * {
       *   token: string,
       *   password: string
       * }
       *
       * The backend should:
       *
       * 1. Validate the token.
       * 2. Check token expiry.
       * 3. Locate the associated account.
       * 4. Hash the new password.
       * 5. Replace the old password.
       * 6. Invalidate the reset token.
       */

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

          {/* Mobile-only message */}

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
                Almost there
              </p>

              <h1 className="mt-2 font-[var(--font-roboto)] text-3xl font-black leading-[1.08] tracking-[-0.04em] sm:text-4xl">
                Create a new
                <span className="block text-[#ffc83d]">secret key.</span>
              </h1>

              <p className="mt-3 max-w-sm font-[var(--font-poppins)] text-sm leading-6 text-white/90">
                Choose a new password and get right back to your BuzzieWorld adventure.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ================================================================
            RIGHT RESET PANEL
        ================================================================ */}

        <section
          aria-label="Reset your password"
          className="relative flex min-h-[680px] items-center justify-center overflow-hidden bg-[#fff9ed] bg-[url('/images/login/login-right-background.jpg')] bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6 sm:py-12 lg:min-h-0 lg:px-10 lg:py-12 xl:px-16"
        >
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
              {!isReset ? (
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
                  {/* ======================================================
                      ICON
                  ====================================================== */}

                  <motion.div variants={itemVariants} className="flex justify-center">
                    <motion.div
                      aria-hidden="true"
                      className="flex size-[58px] items-center justify-center rounded-[18px] bg-[#fff5dc] text-[#285bd8] shadow-[0_6px_18px_rgba(231,190,87,0.14)]"
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
                      <KeyRound className="size-7" strokeWidth={1.8} />
                    </motion.div>
                  </motion.div>

                  {/* ======================================================
                      HEADING
                  ====================================================== */}

                  <motion.div variants={itemVariants} className="mt-5 text-center">
                    <h2 className="font-[var(--font-roboto)] text-[2rem] font-black tracking-[-0.045em] text-[#14244b] sm:text-[2.2rem]">
                      Reset your password
                    </h2>

                    <p className="mx-auto mt-2 max-w-[390px] font-[var(--font-poppins)] text-[13px] font-medium leading-6 text-[#69738a] sm:text-sm">
                      Create a new password for your BuzzieWorld account.
                    </p>
                  </motion.div>

                  {/* ======================================================
                      ERROR
                  ====================================================== */}

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
                        className="mt-6 overflow-hidden"
                      >
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-[var(--font-poppins)] text-sm font-medium leading-5 text-red-700">
                          {error}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* ======================================================
                      RESET FORM
                  ====================================================== */}

                  <motion.form
                    variants={containerVariants}
                    onSubmit={handleSubmit}
                    className="mt-8"
                    noValidate
                  >
                    {/* ==================================================
                        NEW PASSWORD
                    ================================================== */}

                    <motion.div variants={itemVariants}>
                      <div className="flex items-center justify-between gap-3">
                        <label
                          htmlFor="reset-password"
                          className="block font-[var(--font-poppins)] text-sm font-bold text-[#202b43]"
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
                            className={`font-[var(--font-poppins)] text-[11px] font-bold ${passwordStrength.textClass}`}
                          >
                            {passwordStrength.label}
                          </motion.span>
                        ) : null}
                      </div>

                      <div className="relative mt-2.5">
                        <LockKeyhole
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 size-[19px] -translate-y-1/2 text-[#758096]"
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
                          className="h-[52px] w-full rounded-[15px] border border-[#d9dce3] bg-white/80 pl-12 pr-12 font-[var(--font-poppins)] text-[14px] font-medium text-[#1c2947] outline-none placeholder:text-[#929aaa] transition focus:border-[#3f6ff5] focus:bg-white focus:ring-4 focus:ring-[#3f6ff5]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[15px]"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          disabled={isSubmitting}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#758096] transition hover:bg-[#f2f4f8] hover:text-[#1c2947] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff5] disabled:pointer-events-none"
                        >
                          {showPassword ? (
                            <EyeOff className="size-[18px]" strokeWidth={1.8} />
                          ) : (
                            <Eye className="size-[18px]" strokeWidth={1.8} />
                          )}
                        </button>
                      </div>

                      {/* Password strength */}

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
                              <div className="h-1 overflow-hidden rounded-full bg-[#ECEEF2]">
                                <motion.div
                                  className={`h-full rounded-full ${passwordStrength?.barClass}`}
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

                              <p className="mt-1.5 font-[var(--font-poppins)] text-[10.5px] font-medium text-[#8790A0]">
                                Use at least 8 characters with a mix of letters, numbers and
                                symbols.
                              </p>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>

                    {/* ==================================================
                        CONFIRM PASSWORD
                    ================================================== */}

                    <motion.div variants={itemVariants} className="mt-5">
                      <label
                        htmlFor="reset-confirm-password"
                        className="block font-[var(--font-poppins)] text-sm font-bold text-[#202b43]"
                      >
                        Confirm new password
                      </label>

                      <div className="relative mt-2.5">
                        <LockKeyhole
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 size-[19px] -translate-y-1/2 text-[#758096]"
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
                            "h-[52px] w-full rounded-[15px] border bg-white/80 pl-12 pr-12 font-[var(--font-poppins)] text-[14px] font-medium text-[#1c2947] outline-none placeholder:text-[#929aaa] transition focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[15px]",
                            confirmPassword && passwordsMatch
                              ? "border-[#78B47D] focus:border-[#5C9B63] focus:ring-[#5C9B63]/10"
                              : "border-[#d9dce3] focus:border-[#3f6ff5] focus:ring-[#3f6ff5]/10",
                          ].join(" ")}
                        />

                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                          disabled={isSubmitting}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#758096] transition hover:bg-[#f2f4f8] hover:text-[#1c2947] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff5] disabled:pointer-events-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-[18px]" strokeWidth={1.8} />
                          ) : (
                            <Eye className="size-[18px]" strokeWidth={1.8} />
                          )}
                        </button>

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
                              className="absolute right-12 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#EAF5EA] text-[#4C8152]"
                              aria-label="Passwords match"
                            >
                              <Check className="size-3.5" strokeWidth={2.5} />
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </div>

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
                          className="mt-2 font-[var(--font-poppins)] text-[11px] font-medium text-[#C94E59]"
                        >
                          Passwords do not match.
                        </motion.p>
                      ) : null}
                    </motion.div>

                    {/* ==================================================
                        SUBMIT
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
                      className="mt-7 flex h-[52px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#285be0] px-5 font-[var(--font-poppins)] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(40,91,224,0.22)] transition-colors duration-200 hover:bg-[#2252cf] hover:shadow-[0_13px_26px_rgba(40,91,224,0.28)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#285be0]/20"
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
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
                  className="flex flex-col items-center text-center"
                >
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
                    className="flex size-[70px] items-center justify-center rounded-[22px] bg-[#EAF5EA] text-[#4C8152] shadow-[0_8px_24px_rgba(76,129,82,0.12)]"
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
                      delay: 0.13,
                      ease: pageEase,
                    }}
                    className="mt-6 font-[var(--font-roboto)] text-[2rem] font-black tracking-[-0.045em] text-[#14244b] sm:text-[2.2rem]"
                  >
                    Password updated!
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
                      delay: 0.19,
                      ease: pageEase,
                    }}
                    className="mt-3 max-w-[390px] font-[var(--font-poppins)] text-sm leading-6 text-[#69738a]"
                  >
                    Your password has been changed successfully. You're all set to continue your
                    BuzzieWorld adventure.
                  </motion.p>

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
                    className="mt-7 w-full rounded-[20px] border border-[#EEDDBB]/70 bg-[#FFF8EC] px-5 py-4"
                  >
                    <div className="flex items-start gap-3 text-left">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#4C8152] shadow-sm">
                        <Check className="size-4" strokeWidth={2.4} />
                      </div>

                      <div>
                        <p className="font-[var(--font-poppins)] text-sm font-bold text-[#27334c]">
                          You're ready to go
                        </p>

                        <p className="mt-1 font-[var(--font-poppins)] text-[11px] leading-5 text-[#7A8495]">
                          Use your new password the next time you sign in.
                        </p>
                      </div>
                    </div>
                  </motion.div>

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
                    className="mt-7 w-full"
                  >
                    <Link
                      href="/login"
                      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#285be0] px-5 font-[var(--font-poppins)] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(40,91,224,0.22)] transition hover:-translate-y-0.5 hover:bg-[#2252cf] hover:shadow-[0_13px_26px_rgba(40,91,224,0.28)]"
                    >
                      Continue to Sign In
                      <ArrowRight className="size-[18px]" strokeWidth={2} />
                    </Link>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100svh-4.7rem)] items-center justify-center bg-[#fff9ed] px-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-[18px] bg-[#fff5dc] text-[#285bd8]">
              <KeyRound className="size-7" strokeWidth={1.8} />
            </div>

            <p className="mt-4 font-[var(--font-poppins)] text-sm font-semibold text-[#526078]">
              Preparing your password reset...
            </p>
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

