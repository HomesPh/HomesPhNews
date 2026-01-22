"use client";

import { Eye, Calendar, Facebook, Twitter, Linkedin, Link2 } from "lucide-react";
import Link from "next/link";

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
}: ArticleHeaderProps) {
  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
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
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(articleTitle)}`,
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
    <header className="mb-8">
      {/* Category | Location */}
      <div className="flex gap-[16px] items-center mb-6">
        <Link
          href={categoryId ? `/?category=${categoryId}` : "/"}
          className="bg-white border border-[#e5e7eb] px-[10px] py-[6px] rounded-[6px] font-semibold text-[14px] text-black tracking-[-0.5px] hover:bg-gray-50 hover:text-[#c10007] transition-all"
        >
          {category}
        </Link>
        <p className="font-normal text-[14px] text-black tracking-[-0.5px] leading-[20px]">|</p>
        <Link
          href={countryId ? `/?country=${countryId}` : "/"}
          className="font-semibold text-[14px] text-black tracking-[-0.5px] hover:text-[#c10007] transition-colors"
        >
          {location.toUpperCase()}
        </Link>
      </div>

      {/* Title and Subtitle */}
      <div className="flex flex-col gap-[20px] mb-6">
        <h1 className="font-bold text-[42px] md:text-[48px] text-[#111827] tracking-tight leading-[1.1]">
          {title}
        </h1>
        <p className="font-normal text-[20px] text-[#4b5563] tracking-[-0.5px] leading-[1.2]">
          {subtitle}
        </p>
      </div>

      {/* Author and Meta / Social Share Row */}
      <div className="flex items-center justify-between border-y border-[#e5e7eb] py-[20px]">
        {/* Left: Author and Meta Info */}
        <div className="flex gap-[34px] items-center">
          <p className="font-semibold text-[14px] text-[#6b7280] tracking-[-0.5px] leading-[20px]">
            By {author.name}
          </p>
          <div className="flex items-center gap-[9px]">
            <Calendar className="size-[14px] text-[#6b7280]" />
            <p className="font-normal text-[14px] text-[#6b7280] tracking-[-0.5px] leading-[20px]">
              {date}
            </p>
          </div>
          <div className="flex items-center gap-[9px]">
            <Eye className="size-[14px] text-[#6b7280]" />
            <p className="font-normal text-[14px] text-[#6b7280] tracking-[-0.5px] leading-[20px]">
              {views} views
            </p>
          </div>
        </div>

        {/* Right: Social Share Icons */}
        <div className="flex items-center justify-between w-[141px]">
          <button
            onClick={() => handleShare('facebook')}
            className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Facebook className="w-full h-full text-[#155DFC]" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Twitter className="w-full h-full text-[#50A2FF]" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Linkedin className="w-full h-full text-[#1447E6]" />
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Link2 className="w-full h-full text-[#4A5565]" />
          </button>
        </div>
      </div>
    </header>
  );
}
