import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import LandingHeader from "@/components/layout/header/LandingHeader";
import LandingCountryNav from "@/components/layout/nav/LandingCountryNav";
import LandingCategoryNav from "@/components/layout/nav/LandingCategoryNav";
import { Categories, Countries } from "./data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Newsletter",
  description: "add something here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <LandingHeader />
        <LandingCountryNav countries={Countries} />
        <LandingCategoryNav categories={Categories} />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
