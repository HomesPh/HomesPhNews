'use client';

import { Suspense, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import useAds from "../hooks/useAds";

function AdContent() {
  const { ads, isLoading, error } = useAds({ campaign: "news-homes-ph-ads" });

  // Pick a random ad on each render
  const ad = useMemo(() => {
    if (ads.length === 0) return null;
    return ads[Math.floor(Math.random() * ads.length)];
  }, [ads]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="aspect-3/2 w-full" />
        <CardContent className="p-3">
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error || !ad) {
    return (
      <Card className="overflow-hidden">
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
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
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

export default function AdSpace() {
  return (
    <Suspense
      fallback={
        <Card className="overflow-hidden">
          <Skeleton className="aspect-3/2 w-full" />
          <CardContent className="p-3">
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      }
    >
      <AdContent />
    </Suspense>
  );
}