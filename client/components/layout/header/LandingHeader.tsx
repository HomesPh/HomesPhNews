"use client";

import { Globe } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function LandingHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // this changes search parameter 'search' 
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <header className="w-full border-b bg-white z-50">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="bg-red-600 text-white rounded-2xl flex justify-center items-center w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform hover:scale-105">
            <Globe className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          {/* Text container */}
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold leading-tight">Global News</h1>
            <p className="text-xs text-gray-500 leading-tight">Network</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 sm:gap-3">
          {/* Subscribe button - Outline on mobile, default on desktop */}
          <Button
            variant="default"
            className="hidden sm:inline-flex hover:bg-red-700 transition-colors"
          >
            Subscribe
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
          >
            Subscribe
          </Button>

          {/* Search input - Hidden on mobile, visible on tablet+ */}
          <Input
            className="hidden md:inline-flex w-48 lg:w-64 focus:ring-2 focus:ring-red-500 transition-all"
            placeholder="Search news..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}