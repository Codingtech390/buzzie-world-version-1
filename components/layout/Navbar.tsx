"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Ban,
  ChevronDown,
  FileText,
  Gamepad2,
  Heart,
  Info,
  Mail,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { durations, easings } from "@/config/animations";
import { siteConfig } from "@/config/site";
import { useCart } from "@/hooks/useCart";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type StorefrontCategory = {
  _id: string;
  name: string;
  slug: string;
};

type NavigationItem = {
  label: string;
  href: string;
  exact?: boolean;
  dropdown?: boolean;
};

/* -------------------------------------------------------------------------- */
/* THEME                                                                      */
/* -------------------------------------------------------------------------- */

const NAV_THEME = {
  crimson: "#E72D5A",
  crimsonDark: "#D5224E",
  crimsonSoft: "#FFF0F3",
  crimsonPale: "#FFF7F8",

  text: "#263451",
  textMuted: "#657086",
  textSoft: "#7B8495",

  surface: "#FFFDF9",
  surfaceWhite: "#FFFFFF",

  border: "#EDE2D6",
  borderStrong: "#E5D5C7",

  cream: "#FFF8EE",
  creamHover: "#FFF2E3",

  purple: "#6F32F5",
} as const;

/* -------------------------------------------------------------------------- */
/* NAVIGATION                                                                 */
/* -------------------------------------------------------------------------- */

const desktopNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    exact: true,
  },
  {
    label: "All Products",
    href: "/shop",
  },
  {
    label: "Categories",
    href: "/categories",
    dropdown: true,
  },
  {
    label: "How to Play / FAQ",
    href: "/faq",
  },
  {
    label: "Crazy Deals",
    href: "/crazy-deals",
  },
  {
    label: "Return Gifts",
    href: "/return-gifts",
  },
  {
    label: "Contact Us & Policies",
    href: "/contact",
    dropdown: true,
  },
];

const mobileNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    exact: true,
  },
  {
    label: "All Products",
    href: "/shop",
  },
  {
    label: "Categories",
    href: "/categories",
    dropdown: true,
  },
  {
    label: "How to Play / FAQ",
    href: "/faq",
  },
  {
    label: "Crazy Deals",
    href: "/crazy-deals",
  },
  {
    label: "Return Gifts",
    href: "/return-gifts",
  },
  {
    label: "Contact Us & Policies",
    href: "/contact",
    dropdown: true,
  },
];

const categoryNavigation = [
  {
    label: "Binder",
    slug: "binder",
  },
  {
    label: "Mythology",
    slug: "mythology",
  },
  {
    label: "Mind Games",
    slug: "mind-games",
  },
  {
    label: "On-the-Go Games",
    slug: "on-the-go-games",
  },
  {
    label: "Phonics",
    slug: "phonics",
  },
  {
    label: "Card Games",
    slug: "card-games",
  },
  {
    label: "Geography",
    slug: "geography",
  },
  {
    label: "Return Gifts",
    slug: "return-gifts",
  },
  {
    label: "Customized Products",
    slug: "customized-products",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* CONTACT / POLICY NAVIGATION                                                */
/* -------------------------------------------------------------------------- */

const contactNavigation = [
  {
    label: "About Us",
    href: "/about",
    description: "Our story & what we do",
  },
  {
    label: "Contact Us",
    href: "/contact",
    description: "We're here to help",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
    description: "How we handle your information",
  },
  {
    label: "Terms of Service",
    href: "/terms",
    description: "Rules for using BuzzieWorld",
  },
  {
    label: "Shipping Policy",
    href: "/shipping-policy",
    description: "Delivery information & timelines",
  },
  {
    label: "Returns & Refunds",
    href: "/returns-refunds",
    description: "Returns, exchanges & refunds",
  },
  {
    label: "Cancellation Policy",
    href: "/cancellation-policy",
    description: "Order cancellation information",
  },
  {
    label: "Disclaimer",
    href: "/disclaimer",
    description: "Important website information",
  },
] as const;

function getContactNavigationIcon(href: string) {
  switch (href) {
    case "/about":
      return Gamepad2;
    case "/contact":
      return Mail;
    case "/privacy-policy":
      return ShieldCheck;
    case "/terms":
      return FileText;
    case "/shipping-policy":
      return Truck;
    case "/returns-refunds":
      return RotateCcw;
    case "/cancellation-policy":
      return Ban;
    case "/disclaimer":
      return AlertTriangle;
    default:
      return Info;
  }
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function isNavigationActive(
  pathname: string,
  href: string,
  exact = false,
): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href.includes("#")) {
    return false;
  }

  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function normalizeCategoryValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  const pathname = usePathname();

  const { data: session, status: sessionStatus } = useSession();

  const { cart } = useCart();

  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [categoryLinks, setCategoryLinks] = useState<StorefrontCategory[]>([]);

  /* ------------------------------------------------------------------------ */
  /* REFS                                                                     */
  /* ------------------------------------------------------------------------ */

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const contactMenuRef = useRef<HTMLDivElement>(null);

  const categoryCloseTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const contactCloseTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ------------------------------------------------------------------------ */
  /* MOBILE MENU                                                              */
  /* ------------------------------------------------------------------------ */

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
    setIsContactMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    const originalOverflow = document.body.style.overflow;

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  /* ------------------------------------------------------------------------ */
  /* ROUTE CHANGE                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCategoryMenuOpen(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsContactMenuOpen(false);
  }, [pathname]);

  /* ------------------------------------------------------------------------ */
  /* LOAD CATEGORIES                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", {
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          success?: boolean;
          categories?: StorefrontCategory[];
        };

        if (data.success && Array.isArray(data.categories)) {
          setCategoryLinks(data.categories);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Navbar category loading failed:", error);
      }
    }

    loadCategories();

    return () => {
      controller.abort();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* DESKTOP DROPDOWNS                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isCategoryMenuOpen && !isContactMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const clickedCategoryMenu =
        categoryMenuRef.current?.contains(target) ?? false;

      const clickedContactMenu =
        contactMenuRef.current?.contains(target) ?? false;

      if (clickedCategoryMenu || clickedContactMenu) {
        return;
      }

      setIsCategoryMenuOpen(false);
      setIsContactMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCategoryMenuOpen(false);
        setIsContactMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCategoryMenuOpen, isContactMenuOpen]);

  /* ------------------------------------------------------------------------ */
  /* CATEGORY URL RESOLUTION                                                  */
  /* ------------------------------------------------------------------------ */

  /*
   * Keep the existing backend-driven category URL behavior.
   *
   * The dropdown presentation does NOT change how category URLs are built.
   */
  const getCategoryHref = useCallback(
    (slug: string) => {
      const requestedSlug = normalizeCategoryValue(slug);

      const category = categoryLinks.find(
        (item) =>
          normalizeCategoryValue(item.slug) === requestedSlug ||
          normalizeCategoryValue(item.name) === requestedSlug,
      );

      if (!category?._id) {
        return "/categories";
      }

      return `/shop?category=${encodeURIComponent(category._id)}`;
    },
    [categoryLinks],
  );

  /* ------------------------------------------------------------------------ */
  /* ACCOUNT / CART                                                           */
  /* ------------------------------------------------------------------------ */

  const cartItemCount = cart.itemCount ?? 0;

  const isAuthenticated = sessionStatus === "authenticated";

  const accountHref = isAuthenticated ? "/account" : "/login";

  const accountLabel = isAuthenticated
    ? session?.user?.name || "Account"
    : "Account";

  const isAccountArea =
    pathname.startsWith("/account") || pathname === "/login";

  /* ------------------------------------------------------------------------ */
  /* ACTIVE STATES                                                            */
  /* ------------------------------------------------------------------------ */

  const isCategoriesArea =
    pathname.startsWith("/categories") || pathname.startsWith("/shop");

  const isContactArea =
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/shipping-policy") ||
    pathname.startsWith("/returns-refunds") ||
    pathname.startsWith("/cancellation-policy") ||
    pathname.startsWith("/disclaimer");

  /* ------------------------------------------------------------------------ */
  /* DROPDOWN TOGGLES                                                         */
  /* ------------------------------------------------------------------------ */

  const toggleCategoryMenu = useCallback(() => {
    setIsCategoryMenuOpen((current) => !current);
    setIsContactMenuOpen(false);
  }, []);

  const toggleContactMenu = useCallback(() => {
    setIsContactMenuOpen((current) => !current);
    setIsCategoryMenuOpen(false);
  }, []);

  const openCategoryMenuOnHover = useCallback(() => {
    if (categoryCloseTimerRef.current) {
      clearTimeout(categoryCloseTimerRef.current);
      categoryCloseTimerRef.current = null;
    }

    setIsCategoryMenuOpen(true);
    setIsContactMenuOpen(false);
  }, []);

  const closeCategoryMenuOnHover = useCallback(() => {
    if (categoryCloseTimerRef.current) {
      clearTimeout(categoryCloseTimerRef.current);
    }

    categoryCloseTimerRef.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
      categoryCloseTimerRef.current = null;
    }, 180);
  }, []);

  const openContactMenuOnHover = useCallback(() => {
    if (contactCloseTimerRef.current) {
      clearTimeout(contactCloseTimerRef.current);
      contactCloseTimerRef.current = null;
    }

    setIsContactMenuOpen(true);
    setIsCategoryMenuOpen(false);
  }, []);

  const closeContactMenuOnHover = useCallback(() => {
    if (contactCloseTimerRef.current) {
      clearTimeout(contactCloseTimerRef.current);
    }

    contactCloseTimerRef.current = setTimeout(() => {
      setIsContactMenuOpen(false);
      contactCloseTimerRef.current = null;
    }, 180);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* DESKTOP NAV ITEM                                                         */
  /* ------------------------------------------------------------------------ */

  const renderDesktopNavigationItem = (item: NavigationItem) => {
    const isCategories = item.label === "Categories";
    const isContactPolicies = item.label === "Contact Us & Policies";

    const active = isCategories
      ? pathname.startsWith("/categories") || isCategoryMenuOpen
      : isContactPolicies
        ? isContactArea || isContactMenuOpen
        : isNavigationActive(pathname, item.href, item.exact);

    /* ---------------------------------------------------------------------- */
    /* CATEGORIES DROPDOWN                                                    */
    /* ---------------------------------------------------------------------- */

    if (isCategories) {
      return (
        <div
          key={item.label}
          ref={categoryMenuRef}
          className="relative flex shrink-0 items-center"
          onMouseEnter={openCategoryMenuOnHover}
          onMouseLeave={closeCategoryMenuOnHover}
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isCategoryMenuOpen}
            onClick={toggleCategoryMenu}
            className={[
              "group relative flex h-10 shrink-0 items-center gap-2 rounded-full px-4 font-[var(--font-poppins-brand)] !text-[14px] font-bold leading-none tracking-[-0.01em] whitespace-nowrap outline-none transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-2",
              active
                ? "bg-[#FFF0F3] !text-[#263451] shadow-[inset_0_0_0_1px_rgba(231,45,90,0.08)]"
                : "text-[#657086] hover:bg-[#FFF8EE] hover:text-[#263451]",
            ].join(" ")}
          >
            <span className="font-[var(--font-poppins-brand)] font-bold">Categories</span>

            <ChevronDown
              aria-hidden="true"
              className={[
                "size-3.5 shrink-0 opacity-60 transition-transform duration-200",
                isCategoryMenuOpen ? "rotate-180" : "",
              ].join(" ")}
              strokeWidth={2.2}
            />

            {active ? (
              <span
                aria-hidden="true"
                className="absolute bottom-[1px] left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-[#E72D5A]"
              />
            ) : null}
          </button>

          {/* ================================================================ */}
          {/* CATEGORY DROPDOWN — EARLIER TEXT + KID-PEEKING DESIGN             */}
          {/* ================================================================ */}

          <AnimatePresence>
            {isCategoryMenuOpen ? (
              <motion.div
                role="menu"
                aria-label="Shop by category"
                initial={{
                  opacity: 0,
                  y: 7,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 7,
                  scale: 0.98,
                }}
                transition={{
                  duration: durations.fast,
                  ease: easings.smooth,
                }}
                className="
              absolute
              left-1/2
              top-[calc(100%+12px)]
              z-[80]
              w-[min(94vw,620px)]
              -translate-x-1/2
              overflow-hidden
              rounded-[22px]
              border
              border-[#EDE2D6]
              bg-[#FFFDF9]/98
              p-6 sm:p-7
              shadow-[0_24px_70px_rgba(42,35,28,0.15)]
              backdrop-blur-xl
            "
              >
                {/* ========================================================== */}
                {/* TOP ACCENT                                                  */}
                {/* ========================================================== */}

                <div
                  aria-hidden="true"
                  className="
                pointer-events-none
                absolute
                left-10
                right-10
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[#E72D5A]/35
                to-transparent
              "
                />

                {/* ========================================================== */}
                {/* KID PEEKING                                                 */}
                {/* ========================================================== */}

                <div
                  aria-hidden="true"
                  className="
                pointer-events-none
                absolute
                bottom-1
                right-3
                z-20
                w-[68px]
                sm:w-[76px]
              "
                >
                  <Image
                    src="/images/hero/kid-peeking.png"
                    alt=""
                    width={220}
                    height={300}
                    sizes="76px"
                    className="
                  h-auto
                  w-full
                  object-contain
                "
                  />
                </div>

                {/* ========================================================== */}
                {/* DROPDOWN HEADING                                             */}
                {/* ========================================================== */}

                <div
                  className="
                relative
                z-10
                mb-6
                px-2
                pt-1
                pr-4
              "
                >
                  <p
                    className="
                  font-[var(--font-poppins-brand)]
                  text-[12px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-[#E72D5A]
                "
                  >
                    Explore
                  </p>

                  <p
                    className="
                  mt-1.5
                  font-[var(--font-poppins-brand)]
                  text-[21px]
                  font-bold
                  leading-none
                  text-[#263451]
                "
                  >
                    Shop by category
                  </p>
                </div>

                {/* ========================================================== */}
                {/* CATEGORY LINKS                                               */}
                {/* ========================================================== */}

                <div
                  className="
                relative
                z-10
                grid
                grid-cols-2
                gap-x-4
                gap-y-2.5
                pr-2
                sm:grid-cols-3
              "
                >
                  {categoryNavigation.map((category) => {
                    const href = getCategoryHref(category.slug);

                    const activeLink =
                      pathname === href ||
                      categoryLinks.some(
                        (item) =>
                          normalizeCategoryValue(item.slug) ===
                            normalizeCategoryValue(category.slug) &&
                          pathname === getCategoryHref(item.slug),
                      );

                    return (
                      <Link
                        key={category.slug}
                        href={href}
                        role="menuitem"
                        onClick={() => {
                          setIsCategoryMenuOpen(false);
                        }}
                        className={[
                          `
                        group
                        flex
                        min-h-[46px]
                        items-center
                        gap-2.5
                        rounded-xl
                        px-4
                        py-2.5
                        font-[var(--font-poppins-brand)]
                        text-[13px]
                        font-semibold
                        leading-tight
                        outline-none
                        transition-all
                        duration-200
                      `,
                          "focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-inset",
                          activeLink
                            ? "bg-[#FFF0F3] text-[#E72D5A]"
                            : "text-[#263451] hover:bg-[#FFF8EE] hover:text-[#E72D5A]",
                        ].join(" ")}
                      >
                        <span
                          aria-hidden="true"
                          className="
                        size-1.5
                        shrink-0
                        rounded-full
                        bg-[#E72D5A]/30
                        transition-all
                        duration-200
                        group-hover:scale-125
                        group-hover:bg-[#E72D5A]
                      "
                        />

                        <span className="font-[var(--font-poppins-brand)]">{category.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* ========================================================== */}
                {/* VIEW ALL                                                     */}
                {/* ========================================================== */}

                <div
                  className="
                relative
                z-10
                mt-6
                border-t
                border-[#EDE2D6]/80
                pt-5
                pr-2
              "
                >
                  <Link
                    href="/categories"
                    onClick={() => setIsCategoryMenuOpen(false)}
                    className="
                  group
                  flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-4
                  py-2.5
                  font-[var(--font-poppins-brand)]
                  text-[12px]
                  font-bold
                  leading-none
                  text-[#657086]
                  outline-none
                  transition-all
                  duration-200
                  hover:bg-[#E72D5A]
                  hover:text-white
                  focus-visible:ring-2
                  focus-visible:ring-[#E72D5A]
                "
                  >
                    <span className="font-[var(--font-poppins-brand)]">View all categories</span>

                    <span
                      aria-hidden="true"
                      className="
                    h-px
                    w-4
                    bg-current
                    transition-all
                    duration-200
                    group-hover:w-6
                  "
                    />
                  </Link>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      );
    }

    /* ---------------------------------------------------------------------- */
    /* CONTACT / POLICIES DROPDOWN                                            */
    /* ---------------------------------------------------------------------- */

    if (isContactPolicies) {
      return (
        <div
          key={item.label}
          ref={contactMenuRef}
          className="relative flex shrink-0 items-center"
          onMouseEnter={openContactMenuOnHover}
          onMouseLeave={closeContactMenuOnHover}
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isContactMenuOpen}
            onClick={toggleContactMenu}
            className={[
              "group relative flex h-10 shrink-0 items-center gap-1 rounded-full px-3 font-[var(--font-poppins-brand)] !text-[14px] font-bold leading-none tracking-[-0.01em] whitespace-nowrap outline-none transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-2",
              active
                ? "bg-[#FFF0F3] !text-[#263451] shadow-[inset_0_0_0_1px_rgba(231,45,90,0.08)]"
                : "text-[#657086] hover:bg-[#FFF8EE] hover:text-[#263451]",
            ].join(" ")}
          >
            <span className="font-[var(--font-poppins-brand)] font-bold">
              Contact Us & Policies
            </span>

            <ChevronDown
              aria-hidden="true"
              className={[
                "size-3.5 shrink-0 opacity-60 transition-transform duration-200",
                isContactMenuOpen ? "rotate-180" : "",
              ].join(" ")}
              strokeWidth={2.2}
            />

            {active ? (
              <span
                aria-hidden="true"
                className="absolute bottom-[1px] left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-[#E72D5A]"
              />
            ) : null}
          </button>

          {/* ================================================================ */}
          {/* CONTACT DROPDOWN                                                  */}
          {/* ================================================================ */}

          <AnimatePresence>
            {isContactMenuOpen ? (
              <motion.div
                role="menu"
                aria-label="Contact and policies"
                initial={{
                  opacity: 0,
                  y: 7,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 7,
                  scale: 0.98,
                }}
                transition={{
                  duration: durations.fast,
                  ease: easings.smooth,
                }}
                className="

                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-[80]
                  w-[min(92vw,310px)]
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#EDE2D6]
                  bg-[#FFFDF9]/98
                  p-3
                  shadow-[0_24px_70px_rgba(42,35,28,0.15)]
                  backdrop-blur-xl
                "
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-[#E72D5A]/35 to-transparent"
                />

                <div className="px-3 pb-2 pt-1">
                  <p className="font-[var(--font-poppins-brand)] text-[16px] font-black uppercase tracking-[0.16em] text-[#E72D5A]">
                    BuzzieWorld
                  </p>

                  <p className="mt-1 font-[var(--font-poppins-brand)] text-[20px] font-bold text-[#263451]">
                    We'd love to hear from you
                  </p>
                </div>

                <div className="space-y-1">
                  {contactNavigation.map((contactItem) => {
                    const activeLink = isNavigationActive(pathname, contactItem.href);

                    return (
                      <Link
                        key={contactItem.href}
                        href={contactItem.href}
                        role="menuitem"
                        onClick={() => {
                          setIsContactMenuOpen(false);
                        }}
                        className={[
                          "group flex min-h-[58px] items-center gap-3 rounded-xl px-3.5 outline-none transition-all duration-200",
                          "focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-inset",
                          activeLink ? "bg-[#FFF0F3]" : "hover:bg-[#FFF8EE]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                            activeLink
                              ? "bg-[#E72D5A] text-white"
                              : "bg-[#FFF0F3] text-[#E72D5A] group-hover:bg-[#E72D5A] group-hover:text-white",
                          ].join(" ")}
                        >
                          {(() => {
                            const Icon = getContactNavigationIcon(contactItem.href);

                            return <Icon className="size-4" strokeWidth={2} />;
                          })()}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={[
                              "block font-[var(--font-poppins-brand)] text-[14px] font-bold leading-none",
                              activeLink ? "text-[#E72D5A]" : "text-[#263451]",
                            ].join(" ")}
                          >
                            {contactItem.label}
                          </span>

                          <span className="mt-1 block font-[var(--font-poppins-brand)] text-[16px] font-medium leading-none text-[#7B8495]">
                            {contactItem.description}
                          </span>
                        </span>

                        <span
                          aria-hidden="true"
                          className={[
                            "size-1.5 rounded-full transition-all duration-200",
                            activeLink ? "bg-[#E72D5A]" : "bg-transparent group-hover:bg-[#E72D5A]",
                          ].join(" ")}
                        />
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      );
    }

    /* ---------------------------------------------------------------------- */
    /* STANDARD DESKTOP LINK                                                  */
    /* ---------------------------------------------------------------------- */

    return (
      <Link
        key={item.href + item.label}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={[
          "group relative flex h-10 shrink-0 items-center rounded-full px-3 font-[var(--font-poppins-brand)] !text-[14px] font-bold leading-none tracking-[-0.01em] whitespace-nowrap outline-none transition-all duration-200",
          "focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-2",
          active
            ? "bg-[#FFF0F3] !text-[#263451] shadow-[inset_0_0_0_1px_rgba(231,45,90,0.08)]"
            : item.label === "Crazy Deals"
              ? "text-[#E72D5A] hover:bg-[#FFF0F3] hover:text-[#D5224E]"
              : "text-[#657086] hover:bg-[#FFF8EE] hover:text-[#263451]",
        ].join(" ")}
      >
        <span className="font-[var(--font-poppins-brand)] font-bold">{item.label}</span>

        {active ? (
          <span
            aria-hidden="true"
            className="absolute bottom-[1px] left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-[#E72D5A]"
          />
        ) : null}

        {item.label === "Crazy Deals" ? (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 size-1.5 rounded-full bg-[#E72D5A]"
          />
        ) : null}
      </Link>
    );
  };;;

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div
          className="
            relative
            border-b
            border-[#EDE2D6]/90
            bg-[#a092cd]
            shadow-[0_8px_30px_rgba(42,35,28,0.055)]
            backdrop-blur-xl
          "
        >
          {/* Crimson bottom accent */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[#E72D5A]/35
              to-transparent
            "
          />

          <div className="container">
            <div
              className="
                flex
                min-h-[4.65rem]
                items-center
                gap-2
                sm:min-h-[5rem]
                sm:gap-3
                lg:gap-4
                xl:gap-5
              "
            >
              {/* ============================================================ */}
              {/* LOGO                                                          */}
              {/* ============================================================ */}

              <Link
                href="/"
                aria-label="BuzzieWorld home"
                className="
                  group
                  relative
                  flex
                  shrink-0
                  items-center
                  rounded-2xl
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E72D5A]
                  focus-visible:ring-offset-4
                "
              >
                <Image
                  src="/images/hero/buzzie-logo.png"
                  alt="BuzzieWorld"
                  width={190}
                  height={58}
                  priority
                  className="
                    h-auto
                    w-[90px]
                    object-contain
                    transition-transform
                    duration-300
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover:-translate-y-0.5
                    sm:w-[104px]
                    md:w-[116px]
                    lg:w-[124px]
                    xl:w-[132px]
                  "
                />
              </Link>

              {/* ============================================================ */}
              {/* DESKTOP NAVIGATION                                            */}
              {/* ============================================================ */}

              <nav
                className="
                  hidden
                  min-w-0
                  flex-1
                  items-center
                  justify-center
                  lg:flex
                "
                aria-label="Main navigation"
              >
                {/* ONE DESKTOP PILL: NAVIGATION + ACTIONS */}

                <div
                  className="
                    flex
                    min-w-0
                    max-w-full
                    items-center
                    justify-center
                    gap-1
                    rounded-full
                    border
                    border-[#EDE2D6]/80
                    bg-white/75
                    p-1.5
                    shadow-[0_4px_18px_rgba(42,35,28,0.035)]
                    backdrop-blur-md
                  "
                >
                  {/* NAVIGATION */}

                  <div className="flex min-w-0 items-center justify-center gap-0.5">
                    {desktopNavigation.map(renderDesktopNavigationItem)}
                  </div>

                  {/* DESKTOP ACTIONS */}

                  <div
                    className="
                      ml-2
                      flex
                      shrink-0
                      items-center
                      gap-1
                      border-l
                      border-[#EDE2D6]/80
                      pl-2
                    "
                  >
                    {/* SEARCH */}

                    <Link
                      href="/search"
                      aria-label="Search products"
                      className="
                        group
                        flex
                        size-10
                        items-center
                        justify-center
                        rounded-full
                        text-[#657086]
                        outline-none
                        transition-all
                        duration-200
                        hover:bg-[#FFF8EE]
                        hover:text-[#263451]
                        focus-visible:ring-2
                        focus-visible:ring-[#E72D5A]
                        focus-visible:ring-offset-2
                      "
                    >
                      <Search
                        className="size-[1.05rem] transition-transform duration-200 group-hover:scale-110"
                        strokeWidth={2}
                      />
                    </Link>

                    {/* WISHLIST */}

                    <Link
                      href="/account/wishlist"
                      aria-label="Wishlist"
                      aria-current={
                        pathname.startsWith("/account/wishlist")
                          ? "page"
                          : undefined
                      }
                      className={[
                        "group relative flex size-10 items-center justify-center rounded-full outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-2",
                        pathname.startsWith("/account/wishlist")
                          ? "bg-[#FFF0F3] text-[#E72D5A] shadow-[inset_0_0_0_1px_rgba(231,45,90,0.08)]"
                          : "text-[#657086] hover:bg-[#FFF8EE] hover:text-[#E72D5A]",
                      ].join(" ")}
                    >
                      <Heart
                        className="size-[1.05rem] transition-transform duration-200 group-hover:scale-110"
                        strokeWidth={2}
                      />
                    </Link>

                    {/* CART */}

                    <Link
                      href="/cart"
                      aria-label={
                        cartItemCount > 0
                          ? `Shopping cart, ${cartItemCount} items`
                          : "Shopping cart"
                      }
                      aria-current={
                        pathname === "/cart" ? "page" : undefined
                      }
                      className={[
                        "group relative flex size-10 items-center justify-center rounded-full outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-2",
                        pathname === "/cart"
                          ? "bg-[#FFF0F3] text-[#263451] shadow-[inset_0_0_0_1px_rgba(231,45,90,0.08)]"
                          : "text-[#657086] hover:bg-[#FFF8EE] hover:text-[#263451]",
                      ].join(" ")}
                    >
                      <ShoppingBag
                        className="size-[1.05rem] transition-transform duration-200 group-hover:scale-105"
                        strokeWidth={2}
                      />

                      {cartItemCount > 0 ? (
                        <span
                          aria-hidden="true"
                          className="
                            absolute
                            -right-0.5
                            -top-0.5
                            flex
                            min-h-[18px]
                            min-w-[18px]
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-[#FFFDF9]
                            bg-[#E72D5A]
                            px-1
                            font-[var(--font-poppins-brand)]
                            text-[0.57rem]
                            font-bold
                            leading-none
                            text-white
                            shadow-[0_3px_8px_rgba(231,45,90,0.28)]
                          "
                        >
                          {cartItemCount > 99 ? "99+" : cartItemCount}
                        </span>
                      ) : null}
                    </Link>

                    {/* ====================================================== */}
                    {/* ACCOUNT — EXTRA LEFT SPACE FROM CART                  */}
                    {/* ====================================================== */}

                    <Link
                      href={accountHref}
                      aria-label={accountLabel}
                      className={[
                        "ml-1 inline-flex h-10 max-w-[9.5rem] items-center gap-2 rounded-full border px-3.5 font-[var(--font-poppins-brand)] !text-[14px] font-bold leading-none outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-2",
                        isAccountArea
                          ? "border-[#E72D5A]/20 bg-[#FFF0F3] text-[#263451] shadow-[0_3px_12px_rgba(231,45,90,0.06)]"
                          : "border-[#EDE2D6] bg-white/75 text-[#657086] hover:border-[#E72D5A]/25 hover:bg-[#FFF8EE] hover:text-[#263451]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex size-7 shrink-0 items-center justify-center rounded-full",
                          isAccountArea
                            ? "bg-[#E72D5A] text-white"
                            : "bg-[#FFF0F3] text-[#E72D5A]",
                        ].join(" ")}
                      >
                        <UserRound
                          className="size-3.5"
                          strokeWidth={2.1}
                        />
                      </span>

                      <span className="truncate font-[var(--font-poppins-brand)] font-bold">
                        {sessionStatus === "loading"
                          ? "Account"
                          : accountLabel}
                      </span>
                    </Link>
                  </div>
                </div>
              </nav>

              {/* ============================================================ */}
              {/* MOBILE ACTIONS                                                */}
              {/* ============================================================ */}

              <div className="ml-auto flex shrink-0 items-center gap-0.5 lg:hidden">
                {/* SEARCH */}

                <Link
                  href="/search"
                  aria-label="Search products"
                  className="
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    text-[#657086]
                    outline-none
                    transition-all
                    duration-200
                    hover:bg-[#FFF8EE]
                    hover:text-[#263451]
                    focus-visible:ring-2
                    focus-visible:ring-[#E72D5A]
                    focus-visible:ring-offset-2
                  "
                >
                  <Search className="size-[1.1rem]" strokeWidth={2} />
                </Link>

                {/* CART */}

                <Link
                  href="/cart"
                  aria-label="Shopping cart"
                  className="
                    relative
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    text-[#657086]
                    outline-none
                    transition-all
                    duration-200
                    hover:bg-[#FFF8EE]
                    hover:text-[#263451]
                    focus-visible:ring-2
                    focus-visible:ring-[#E72D5A]
                    focus-visible:ring-offset-2
                  "
                >
                  <ShoppingBag
                    className="size-[1.1rem]"
                    strokeWidth={2}
                  />

                  {cartItemCount > 0 ? (
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        -right-0.5
                        -top-0.5
                        flex
                        min-h-[18px]
                        min-w-[18px]
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        border-[#FFFDF9]
                        bg-[#E72D5A]
                        px-1
                        font-[var(--font-poppins-brand)]
                        text-[0.57rem]
                        font-bold
                        leading-none
                        text-white
                      "
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  ) : null}
                </Link>

                {/* MOBILE MENU BUTTON */}

                <button
                  ref={menuButtonRef}
                  type="button"
                  onClick={toggleMobileMenu}
                  aria-label={
                    isMobileMenuOpen
                      ? "Close navigation"
                      : "Open navigation"
                  }
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-navigation-drawer"
                  className="
                    ml-1
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E72D5A]
                    !text-white
                    shadow-[0_8px_20px_rgba(231,45,90,0.22)]
                    outline-none
                    transition-all
                    duration-200
                    hover:scale-[1.04]
                    hover:bg-[#D5224E]
                    focus-visible:ring-2
                    focus-visible:ring-[#E72D5A]
                    focus-visible:ring-offset-2
                  "
                >
                  {isMobileMenuOpen ? (
                    <X className="size-[1.15rem]" strokeWidth={2} />
                  ) : (
                    <Menu
                      className="size-[1.15rem]"
                      strokeWidth={2}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* MOBILE DRAWER                                                         */}
      {/* ====================================================================== */}

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <>
            {/* OVERLAY */}

            <motion.button
              type="button"
              aria-label="Close navigation"
              className="
                fixed
                inset-0
                z-[60]
                cursor-default
                bg-[#263451]/35
                backdrop-blur-[5px]
                lg:hidden
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: durations.fast,
                ease: easings.smooth,
              }}
              onClick={closeMobileMenu}
            />

            {/* DRAWER */}

            <motion.aside
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="
                fixed
                inset-y-0
                right-0
                z-[70]
                flex
                w-[min(90vw,410px)]
                flex-col
                overflow-hidden
                border-l
                border-[#EDE2D6]
                bg-[#FFFDF9]
                shadow-[-28px_0_75px_rgba(42,35,28,0.17)]
                lg:hidden
              "
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: durations.normal,
                ease: easings.premium,
              }}
            >
              {/* Decorative crimson glow */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  size-64
                  rounded-full
                  bg-[#E72D5A]/10
                  blur-3xl
                "
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  -left-24
                  size-64
                  rounded-full
                  bg-[#6F32F5]/8
                  blur-3xl
                "
              />

              {/* ============================================================ */}
              {/* DRAWER HEADER                                                 */}
              {/* ============================================================ */}

              <div
                className="
                  relative
                  flex
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-[#EDE2D6]
                  bg-white/70
                  px-5
                  py-4
                  backdrop-blur-xl
                "
              >
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  aria-label="BuzzieWorld home"
                  className="
                    rounded-xl
                    outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#E72D5A]
                    focus-visible:ring-offset-2
                  "
                >
                  <Image
                    src="/images/hero/Logo.png"
                    alt="BuzzieWorld"
                    width={180}
                    height={55}
                    className="h-auto w-[116px] object-contain"
                  />
                </Link>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close navigation menu"
                  className="
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#EDE2D6]
                    bg-white
                    text-[#657086]
                    shadow-[0_4px_12px_rgba(42,35,28,0.05)]
                    outline-none
                    transition-all
                    duration-200
                    hover:border-[#E72D5A]/20
                    hover:bg-[#FFF0F3]
                    hover:text-[#E72D5A]
                    focus-visible:ring-2
                    focus-visible:ring-[#E72D5A]
                    focus-visible:ring-offset-2
                  "
                >
                  <X className="size-5" strokeWidth={2} />
                </button>
              </div>

              {/* ============================================================ */}
              {/* DRAWER CONTENT                                               */}
              {/* ============================================================ */}

              <nav
                className="
                  relative
                  flex-1
                  overflow-y-auto
                  overscroll-contain
                  px-5
                  py-6
                "
                aria-label="Mobile navigation"
              >
                {/* INTRO */}

                <div
                  className="
                    mb-6
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-[#EDE2D6]
                    bg-gradient-to-br
                    from-[#FFF0F3]
                    via-[#FFFDF9]
                    to-white
                    p-4
                    shadow-[0_10px_30px_rgba(42,35,28,0.05)]
                  "
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        flex
                        size-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-[15px]
                        bg-[#E72D5A]
                        !text-white
                        shadow-[0_7px_16px_rgba(231,45,90,0.18)]
                      "
                    >
                      <Gamepad2 className="size-5" strokeWidth={2} />
                    </span>

                    <div>
                      <p className="font-[var(--font-poppins-brand)] text-sm font-bold tracking-[-0.02em] text-[#263451]">
                        Welcome to BuzzieWorld
                      </p>

                      <p className="mt-0.5 font-[var(--font-poppins-brand)] text-[0.68rem] font-medium leading-4 text-[#7B8495]">
                        Learn · Play · Imagine
                      </p>
                    </div>
                  </div>
                </div>

                {/* MOBILE LINKS */}

                <div className="space-y-1.5">
                  {mobileNavigation.map((item, index) => {
                    const isCategories = item.label === "Categories";
                    const isContactPolicies =
                      item.label === "Contact Us & Policies";

                    const active = isCategories
                      ? pathname.startsWith("/categories") ||
                        isCategoryMenuOpen
                      : isContactPolicies
                        ? isContactArea || isContactMenuOpen
                        : isNavigationActive(
                            pathname,
                            item.href,
                            item.exact,
                          );

                    /* ====================================================== */
                    /* MOBILE CATEGORIES                                     */
                    /* ====================================================== */

                    if (isCategories) {
                      return (
                        <motion.div
                          key={item.label}
                          initial={{
                            opacity: 0,
                            x: 14,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: durations.fast,
                            delay: index * 0.035,
                            ease: easings.premium,
                          }}
                        >
                          <button
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={isCategoryMenuOpen}
                            onClick={toggleCategoryMenu}
                            className={[
                              "group flex min-h-12 w-full items-center justify-between rounded-2xl px-4 font-[var(--font-poppins-brand)] !text-[0.78rem] font-semibold leading-none outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-1",
                              active
                                ? "bg-[#FFF0F3] text-[#263451] shadow-[inset_0_0_0_1px_rgba(231,45,90,0.08)]"
                                : "text-[#657086] hover:bg-[#FFF8EE] hover:text-[#263451]",
                            ].join(" ")}
                          >
                            <span className="font-[var(--font-poppins-brand)]">
                              Categories
                            </span>

                            <ChevronDown
                              className={[
                                "size-4 opacity-60 transition-transform duration-200",
                                isCategoryMenuOpen ? "rotate-180" : "",
                              ].join(" ")}
                              strokeWidth={2}
                            />
                          </button>

                          <AnimatePresence>
                            {isCategoryMenuOpen ? (
                              <motion.div
                                initial={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                transition={{
                                  duration: durations.fast,
                                  ease: easings.smooth,
                                }}
                                className="overflow-hidden"
                              >
                                <div
                                  className="
                                    ml-3
                                    mt-1.5
                                    grid
                                    gap-1
                                    border-l-2
                                    border-[#E72D5A]/20
                                    pl-3
                                  "
                                >
                                  {categoryNavigation.map((category) => (
                                    <Link
                                      key={category.slug}
                                      href={getCategoryHref(category.slug)}
                                      onClick={() => {
                                        setIsCategoryMenuOpen(false);
                                        closeMobileMenu();
                                      }}
                                      className="
                                        group
                                        flex
                                        min-h-10
                                        items-center
                                        justify-between
                                        rounded-xl
                                        px-3
                                        font-[var(--font-poppins-brand)]
                                        !text-[0.78rem]
                                        font-semibold
                                        leading-none
                                        text-[#687489]
                                        outline-none
                                        transition-all
                                        duration-200
                                        hover:bg-[#FFF0F3]
                                        hover:text-[#263451]
                                        focus-visible:ring-2
                                        focus-visible:ring-[#E72D5A]
                                        focus-visible:ring-inset
                                      "
                                    >
                                      <span className="font-[var(--font-poppins-brand)]">
                                        {category.label}
                                      </span>

                                      <span
                                        aria-hidden="true"
                                        className="
                                          size-1.5
                                          rounded-full
                                          bg-[#E72D5A]/25
                                          transition-all
                                          duration-200
                                          group-hover:bg-[#E72D5A]
                                          group-hover:scale-125
                                        "
                                      />
                                    </Link>
                                  ))}

                                  <Link
                                    href="/categories"
                                    onClick={closeMobileMenu}
                                    className="
                                      mt-1
                                      flex
                                      min-h-10
                                      items-center
                                      justify-center
                                      rounded-xl
                                      bg-[#FFF0F3]
                                      px-3
                                      font-[var(--font-poppins-brand)]
                                      !text-[0.78rem]
                                      font-bold
                                      leading-none
                                      text-[#E72D5A]
                                      transition-all
                                      duration-200
                                      hover:bg-[#E72D5A]
                                      hover:text-white
                                    "
                                  >
                                    View all categories
                                  </Link>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </motion.div>
                      );
                    }

                    /* ====================================================== */
                    /* MOBILE CONTACT DROPDOWN                              */
                    /* ====================================================== */

                    if (isContactPolicies) {
                      return (
                        <motion.div
                          key={item.label}
                          initial={{
                            opacity: 0,
                            x: 14,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: durations.fast,
                            delay: index * 0.035,
                            ease: easings.premium,
                          }}
                        >
                          <button
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={isContactMenuOpen}
                            onClick={toggleContactMenu}
                            className={[
                              "group flex min-h-12 w-full items-center justify-between rounded-2xl px-4 font-[var(--font-poppins-brand)] !text-[0.78rem] font-semibold leading-none outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-1",
                              active
                                ? "bg-[#FFF0F3] text-[#263451] shadow-[inset_0_0_0_1px_rgba(231,45,90,0.08)]"
                                : "text-[#657086] hover:bg-[#FFF8EE] hover:text-[#263451]",
                            ].join(" ")}
                          >
                            <span className="font-[var(--font-poppins-brand)]">
                              Contact Us & Policies
                            </span>

                            <ChevronDown
                              className={[
                                "size-4 opacity-60 transition-transform duration-200",
                                isContactMenuOpen ? "rotate-180" : "",
                              ].join(" ")}
                              strokeWidth={2}
                            />
                          </button>

                          <AnimatePresence>
                            {isContactMenuOpen ? (
                              <motion.div
                                initial={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                transition={{
                                  duration: durations.fast,
                                  ease: easings.smooth,
                                }}
                                className="overflow-hidden"
                              >
                                <div
                                  className="
                                    ml-3
                                    mt-1.5
                                    grid
                                    gap-1
                                    border-l-2
                                    border-[#E72D5A]/20
                                    pl-3
                                  "
                                >
                                  {contactNavigation.map((contactItem) => {
                                    const activeLink =
                                      isNavigationActive(
                                        pathname,
                                        contactItem.href,
                                      );

                                    return (
                                      <Link
                                        key={contactItem.href}
                                        href={contactItem.href}
                                        onClick={closeMobileMenu}
                                        className={[
                                          "group flex min-h-[52px] items-center gap-3 rounded-xl px-3 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-inset",
                                          activeLink
                                            ? "bg-[#FFF0F3]"
                                            : "hover:bg-[#FFF8EE]",
                                        ].join(" ")}
                                      >
                                        <span
                                          className={[
                                            "flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                                            activeLink
                                              ? "bg-[#E72D5A] text-white"
                                              : "bg-[#FFF0F3] text-[#E72D5A] group-hover:bg-[#E72D5A] group-hover:text-white",
                                          ].join(" ")}
                                        >
                                          {(() => {
                                            const Icon =
                                              getContactNavigationIcon(
                                                contactItem.href,
                                              );

                                            return (
                                              <Icon
                                                className="size-3.5"
                                                strokeWidth={2}
                                              />
                                            );
                                          })()}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                          <span
                                            className={[
                                              "block font-[var(--font-poppins-brand)] text-[0.74rem] font-bold leading-none",
                                              activeLink
                                                ? "text-[#E72D5A]"
                                                : "text-[#263451]",
                                            ].join(" ")}
                                          >
                                            {contactItem.label}
                                          </span>

                                          <span className="mt-1 block font-[var(--font-poppins-brand)] text-[0.58rem] font-medium leading-none text-[#7B8495]">
                                            {contactItem.description}
                                          </span>
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </motion.div>
                      );
                    }

                    /* ====================================================== */
                    /* STANDARD MOBILE LINK                                 */
                    /* ====================================================== */

                    return (
                      <motion.div
                        key={`${item.href}-${item.label}`}
                        initial={{
                          opacity: 0,
                          x: 14,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
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
                            "group flex min-h-12 items-center justify-between rounded-2xl px-4 font-[var(--font-poppins-brand)] !text-[0.78rem] font-semibold leading-none outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E72D5A] focus-visible:ring-offset-1",
                            active
                              ? "bg-[#FFF0F3] text-[#263451] shadow-[inset_0_0_0_1px_rgba(231,45,90,0.08)]"
                              : item.label === "Crazy Deals"
                                ? "text-[#E72D5A] hover:bg-[#FFF0F3] hover:text-[#D5224E]"
                                : "text-[#657086] hover:bg-[#FFF8EE] hover:text-[#263451]",
                          ].join(" ")}
                        >
                          <span className="font-[var(--font-poppins-brand)]">
                            {item.label}
                          </span>

                          {item.label === "Crazy Deals" ? (
                            <span
                              aria-hidden="true"
                              className="size-2 rounded-full bg-[#E72D5A]"
                            />
                          ) : active ? (
                            <span
                              aria-hidden="true"
                              className="size-2 rounded-full bg-[#E72D5A]"
                            />
                          ) : null}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* SEARCH */}

                  <Link
                    href="/search"
                    onClick={closeMobileMenu}
                    className="
                      flex
                      min-h-12
                      items-center
                      justify-between
                      rounded-2xl
                      px-4
                      font-[var(--font-poppins-brand)]
                      !text-[0.78rem]
                      font-semibold
                      leading-none
                      text-[#657086]
                      outline-none
                      transition-colors
                      duration-200
                      hover:bg-[#FFF8EE]
                      hover:text-[#263451]
                      focus-visible:ring-2
                      focus-visible:ring-[#E72D5A]
                      focus-visible:ring-offset-1

                    "
                  >
                    <span className="font-[var(--font-poppins-brand)] ">
                      Search
                    </span>

                    <Search className="size-4" strokeWidth={2} />
                  </Link>

                  {/* WISHLIST */}

                  <Link
                    href="/account/wishlist"
                    onClick={closeMobileMenu}
                    className="
                      flex
                      min-h-12
                      items-center
                      justify-between
                      rounded-2xl
                      px-4
                      font-[var(--font-poppins-brand)]
                      !text-[0.78rem]
                      font-semibold
                      leading-none
                      text-[#657086]
                      outline-none
                      transition-colors
                      duration-200
                      hover:bg-[#FFF8EE]
                      hover:text-[#E72D5A]
                      focus-visible:ring-2
                      focus-visible:ring-[#E72D5A]
                      focus-visible:ring-offset-1
                    "
                  >
                    <span className="font-[var(--font-poppins-brand)]">
                      Wishlist
                    </span>

                    <Heart className="size-4" strokeWidth={2} />
                  </Link>

                  {/* CART */}

                  <Link
                    href="/cart"
                    onClick={closeMobileMenu}
                    className="
                      flex
                      min-h-12
                      items-center
                      justify-between
                      rounded-2xl
                      px-4
                      font-[var(--font-poppins-brand)]
                      !text-[0.78rem]
                      font-semibold
                      leading-none
                      text-[#657086]
                      outline-none
                      transition-colors
                      duration-200
                      hover:bg-[#FFF8EE]
                      hover:text-[#263451]
                      focus-visible:ring-2
                      focus-visible:ring-[#E72D5A]
                      focus-visible:ring-offset-1
                    "
                  >
                    <span className="font-[var(--font-poppins-brand)]">
                      Cart
                    </span>

                    <span className="flex items-center gap-2">
                      {cartItemCount > 0 ? (
                        <span
                          className="
                            rounded-full
                            bg-[#E72D5A]
                            px-2
                            py-0.5
                            font-[var(--font-poppins-brand)]
                            text-[0.6rem]
                            font-bold
                            text-white
                          "
                        >
                          {cartItemCount > 99 ? "99+" : cartItemCount}
                        </span>
                      ) : null}

                      <ShoppingBag
                        className="size-4"
                        strokeWidth={2}
                      />
                    </span>
                  </Link>
                </div>
              </nav>

              {/* ============================================================ */}
              {/* DRAWER FOOTER                                                */}
              {/* ============================================================ */}

              <div
                className="
                  relative
                  shrink-0
                  border-t
                  border-[#EDE2D6]
                  bg-white/70
                  p-5
                  backdrop-blur-xl
                "
              >
                <Link
                  href={accountHref}
                  onClick={closeMobileMenu}
                  className="
                    flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#E72D5A]
                    px-4
                    font-[var(--font-poppins-brand)]
                    text-sm
                    font-bold
                    !text-white
                    shadow-[0_12px_26px_rgba(231,45,90,0.20)]
                    outline-none
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#D5224E]
                    focus-visible:ring-2
                    focus-visible:ring-[#E72D5A]
                    focus-visible:ring-offset-2
                  "
                >
                  <UserRound className="size-4" strokeWidth={2} />

                  <span className="font-[var(--font-poppins-brand)]">
                    {isAuthenticated ? "My Account" : "Sign In"}
                  </span>
                </Link>

                <p className="mt-3 text-center font-[var(--font-poppins-brand)] text-[0.66rem] font-medium leading-5 text-[#7A8495]">
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
