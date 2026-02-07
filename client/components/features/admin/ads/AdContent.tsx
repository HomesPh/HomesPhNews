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

interface Props {
  className?: string;
  rotateInterval?: number;
}

export default function AdContent({ className, rotateInterval }: Props) {
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
    return <AdSkeleton className={className} />;
  }

  // error state
  if (error) {
    return <AdPlaceholder className={className} message="Failed to load ads" />;
  }

  // no ads state
  if (!ad) {
    return <AdPlaceholder className={className} />;
  }

  return (
    <Link
      href={ad.destination_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn("group block h-full w-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={cn("relative h-full w-full overflow-hidden border-0 bg-black/5 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-zinc-900/50", className)}>

        {/* Main Content Layer */}
        <div className="relative z-10 flex h-full w-full flex-col">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={ad.image_url}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 500px"
              priority={true}
            />
          </div>

          {/* Badges & Overlay Info */}
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 z-20 bg-black/50 text-[10px] uppercase tracking-wider text-white backdrop-blur-md hover:bg-black/70 border-white/10"
          >
            Sponsored
          </Badge>

          {/* Title Overlay - Appears on Hover for clean look */}
          <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full transform bg-linear-to-t from-black/90 via-black/60 to-transparent px-4 pb-3 pt-6 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow-md">
              {ad.title}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[10px] text-zinc-300">Visit Site &rarr;</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
