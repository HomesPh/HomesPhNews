"use client";

import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-[#030213] text-white w-full">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[110px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Countries */}
          <div>
            <h4 className="font-bold text-[16px] mb-4">Countries</h4>
            <ul className="space-y-2">
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Canada</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">USA</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Philippines</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Singapore</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Europe</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-[16px] mb-4">Categories</h4>
            <ul className="space-y-2">
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Technology</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Business</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Politics</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Economy</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Tourism</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Real Estate</li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-[16px] mb-4">About</h4>
            <ul className="space-y-2">
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">About Us</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Contact</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Advertise</li>
            </ul>
          </div>

          {/* Legal & Follow Us */}
          <div>
            <h4 className="font-bold text-[16px] mb-4">Legal</h4>
            <ul className="space-y-2 mb-6">
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Terms & Policy</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="font-normal text-[14px] text-[#9ca3af] hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
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
    </footer>
  );
}