"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

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
       * Backend-ready login request.
       *
       * Expected payload:
       * {
       *   email: string;
       *   password: string;
       * }
       *
       * Change LOGIN_ENDPOINT only if your eventual auth API
       * uses a different route.
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

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "We couldn't sign you in. Please check your details and try again.",
        );
      }

      /*
       * Backend integration point.
       *
       * If your API returns a redirect URL:
       *
       * if (data?.redirectUrl) {
       *   window.location.href = data.redirectUrl;
       *   return;
       * }
       *
       * If you use NextAuth/Clerk/custom session handling,
       * replace this section with that authentication flow.
       */

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      /*
       * Default successful login destination.
       *
       * Change this when your actual authentication flow
       * establishes the session.
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
      <div
        className="grid
      min-h-[calc(100svh-4.7rem)]
      w-full
      lg:min-h-[calc(100svh-5rem)]
      lg:grid-cols-2"
      >
        {/* ============================================================
            LEFT ADVENTURE PANEL
        ============================================================ */}

        <section
          aria-label="Welcome to BuzzieWorld"
          className="
            relative
        min-h-[420px]
        overflow-hidden
        bg-[#061b48]
        bg-[url('/images/login/login-left-background.jpg')]
        bg-cover
        bg-center
        bg-no-repeat
        sm:min-h-[520px]
        lg:min-h-0
          "
        >
          {/* Subtle overlay only to protect the artwork from accidental
              rendering differences. The supplied artwork remains dominant. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/[0.02]"
          />

          {/* Mobile-only readable intro.
              Desktop artwork already contains the complete text. */}
          <div
            className="
              relative
              z-10
              flex
              min-h-[420px]
              items-end
              px-6
              pb-8
              sm:min-h-[520px]
              sm:px-10
              sm:pb-10
              lg:hidden
            "
          >
            <div className="max-w-md rounded-3xl bg-[#061b48]/35 p-5 text-white backdrop-blur-[2px]">
              <p className="text-sm font-semibold tracking-wide text-white/80">
                Play · Learn · Grow
              </p>

              <h1 className="mt-2 text-3xl font-black leading-tight">
                Welcome back to
                <span className="block text-[#ffc83d]">the adventure.</span>
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/90">
                Sign in to continue exploring magical toys, games and experiences crafted for little
                imaginations.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            RIGHT LOGIN PANEL
        ============================================================ */}

        <section
          aria-label="Login"
          className="
            relative
        flex
        min-h-[700px]
        items-center
        justify-center
        overflow-hidden
        bg-[#fff9ed]
        bg-[url('/images/login/login-right-background.jpg')]
        bg-cover
        bg-center
        bg-no-repeat
        px-4
        py-10
        sm:px-6
        sm:py-12
        lg:min-h-0
        lg:px-10
        xl:px-16
          "
        >
          {/* ==========================================================
              BACKGROUND DEPTH
          ========================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-b
              from-white/[0.06]
              via-transparent
              to-[#fff4d8]/10
            "
          />

          {/* ==========================================================
              LOGIN CARD
          ========================================================== */}

          <div
            className="
              relative
              z-10
              w-full
              max-w-[530px]
              rounded-[32px]
              border
              border-white/90
              bg-white/[0.93]
              px-6
              py-8
              shadow-[0_24px_70px_rgba(52,42,19,0.13)]
              backdrop-blur-[8px]
              sm:px-10
              sm:py-10
              md:px-12
              md:py-11
            "
          >
            {/* ========================================================
                BEE ICON
            ======================================================== */}

            <div className="flex justify-center">
              <div
                className="
                  flex
                  size-[58px]
                  items-center
                  justify-center
                  rounded-[18px]
                  bg-[#fff5dc]
                  text-[30px]
                  shadow-[0_6px_18px_rgba(231,190,87,0.14)]
                "
                aria-hidden="true"
              >
                🐝
              </div>
            </div>

            {/* ========================================================
                HEADING
            ======================================================== */}

            <div className="mt-5 text-center">
              <h2
                className="
                  font-[var(--font-roboto)]
                  text-[2rem]
                  font-black
                  tracking-[-0.045em]
                  text-[#14244b]
                  sm:text-[2.25rem]
                "
              >
                Welcome back!
              </h2>

              <p className="mt-2 text-[15px] font-medium text-[#69738a]">Glad to see you again.</p>
            </div>

            {/* ========================================================
                ERROR
            ======================================================== */}

            {error ? (
              <div
                role="alert"
                className="
                  mt-6
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
            ) : null}

            {/* ========================================================
                LOGIN FORM
            ======================================================== */}

            <form onSubmit={handleSubmit} className="mt-8" noValidate>
              {/* ======================================================
                  EMAIL
              ====================================================== */}

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

                <div className="relative mt-2.5">
                  <Mail
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      size-[19px]
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
                      if (error) setError("");
                    }}
                    disabled={isSubmitting}
                    className="
                      h-[52px]
                      w-full
                      rounded-[15px]
                      border
                      border-[#d9dce3]
                      bg-white/80
                      pl-12
                      pr-4
                      text-[15px]
                      font-medium
                      text-[#1c2947]
                      outline-none
                      placeholder:text-[#929aaa]
                      transition
                      focus:border-[#3f6ff5]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#3f6ff5]/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />
                </div>
              </div>

              {/* ======================================================
                  PASSWORD
              ====================================================== */}

              <div className="mt-6">
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

                <div className="relative mt-2.5">
                  <LockKeyhole
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      size-[19px]
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
                      if (error) setError("");
                    }}
                    disabled={isSubmitting}
                    className="
                      h-[52px]
                      w-full
                      rounded-[15px]
                      border
                      border-[#d9dce3]
                      bg-white/80
                      pl-12
                      pr-12
                      text-[15px]
                      font-medium
                      text-[#1c2947]
                      outline-none
                      placeholder:text-[#929aaa]
                      transition
                      focus:border-[#3f6ff5]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#3f6ff5]/10
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
                      right-3
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
                      focus-visible:ring-[#3f6ff5]
                      disabled:pointer-events-none
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="size-[19px]" strokeWidth={1.8} />
                    ) : (
                      <Eye className="size-[19px]" strokeWidth={1.8} />
                    )}
                  </button>
                </div>

                {/* ====================================================
                    FORGOT PASSWORD
                ==================================================== */}

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
                      focus-visible:ring-[#3f6ff5]
                      focus-visible:ring-offset-2
                    "
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* ======================================================
                  SIGN IN
              ====================================================== */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-5
                  flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[15px]
                  bg-[#285be0]
                  px-5
                  text-[15px]
                  font-bold
                  text-white
                  shadow-[0_10px_22px_rgba(40,91,224,0.22)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#2252cf]
                  hover:shadow-[0_13px_26px_rgba(40,91,224,0.28)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  disabled:hover:translate-y-0
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
              </button>
            </form>

            {/* ========================================================
                SOCIAL DIVIDER
            ======================================================== */}

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#dfe1e5]" />

              <span className="shrink-0 text-sm font-medium text-[#788196]">or continue with</span>

              <div className="h-px flex-1 bg-[#dfe1e5]" />
            </div>

            {/* ========================================================
                SOCIAL LOGIN
            ======================================================== */}

            <div className="grid grid-cols-1 gap-2.5">
              {/* GOOGLE */}

              <button
                type="button"
                disabled={isSubmitting}
                className="
                  flex
                  h-[46px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[14px]
                  border
                  border-[#d9dce3]
                  bg-white
                  px-2
                  text-sm
                  font-semibold
                  text-[#20283a]
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#c8ccd5]
                  hover:shadow-sm
                  disabled:pointer-events-none
                  disabled:opacity-60
                "
                onClick={() => {
                  // Connect Google OAuth here.
                }}
              >
                <span aria-hidden="true" className="text-[18px] font-bold">
                  G
                </span>

                <span className="hidden sm:inline">Google</span>
              </button>

              {/* FACEBOOK */}

              {/* <button
                type="button"
                disabled={isSubmitting}
                className="
                  flex
                  h-[46px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[14px]
                  border
                  border-[#d9dce3]
                  bg-white
                  px-2
                  text-sm
                  font-semibold
                  text-[#20283a]
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#c8ccd5]
                  hover:shadow-sm
                  disabled:pointer-events-none
                  disabled:opacity-60
                "
                onClick={() => {
                  // Connect Facebook OAuth here.
                }}
              >
                <span
                  aria-hidden="true"
                  className="
                    flex
                    size-[18px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#1877f2]
                    text-xs
                    font-black
                    text-white
                  "
                >
                  f
                </span>

                <span className="hidden sm:inline">Facebook</span>
              </button> */}

              {/* APPLE */}

              {/* <button
                type="button"
                disabled={isSubmitting}
                className="
                  flex
                  h-[46px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[14px]
                  border
                  border-[#d9dce3]
                  bg-white
                  px-2
                  text-sm
                  font-semibold
                  text-[#20283a]
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#c8ccd5]
                  hover:shadow-sm
                  disabled:pointer-events-none
                  disabled:opacity-60
                "
                onClick={() => {
                  // Connect Apple OAuth here.
                }}
              >
                <span aria-hidden="true" className="text-[18px] leading-none text-black">
                  
                </span>

                <span className="hidden sm:inline">Apple</span>
              </button> */}
            </div>

            {/* ========================================================
                CREATE ACCOUNT
            ======================================================== */}

            <div
              className="
                mt-7
                flex
                min-h-[88px]
                items-center
                justify-between
                gap-4
                rounded-[17px]
                bg-[#fff6e5]
                px-5
                py-4
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
                    text-[15px]
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

              {/* Small decorative character substitute.
                  This intentionally stays lightweight because the
                  surrounding login-right-background already contains
                  the page's decorative artwork. */}
              <div
                aria-hidden="true"
                className="
                  hidden
                  size-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#ffe4b2]
                  text-[29px]
                  sm:flex
                "
              >
                🧸
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
