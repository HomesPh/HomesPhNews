import { Suspense } from "react";
import LandingHeader from "@/components/layout/header/LandingHeader";
import LandingCountryNav from "@/components/layout/nav/LandingCountryNav";
import LandingCategoryNav from "@/components/layout/nav/LandingCategoryNav";
import LocationFilterBar from "@/components/layout/nav/LocationFilterBar";
import LandingFooter from "@/components/layout/footer/LandingFooter";
import { getPublicCategories, getPublicCountries, getPublicProvinces } from "@/lib/api-v2";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoriesData, countriesData, provincesData] = await Promise.all([
    getPublicCategories().catch(() => []),
    getPublicCountries().catch(() => []),
    getPublicProvinces().catch(() => []),
  ]);

  const dynamicCategories = [
    { id: "All", label: "All News" },
    ...(categoriesData || []).map((cat: any) => ({
      id: cat.name,
      label: cat.name
    }))
  ];

  const dynamicCountries = [
    { id: "Global", label: "All Countries" },
    ...(countriesData || []).map((c: any) => ({
      id: c.name,
      label: c.name
    }))
  ];
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#030712] flex flex-col pt-[120px] transition-colors duration-300">
      <Suspense fallback={<div className="h-[72px] bg-white dark:bg-[#1a1d2e] border-b border-[#e5e7eb] dark:border-[#2a2d3e]" />}>
        <LandingHeader categories={dynamicCategories} countries={dynamicCountries} />
      </Suspense>
      <Suspense fallback={<div className="h-[52px] bg-white dark:bg-[#1a1d2e] border-b border-[#e5e7eb] dark:border-[#2a2d3e]" />}>
        <LandingCountryNav countries={dynamicCountries} />
      </Suspense>
      <Suspense fallback={<div className="h-[52px] bg-white dark:bg-[#1a1d2e] border-b border-[#e5e7eb] dark:border-[#2a2d3e]" />}>
        <LandingCategoryNav categories={dynamicCategories} />
      </Suspense>
      <Suspense fallback={<div className="h-[48px] bg-white dark:bg-[#1a1d2e] border-b border-[#e5e7eb] dark:border-[#2a2d3e]" />}>
        <LocationFilterBar provinces={provincesData} />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
