import type { Metadata } from "next";
import { Bebas_Neue, League_Gothic, Poppins } from "next/font/google";

import "./globals.css";

import { LenisProvider } from "@/providers/LenisProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

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

/*
 * Real Poppins font.
 *
 * IMPORTANT:
 * Do not use --font-poppins here because that variable
 * already exists in globals.css as a compatibility alias.
 */
const poppins = Poppins({
  variable: "--font-poppins-brand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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

  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),

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
        antialiased
      `}
      suppressHydrationWarning
    >
      <body>
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
