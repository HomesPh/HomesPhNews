"use client";

import { useState } from "react";
import CustomShareBoard from "@/components/shared/CustomShareBoard";

import { WhatsAppIcon } from "@/components/shared/icons/WhatsAppIcon";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
  </svg>
);

export default function ArticleShareBox() {
  const [isBoardOpen, setIsBoardOpen] = useState(false);

  const handleShare = (platform: 'facebook' | 'linkedin' | 'whatsapp' | 'share') => {
    const url = window.location.href;
    const title = document.title;

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      // CASE 'x' removed
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
          '_blank'
        );
        break;
      case 'share':
        const shareData = {
          title: title,
          text: 'Check out this article on HomesPh News',
          url: url
        };

        if (navigator.share) {
          navigator.share(shareData).catch(err => {
            console.error('Error sharing:', err);
            if (err.name !== 'AbortError') {
              setIsBoardOpen(true);
            }
          });
        } else {
          setIsBoardOpen(true);
        }
        break;
    }
  };

  return (
    <div className="bg-[#eff6ff] dark:bg-[#1a1d2e] border border-transparent dark:border-[#2a2d3e] rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[10px] items-center justify-center text-center my-8">
      <p className="font-semibold text-[18px] text-[#111827] dark:text-white tracking-[-0.5px] leading-[20px]">
        Found this article interesting?
      </p>
      <p className="font-normal text-[16px] text-[#4b5563] dark:text-gray-400 tracking-[-0.5px] leading-[24px]">
        Share it with your network.
      </p>

      <div className="flex gap-[7px] items-center flex-wrap justify-center w-full">
        <button
          onClick={() => handleShare('whatsapp')}
          className="bg-[#25D366] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center w-full sm:w-auto min-w-[154px]"
        >
          <WhatsAppIcon className="w-[15px] h-[15px]" />
          Share on WhatsApp
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="bg-[#1877F2] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center w-full sm:w-auto min-w-[154px]"
        >
          <FacebookIcon className="w-[15px] h-[15px]" />
          Share on Facebook
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="bg-[#0077B5] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center w-full sm:w-auto min-w-[154px]"
        >
          <LinkedinIcon className="w-[15px] h-[15px]" />
          Share on LinkedIn
        </button>
        <button
          onClick={() => handleShare('share')}
          className="bg-[#4A5565] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center w-full sm:w-auto min-w-[154px]"
        >
          <ShareIcon className="w-[15px] h-[15px]" />
          Share
        </button>
      </div>

      <CustomShareBoard
        isOpen={isBoardOpen}
        onOpenChange={setIsBoardOpen}
        url={typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''}
        title={typeof document !== 'undefined' ? document.title : ''}
      />
    </div>
  );
}
