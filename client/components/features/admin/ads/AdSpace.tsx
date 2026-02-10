'use client';

import { Suspense } from "react";
import AdSkeleton from "./AdSkeleton";
import AdContent from "./AdContent";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  rotateInterval?: number;
  width?: number;
  height?: number;
}

export default function AdSpace({ className, rotateInterval, width, height }: Props) {
  return (
    <div className={cn("w-full flex justify-center", className)}>
      <Suspense
        fallback={<AdSkeleton width={width} height={height} />}
      >
        <AdContent
          rotateInterval={rotateInterval}
          width={width}
          height={height}
        />
      </Suspense>
    </div>
  );
}