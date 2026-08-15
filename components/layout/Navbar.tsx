"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { durations, easings } from "@/config/animations";
import { mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useCart } from "@/hooks/useCart";

function isNavigationActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

// function closeMobileMenuIfEscape(event: KeyboardEvent<Document>, onClose: () => void): void {
//   if (event.key === "Escape") {
//     onClose();
//   }
// }

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();
  const { cart } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

const handleKeyDown = (event: globalThis.KeyboardEvent) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
};

    window.addEventListener("keydown", handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

useEffect(() => {
  if (isMobileMenuOpen) {
    window.requestAnimationFrame(() => {
      setIsMobileMenuOpen(false);
    });
  }
}, [pathname, isMobileMenuOpen]);

  const cartItemCount = cart.itemCount ?? 0;
  const isAuthenticated = sessionStatus === "authenticated";

  const accountHref = isAuthenticated ? "/account" : "/login";
  const accountLabel = isAuthenticated ? session?.user?.name || "Account" : "Account";

  const desktopNavigation = mainNavigation.filter(
    (item) => item.label !== "Home" && item.label !== "Contact",
  );

  const mobileNavigation = [
    ...mainNavigation,
    {
      label: "Wishlist",
      href: "/account/wishlist",
    },
    {
      label: "Account",
      href: accountHref,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="border-b border-[rgba(238,221,187,0.62)] bg-[rgba(255,253,249,0.88)] shadow-[0_8px_30px_rgba(39,52,74,0.05)] backdrop-blur-xl">
          <div className="container">
            <div className="flex h-[4.5rem] items-center justify-between gap-3 sm:h-[4.75rem]">
              <Link
                href="/"
                className="group flex shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-none"
                aria-label="BuzzieWorld home"
              >
                <span
                  aria-hidden="true"
                  className="relative flex size-9 items-center justify-center overflow-hidden rounded-[14px] bg-[linear-gradient(145deg,#3F7DFF_0%,#79D45C_100%)] shadow-[0_8px_20px_rgba(63,125,255,0.22)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-3 group-hover:scale-105 sm:size-10"
                >
                  <span className="absolute -right-1 -top-1 size-4 rounded-full bg-[#F8C83B]" />
                  <span className="absolute bottom-1 left-1 size-2 rounded-full bg-white/80" />
                  <span className="relative size-4 rounded-full bg-white shadow-sm" />
                </span>

                <span className="flex flex-col leading-none">
                  <span className="font-[var(--font-roboto)] text-[1.12rem] font-black tracking-[-0.045em] text-[#27344A] sm:text-[1.25rem]">
                    BuzzieWorld
                  </span>

                  <span className="mt-1 hidden text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#687489] sm:block">
                    Learn · Play · Imagine
                  </span>
                </span>
              </Link>

              <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
                {desktopNavigation.map((item) => {
                  const active = isNavigationActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "relative rounded-full px-3.5 py-2 text-[0.84rem] font-semibold transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2",
                        active
                          ? "bg-[#3F7DFF]/10 text-[#2A62D8]"
                          : "text-[#526075] hover:bg-[#FFF8EC] hover:text-[#27344A]",
                      ].join(" ")}
                    >
                      {item.label}

                      {active ? (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#3F7DFF]"
                        />
                      ) : null}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden items-center gap-1.5 sm:flex">
                <Link
                  href="/search"
                  className="flex size-10 items-center justify-center rounded-full text-[#526075] transition-all duration-200 hover:bg-[#FFF8EC] hover:text-[#27344A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                  aria-label="Search products"
                >
                  <Search className="size-[1.1rem]" strokeWidth={2.1} />
                </Link>

                <Link
                  href="/account/wishlist"
                  className={[
                    "relative flex size-10 items-center justify-center rounded-full transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2",
                    pathname.startsWith("/account/wishlist")
                      ? "bg-[#F56B9A]/10 text-[#C44770]"
                      : "text-[#526075] hover:bg-[#FFF8EC] hover:text-[#C44770]",
                  ].join(" ")}
                  aria-label="Wishlist"
                  aria-current={pathname.startsWith("/account/wishlist") ? "page" : undefined}
                >
                  <Heart className="size-[1.1rem]" strokeWidth={2.1} />
                </Link>

                <Link
                  href="/cart"
                  className={[
                    "relative flex size-10 items-center justify-center rounded-full transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2",
                    pathname === "/cart"
                      ? "bg-[#3F7DFF]/10 text-[#2A62D8]"
                      : "text-[#526075] hover:bg-[#FFF8EC] hover:text-[#27344A]",
                  ].join(" ")}
                  aria-label={
                    cartItemCount > 0 ? `Shopping cart, ${cartItemCount} items` : "Shopping cart"
                  }
                  aria-current={pathname === "/cart" ? "page" : undefined}
                >
                  <ShoppingBag className="size-[1.1rem]" strokeWidth={2.1} />

                  {cartItemCount > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#3F7DFF] px-1 text-[0.62rem] font-bold leading-none text-white shadow-[0_4px_10px_rgba(63,125,255,0.24)]"
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  ) : null}
                </Link>

                <Link
                  href={accountHref}
                  className={[
                    "ml-1 inline-flex h-10 max-w-[11rem] items-center gap-2 rounded-full border px-3.5 text-[0.78rem] font-semibold transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2",
                    pathname.startsWith("/account") || pathname === "/login"
                      ? "border-[#3F7DFF]/20 bg-[#3F7DFF]/10 text-[#2A62D8]"
                      : "border-[#EEDDBB] bg-white/70 text-[#526075] hover:border-[#3F7DFF]/20 hover:bg-white hover:text-[#27344A]",
                  ].join(" ")}
                  aria-label={accountLabel}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FFF8EC]">
                    <UserRound className="size-3.5" strokeWidth={2.2} />
                  </span>

                  <span className="truncate">
                    {sessionStatus === "loading" ? "Account" : accountLabel}
                  </span>
                </Link>
              </div>

              <div className="flex items-center gap-1 sm:hidden">
                <Link
                  href="/search"
                  className="flex size-10 items-center justify-center rounded-full text-[#526075] hover:bg-[#FFF8EC] hover:text-[#27344A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                  aria-label="Search products"
                >
                  <Search className="size-[1.12rem]" strokeWidth={2.15} />
                </Link>

                <Link
                  href="/cart"
                  className="relative flex size-10 items-center justify-center rounded-full text-[#526075] hover:bg-[#FFF8EC] hover:text-[#27344A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                  aria-label={
                    cartItemCount > 0 ? `Shopping cart, ${cartItemCount} items` : "Shopping cart"
                  }
                >
                  <ShoppingBag className="size-[1.12rem]" strokeWidth={2.15} />

                  {cartItemCount > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#3F7DFF] px-1 text-[0.62rem] font-bold leading-none text-white shadow-[0_4px_10px_rgba(63,125,255,0.24)]"
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  ) : null}
                </Link>

                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-navigation-drawer"
                  className="flex size-10 items-center justify-center rounded-full bg-[#27344A] text-white shadow-[0_8px_20px_rgba(39,52,74,0.14)] transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                >
                  {isMobileMenuOpen ? (
                    <X className="size-[1.15rem]" strokeWidth={2.2} />
                  ) : (
                    <Menu className="size-[1.15rem]" strokeWidth={2.2} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-[60] bg-[#27344A]/30 backdrop-blur-[3px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: durations.fast,
                ease: easings.smooth,
              }}
              onClick={closeMobileMenu}
            />

            <motion.aside
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,390px)] flex-col overflow-hidden border-l border-[#EEDDBB]/70 bg-[#FFFDF9] shadow-[-20px_0_60px_rgba(39,52,74,0.12)] lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: durations.normal,
                ease: easings.premium,
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[#F8C83B]/14 blur-2xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-16 size-48 rounded-full bg-[#3F7DFF]/10 blur-3xl"
              />

              <div className="relative flex items-center justify-between border-b border-[#EEDDBB]/70 px-5 py-4 sm:px-6">
                <div>
                  <p className="font-[var(--font-roboto)] text-lg font-black tracking-[-0.04em] text-[#27344A]">
                    BuzzieWorld
                  </p>

                  <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#687489]">
                    Explore the kingdom
                  </p>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close navigation menu"
                  className="flex size-10 items-center justify-center rounded-full border border-[#EEDDBB] bg-white text-[#526075] transition-colors hover:bg-[#FFF8EC] hover:text-[#27344A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                >
                  <X className="size-5" strokeWidth={2.1} />
                </button>
              </div>

              <nav className="relative flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="mb-5 rounded-[24px] border border-[#EEDDBB]/70 bg-[linear-gradient(135deg,#FFF8EC_0%,#FFFFFF_100%)] p-4 shadow-[0_10px_28px_rgba(56,40,15,0.05)]">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[13px] bg-[#3F7DFF] text-white"
                    >
                      <ShoppingBag className="size-4" strokeWidth={2.1} />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-[#27344A]">Ready for an adventure?</p>

                      <p className="mt-1 text-xs leading-5 text-[#687489]">
                        Discover playful products made for learning, creating and imagining.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  {mobileNavigation.map((item, index) => {
                    const active = isNavigationActive(pathname, item.href);

                    return (
                      <motion.div
                        key={`${item.href}-${item.label}`}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: durations.fast,
                          delay: index * 0.035,
                          ease: easings.premium,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          aria-current={active ? "page" : undefined}
                          className={[
                            "flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold transition-all duration-200",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2",
                            active
                              ? "bg-[#3F7DFF]/10 text-[#2A62D8]"
                              : "text-[#526075] hover:bg-white hover:text-[#27344A]",
                          ].join(" ")}
                        >
                          <span>{item.label}</span>

                          {active ? (
                            <span aria-hidden="true" className="size-2 rounded-full bg-[#3F7DFF]" />
                          ) : null}
                        </Link>
                      </motion.div>
                    );
                  })}

                  <motion.div
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: durations.fast,
                      delay: mobileNavigation.length * 0.035,
                      ease: easings.premium,
                    }}
                  >
                    <Link
                      href="/search"
                      onClick={closeMobileMenu}
                      className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold text-[#526075] transition-colors hover:bg-white hover:text-[#27344A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                    >
                      <span>Search</span>
                      <Search className="size-4" strokeWidth={2.1} />
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: durations.fast,
                      delay: (mobileNavigation.length + 1) * 0.035,
                      ease: easings.premium,
                    }}
                  >
                    <Link
                      href="/cart"
                      onClick={closeMobileMenu}
                      className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold text-[#526075] transition-colors hover:bg-white hover:text-[#27344A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                    >
                      <span>Cart</span>

                      <span className="flex items-center gap-2">
                        {cartItemCount > 0 ? (
                          <span className="rounded-full bg-[#3F7DFF] px-2 py-0.5 text-[0.63rem] font-bold text-white">
                            {cartItemCount > 99 ? "99+" : cartItemCount}
                          </span>
                        ) : null}

                        <ShoppingBag className="size-4" strokeWidth={2.1} />
                      </span>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: durations.fast,
                      delay: (mobileNavigation.length + 2) * 0.035,
                      ease: easings.premium,
                    }}
                  >
                    <Link
                      href="/account/wishlist"
                      onClick={closeMobileMenu}
                      className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold text-[#526075] transition-colors hover:bg-white hover:text-[#C44770] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                    >
                      <span>Wishlist</span>
                      <Heart className="size-4" strokeWidth={2.1} />
                    </Link>
                  </motion.div>
                </div>
              </nav>

              <div className="relative border-t border-[#EEDDBB]/70 p-5 sm:p-6">
                <Link
                  href={accountHref}
                  onClick={closeMobileMenu}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#27344A] px-4 text-sm font-bold text-white shadow-[0_12px_26px_rgba(39,52,74,0.16)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                >
                  <UserRound className="size-4" strokeWidth={2.1} />
                  <span>{isAuthenticated ? "My Account" : "Sign In"}</span>
                </Link>

                <p className="mt-3 text-center text-[0.7rem] leading-5 text-[#687489]">
                  {siteConfig.description}
                </p>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
