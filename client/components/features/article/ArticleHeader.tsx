"use client";

import { Eye, Calendar, Facebook, Linkedin, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CustomShareBoard from "@/components/shared/CustomShareBoard";
import { decodeHtml } from "@/lib/utils";

// XIcon removed

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 8.366A10.066 10.066 0 0 1 8.19 21.99l-.213-.113-4.142 1.086 1.106-4.038-.125-.199a9.957 9.957 0 0 1-1.522-5.304c0-5.513 4.486-10 10-10 2.668 0 5.176 1.037 7.058 2.92a9.92 9.92 0 0 1 2.922 7.06c0 5.513-4.486 10-10 10m8.472-18.472A11.916 11.916 0 0 0 12.651 1.25c-6.605 0-11.977 5.372-11.977 11.977a11.905 11.905 0 0 0 1.617 6.007l-1.717 6.273 6.42-1.684a11.902 11.902 0 0 0 5.657 1.427h.005c6.605 0 11.977-5.372 11.977-11.977a11.915 11.915 0 0 0-3.511-8.47" />
  </svg>
);

interface ArticleHeaderProps {
  category: string;
  categoryId?: string;
  location: string;
  countryId?: string;
  title: string;
  subtitle: string;
  author: {
    name: string;
    image?: string;
  };
  date: string;
  views: number;
  forceLight?: boolean;
}

export default function ArticleHeader({
  category,
  categoryId,
  location,
  countryId,
  title,
  subtitle,
  author,
  date,
  views,
  forceLight = false,
}: ArticleHeaderProps) {
  const [isBoardOpen, setIsBoardOpen] = useState(false);

  const handleShare = (platform: 'facebook' | 'linkedin' | 'whatsapp' | 'share') => {
    const url = window.location.href;
    const articleTitle = title;

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      // X removed
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + " " + url)}`,
          '_blank'
        );
        break;
      case 'share':
        const shareData = {
          title: articleTitle,
          text: subtitle || articleTitle,
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

  // Helper to conditionally apply dark classes
  const darkClass = (cls: string) => !forceLight ? cls : '';

  return (
    <header className="mb-8">
      {/* Category | Location */}
      <div className="flex gap-[16px] items-center mb-6">
        <Link
          href={categoryId ? `/?category=${categoryId}` : "/"}
          className={`bg-white ${darkClass('dark:bg-[#1a1d2e]')} border border-[#e5e7eb] ${darkClass('dark:border-[#2a2d3e]')} px-[10px] py-[6px] rounded-[6px] font-semibold text-[14px] text-black ${darkClass('dark:text-white')} tracking-[-0.5px] hover:bg-gray-50 ${darkClass('dark:hover:bg-[#252836]')} hover:text-[#c10007] ${darkClass('dark:hover:text-[#c10007]')} transition-all`}
        >
          {category}
        </Link>
        <p className={`font-normal text-[14px] text-black ${darkClass('dark:text-gray-400')} tracking-[-0.5px] leading-[20px]`}>|</p>
        <Link
          href={countryId ? `/?country=${countryId}` : "/"}
          className={`font-semibold text-[14px] text-black ${darkClass('dark:text-white')} tracking-[-0.5px] hover:text-[#c10007] ${darkClass('dark:hover:text-[#c10007]')} transition-colors`}
        >
          {location.toUpperCase()}
        </Link>
      </div>

      {/* Title and Subtitle */}
      <div className="prose prose-lg max-w-none mb-12">
        <h1 className={`font-bold text-[42px] md:text-[48px] text-[#111827] ${darkClass('dark:text-white')} tracking-tight leading-[1.1]`}>
          {title}
        </h1>
        {(() => {
          const decodedSubtitle = decodeHtml(subtitle);
          return decodedSubtitle.includes('<') ? (
            <div
              className={`font-normal text-[20px] text-[#4b5563] ${darkClass('dark:text-gray-300')} tracking-[-0.5px] leading-[1.2]`}
              dangerouslySetInnerHTML={{ __html: decodedSubtitle }}
            />
          ) : (
            <p className={`font-normal text-[20px] text-[#4b5563] ${darkClass('dark:text-gray-300')} tracking-[-0.5px] leading-[1.2]`}>
              {decodedSubtitle}
            </p>
          );
        })()}
      </div>

      {/* Author and Meta / Social Share Row */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between border-y border-[#e5e7eb] ${darkClass('dark:border-[#2a2d3e]')} py-[20px] gap-4`}>
        {/* Left: Author and Meta Info */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-[20px] md:gap-x-[34px]">
          <p className={`font-semibold text-[14px] text-[#6b7280] ${darkClass('dark:text-gray-400')} tracking-[-0.5px] leading-[20px]`}>
            By {author.name}
          </p>
          <div className="flex items-center gap-[9px]">
            <Calendar className={`size-[14px] text-[#6b7280] ${darkClass('dark:text-gray-400')}`} />
            <p className={`font-normal text-[14px] text-[#6b7280] ${darkClass('dark:text-gray-400')} tracking-[-0.5px] leading-[20px]`}>
              {date}
            </p>
          </div>
          <div className="flex items-center gap-[9px]">
            <Eye className={`size-[14px] text-[#6b7280] ${darkClass('dark:text-gray-400')}`} />
            <p className={`font-normal text-[14px] text-[#6b7280] ${darkClass('dark:text-gray-400')} tracking-[-0.5px] leading-[20px]`}>
              {views} views
            </p>
          </div>

        </div>

        {/* Right: Social Share Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleShare('whatsapp')}
            className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
            title="Share on WhatsApp"
          >
            <WhatsAppIcon className="w-full h-full text-[#25D366]" />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
            title="Share on Facebook"
          >
            <Facebook className="w-full h-full text-[#155DFC]" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-full h-full text-[#1447E6]" />
          </button>
          <button
            onClick={() => handleShare('share')}
            className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
            title="Share"
          >
            <Share2 className={`w-full h-full text-[#4A5565] ${darkClass('dark:text-gray-400')}`} />
          </button>
        </div>
      </div>

      <CustomShareBoard
        isOpen={isBoardOpen}
        onOpenChange={setIsBoardOpen}
        url={typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''}
        title={title}
      />
    </header>
  );
}
