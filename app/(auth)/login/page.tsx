"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

const LOGIN_ENDPOINT = "/api/auth/login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * ================================================================
       * AUTHENTICATION ENDPOINT
       * ================================================================
       *
       * Keep this endpoint unchanged until the real authentication
       * implementation is connected.
       *
       * Current expected payload:
       *
       * {
       *   email: string;
       *   password: string;
       * }
       */

      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      /*
       * Some failed API responses may not contain valid JSON.
       * Therefore, don't allow response.json() itself to crash
       * the login flow.
       */

      const data = await response.json().catch(() => null);

      /*
       * ================================================================
       * API ERROR HANDLING
       * ================================================================
       */

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "We couldn't sign you in. Please check your details and try again.",
        );
      }

      /*
       * ================================================================
       * SUCCESSFUL AUTHENTICATION
       * ================================================================
       *
       * If the backend returns a redirect URL, respect it.
       *
       * Example:
       *
       * {
       *   success: true,
       *   redirectUrl: "/account"
       * }
       */

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      /*
       * ================================================================
       * DEFAULT SUCCESS DESTINATION
       * ================================================================
       *
       * Once proper session handling is implemented, this section
       * can be replaced by the final authentication flow.
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
    <main
      className="
        relative
        min-h-[100svh]
        w-full
        overflow-x-hidden
        bg-white
        bg-cover
        bg-center
        bg-no-repeat
      "
      style={{
        backgroundImage: "url('/images/backgrounds/perfect-background.png')",
      }}
    >
      {/* ================================================================
          BACKGROUND
          ---------------------------------------------------------------
          perfect-background.png is the background for the COMPLETE
          authentication page.
      ================================================================= */}

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
          {/* ============================================================
              LEFT SIDE
              ------------------------------------------------------------
              BuzzieWorld artwork.
          ============================================================ */}

          <section
            aria-label="Welcome to BuzzieWorld"
            className="
              flex
              w-full
              items-center
              justify-center
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
                x: -35,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                flex
                w-full
                items-center
                justify-center
              "
            >
              <motion.img
                src="/images/login/login-1.png"
                alt="A world awaits at BuzzieWorld"
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
                  ease: [0.22, 1, 0.36, 1],
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
          </section>

          {/* ============================================================
              RIGHT SIDE
              ------------------------------------------------------------
              Login form.
          ============================================================ */}

          <section
            aria-label="Login"
            className="
              flex
              w-full
              items-center
              justify-center
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
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                w-full
                max-w-[440px]
              "
            >
              {/* ========================================================
                  LOGIN CARD
              ======================================================== */}

              <div
                className="
                  w-full
                  rounded-[28px]
                  border
                  border-[#eee8dc]
                  bg-white
                  px-5
                  py-7
                  shadow-[0_20px_60px_rgba(45,35,20,0.10)]
                  sm:px-8
                  sm:py-8
                  md:px-9
                  md:py-9
                "
              >
                {/* ======================================================
                    BEE
                ====================================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="flex justify-center"
                >
                  <div
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
                  >
                    🐝
                  </div>
                </motion.div>

                {/* ======================================================
                    HEADING
                ====================================================== */}

                <div className="mt-4 text-center">
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
                    Welcome back!
                  </h1>

                  <p className="mt-1.5 text-sm font-medium text-[#69738a]">
                    Glad to see you again.
                  </p>
                </div>

                {/* ======================================================
                    ERROR MESSAGE
                ====================================================== */}

                {error ? (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    role="alert"
                    className="
                      mt-5
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
                  </motion.div>
                ) : null}

                {/* ======================================================
                    LOGIN FORM
                ====================================================== */}

                <form onSubmit={handleSubmit} className="mt-6" noValidate>
                  {/* ====================================================
                      EMAIL
                  ==================================================== */}

                  <div>
                    <label
                      htmlFor="login-email"
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
                        id="login-email"
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
                          text-[15px]
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
                        "
                      />
                    </div>
                  </div>

                  {/* ====================================================
                      PASSWORD
                  ==================================================== */}

                  <div className="mt-5">
                    <label
                      htmlFor="login-password"
                      className="
                        block
                        text-sm
                        font-bold
                        text-[#202b43]
                      "
                    >
                      Password
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
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
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
                          text-[15px]
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
                        "
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        disabled={isSubmitting}
                        aria-label={showPassword ? "Hide password" : "Show password"}
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
                          <EyeOff className="size-[18px]" strokeWidth={1.8} />
                        ) : (
                          <Eye className="size-[18px]" strokeWidth={1.8} />
                        )}
                      </button>
                    </div>

                    {/* ==================================================
                        FORGOT PASSWORD
                    ================================================== */}

                    <div className="mt-2.5 flex justify-end">
                      <Link
                        href="/forgot-password"
                        className="
                          text-sm
                          font-bold
                          text-[#285bd8]
                          transition
                          hover:text-[#1746b8]
                          hover:underline
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#ff2868]
                          focus-visible:ring-offset-2
                        "
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  {/* ====================================================
                      SIGN IN BUTTON
                  ==================================================== */}

                  <motion.button
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="size-[18px]" strokeWidth={1.9} />
                        Sign In
                      </>
                    )}
                  </motion.button>
                </form>

                {/* ========================================================
                    SOCIAL LOGIN DIVIDER
                ======================================================== */}

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#dfe1e5]" />

                  <span className="shrink-0 text-xs font-medium text-[#788196] sm:text-sm">
                    or continue with
                  </span>

                  <div className="h-px flex-1 bg-[#dfe1e5]" />
                </div>

                {/* ========================================================
                    GOOGLE
                ======================================================== */}

                <button
                  type="button"
                  disabled={isSubmitting}
                  className="
                    flex
                    h-[46px]
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
                     * authentication system is implemented.
                     */
                  }}
                >
                  <span aria-hidden="true" className="text-[18px] font-bold">
                    G
                  </span>

                  <span>Continue with Google</span>
                </button>

                {/* ========================================================
                    REGISTER
                ======================================================== */}

                <div
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
                    <p className="text-sm font-medium text-[#27334c]">New to BuzzieWorld?</p>

                    <Link
                      href="/register"
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
                      "
                    >
                      Create an account
                      <ArrowRight className="size-4" strokeWidth={2.3} />
                    </Link>
                  </div>

                  <div
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
                  >
                    🧸
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
