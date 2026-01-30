"use client";

import { Menu, Search, LayoutDashboard, FileText, Mail, Utensils } from "lucide-react";
import Link from "next/link";
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
      <BreakingNewsTicker items={breakingNews} />

      <header className="bg-white w-full border-b border-[#e5e7eb]">
        <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between px-4 py-[16px]">
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
                    isLinkActive ? "text-[#c10007]" : "text-[#374151] hover:text-[#c10007]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search and Subscribe */}
          <div className="flex gap-[20px] items-center">
            <button
              onClick={() => setIsSubscribeModalOpen(true)}
              className="hidden md:flex bg-[#030213] text-white px-[10px] py-[5px] rounded-[6px] font-semibold text-[14px] tracking-[-0.5px] hover:bg-[#1a1829] transition-colors"
            >
              Subscribe
            </button>

            <form onSubmit={handleSearch} className="relative hidden md:block">
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

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 text-[#374151] hover:text-[#c10007] transition-colors">
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <LandingMobileMenu
                navLinks={navLinks}
                searchQuery={searchQuery}
                handleInputChange={handleInputChange}
                handleSearch={(e) => {
                  handleSearch(e);
                  setIsMobileMenuOpen(false);
                }}
                setIsSubscribeModalOpen={(open) => {
                  setIsSubscribeModalOpen(open);
                  setIsMobileMenuOpen(false);
                }}
              />
            </Sheet>
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