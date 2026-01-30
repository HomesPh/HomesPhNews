"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type LandingCategoryNavProps = {
  categories: {
    id: string;
    label: string;
  }[];
}

export default function LandingCategoryNav({ categories }: LandingCategoryNavProps) {
  return (
    <div className="bg-white w-full border-b border-[#e5e7eb]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[110px] py-[16px]">
        <Suspense fallback={<NavContentFallback categories={categories} />}>
          <NavContent categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}

function NavContent({ categories }: LandingCategoryNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCategory = searchParams.get("category") || "all";

  const handleChangeCategoryTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    // Determine target path: if searching or already on search page, stay on search page
    const q = params.get("q");
    const targetPath = (q || pathname.startsWith("/search")) ? "/search" : "/";

    const queryString = params.toString() ? `?${params.toString()}` : "";
    router.push(`${targetPath}${queryString}`, { scroll: false });
  }

  return (
    <div className="bg-white dark:bg-[#1a1d2e] w-full border-b border-[#e5e7eb] dark:border-[#2a2d3e] transition-colors duration-300">
      <div className="w-full max-w-[1280px] mx-auto px-4 py-[16px]">
        <nav className="flex gap-[30px] items-center justify-start overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category, idx) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleChangeCategoryTab(category.id)}
                className={`shrink-0 font-medium text-[14px] tracking-[-0.5px] whitespace-nowrap transition-colors ${isActive
                  ? "bg-[#030213] text-white px-[10px] py-[5px] rounded-[6px]"
                  : "text-[#374151] dark:text-gray-300 hover:text-[#c10007] dark:hover:text-[#c10007] px-0 py-px"
                  }`}
              >
                {category.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function NavContentFallback({ categories }: LandingCategoryNavProps) {
  return (
    <nav className="flex gap-[30px] items-center justify-center overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <div
          key={category.id}
          className="shrink-0 font-medium text-[14px] tracking-[-0.5px] whitespace-nowrap text-[#374151] px-0 py-px"
        >
          {category.label}
        </div>
      ))}
    </nav>
  );
}