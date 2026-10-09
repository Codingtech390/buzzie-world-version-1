import type { Metadata } from "next";

import { Bebas_Neue, League_Gothic, Playpen_Sans, Poppins } from "next/font/google";

import "./globals.css";

import { LenisProvider } from "@/providers/LenisProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

import JsonLd from "@/components/seo/JsonLd";
import { createOrganizationJsonLd, createWebSiteJsonLd, SITE_URL } from "@/lib/seo";

const leagueGothic = League_Gothic({
  variable: "--font-league-gothic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins-brand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const playpenSans = Playpen_Sans({
  variable: "--font-playpen-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BuzzieWorld",
    template: "%s | BuzzieWorld",
  },

  description:
    "Discover toys, books, STEM products, games and more at BuzzieWorld — a magical world of learning and play.",

  keywords: [
    "BuzzieWorld",
    "kids toys",
    "educational toys",
    "kids books",
    "STEM toys",
    "baby toys",
    "children products",
  ],

  authors: [{ name: "BuzzieWorld" }],
  creator: "BuzzieWorld",
  publisher: "BuzzieWorld",

  metadataBase: new URL(SITE_URL),

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "BuzzieWorld",
    title: "BuzzieWorld",
    description: "Discover toys, books, STEM products, games and more at BuzzieWorld.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "BuzzieWorld",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BuzzieWorld",
    description: "Discover toys, books, STEM products, games and more at BuzzieWorld.",
    images: [`${SITE_URL}/opengraph-image`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${leagueGothic.variable}
        ${bebasNeue.variable}
        ${poppins.variable}
        ${playpenSans.variable}
        antialiased
      `}
      suppressHydrationWarning
    >
      <body>
        <JsonLd data={createOrganizationJsonLd()} />
        <JsonLd data={createWebSiteJsonLd()} />
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider>
              <LenisProvider>
                {children}
                <ToastProvider />
              </LenisProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
