"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type LandingCategoryNavProps = {
  categories: {
    id: string;
    label: string;
    count?: number; // Added count property
  }[];
}

export default function LandingCategoryNav({ categories }: LandingCategoryNavProps) {
  return (
    <div className="bg-white dark:bg-[#1a1d2e] w-full">
      <Suspense fallback={<NavContentFallback categories={categories} />}>
        <NavContent categories={categories} />
      </Suspense>
    </div>
  );
}

function NavContent({ categories }: LandingCategoryNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || searchParams.get("topic") || "all"; // Support topic for restaurants

  // Dynamic Category Switch
  const isRestaurantPage = pathname.startsWith("/restaurants");
  const displayCategories = isRestaurantPage
    ? require("@/app/data").RestaurantCategories // Dynamic import to avoid circular dependency issues if any, or just import at top if clean
    : categories;

  const handleChangeCategoryTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    // Determine target path: if searching or already on search page, stay on search page
    const q = params.get("q");

    // Fix: If restaurant page, link to restaurants page with topic, else default behavior
    let targetPath = (q || pathname.startsWith("/search")) ? "/search" : "/";
    if (isRestaurantPage) targetPath = "/restaurants";

    const queryString = params.toString() ? `?${params.toString()}` : "";
    router.push(`${targetPath}${queryString}`, { scroll: false });
  }

  // Update change handler for restaurants to use 'topic'
  // Update change handler for restaurants to use 'topic'
  const handleCategoryClick = (id: string, label: string) => {
    if (isRestaurantPage) {
      if (id === "All") {
        router.push("/restaurants");
      } else {
        router.push(`/restaurants?topic=${encodeURIComponent(label)}`);
      }
    } else {
      handleChangeCategoryTab(id);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d2e] w-full border-b border-[#e5e7eb] dark:border-[#2a2d3e] transition-colors duration-300">
      <div className="w-full max-w-[1280px] mx-auto px-4 py-[16px]">
        <nav className="flex gap-[30px] items-center justify-start overflow-x-auto pb-2 scrollbar-hide">
          {displayCategories.map((category: any, idx: number) => {
            const isActive = activeCategory === category.id || (isRestaurantPage && activeCategory === category.label);

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.label)}
                className={`shrink-0 font-medium text-[14px] tracking-[-0.5px] whitespace-nowrap transition-colors flex items-center gap-1 ${isActive
                  ? "bg-[#030213] dark:bg-white text-white dark:text-[#030213] px-[10px] py-[5px] rounded-[6px]"
                  : "text-[#374151] dark:text-gray-300 hover:text-[#c10007] dark:hover:text-[#c10007] px-0 py-px"
                  }`}
              >
                {category.label}
                {category.count !== undefined && (
                  <span className={`text-[10px] ${isActive ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400'}`}>
                    ({category.count})
                  </span>
                )}
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
          className="shrink-0 font-medium text-[14px] tracking-[-0.5px] whitespace-nowrap text-[#374151] dark:text-gray-400 px-0 py-px"
        >
          {category.label}
        </div>
      ))}
    </nav>
  );
}