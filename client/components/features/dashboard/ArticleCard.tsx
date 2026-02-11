"use client";

import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { cn, decodeHtml } from '@/lib/utils'
import { Clock } from 'lucide-react'
import ShareButtons from "@/components/shared/ShareButtons";

interface ArticleCardProps {
  id: string
  slug?: string
  category: string
  location?: string
  title: string
  description?: string
  timeAgo: string
  views?: string
  imageSrc: string
  imageAlt?: string
  className?: string
}

export default function ArticleCard({
  id,
  slug,
  category,
  location,
  title,
  description,
  timeAgo,
  views,
  imageSrc,
  imageAlt = "Article Image",
  className
}: ArticleCardProps) {
  return (
    <Link
      href={slug ? `/article/${slug}` : `/article/${id}`}
      className={cn(
        'group flex gap-6 rounded-[12px] border border-[#f3f4f6] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-transparent',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-[192px] w-[288px] shrink-0 overflow-hidden rounded-[8px]">
        <Image
          src={imageSrc || 'https://placehold.co/800x450?text=No+Image'}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 288px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Tags - Bottom Left */}
        <div className="absolute bottom-2 left-2 flex gap-1 z-10 transition-opacity">
          <Badge
            variant="outline"
            className="rounded-[4px] border border-[#e5e7eb] bg-white px-2 py-0.5 text-[10px] font-semibold tracking-[-0.5px] text-[#111827] shadow-lg hover:bg-white"
          >
            {category}
          </Badge>
          {location && (
            <Badge
              variant="outline"
              className="rounded-[4px] border border-[#e5e7eb] bg-white px-2 py-0.5 text-[10px] font-semibold tracking-[-0.5px] text-[#111827] shadow-lg hover:bg-white"
            >
              {location.toUpperCase()}
            </Badge>
          )}
        </div>
        {/* Share Icons - Bottom Right */}
        <div className="absolute bottom-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
          <ShareButtons
            url={slug ? `/article/${slug}` : `/article/${id}`}
            title={title}
            description={description}
            size="xs"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 justify-center">

        {/* Title - Making it red by default to match screenshot */}
        <h3 className="line-clamp-2 text-[20px] font-bold leading-[1.4] text-[#c10007] tracking-[-0.5px] transition-colors group-hover:text-[#9a0005]">
          {title}
        </h3>

        {/* Description / Excerpt */}
        <div
          className="line-clamp-2 text-[16px] font-normal leading-[1.5] text-[#4b5563] tracking-[-0.5px] prose prose-sm max-w-none [&>p]:m-0 [&>p]:inline"
          dangerouslySetInnerHTML={{ __html: decodeHtml(description) }}
        />

        {/* Meta */}
        <div className="flex items-center gap-2 text-[#6b7280] mt-1">
          <Clock className="h-[14px] w-[14px]" />
          <span className="text-[14px] font-normal tracking-[-0.5px]">
            {timeAgo}
          </span>
          <span className="text-[16px] font-normal tracking-[-0.5px]">•</span>
          <span className="text-[14px] font-normal tracking-[-0.5px]">
            {views}
          </span>
        </div>
      </div>
    </Link>
  )
}
