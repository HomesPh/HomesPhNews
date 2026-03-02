"use client";

import { Facebook, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Countries, Categories } from "@/app/data";

import { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";

// WhatsApp SVG icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.103 1.51 5.833L.036 23.867a.499.499 0 0 0 .611.632l6.218-1.63A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.99a9.958 9.958 0 0 1-5.17-1.443l-.37-.22-3.838 1.006 1.024-3.737-.242-.383A9.943 9.943 0 0 1 2.01 12C2.01 6.486 6.486 2.01 12 2.01S21.99 6.486 21.99 12 17.514 21.99 12 21.99z" />
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
                className="font-normal text-[13px] text-[#c10007] hover:text-white cursor-pointer transition-colors"
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
                className="font-normal text-[13px] text-[#c10007] hover:text-white cursor-pointer transition-colors"
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
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#c10007] transition-colors group-hover:bg-[#c10007]">
                <WhatsAppIcon className="w-4 h-4 text-[#030213] group-hover:text-white transition-colors" />
              </span>
              <span className="text-[13px] text-[#9ca3af] group-hover:text-white transition-colors">WhatsApp</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#c10007] transition-colors group-hover:bg-[#c10007]">
                <Facebook className="w-4 h-4 text-[#030213] group-hover:text-white transition-colors" fill="currentColor" strokeWidth={0} />
              </span>
              <span className="text-[13px] text-[#9ca3af] group-hover:text-white transition-colors">Facebook</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-[#c10007] transition-colors group-hover:bg-[#c10007]">
                <Linkedin className="w-4 h-4 text-[#030213] group-hover:text-white transition-colors" fill="currentColor" strokeWidth={0} />
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