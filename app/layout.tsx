import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";

import "./globals.css";

import { QueryProvider } from "@/providers/QueryProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
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
      className={`${poppins.variable} ${roboto.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider>
              {children}
              <ToastProvider />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
