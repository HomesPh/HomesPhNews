"use client";

import { Menu, Search, LayoutDashboard, FileText, Mail, Utensils } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/features/theme/ModeToggle";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SubscribeModal from "./SubscribeModal";
import BreakingNewsTicker from "./BreakingNewsTicker";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import LandingMobileMenu from "./LandingMobileMenu";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function LandingHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <div className="relative w-8 h-8 md:w-10 md:h-10">
                  <img
                    src="/images/HomesTV.png"
                    alt="HomesTV Logo"
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[18px] md:text-[22px] leading-none text-[#111827] dark:text-white tracking-tight">
                    HomesTV
                  </span>
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
                          ? "text-[#c10007]"
                          : "text-[#374151] dark:text-gray-300 hover:text-[#c10007] dark:hover:text-[#c10007]"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Search and Subscribe */}
              <div className="hidden lg:flex items-center gap-4">
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="w-[200px] bg-gray-50 dark:bg-[#252836] border border-gray-200 dark:border-gray-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all dark:text-white dark:placeholder:text-gray-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                  >
                    <Search size={18} />
                  </button>
                </form>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                <ModeToggle />

                <button
                  onClick={() => setIsSubscribeModalOpen(true)}
                  className="bg-[#c10007] hover:bg-[#a10006] text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
                >
                  Subscribe
                </button>
              </div>

              {/* Mobile Menu Trigger */}
              <div className="flex items-center gap-2 lg:hidden">
                <ModeToggle />
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="lg:hidden p-2 text-[#374151] dark:text-gray-300 hover:text-[#c10007] transition-colors">
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
      />
    </>
  );
}