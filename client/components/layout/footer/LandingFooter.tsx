"use client";

import Link from "next/link";
import Image from "next/image";
import { Countries, Categories } from "@/app/data";

import { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";

// Social Media Icons
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 8.366A10.066 10.066 0 0 1 8.19 21.99l-.213-.113-4.142 1.086 1.106-4.038-.125-.199a9.957 9.957 0 0 1-1.522-5.304c0-5.513 4.486-10 10-10 2.668 0 5.176 1.037 7.058 2.92a9.92 9.92 0 0 1 2.922 7.06c0 5.513-4.486 10-10 10m8.472-18.472A11.916 11.916 0 0 0 12.651 1.25c-6.605 0-11.977 5.372-11.977 11.977a11.905 11.905 0 0 0 1.617 6.007l-1.717 6.273 6.42-1.684a11.902 11.902 0 0 0 5.657 1.427h.005c6.605 0 11.977-5.372 11.977-11.977a11.915 11.915 0 0 0-3.511-8.47" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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
    if (value && value !== "Global" && value !== "All") {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    const q = params.get("q");
    const targetPath = (q || pathname.startsWith("/search")) ? "/search" : "/";
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return `${targetPath}${queryString}`;
  };

  const handleScrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Main Grid: Logo col + 4 nav columns */}
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-8 mb-10">

        {/* Column 1: Logo + Description */}
        <div className="w-full md:w-[220px] md:shrink-0 flex flex-col gap-4">
          <Link href="/" onClick={handleScrollTop}>
            <Image
              src="/images/HomesLogoW.png"
              alt="Homes.ph News"
              width={160}
              height={40}
              className="object-contain"
            />
          </Link>
          <p className="text-[13px] text-[#9ca3af] leading-relaxed">
            Homes.ph News is your trusted source for the latest real estate news, property trends, market insights, and lifestyle stories across the Philippines and beyond.
          </p>
        </div>

        {/* Column 2: Countries */}
        <div>
          <h4 className="font-bold text-[13px] mb-4 text-white uppercase tracking-wide">Countries</h4>
          <ul className="space-y-2">
            {Countries.filter((c) => c.id !== "Global")
              .slice(0, 3)
              .map((country) => (
                <li key={country.id}>
                  <Link
                    href={getHref("country", country.id)}
                    scroll={true}
                    onClick={handleScrollTop}
                    className="font-normal text-[13px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
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
                className="font-normal text-[13px] text-[#1428AE] hover:text-white cursor-pointer transition-colors"
              >
                View All
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h4 className="font-bold text-[13px] mb-4 text-white uppercase tracking-wide">Categories</h4>
          <ul className="space-y-2">
            {Categories.filter((c) => c.id !== "All")
              .slice(0, 3)
              .map((category) => (
                <li key={category.id}>
                  <Link
                    href={getHref("category", category.id)}
                    scroll={true}
                    onClick={handleScrollTop}
                    className="font-normal text-[13px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link
                href={getHref("category", "All")}
                scroll={true}
                onClick={handleScrollTop}
                className="font-normal text-[13px] text-[#1428AE] hover:text-white cursor-pointer transition-colors"
              >
                View All
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: About */}
        <div>
          <h4 className="font-bold text-[13px] mb-4 text-white uppercase tracking-wide">About</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about-us" scroll={true} onClick={handleScrollTop}
                className="font-normal text-[13px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" scroll={true} onClick={handleScrollTop}
                className="font-normal text-[13px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faqs" scroll={true} onClick={handleScrollTop}
                className="font-normal text-[13px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/advertise" scroll={true} onClick={handleScrollTop}
                className="font-normal text-[13px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">
                Advertise
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Follow Us */}
        <div>
          <h4 className="font-bold text-[13px] mb-4 text-white uppercase tracking-wide">Follow Us</h4>
          <div className="flex flex-col gap-3">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#25D366] transition-colors group-hover:bg-[#25D366]">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:text-white transition-colors" />
              </span>
              <span className="text-[13px] text-[#9ca3af] group-hover:text-white transition-colors">WhatsApp</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#1877F2] transition-colors group-hover:bg-[#1877F2]">
                <FacebookIcon className="w-4 h-4 text-[#1877F2] group-hover:text-white transition-colors" />
              </span>
              <span className="text-[13px] text-[#9ca3af] group-hover:text-white transition-colors">Facebook</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#0A66C2] transition-colors group-hover:bg-[#0A66C2]">
                <LinkedinIcon className="w-4 h-4 text-[#0A66C2] group-hover:text-white transition-colors" />
              </span>
              <span className="text-[13px] text-[#9ca3af] group-hover:text-white transition-colors">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright left, Policy links right */}
      <div className="border-t border-[#1f2937] pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-normal text-[12px] text-[#6b7280]">
          © 2026 Homes.ph News. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms-and-policy" className="text-[12px] text-[#6b7280] hover:text-white transition-colors">
            Terms &amp; Policy
          </Link>
          <Link href="/privacy-policy" className="text-[12px] text-[#6b7280] hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/cookie-policy" className="text-[12px] text-[#6b7280] hover:text-white transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

function FooterFallback() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-8 mb-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-4 w-20 bg-[#1f2937] rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-3 w-28 bg-[#1f2937] rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}