"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const REGISTER_ENDPOINT = "/api/auth/register";

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
      staggerChildren: 0.055,
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
      className: "bg-[#E76D75]",
      textClassName: "text-[#C94E59]",
    };
  }

  if (score === 2) {
    return {
      label: "Fair",
      width: "50%",
      className: "bg-[#E5B64D]",
      textClassName: "text-[#A47712]",
    };
  }

  if (score === 3) {
    return {
      label: "Good",
      width: "75%",
      className: "bg-[#6DAA72]",
      textClassName: "text-[#4C8152]",
    };
  }

  return {
    label: "Strong",
    width: "100%",
    className: "bg-[#3F7DFF]",
    textClassName: "text-[#2D63D0]",
  };
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => {
    if (!password) {
      return null;
    }

    return getPasswordStrength(password);
  }, [password]);

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setError("Please enter your name.");
      return;
    }

    if (normalizedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Backend-ready registration request.
       *
       * Expected payload:
       *
       * {
       *   name: string,
       *   email: string,
       *   password: string
       * }
       *
       * Change REGISTER_ENDPOINT only if your final
       * authentication API uses another route.
       */

      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "We couldn't create your account. Please try again.",
        );
      }

      /*
       * If your backend returns a redirect URL,
       * honor it automatically.
       */
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      /*
       * If registration establishes the session immediately,
       * this can later be replaced with your preferred
       * NextAuth/custom authentication flow.
       *
       * Default destination:
       */
      window.location.href = "/account";
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
          aria-label="Join the BuzzieWorld adventure"
          className="relative min-h-[400px] overflow-hidden bg-[#061b48] bg-[url('/images/login/login-left-background.jpg')] bg-cover bg-center bg-no-repeat sm:min-h-[500px] lg:min-h-0"
          initial="hidden"
          animate="visible"
          variants={artworkVariants}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/[0.02]"
          />

          {/* Mobile-only content.
              Desktop artwork already contains the visual messaging. */}
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
                Play · Learn · Grow
              </p>

              <h1 className="mt-2 font-[var(--font-roboto)] text-3xl font-black leading-[1.08] tracking-[-0.04em] sm:text-4xl">
                Your adventure
                <span className="block text-[#ffc83d]">
                  starts here.
                </span>
              </h1>

              <p className="mt-3 max-w-sm font-[var(--font-poppins)] text-sm leading-6 text-white/90">
                Create your BuzzieWorld account and unlock a
                magical world of toys, games, learning and
                imagination.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ================================================================
            RIGHT REGISTER PANEL
        ================================================================ */}

        <section
          aria-label="Create your BuzzieWorld account"
          className="relative flex min-h-[760px] items-center justify-center overflow-hidden bg-[#fff9ed] bg-[url('/images/login/login-right-background.jpg')] bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6 sm:py-12 lg:min-h-0 lg:px-10 lg:py-12 xl:px-16"
        >
          {/* Background depth */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-[#fff4d8]/10"
          />

          <motion.div
            className="relative z-10 w-full max-w-[530px] rounded-[32px] border border-white/90 bg-white/[0.94] px-6 py-8 shadow-[0_24px_70px_rgba(52,42,19,0.13)] backdrop-blur-[8px] sm:px-10 sm:py-9 md:px-12 md:py-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* ============================================================
                BEE ICON
            ============================================================ */}

            <motion.div
              variants={itemVariants}
              className="flex justify-center"
            >
              <motion.div
                aria-hidden="true"
                className="flex size-[58px] items-center justify-center rounded-[18px] bg-[#fff5dc] text-[30px] shadow-[0_6px_18px_rgba(231,190,87,0.14)]"
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
                🐝
              </motion.div>
            </motion.div>

            {/* ============================================================
                HEADING
            ============================================================ */}

            <motion.div
              variants={itemVariants}
              className="mt-4 text-center"
            >
              <h2 className="font-[var(--font-roboto)] text-[1.85rem] font-black tracking-[-0.045em] text-[#14244b] sm:text-[2.15rem]">
                Create your account
              </h2>

              <p className="mt-2 font-[var(--font-poppins)] text-[13px] font-medium text-[#69738a] sm:text-sm">
                Welcome to the BuzzieWorld family.
              </p>
            </motion.div>

            {/* ============================================================
                ERROR
            ============================================================ */}

            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="register-error"
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
                  className="mt-5 overflow-hidden"
                >
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-[var(--font-poppins)] text-sm font-medium leading-5 text-red-700">
                    {error}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* ============================================================
                REGISTER FORM
            ============================================================ */}

            <form
              onSubmit={handleSubmit}
              className="mt-7"
              noValidate
            >
              {/* ======================================================
                  NAME
              ====================================================== */}

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="register-name"
                  className="block font-[var(--font-poppins)] text-sm font-bold text-[#202b43]"
                >
                  Full name
                </label>

                <div className="relative mt-2">
                  <UserRound
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#758096]"
                    strokeWidth={1.8}
                  />

                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    disabled={isSubmitting}
                    className="h-[50px] w-full rounded-[15px] border border-[#d9dce3] bg-white/80 pl-11 pr-4 font-[var(--font-poppins)] text-[14px] font-medium text-[#1c2947] outline-none placeholder:text-[#929aaa] transition focus:border-[#3f6ff5] focus:bg-white focus:ring-4 focus:ring-[#3f6ff5]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[52px] sm:text-[15px]"
                  />
                </div>
              </motion.div>

              {/* ======================================================
                  EMAIL
              ====================================================== */}

              <motion.div
                variants={itemVariants}
                className="mt-5"
              >
                <label
                  htmlFor="register-email"
                  className="block font-[var(--font-poppins)] text-sm font-bold text-[#202b43]"
                >
                  Email address
                </label>

                <div className="relative mt-2">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#758096]"
                    strokeWidth={1.8}
                  />

                  <input
                    id="register-email"
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
                    className="h-[50px] w-full rounded-[15px] border border-[#d9dce3] bg-white/80 pl-11 pr-4 font-[var(--font-poppins)] text-[14px] font-medium text-[#1c2947] outline-none placeholder:text-[#929aaa] transition focus:border-[#3f6ff5] focus:bg-white focus:ring-4 focus:ring-[#3f6ff5]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[52px] sm:text-[15px]"
                  />
                </div>
              </motion.div>

              {/* ======================================================
                  PASSWORD
              ====================================================== */}

              <motion.div
                variants={itemVariants}
                className="mt-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="register-password"
                    className="block font-[var(--font-poppins)] text-sm font-bold text-[#202b43]"
                  >
                    Password
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
                      className={`font-[var(--font-poppins)] text-[11px] font-bold ${passwordStrength.textClassName}`}
                    >
                      {passwordStrength.label}
                    </motion.span>
                  ) : null}
                </div>

                <div className="relative mt-2">
                  <LockKeyhole
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#758096]"
                    strokeWidth={1.8}
                  />

                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    disabled={isSubmitting}
                    className="h-[50px] w-full rounded-[15px] border border-[#d9dce3] bg-white/80 pl-11 pr-12 font-[var(--font-poppins)] text-[14px] font-medium text-[#1c2947] outline-none placeholder:text-[#929aaa] transition focus:border-[#3f6ff5] focus:bg-white focus:ring-4 focus:ring-[#3f6ff5]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[52px] sm:text-[15px]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={isSubmitting}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#758096] transition hover:bg-[#f2f4f8] hover:text-[#1c2947] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff5] disabled:pointer-events-none"
                  >
                    {showPassword ? (
                      <EyeOff
                        className="size-[18px]"
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        className="size-[18px]"
                        strokeWidth={1.8}
                      />
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
                            className={`h-full rounded-full ${passwordStrength?.className}`}
                            initial={{ width: 0 }}
                            animate={{
                              width:
                                passwordStrength?.width ?? "0%",
                            }}
                            transition={{
                              duration: 0.3,
                              ease: pageEase,
                            }}
                          />
                        </div>

                        <p className="mt-1.5 font-[var(--font-poppins)] text-[10.5px] font-medium text-[#8790A0]">
                          Use at least 8 characters with a mix
                          of letters, numbers and symbols.
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>

              {/* ======================================================
                  CONFIRM PASSWORD
              ====================================================== */}

              <motion.div
                variants={itemVariants}
                className="mt-5"
              >
                <label
                  htmlFor="register-confirm-password"
                  className="block font-[var(--font-poppins)] text-sm font-bold text-[#202b43]"
                >
                  Confirm password
                </label>

                <div className="relative mt-2">
                  <LockKeyhole
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#758096]"
                    strokeWidth={1.8}
                  />

                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(
                        event.target.value,
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    disabled={isSubmitting}
                    className={[
                      "h-[50px] w-full rounded-[15px] border bg-white/80 pl-11 pr-12 font-[var(--font-poppins)] text-[14px] font-medium text-[#1c2947] outline-none placeholder:text-[#929aaa] transition focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[52px] sm:text-[15px]",
                      confirmPassword &&
                      passwordsMatch
                        ? "border-[#78B47D] focus:border-[#5C9B63] focus:ring-[#5C9B63]/10"
                        : "border-[#d9dce3] focus:border-[#3f6ff5] focus:ring-[#3f6ff5]/10",
                    ].join(" ")}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current,
                      )
                    }
                    disabled={isSubmitting}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#758096] transition hover:bg-[#f2f4f8] hover:text-[#1c2947] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6ff5] disabled:pointer-events-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff
                        className="size-[18px]"
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        className="size-[18px]"
                        strokeWidth={1.8}
                      />
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
                        <Check
                          className="size-3.5"
                          strokeWidth={2.5}
                        />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ======================================================
                  TERMS
              ====================================================== */}

              <motion.p
                variants={itemVariants}
                className="mt-4 font-[var(--font-poppins)] text-[11px] leading-5 text-[#7A8495]"
              >
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-[#285bd8] hover:underline"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#285bd8] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </motion.p>

              {/* ======================================================
                  CREATE ACCOUNT
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
                className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#285be0] px-5 font-[var(--font-poppins)] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(40,91,224,0.22)] transition-colors duration-200 hover:bg-[#2252cf] hover:shadow-[0_13px_26px_rgba(40,91,224,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-[0_10px_22px_rgba(40,91,224,0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#285be0]/20"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                      aria-hidden="true"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      className="size-[18px]"
                      strokeWidth={2}
                    />
                  </>
                )}
              </motion.button>
            </form>

            {/* ============================================================
                SOCIAL DIVIDER
            ============================================================ */}

            <motion.div
              variants={itemVariants}
              className="my-6 flex items-center gap-3"
            >
              <div className="h-px flex-1 bg-[#dfe1e5]" />

              <span className="shrink-0 font-[var(--font-poppins)] text-xs font-medium text-[#788196]">
                or sign up with
              </span>

              <div className="h-px flex-1 bg-[#dfe1e5]" />
            </motion.div>

            {/* ============================================================
                SOCIAL SIGN UP
            ============================================================ */}

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 gap-2.5"
            >
              {/* GOOGLE */}

              <button
                type="button"
                disabled={isSubmitting}
                className="flex h-[45px] items-center justify-center gap-2 rounded-[14px] border border-[#d9dce3] bg-white px-2 font-[var(--font-poppins)] text-sm font-semibold text-[#20283a] transition hover:-translate-y-0.5 hover:border-[#c8ccd5] hover:shadow-sm disabled:pointer-events-none disabled:opacity-60"
                onClick={() => {
                  // Connect Google OAuth here.
                }}
              >
                <span
                  aria-hidden="true"
                  className="text-[17px] font-bold"
                >
                  G
                </span>

                <span className="hidden sm:inline">
                  Google
                </span>
              </button>

              {/* FACEBOOK */}

              {/* <button
                type="button"
                disabled={isSubmitting}
                className="flex h-[45px] items-center justify-center gap-2 rounded-[14px] border border-[#d9dce3] bg-white px-2 font-[var(--font-poppins)] text-sm font-semibold text-[#20283a] transition hover:-translate-y-0.5 hover:border-[#c8ccd5] hover:shadow-sm disabled:pointer-events-none disabled:opacity-60"
                onClick={() => {
                  // Connect Facebook OAuth here.
                }}
              >
                <span
                  aria-hidden="true"
                  className="flex size-[18px] items-center justify-center rounded-full bg-[#1877f2] text-xs font-black text-white"
                >
                  f
                </span>

                <span className="hidden sm:inline">
                  Facebook
                </span>
              </button> */}

              {/* APPLE */}

              {/* <button
                type="button"
                disabled={isSubmitting}
                className="flex h-[45px] items-center justify-center gap-2 rounded-[14px] border border-[#d9dce3] bg-white px-2 font-[var(--font-poppins)] text-sm font-semibold text-[#20283a] transition hover:-translate-y-0.5 hover:border-[#c8ccd5] hover:shadow-sm disabled:pointer-events-none disabled:opacity-60"
                onClick={() => {
                  // Connect Apple OAuth here.
                }}
              >
                <span
                  aria-hidden="true"
                  className="text-[18px] leading-none text-black"
                >
                  
                </span>

                <span className="hidden sm:inline">
                  Apple
                </span>
              </button> */}
            </motion.div>

            {/* ============================================================
                LOGIN LINK
            ============================================================ */}

            <motion.div
              variants={itemVariants}
              className="mt-6 flex min-h-[78px] items-center justify-between gap-4 rounded-[17px] bg-[#fff6e5] px-5 py-4"
            >
              <div className="min-w-0">
                <p className="font-[var(--font-poppins)] text-sm font-medium text-[#27334c]">
                  Already have an account?
                </p>

                <Link
                  href="/login"
                  className="mt-1 inline-flex items-center gap-1.5 font-[var(--font-poppins)] text-[14px] font-black text-[#285bd8] transition hover:text-[#1746b8] sm:text-[15px]"
                >
                  Sign in
                  <ArrowRight
                    className="size-4"
                    strokeWidth={2.3}
                  />
                </Link>
              </div>

              <motion.div
                aria-hidden="true"
                className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-[#ffe4b2] text-[25px] sm:flex"
                whileHover={{
                  rotate: -4,
                  scale: 1.05,
                }}
              >
                🧸
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
