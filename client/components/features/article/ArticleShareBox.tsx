"use client";

import { Facebook, Linkedin, Share2 } from "lucide-react";
import { useState } from "react";
import CustomShareBoard from "@/components/shared/CustomShareBoard";

// XIcon removed

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 8.366A10.066 10.066 0 0 1 8.19 21.99l-.213-.113-4.142 1.086 1.106-4.038-.125-.199a9.957 9.957 0 0 1-1.522-5.304c0-5.513 4.486-10 10-10 2.668 0 5.176 1.037 7.058 2.92a9.92 9.92 0 0 1 2.922 7.06c0 5.513-4.486 10-10 10m8.472-18.472A11.916 11.916 0 0 0 12.651 1.25c-6.605 0-11.977 5.372-11.977 11.977a11.905 11.905 0 0 0 1.617 6.007l-1.717 6.273 6.42-1.684a11.902 11.902 0 0 0 5.657 1.427h.005c6.605 0 11.977-5.372 11.977-11.977a11.915 11.915 0 0 0-3.511-8.47" />
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
          className="bg-[#155dfc] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center w-full sm:w-auto min-w-[154px]"
        >
          <Facebook className="w-[15px] h-[15px]" />
          Share on Facebook
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="bg-[#1447e6] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center w-full sm:w-auto min-w-[154px]"
        >
          <Linkedin className="w-[15px] h-[15px]" />
          Share on LinkedIn
        </button>
        <button
          onClick={() => handleShare('share')}
          className="bg-gray-600 text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center w-full sm:w-auto min-w-[154px]"
        >
          <Share2 className="w-[15px] h-[15px]" />
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
