"use client";

import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import { Countries, Categories } from "@/app/data";

import { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function LandingFooter() {
  return (
    <footer className="bg-[#030213] text-white w-full">
      <Suspense fallback={<FooterFallback />}>
        <FooterContent />
      </Suspense>
    </footer>
  );
}

function FooterContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getHref = (type: "country" | "category", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Set the specific param
    if (value && value !== "Global" && value !== "All") {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    // Determine target path
    const q = params.get("q");
    const targetPath = (q || pathname.startsWith("/search")) ? "/search" : "/";

    // Check if we are on a page where we shouldn't apply invalid filters (e.g. restaurant page categories)
    // But since Footer has global categories, we mostly want to target the main search/home feed.
    // If on /restaurants, and we click a generic category like "Politics", we probably want to leave restaurants.
    // So targetPath logic above handles this (defaults to / or /search).

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return `${targetPath}${queryString}`;
  };

  const handleScrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-[110px] py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Countries */}
        <div>
          <h4 className="font-bold text-[16px] mb-4">Countries</h4>
          <ul className="space-y-2">
            {Countries.filter((c) => c.id !== "Global")
              .slice(0, 5)
              .map((country) => (
                <li key={country.id}>
                  <Link
                    href={getHref("country", country.id)}
                    scroll={true}
                    onClick={handleScrollTop}
                    className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
                  >
                    {country.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link
                href={getHref("country", "Global")}
                scroll={true}
                onClick={handleScrollTop}
                className="font-normal text-[14px] text-white hover:text-[#c10007] cursor-pointer transition-colors flex items-center gap-1"
              >
                View All
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold text-[16px] mb-4">Categories</h4>
          <ul className="space-y-2">
            {Categories.filter((c) => c.id !== "All").map((category) => (
              <li key={category.id}>
                <Link
                  href={getHref("category", category.id)}
                  scroll={true}
                  onClick={handleScrollTop}
                  className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="font-bold text-[16px] mb-4">About</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about-us"
                scroll={true}
                onClick={handleScrollTop}
                className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                scroll={true}
                onClick={handleScrollTop}
                className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/faqs"
                scroll={true}
                onClick={handleScrollTop}
                className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/advertise"
                scroll={true}
                onClick={handleScrollTop}
                className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
              >
                Advertise
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Follow Us */}
        <div>
          <h4 className="font-bold text-[16px] mb-4">Legal</h4>
          <ul className="space-y-2 mb-6">
            <li>
              <Link href="/terms-and-policy" className="font-normal text-[14px] text-[#9ca3af] hover:text-white transition-colors">
                Terms & Policy
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="font-normal text-[14px] text-[#9ca3af] hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="font-normal text-[14px] text-[#9ca3af] hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>

          <h4 className="font-bold text-[16px] mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <Facebook className="w-5 h-5 text-white cursor-pointer hover:text-[#9ca3af] transition-colors" />
            <Twitter className="w-5 h-5 text-white cursor-pointer hover:text-[#9ca3af] transition-colors" />
            <Linkedin className="w-5 h-5 text-white cursor-pointer hover:text-[#9ca3af] transition-colors" />
            <Instagram className="w-5 h-5 text-white cursor-pointer hover:text-[#9ca3af] transition-colors" />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#374151] pt-6 flex flex-col items-center">
        <p className="font-normal text-[12px] text-[#6b7280] text-center">
          © 2026 HomesTV. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function FooterFallback() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-[110px] py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-24 bg-[#1f2937] rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 w-32 bg-[#1f2937] rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}