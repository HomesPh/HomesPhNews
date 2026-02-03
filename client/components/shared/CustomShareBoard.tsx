"use client";

import React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Facebook, Linkedin, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomShareBoardProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    title: string;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 8.366A10.066 10.066 0 0 1 8.19 21.99l-.213-.113-4.142 1.086 1.106-4.038-.125-.199a9.957 9.957 0 0 1-1.522-5.304c0-5.513 4.486-10 10-10 2.668 0 5.176 1.037 7.058 2.92a9.92 9.92 0 0 1 2.922 7.06c0 5.513-4.486 10-10 10m8.472-18.472A11.916 11.916 0 0 0 12.651 1.25c-6.605 0-11.977 5.372-11.977 11.977a11.905 11.905 0 0 0 1.617 6.007l-1.717 6.273 6.42-1.684a11.902 11.902 0 0 0 5.657 1.427h.005c6.605 0 11.977-5.372 11.977-11.977a11.915 11.915 0 0 0-3.511-8.47" />
    </svg>
);

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
            icon: <Linkedin className="w-6 h-6" />,
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
