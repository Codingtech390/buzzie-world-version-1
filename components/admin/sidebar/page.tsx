"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FolderTree,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useState, type ElementType } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: ElementType;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        label: "Brands",
        href: "/admin/brands",
        icon: Tag,
      },
      {
        label: "Collections",
        href: "/admin/collections",
        icon: ShoppingBag,
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ClipboardList,
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    label: "Storefront",
    items: [
      {
        label: "Homepage",
        href: "/admin/storefront/homepage",
        icon: Home,
      },
      {
        label: "Banners",
        href: "/admin/storefront/banners",
        icon: ImageIcon,
      },
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: Star,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-[#27344A]/25 backdrop-blur-[3px] lg:hidden"
        />
      )}

      <aside
        className={`
          group/sidebar fixed inset-y-0 left-0 z-50 flex h-screen min-h-0 flex-col
          overflow-hidden border-r border-[#E9E2F1] bg-[#FFFEFF]
          shadow-[8px_0_30px_rgba(39,52,74,0.035)]
          transition-[width,transform] duration-300 ease-out
          lg:sticky lg:top-0 lg:z-30 lg:self-start
          ${collapsed ? "lg:w-[84px]" : "lg:w-[270px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Soft theme glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#C391EE]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-24 h-64 w-64 rounded-full bg-[#E83D59]/[0.045] blur-3xl"
        />

        {/* =========================
            BRAND
        ========================== */}
        <div
          className={`
            relative z-10 flex h-[78px] shrink-0 items-center border-b border-[#EEE8F4]
            bg-white/90
            ${collapsed ? "justify-center px-3" : "justify-between px-5"}
          `}
        >
          <Link
            href="/admin"
            onClick={onMobileClose}
            className="group flex min-w-0 items-center gap-3"
          >
            <div
              className="
                relative flex h-10 w-10 shrink-0 items-center justify-center
                rounded-[13px] bg-[#C391EE]
                shadow-[0_8px_18px_rgba(195,145,238,0.28)]
                transition-transform duration-200 group-hover:scale-[1.04]
              "
            >
              <Sparkles className="h-[19px] w-[19px] text-white" strokeWidth={2.15} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#E83D59] ring-2 ring-white" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="font-[Poppins] text-[16px] font-bold leading-none tracking-[-0.025em] text-[#27344A]">
                  BuzzieWorld
                </p>
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#A56ED5]">
                  Admin Panel
                </p>
              </div>
            )}
          </Link>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close sidebar"
            className="
              flex h-9 w-9 items-center justify-center rounded-xl
              text-[#9AA3B2] transition-all hover:bg-[#F8F3FC]
              hover:text-[#27344A] lg:hidden
            "
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* =========================
            STORE PREVIEW
        ========================== */}
        {!collapsed && (
          <div className="relative z-10 px-4 pt-4">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="
                group flex items-center gap-3 rounded-2xl
                border border-[#EAE2F2] bg-[#FCF9FE] px-3 py-2.5
                shadow-[0_4px_14px_rgba(39,52,74,0.025)]
                transition-all duration-200
                hover:-translate-y-px hover:border-[#D9B9F2]
                hover:bg-[#F9F2FE] hover:shadow-[0_8px_20px_rgba(195,145,238,0.10)]
              "
            >
              <div
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                  bg-white text-[#A56ED5]
                  shadow-[0_3px_10px_rgba(39,52,74,0.07)]
                "
              >
                <Store className="h-[16px] w-[16px]" strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-[Poppins] text-[11px] font-semibold text-[#27344A]">
                  View Storefront
                </p>
                <p className="mt-0.5 truncate text-[10px] text-[#98A1AF]">Open live website</p>
              </div>

              <ChevronRight
                className="
                  h-4 w-4 shrink-0 text-[#C9B8D8]
                  transition-all duration-200
                  group-hover:translate-x-0.5 group-hover:text-[#A56ED5]
                "
              />
            </Link>
          </div>
        )}

        {/* =========================
            NAVIGATION
        ========================== */}
        <nav
          className="
            relative z-10 min-h-0 flex-1 overflow-y-auto px-3 py-5
          "
          style={{ scrollbarWidth: "thin", scrollbarColor: "#E6DDEB transparent" }}
          aria-label="Admin navigation"
        >
          {navigation.map((group, groupIndex) => (
            <div
              key={group.label}
              className={`
                ${groupIndex === 0 ? "mb-5" : "mb-6"}
                last:mb-0
              `}
            >
              {!collapsed ? (
                <div className="mb-2.5 flex items-center gap-2 px-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A6A9B3]">
                    {group.label}
                  </span>
                  <span className="h-px flex-1 bg-[#F1EDF4]" />
                </div>
              ) : (
                <div className="mb-3 px-2">
                  <div className="h-px w-full bg-[#F0EBF4]" />
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`
                        group relative flex items-center rounded-[13px]
                        text-[12px] font-semibold transition-all duration-200
                        ${collapsed ? "h-11 justify-center px-2" : "min-h-11 gap-3 px-3"}
                        ${
                          active
                            ? "bg-[#F5ECFC] text-[#8F55C1] shadow-[0_4px_12px_rgba(195,145,238,0.08)]"
                            : "text-[#6F7888] hover:bg-[#FAF7FC] hover:text-[#27344A]"
                        }
                      `}
                    >
                      {/* Active indicator */}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="
                            absolute left-0 top-1/2 h-6 w-[3px]
                            -translate-y-1/2 rounded-r-full bg-[#C391EE]
                            shadow-[0_0_8px_rgba(195,145,238,0.35)]
                          "
                        />
                      )}

                      <span
                        className={`
                          flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]
                          transition-all duration-200
                          ${
                            active
                              ? "bg-white text-[#A56ED5] shadow-[0_3px_9px_rgba(195,145,238,0.13)]"
                              : "bg-transparent text-[#9BA3B0] group-hover:bg-white group-hover:text-[#687282] group-hover:shadow-[0_3px_9px_rgba(39,52,74,0.045)]"
                          }
                        `}
                      >
                        <Icon className="h-[17px] w-[17px]" strokeWidth={active ? 2.15 : 1.9} />
                      </span>

                      {!collapsed && (
                        <>
                          <span className="truncate">{item.label}</span>

                          {active && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C391EE] shadow-[0_0_0_3px_rgba(195,145,238,0.10)]" />
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* =========================
            BOTTOM AREA
        ========================== */}
        <div
          className="
            relative z-10 shrink-0 border-t border-[#EEE8F4]
            bg-white/95 p-3
          "
        >
          {/* User */}
          {!collapsed && (
            <div
              className="
                mb-2 flex items-center gap-3 rounded-2xl
                border border-transparent px-3 py-2.5
                transition-colors hover:border-[#F0E9F5] hover:bg-[#FCFAFD]
              "
            >
              <div
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                  bg-gradient-to-br from-[#C391EE] to-[#E83D59]
                  font-[Poppins] text-xs font-bold text-white
                  shadow-[0_5px_14px_rgba(195,145,238,0.22)]
                "
              >
                A
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-[Poppins] text-[11px] font-semibold text-[#27344A]">
                  Administrator
                </p>
                <p className="mt-0.5 text-[10px] text-[#9AA2AE]">Store Manager</p>
              </div>

              <span className="h-2 w-2 rounded-full bg-[#79D45C] ring-2 ring-[#EAF8E6]" />
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            title={collapsed ? "Sign out" : undefined}
            className={`
              flex w-full items-center rounded-xl text-[12px] font-semibold
              text-[#9A6270] transition-all duration-200
              hover:bg-[#FFF3F5] hover:text-[#D34A62]
              ${collapsed ? "h-11 justify-center px-2" : "h-10 gap-3 px-3"}
            `}
          >
            <LogOut className="h-[17px] w-[17px]" strokeWidth={1.9} />
            {!collapsed && <span>Sign out</span>}
          </button>

          {/* Collapse button - desktop */}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="
              mt-1 hidden h-10 w-full items-center justify-center gap-2
              rounded-xl text-[11px] font-semibold text-[#9AA2AE]
              transition-all duration-200 hover:bg-[#FAF7FC]
              hover:text-[#5E6878] lg:flex
            "
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
