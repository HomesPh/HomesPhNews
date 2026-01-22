"use client";
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

type HeroSectionProps = {
  id?: string
  title: string
  description: string
  category: string
  country?: string
  imageUrl: string
  imageAlt?: string
  timeAgo: string
  keywords?: string
  isFeatured?: boolean
  onReadMore?: () => void
  readMoreText?: string
}

export default function HeroSection({
  id = 'hero-article',
  title,
  description,
  category,
  country,
  imageUrl,
  imageAlt = 'Hero image',
  timeAgo,
  keywords,
  isFeatured = false,
  onReadMore,
  readMoreText = 'Read Full Story'
}: HeroSectionProps) {
  const keywordList = keywords ? keywords.split(',').map(s => s.trim()) : [];

  return (
    <Link href={`/article?id=${id}`} className="block">
      <div className="group relative mb-8 w-full h-[379px] overflow-hidden rounded-[16px] bg-black cursor-pointer">
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl || 'https://placehold.co/800x450?text=No+Image'}
            alt={imageAlt}
            fill
            className="object-cover opacity-70 transition-all duration-500 group-hover:opacity-80 group-hover:scale-105"
            sizes="100vw"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-[rgba(0,0,0,0.4)] to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-[20px] md:p-[40px] flex flex-col gap-4">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {isFeatured && (
              <Badge className="bg-[#c10007] text-white px-3 py-1 rounded-[4px] text-[12px] font-bold tracking-tight border-none hover:bg-[#a00006]">
                FEATURED
              </Badge>
            )}
            <Badge className="bg-white text-black px-3 py-1 rounded-[4px] text-[12px] font-bold tracking-tight border-none hover:bg-gray-100">
              {(category || 'NEWS').toUpperCase()}
            </Badge>
            {country && (
              <Badge className="bg-transparent text-white border border-white/30 px-3 py-1 rounded-[4px] text-[12px] font-bold tracking-tight hover:bg-white/10">
                {country.toUpperCase()}
              </Badge>
            )}
            <div className="flex items-center gap-2 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c10007]" />
              <span className="text-[14px] font-medium text-[#d1d5db] tracking-tight">
                {timeAgo}
              </span>
            </div>

            {keywordList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 w-full">
                {keywordList.slice(0, 3).map((kw, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/20">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-[24px] md:text-[32px] font-bold text-white tracking-[-0.02em] leading-[1.1] max-w-5xl group-hover:text-white transition-colors">
            {title}
          </h2>

          {/* Description */}
          <p className="line-clamp-2 text-[15px] md:text-[16px] font-normal text-[#e5e7eb] tracking-tight leading-[1.6] max-w-3xl opacity-90">
            {description}
          </p>

          {/* Button */}
          <div>
            <Button
              className="bg-[#dc2626] text-white px-[27px] py-[14px] h-auto rounded-[8px] text-[16px] font-semibold tracking-[-0.5px] hover:bg-[#b91c1c] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                onReadMore?.();
              }}
            >
              {readMoreText}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
