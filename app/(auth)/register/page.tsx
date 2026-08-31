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

/* ============================================================================
   REGISTER PAGE
   ============================================================================ */

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  /* ==========================================================================
     REGISTER SUBMIT
     ========================================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    /* ========================================================================
       CLIENT-SIDE VALIDATION
       ======================================================================== */

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
      /* ======================================================================
         REGISTRATION API

         Existing endpoint is intentionally preserved.
         ====================================================================== */

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

      /*
       * Some API errors may not contain valid JSON.
       * Never let response.json() itself crash the registration page.
       */

      const data = await response.json().catch(() => null);

      /* ======================================================================
         API ERROR HANDLING
         ====================================================================== */

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "We couldn't create your account. Please try again.",
        );
      }

      /* ======================================================================
         BACKEND REDIRECT

         If the API supplies a redirect URL, use it.
         ====================================================================== */

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      /* ======================================================================
         DEFAULT SUCCESS DESTINATION

         Preserved from the existing registration flow.
         ====================================================================== */

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
          COMPLETE AUTHENTICATION BACKGROUND

          This is intentionally ONE background covering the complete page.

          File:
          public/images/backgrounds/perfect-background.png

          We are not using next/image here. This prevents Next.js from
          generating the problematic imagesrcset selector that previously
          caused the querySelector error.
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
              LEFT SIDE — REGISTER ARTWORK
          ================================================================== */}

          <motion.section
            aria-label="Join the BuzzieWorld adventure"
            initial="hidden"
            animate="visible"
            variants={artworkVariants}
            className="
              flex
              w-full
              items-center
              justify-center
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
                flex
                w-full
                items-center
                justify-center
              "
            >
              <motion.img
                src="/images/login/register-1.png"
                alt="Join the BuzzieWorld adventure"
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
                  max-w-[760px]
                  select-none
                  object-contain
                "
              />
            </motion.div>
          </motion.section>

          {/* ==================================================================
              RIGHT SIDE — REGISTER FORM
          ================================================================== */}

          <section
            aria-label="Create your BuzzieWorld account"
            className="
              flex
              w-full
              items-center
              justify-center
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
                max-w-[500px]
              "
            >
              {/* ==============================================================
                  REGISTER CARD
              ============================================================== */}

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
                  sm:px-8
                  sm:py-8
                  md:px-9
                  md:py-9
                "
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
                    className="
                      flex
                      size-12
                      items-center
                      justify-center
                      rounded-[15px]
                      bg-[#fff5dc]
                      text-[25px]
                      shadow-[0_5px_15px_rgba(231,190,87,0.12)]
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
                  <h1
                    className="
                      text-[1.8rem]
                      font-black
                      leading-tight
                      tracking-[-0.04em]
                      text-[#14244b]
                      sm:text-[2rem]
                    "
                  >
                    Create your account
                  </h1>

                  <p
                    className="
                      mt-1.5
                      text-sm
                      font-medium
                      text-[#69738a]
                    "
                  >
                    Welcome to the BuzzieWorld family.
                  </p>
                </motion.div>

                {/* ============================================================
                    ERROR MESSAGE
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
                      <div
                        className="
                          rounded-2xl
                          border
                          border-red-200
                          bg-red-50
                          px-4
                          py-3
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

                {/* ============================================================
                    REGISTER FORM
                ============================================================ */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-6"
                  noValidate
                >
                  {/* ==========================================================
                      FULL NAME
                  ========================================================== */}

                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="register-name"
                      className="
                        block
                        text-sm
                        font-bold
                        text-[#202b43]
                      "
                    >
                      Full name
                    </label>

                    <div className="relative mt-2">
                      <UserRound
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
                        className="
                          h-[50px]
                          w-full
                          rounded-[14px]
                          border
                          border-[#d9dce3]
                          bg-white
                          pl-11
                          pr-4
                          text-[14px]
                          font-medium
                          text-[#1c2947]
                          outline-none
                          placeholder:text-[#929aaa]
                          transition
                          duration-200
                          focus:border-[#ff2868]
                          focus:ring-4
                          focus:ring-[#ff2868]/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          sm:h-[52px]
                          sm:text-[15px]
                        "
                      />
                    </div>
                  </motion.div>

                  {/* ==========================================================
                      EMAIL
                  ========================================================== */}

                  <motion.div
                    variants={itemVariants}
                    className="mt-5"
                  >
                    <label
                      htmlFor="register-email"
                      className="
                        block
                        text-sm
                        font-bold
                        text-[#202b43]
                      "
                    >
                      Email address
                    </label>

                    <div className="relative mt-2">
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
                        className="
                          h-[50px]
                          w-full
                          rounded-[14px]
                          border
                          border-[#d9dce3]
                          bg-white
                          pl-11
                          pr-4
                          text-[14px]
                          font-medium
                          text-[#1c2947]
                          outline-none
                          placeholder:text-[#929aaa]
                          transition
                          duration-200
                          focus:border-[#ff2868]
                          focus:ring-4
                          focus:ring-[#ff2868]/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          sm:h-[52px]
                          sm:text-[15px]
                        "
                      />
                    </div>
                  </motion.div>

                  {/* ==========================================================
                      PASSWORD
                  ========================================================== */}

                  <motion.div
                    variants={itemVariants}
                    className="mt-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="register-password"
                        className="
                          block
                          text-sm
                          font-bold
                          text-[#202b43]
                        "
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
                          className={`
                            text-[11px]
                            font-bold
                            ${passwordStrength.textClassName}
                          `}
                        >
                          {passwordStrength.label}
                        </motion.span>
                      ) : null}
                    </div>

                    <div className="relative mt-2">
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
                        id="register-password"
                        name="password"
                        type={
                          showPassword ? "text" : "password"
                        }
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
                        className="
                          h-[50px]
                          w-full
                          rounded-[14px]
                          border
                          border-[#d9dce3]
                          bg-white
                          pl-11
                          pr-12
                          text-[14px]
                          font-medium
                          text-[#1c2947]
                          outline-none
                          placeholder:text-[#929aaa]
                          transition
                          duration-200
                          focus:border-[#ff2868]
                          focus:ring-4
                          focus:ring-[#ff2868]/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          sm:h-[52px]
                          sm:text-[15px]
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current,
                          )
                        }
                        disabled={isSubmitting}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="
                          absolute
                          right-2.5
                          top-1/2
                          flex
                          size-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          text-[#758096]
                          transition
                          hover:bg-[#f4f4f5]
                          hover:text-[#1c2947]
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#ff2868]
                          disabled:pointer-events-none
                        "
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

                    {/* ========================================================
                        PASSWORD STRENGTH
                    ======================================================== */}

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
                                  ${passwordStrength?.className}
                                `}
                                initial={{
                                  width: 0,
                                }}
                                animate={{
                                  width:
                                    passwordStrength?.width ??
                                    "0%",
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
                                text-[10.5px]
                                font-medium
                                text-[#8790A0]
                              "
                            >
                              Use at least 8 characters with a
                              mix of letters, numbers and
                              symbols.
                            </p>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>

                  {/* ==========================================================
                      CONFIRM PASSWORD
                  ========================================================== */}

                  <motion.div
                    variants={itemVariants}
                    className="mt-5"
                  >
                    <label
                      htmlFor="register-confirm-password"
                      className="
                        block
                        text-sm
                        font-bold
                        text-[#202b43]
                      "
                    >
                      Confirm password
                    </label>

                    <div className="relative mt-2">
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
                          `
                            h-[50px]
                            w-full
                            rounded-[14px]
                            border
                            bg-white
                            pl-11
                            pr-12
                            text-[14px]
                            font-medium
                            text-[#1c2947]
                            outline-none
                            placeholder:text-[#929aaa]
                            transition
                            duration-200
                            focus:ring-4
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            sm:h-[52px]
                            sm:text-[15px]
                          `,
                          confirmPassword &&
                          passwordsMatch
                            ? `
                              border-[#78B47D]
                              focus:border-[#5C9B63]
                              focus:ring-[#5C9B63]/10
                            `
                            : `
                              border-[#d9dce3]
                              focus:border-[#ff2868]
                              focus:ring-[#ff2868]/10
                            `,
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
                        className="
                          absolute
                          right-2.5
                          top-1/2
                          flex
                          size-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          text-[#758096]
                          transition
                          hover:bg-[#f4f4f5]
                          hover:text-[#1c2947]
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#ff2868]
                          disabled:pointer-events-none
                        "
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

                      {/* ======================================================
                          PASSWORD MATCH INDICATOR
                      ====================================================== */}

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
                            <Check
                              className="size-3.5"
                              strokeWidth={2.5}
                            />
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* ==========================================================
                      TERMS
                  ========================================================== */}

                  <motion.p
                    variants={itemVariants}
                    className="
                      mt-4
                      text-[11px]
                      leading-5
                      text-[#7A8495]
                    "
                  >
                    By creating an account, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="
                        font-semibold
                        text-[#285bd8]
                        hover:underline
                      "
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="
                        font-semibold
                        text-[#285bd8]
                        hover:underline
                      "
                    >
                      Privacy Policy
                    </Link>
                    .
                  </motion.p>

                  {/* ==========================================================
                      CREATE ACCOUNT BUTTON
                  ========================================================== */}

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
                            scale: 0.985,
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
                      text-[15px]
                      font-bold
                      text-white
                      shadow-[0_9px_20px_rgba(40,91,224,0.20)]
                      transition
                      duration-200
                      hover:bg-[#2252cf]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      focus-visible:outline-none
                      focus-visible:ring-4
                      focus-visible:ring-[#285be0]/20
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

                  <span
                    className="
                      shrink-0
                      text-xs
                      font-medium
                      text-[#788196]
                    "
                  >
                    or sign up with
                  </span>

                  <div className="h-px flex-1 bg-[#dfe1e5]" />
                </motion.div>

                {/* ============================================================
                    GOOGLE SIGN UP
                ============================================================ */}

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 gap-2.5"
                >
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="
                      flex
                      h-[45px]
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-[13px]
                      border
                      border-[#d9dce3]
                      bg-white
                      px-2
                      text-sm
                      font-semibold
                      text-[#20283a]
                      transition
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-[#c8ccd5]
                      hover:shadow-sm
                      disabled:pointer-events-none
                      disabled:opacity-60
                    "
                    onClick={() => {
                      /*
                       * Google OAuth will be connected when the
                       * production authentication system is implemented.
                       */
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="text-[17px] font-bold"
                    >
                      G
                    </span>

                    <span>Continue with Google</span>
                  </button>
                </motion.div>

                {/* ============================================================
                    LOGIN LINK
                ============================================================ */}

                <motion.div
                  variants={itemVariants}
                  className="
                    mt-6
                    flex
                    min-h-[72px]
                    items-center
                    justify-between
                    gap-4
                    rounded-[16px]
                    bg-[#fff6e5]
                    px-4
                    py-3
                    sm:px-5
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        text-sm
                        font-medium
                        text-[#27334c]
                      "
                    >
                      Already have an account?
                    </p>

                    <Link
                      href="/login"
                      className="
                        mt-1
                        inline-flex
                        items-center
                        gap-1.5
                        text-[14px]
                        font-black
                        text-[#285bd8]
                        transition
                        hover:text-[#1746b8]
                        sm:text-[15px]
                      "
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
                    className="
                      hidden
                      size-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#ffe4b2]
                      text-[22px]
                      sm:flex
                    "
                    whileHover={{
                      rotate: -4,
                      scale: 1.05,
                    }}
                  >
                    🧸
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
