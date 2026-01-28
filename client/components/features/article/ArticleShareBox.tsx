"use client";

import { Facebook, Twitter, Linkedin, Link2 } from "lucide-react";

export default function ArticleShareBox() {
  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
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
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
  };

  return (
    <div className="bg-[#eff6ff] rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[10px] items-center justify-center text-center h-[159px] my-8">
      <p className="font-semibold text-[18px] text-[#111827] tracking-[-0.5px] leading-[20px]">
        Found this article interesting?
      </p>
      <p className="font-normal text-[16px] text-[#4b5563] tracking-[-0.5px] leading-[24px]">
        Share it with your network.
      </p>

      <div className="flex gap-[7px] items-center flex-wrap justify-center">
        <button
          onClick={() => handleShare('facebook')}
          className="bg-[#155dfc] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center min-w-[154px]"
        >
          <Facebook className="w-[15px] h-[15px]" />
          Share on Facebook
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="bg-[#50a2ff] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center min-w-[154px]"
        >
          <Twitter className="w-[15px] h-[15px]" />
          Share on Twitter
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="bg-[#1447e6] text-white px-[10px] py-[8px] rounded-[6px] font-medium text-[12px] tracking-[-0.5px] hover:opacity-90 transition-opacity flex gap-[10px] items-center justify-center min-w-[154px]"
        >
          <Linkedin className="w-[15px] h-[15px]" />
          Share on LinkedIn
        </button>
      </div>
    </div>
  );
}
