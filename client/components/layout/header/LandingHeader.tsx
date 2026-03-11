"use client";

import { Menu, Search, LayoutDashboard, FileText, Mail, Utensils } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/features/theme/ModeToggle";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SubscribeModal from "./SubscribeModal";
import BreakingNewsTicker from "./BreakingNewsTicker";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import LandingMobileMenu from "./LandingMobileMenu";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getArticlesList, type ArticleResource } from "@/lib/api-v2";
import SearchSuggestions from "@/components/features/dashboard/SearchSuggestions";

export type LandingHeaderProps = {
  categories?: { id: string; label: string }[];
  countries?: { id: string; label: string }[];
}

export default function LandingHeader({ categories = [], countries = [] }: LandingHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLFormElement>(null); // Ref for the search form container

  const [breakingNews, setBreakingNews] = useState<string[]>([
    "AI Revolution: How Machine Learning is Transforming Healthcare in North America",
    "Canada researchers develop groundbreaking AI system for early cancer detection",
    "Global markets react to new tech regulations in major economies",
    "Future of smart cities: Singapore unveils integrated AI management platform"
  ]);

  // Sync state with URL parameter if it changes externally
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Fetch dynamic breaking news
  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const response = await getArticlesList({
          status: "published",
          limit: 10,
          sort_by: "created_at",
          sort_direction: "desc"
        });

        if (response.data && response.data.data && response.data.data.length > 0) {
          const titles = response.data.data.map((article: ArticleResource) => article.title);
          setBreakingNews(titles);
        }
      } catch (error) {
        console.error("Failed to fetch breaking news:", error);
      }
    };


    fetchBreakingNews();
  }, []);

  // Handle click outside to close search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const navLinks = [
    { href: "/?category=Articles", label: "Articles", icon: LayoutDashboard },
    { href: "/?category=Blogs", label: "Blogs", icon: FileText },
    { href: "/?category=Newsletters", label: "Newsletters", icon: Mail },
    { href: "/restaurants", label: "Restaurants", icon: Utensils },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
        <BreakingNewsTicker items={breakingNews} />

        <div className="bg-white dark:bg-[#1a1d2e] border-b border-[#e5e7eb] dark:border-[#2a2d3e] transition-colors duration-300">
          <div className="w-full max-w-[1280px] mx-auto px-4 h-[72px]">
            <div className="flex items-center justify-between h-full">

              {/* Logo Section */}
              <Link href="/" className="flex items-center gap-2 md:gap-3">
                <div className="relative h-4 md:h-6 w-auto flex items-center">
                  <img
                    src="/images/HomesLogo.png"
                    alt="Homes.ph News Logo"
                    className="object-contain h-full w-auto dark:hidden"
                  />
                  <img
                    src="/images/HomesLogoW.png"
                    alt="Homes.ph News Logo"
                    className="object-contain h-full w-auto hidden dark:block"
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8 xl:gap-16 ml-8">
                {navLinks.map((link) => {
                  const currentCategory = searchParams.get("category") || "All";
                  const isLinkActive = link.href.includes("category=")
                    ? currentCategory === new URLSearchParams(link.href.split("?")[1]).get("category")
                    : pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "font-medium text-[15px] transition-colors whitespace-nowrap",
                        isLinkActive
                          ? "text-[#1428AE] dark:text-[#F4AA1D]"
                          : "text-[#374151] dark:text-gray-300 hover:text-[#1428AE] dark:hover:text-[#F4AA1D]"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Search and Subscribe */}
              <div className="hidden lg:flex items-center gap-4">
                <form
                  ref={searchContainerRef}
                  onSubmit={handleSearch}
                  className="relative group"
                >
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="w-[200px] bg-gray-50 dark:bg-[#252836] border border-gray-200 dark:border-gray-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#1428AE] focus:ring-1 focus:ring-[#1428AE] transition-all dark:text-white dark:placeholder:text-gray-500"
                    onFocus={() => setIsSearchFocused(true)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1428AE]"
                  >
                    <Search size={18} />
                  </button>
                  {isSearchFocused && (
                    <SearchSuggestions
                      query={searchQuery}
                      onClose={() => setIsSearchFocused(false)}
                    />
                  )}
                </form>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                <ModeToggle />

                <button
                  onClick={() => setIsSubscribeModalOpen(true)}
                  className="bg-[#1428AE] hover:bg-[#000785] text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
                >
                  Subscribe
                </button>
              </div>

              {/* Mobile Menu Trigger */}
              <div className="flex items-center gap-2 lg:hidden">
                <ModeToggle />
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="lg:hidden p-2 text-[#374151] dark:text-gray-300 hover:text-[#1428AE] transition-colors">
                      <Menu size={24} />
                    </button>
                  </SheetTrigger>
                  <LandingMobileMenu
                    navLinks={navLinks}
                    searchQuery={searchQuery}
                    handleInputChange={handleInputChange}
                    handleSearch={handleSearch}
                    setIsSubscribeModalOpen={setIsSubscribeModalOpen}
                  />
                </Sheet>
              </div>

            </div>
          </div>
        </div>
      </header>

      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        categories={categories}
        countries={countries}
      />
    </>
  );
}