'use client';

import { Suspense, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import useAds from "../hooks/useAds";
import { cn } from "@/lib/utils";

interface AdSpaceProps {
  className?: string;
  rotateInterval?: number;
}

function AdContent({ className, rotateInterval }: AdSpaceProps) {
  const { ads, isLoading, error } = useAds({ campaign: "news-homes-ph-ads" });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize random index when ads are loaded
  useEffect(() => {
    if (ads.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * ads.length));
    }
  }, [ads]);

  // Handle rotation
  useEffect(() => {
    if (ads.length <= 1 || !rotateInterval || rotateInterval <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [ads.length, rotateInterval]);

  const ad = ads.length > 0 ? ads[currentIndex] : null;

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <Skeleton className="aspect-3/2 w-full" />
        <CardContent className="p-3">
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error || !ad) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="flex aspect-3/2 w-full items-center justify-center bg-muted">
          <p className="text-xs text-muted-foreground">Advertisement</p>
        </div>
      </Card>
    );
  }

  return (
    <Link
      href={ad.destination_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block"
    >
      <Card className={cn("overflow-hidden transition-shadow hover:shadow-lg", className)}>
        <div className="relative aspect-3/2 w-full overflow-hidden bg-muted">
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />
          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 bg-black/60 text-[10px] text-white backdrop-blur-sm"
          >
            Sponsored
          </Badge>
        </div>
        <CardContent className="p-3">
          <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
            {ad.title}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AdSpace({ className, rotateInterval }: AdSpaceProps) {
  return (
    <Suspense
      fallback={
        <Card className={cn("overflow-hidden", className)}>
          <Skeleton className="aspect-3/2 w-full" />
          <CardContent className="p-3">
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      }
    >
      <AdContent className={className} rotateInterval={rotateInterval} />
    </Suspense>
  );
}