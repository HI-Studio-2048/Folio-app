import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { SettingsProvider } from "@/components/ui/settings-provider";
import { AffiliateTracker } from "@/components/ui/AffiliateTracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Follio | Visual Portfolio Management",
  description: "Track, evaluate, and expand your investment portfolios.",
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Y2xlYXItcXVhaWwtNDEuY2xlcmsuYWNjb3VudHMuZGV2JA"}>
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen bg-[#06080F] text-slate-100 flex flex-col items-center`}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#06080F] via-slate-900/80 to-[#1e1b4b]/20 z-0 pointer-events-none"></div>
          <SettingsProvider>
            <AffiliateTracker />
            {children}
          </SettingsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
