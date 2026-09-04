import Link from "next/link";
import {
  ArrowRight,
  Eye,
  ImageIcon,
  LayoutDashboard,
  Package,
  Settings2,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";



const homepageSections = [
  {
    title: "Hero Section",
    description:
      "Manage the main hero content, promotional messaging, imagery, and primary call-to-action.",
    icon: ImageIcon,
    href: "/admin/storefront/homepage/hero",
    status: "Manage",
  },
  {
    title: "Featured Products",
    description:
      "Choose which products appear in the featured products section on your storefront.",
    icon: Star,
    href: "/admin/storefront/homepage/featured-products",
    status: "Manage",
  },
  {
    title: "Categories",
    description: "Control the categories highlighted on the homepage and how they are presented.",
    icon: Tag,
    href: "/admin/storefront/homepage/categories",
    status: "Manage",
  },
  {
    title: "Collections",
    description: "Manage featured collections and the products promoted through them.",
    icon: Package,
    href: "/admin/storefront/homepage/collections",
    status: "Manage",
  },
];

export default function HomepagePage() {
  return (
    <div className="min-h-full bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-600">
              <LayoutDashboard className="h-4 w-4" />
              <span>Storefront</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Homepage</span>
            </div>

            <h1 className="font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Homepage
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Manage the content and sections that appear across your BuzzieWorld storefront
              homepage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              Preview Storefront
            </Link>
          </div>
        </div>

        {/* Overview card */}
        <section className="relative mb-8 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-fuchsia-100/40 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                Homepage Control Center
              </div>

              <h2 className="font-[Poppins] text-xl font-semibold text-slate-900 sm:text-2xl">
                Keep your storefront fresh and engaging.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update promotional content, featured products, categories, and collections without
                changing the storefront code.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[430px]">
              <StatCard value="4" label="Sections" />
              <StatCard value="—" label="Active banners" />
              <StatCard value="—" label="Featured items" />
              <StatCard value="Live" label="Storefront" />
            </div>
          </div>
        </section>

        {/* Section management */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-[Poppins] text-lg font-semibold text-slate-900">
                Homepage Sections
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Configure the main content areas of your homepage.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
              <Settings2 className="h-4 w-4" />
              Content Management
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {homepageSections.map((section) => {
              const Icon = section.icon;

              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.025)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_35px_rgba(15,23,42,0.07)] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-[Poppins] text-base font-semibold text-slate-900">
                          {section.title}
                        </h3>

                        <p className="mt-1.5 text-sm leading-5 text-slate-500">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-violet-500" />
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available
                    </span>

                    <span className="text-xs font-semibold text-violet-600">{section.status}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="font-[Poppins] text-lg font-semibold text-slate-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Jump directly to commonly used storefront tools.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              href="/admin/products/new"
              icon={Package}
              title="Add Product"
              description="Create a new product"
            />

            <QuickAction
              href="/admin/storefront/banners"
              icon={ImageIcon}
              title="Manage Banners"
              description="Update promotional banners"
            />

            <QuickAction
              href="/"
              icon={Eye}
              title="View Storefront"
              description="Open the live homepage"
              external
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/80 p-3.5">
      <p className="font-[Poppins] text-lg font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-slate-400">{label}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  external = false,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:border-violet-200 hover:shadow-sm"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>

      <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-violet-500" />
    </Link>
  );
}
