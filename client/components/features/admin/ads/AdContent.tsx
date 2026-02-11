'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useAds from "@/lib/ads/useAds";
import { cn } from "@/lib/utils";
import AdSkeleton from "./AdSkeleton";
import AdPlaceholder from "./AdPlaceholder";

import { ArrowRight } from "lucide-react";

interface Props {
  className?: string;
  rotateInterval?: number;
  width?: number;
  height?: number;
}

export default function AdContent({ className, rotateInterval, width = 300, height = 250 }: Props) {
  const { ads, isLoading, error } = useAds({ campaign: "news-homes-ph-ads" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize random index when ads are loaded
  useEffect(() => {
    if (ads && ads.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * ads.length));
    }
  }, [ads]);

  // Handle rotation
  useEffect(() => {
    if (!ads || ads.length <= 1 || !rotateInterval || rotateInterval <= 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [ads?.length, rotateInterval, isHovered]);

  const ad = (ads && ads.length > 0) ? ads[currentIndex] : null;

  // loading state
  if (isLoading) {
    return <AdSkeleton className={className} width={width} height={height} />;
  }

  // error state
  if (error) {
    return <AdPlaceholder className={className} message="Failed to load ads" width={width} height={height} />;
  }

  // no ads state
  if (!ad) {
    return <AdPlaceholder className={className} width={width} height={height} />;
  }

  const isBanner = width >= 728;
  const cta = "Learn More";

  return (
    <Link
      href={ad.destination_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn("group block relative w-full flex flex-col items-center", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn("relative overflow-hidden border-0 bg-slate-900 shadow-lg transition-all duration-300 mx-auto", className)}
        style={{ maxWidth: `${width}px`, height: `${height}px`, width: '100%' }}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
            sizes={`${width}px`}
            priority={true}
          />
        </div>

        {/* Gradient Overlays */}
        <div className={cn(
          "absolute inset-0 z-10",
          isBanner
            ? "bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"
            : "bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"
        )} />

        {/* Content Layer */}
        <div className="relative z-20 h-full w-full">
          {isBanner ? (
            // Horizontal Banner Layout (728x90)
            <div className="flex h-full items-center justify-between px-4 md:px-8">
              <div className="flex items-center gap-2 md:gap-6 flex-1 min-w-0">
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-sm md:text-lg leading-tight line-clamp-1">
                    {ad.title}
                  </h3>
                  <p className="text-white/70 text-[10px] md:text-xs mt-0.5 line-clamp-1 font-medium hidden sm:block">
                    Premium Real Estate & Lifestyle Updates
                  </p>
                </div>
              </div>

              <div className="bg-white text-slate-900 px-3 py-1.5 md:px-5 md:py-2 rounded-full font-bold text-[10px] md:text-xs flex items-center gap-1 md:gap-2 transition-all duration-300 group-hover:gap-2 md:group-hover:gap-3 group-hover:bg-gray-100 flex-shrink-0 ml-2">
                {cta}
                <ArrowRight size={12} className="w-3 h-3 md:w-[14px] md:h-[14px]" />
              </div>
            </div>
          ) : (
            // Vertical Layout (300x250, 336x280)
            <div className="flex flex-col justify-end h-full p-6 pb-8">
              <div className="space-y-3">
                <h3 className="text-white font-bold text-xl leading-tight line-clamp-2">
                  {ad.title}
                </h3>
                {ad.description && (
                  <p className="text-white/70 text-xs line-clamp-2 font-medium">
                    {ad.description}
                  </p>
                )}

                <div className="inline-flex mt-2 bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold text-xs items-center gap-2 transition-all duration-300 group-hover:gap-3 group-hover:bg-gray-100 group-hover:shadow-xl">
                  {cta}
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hover Shine Effect */}
        <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </Card>
    </Link>
  );
}
