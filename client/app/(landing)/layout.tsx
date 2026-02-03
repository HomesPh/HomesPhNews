import { Suspense } from "react";
import LandingHeader from "@/components/layout/header/LandingHeader";
import LandingCountryNav from "@/components/layout/nav/LandingCountryNav";
import LandingCategoryNav from "@/components/layout/nav/LandingCategoryNav";
import LandingFooter from "@/components/layout/footer/LandingFooter";
import { Categories, Countries } from "../data";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#030712] flex flex-col pt-[120px] transition-colors duration-300">
      <Suspense fallback={<div className="h-[72px] bg-white dark:bg-[#1a1d2e] border-b border-[#e5e7eb] dark:border-[#2a2d3e]" />}>
        <LandingHeader />
      </Suspense>
      <LandingCountryNav countries={Countries} />
      <LandingCategoryNav categories={Categories} />
      <main className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
