"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import CustomShareBoard from "./CustomShareBoard";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { SolidShareIcon } from "./icons/SolidShareIcon";
import { useState } from "react";

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
    className?: string;
    size?: 'default' | 'sm' | 'xs';
}

/**
 * ShareButtons component providing social sharing options
 * Prevents event propagation to avoid triggering parent Link components
 */
export default function ShareButtons({ url, title, description, className, size = 'default' }: ShareButtonsProps) {
    const [isBoardOpen, setIsBoardOpen] = useState(false);

    const handleShare = (e: React.MouseEvent, platform: string) => {
        e.preventDefault();
        e.stopPropagation();

        const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}` : url;

        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(title + ' - ' + fullUrl)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
                break;
            case 'share':
                const shareData = {
                    title: title,
                    text: description || title,
                    url: fullUrl
                };

                if (navigator.share) {
                    navigator.share(shareData).catch(err => {
                        console.error('Error sharing:', err);
                        // If sharing fails (e.g. user cancels or error), we could show our board as backup
                        if (err.name !== 'AbortError') {
                            setIsBoardOpen(true);
                        }
                    });
                } else {
                    // Fallback to our custom share board since native is unavailable
                    setIsBoardOpen(true);
                }
                break;
        }
    };

    const sizes = {
        default: {
            btn: "w-8 h-8",
            icon: "w-4 h-4"
        },
        sm: {
            btn: "w-[26px] h-[26px]",
            icon: "w-[13px] h-[13px]"
        },
        xs: {
            btn: "w-[22px] h-[22px]",
            icon: "w-[11px] h-[11px]"
        }
    };

    const currentSize = sizes[size];

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <button
                onClick={(e) => handleShare(e, 'whatsapp')}
                className={cn("flex items-center justify-center bg-[#25D366]/90 hover:bg-[#128C7E] text-white transition-colors rounded backdrop-blur-sm", currentSize.btn)}
                title="Share on WhatsApp"
            >
                <WhatsAppIcon className={currentSize.icon} />
            </button>
            <button
                onClick={(e) => handleShare(e, 'facebook')}
                className={cn("flex items-center justify-center bg-[#1877F2]/90 hover:bg-[#145DB7] text-white transition-colors rounded backdrop-blur-sm", currentSize.btn)}
                title="Share on Facebook"
            >
                <svg className={currentSize.icon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            </button>
            <button
                onClick={(e) => handleShare(e, 'share')}
                className={cn("flex items-center justify-center bg-gray-600/90 hover:bg-gray-800 text-white transition-colors rounded backdrop-blur-sm", currentSize.btn)}
                title="Share"
            >
                <SolidShareIcon className={currentSize.icon} />
            </button>

            <CustomShareBoard
                isOpen={isBoardOpen}
                onOpenChange={setIsBoardOpen}
                url={url}
                title={title}
            />
        </div>
    );
}
