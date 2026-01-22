"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SubscribeModal from "./SubscribeModal";
import BreakingNewsTicker from "./BreakingNewsTicker";

export default function LandingHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const breakingNews = [
    "AI Revolution: How Machine Learning is Transforming Healthcare in North America",
    "Canada researchers develop groundbreaking AI system for early cancer detection",
    "Global markets react to new tech regulations in major economies",
    "Future of smart cities: Singapore unveils integrated AI management platform"
  ];

  // Sync state with URL parameter if it changes externally
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <BreakingNewsTicker items={breakingNews} />

      <header className="bg-white w-full border-b border-[#e5e7eb]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-[110px] py-[16px]">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              src="/images/HomesTV.png"
              alt="HomesTV"
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
              <p className="font-bold text-[20px] text-[#111827] tracking-[-0.5px] leading-tight">
                HomesTV
              </p>
            </div>
          </Link>

          {/* Search and Subscribe */}
          <div className="flex gap-[20px] items-center">
            <button
              onClick={() => setIsSubscribeModalOpen(true)}
              className="hidden md:flex bg-[#030213] text-white px-[10px] py-[5px] rounded-[6px] font-semibold text-[14px] tracking-[-0.5px] hover:bg-[#1a1829] transition-colors"
            >
              Subscribe
            </button>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search News"
                className="bg-white border border-[#c10007] rounded-[8px] px-[10px] py-[7px] pl-[35px] w-[200px] md:w-[272px] font-medium text-[14px] text-[#374151] tracking-[-0.5px] focus:outline-none focus:ring-2 focus:ring-[#c10007]"
              />
              <div className="absolute left-[10px] top-1/2 -translate-y-1/2 size-[18px]">
                <Search className="w-full h-full text-[#4B5563]" />
              </div>
            </form>
          </div>
        </div>
      </header>

      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </>
  );
}