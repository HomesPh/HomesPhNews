"use client";

import React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Facebook, Link2, Check, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

const GeometricLinkedinIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

interface CustomShareBoardProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    title: string;
}

export default function CustomShareBoard({ isOpen, onOpenChange, url, title }: CustomShareBoardProps) {
    const [copied, setCopied] = React.useState(false);

    const fullUrl = React.useMemo(() => {
        if (typeof window === "undefined") return url;
        return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    }, [url]);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const platforms = [
        {
            id: "whatsapp",
            label: "WhatsApp",
            icon: <WhatsAppIcon className="w-6 h-6" />,
            color: "bg-[#25D366]",
            onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + " - " + fullUrl)}`, "_blank"),
        },
        {
            id: "facebook",
            label: "Facebook",
            icon: <Facebook className="w-6 h-6" />,
            color: "bg-[#1877F2]",
            onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, "_blank"),
        },
        {
            id: "linkedin",
            label: "LinkedIn",
            icon: <GeometricLinkedinIcon className="w-6 h-6" />,
            color: "bg-[#0A66C2]",
            onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, "_blank"),
        },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-2xl p-6 sm:max-w-md mx-auto">
                <SheetHeader className="text-left mb-6">
                    <SheetTitle className="text-xl font-bold">Share Article</SheetTitle>
                    <SheetDescription className="text-sm">
                        Choose a platform to share this article with your network.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    {platforms.map((platform) => (
                        <button
                            key={platform.id}
                            onClick={platform.onClick}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div
                                className={cn(
                                    "w-12 h-12 flex items-center justify-center rounded-2xl text-white transition-transform group-active:scale-95",
                                    platform.color
                                )}
                            >
                                {platform.icon}
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">
                                {platform.label}
                            </span>
                        </button>
                    ))}
                    <button
                        onClick={handleCopy}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div
                            className={cn(
                                "w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all group-active:scale-95",
                                copied && "bg-green-100 dark:bg-green-900/30 text-green-600 shadow-inner"
                            )}
                        >
                            {copied ? <Check className="w-6 h-6" /> : <Link2 className="w-6 h-6" />}
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {copied ? "Copied" : "Copy Link"}
                        </span>
                    </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500 truncate flex-1">{fullUrl}</p>
                    <button
                        onClick={handleCopy}
                        className="text-[10px] font-bold uppercase text-[#cc0000] hover:underline"
                    >
                        {copied ? "Done" : "Copy"}
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
