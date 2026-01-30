"use client";

import { cn } from "@/lib/utils";
import { SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, LayoutDashboard, FileText, Mail, Utensils } from "lucide-react";

export default function LandingMobileMenu({
    navLinks,
    searchQuery,
    handleInputChange,
    handleSearch,
    setIsSubscribeModalOpen
}: {
    navLinks: any[],
    searchQuery: string,
    handleInputChange: (e: any) => void,
    handleSearch: (e: any) => void,
    setIsSubscribeModalOpen: (open: boolean) => void
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] p-0 border-l-[#2a2d3e] bg-[#1a1d2e] gap-0 border-none [&>button]:text-white"
        >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

            {/* Exact replica of AdminSidebar container */}
            <div className="flex flex-col h-full bg-[#1a1d2e] text-white">

                {/* Header - Exact match to AdminSidebar Header */}
                <div className="px-4 py-6 border-b border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-3 px-2">
                        <img
                            src="/images/HomesTV.png"
                            alt="HomesTV"
                            className="w-10 h-10 object-contain"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-[20px] font-bold text-white leading-[1.4] tracking-[-0.5px]">
                                HomesTV
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Content - Exact match to AdminSidebar Content */}
                <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const currentCategory = searchParams.get("category") || "All";
                            const isActive = link.href.includes("category=")
                                ? currentCategory === new URLSearchParams(link.href.split("?")[1]).get("category")
                                : pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <SheetClose key={link.href} asChild>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full h-auto",
                                            // Exact classes from AdminSidebar logic
                                            isActive
                                                ? "bg-[#C10007] text-white hover:bg-[#C10007] hover:text-white"
                                                : "text-[#9ca3af] hover:bg-[#252836] hover:text-white"
                                        )}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-[14px] font-medium tracking-[-0.5px]">
                                            {link.label}
                                        </span>
                                    </Link>
                                </SheetClose>
                            );
                        })}
                    </div>

                    {/* User Side Customization: Search & Subscribe (Styled to match footer/item look) */}
                    <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)] flex flex-col gap-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleInputChange}
                                placeholder="Search News"
                                className="w-full bg-[#252836] border-none rounded-[8px] px-[10px] py-[10px] pl-[35px] font-medium text-[14px] text-white tracking-[-0.5px] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
                            />
                            <div className="absolute left-[10px] top-1/2 -translate-y-1/2 size-[18px]">
                                <Search className="w-full h-full text-gray-500" />
                            </div>
                        </form>

                        <button
                            onClick={() => setIsSubscribeModalOpen(true)}
                            className="w-full bg-[#C10007] text-white px-[10px] py-[12px] rounded-[6px] font-semibold text-[14px] tracking-[-0.5px] hover:bg-[#a10006] transition-colors text-center"
                        >
                            Subscribe
                        </button>
                    </div>

                </div>
            </div>
        </SheetContent>
    );
}
