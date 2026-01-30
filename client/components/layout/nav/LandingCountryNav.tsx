"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type LandingCountryNavProps = {
  countries: {
    id: string;
    label: string;
  }[];
}

export default function LandingCountryNav({ countries }: LandingCountryNavProps) {
  return (
    <div className="bg-white w-full">
      <Suspense fallback={<NavContentFallback countries={countries} />}>
        <NavContent countries={countries} />
      </Suspense>
    </div>
  );
}

function NavContent({ countries }: LandingCountryNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCountry = searchParams.get("country") || "all";

  const handleChangeCountryTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set("country", value);
    } else {
      params.delete("country");
    }

    // Determine target path: if searching or already on search page, stay on search page
    const q = params.get("q");
    const targetPath = (q || pathname.startsWith("/search")) ? "/search" : "/";

    const queryString = params.toString() ? `?${params.toString()}` : "";
    router.push(`${targetPath}${queryString}`, { scroll: false });
  }

  return (
    <div className="bg-white dark:bg-[#1a1d2e] w-full border-y border-[#e5e7eb] dark:border-[#2a2d3e] transition-colors duration-300">
      <div className="w-full max-w-[1280px] mx-auto px-4 py-[16px]">
        <nav className="flex gap-[30px] items-center justify-start overflow-x-auto pb-2 scrollbar-hide">
          {countries.map((country, idx) => {
            const isActive = activeCountry === country.id;

            return (
              <button
                key={country.id}
                onClick={() => handleChangeCountryTab(country.id)}
                className={`relative pb-1 shrink-0 font-medium text-[14px] tracking-[-0.5px] whitespace-nowrap transition-colors ${isActive
                  ? "text-[#c10007]"
                  : "text-[#374151] dark:text-gray-300 hover:text-[#c10007] dark:hover:text-[#c10007]"
                  }`}
              >
                {country.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c10007]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function NavContentFallback({ countries }: LandingCountryNavProps) {
  return (
    <nav className="flex gap-[30px] items-center justify-center overflow-x-auto scrollbar-hide">
      {countries.map((country) => (
        <div
          key={country.id}
          className="relative pb-1 shrink-0 font-medium text-[14px] tracking-[-0.5px] whitespace-nowrap text-[#374151]"
        >
          {country.label}
        </div>
      ))}
    </nav>
  );
}