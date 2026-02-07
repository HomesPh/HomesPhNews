'use client';

import { Suspense } from "react";
import AdSkeleton from "./AdSkeleton";
import AdContent from "./AdContent";

interface Props {
  className?: string;
  rotateInterval?: number;
}

export default function AdSpace({ className, rotateInterval }: Props) {
  return (
    <Suspense
      fallback={<AdSkeleton className={className} />}
    >
      <AdContent className={className} rotateInterval={rotateInterval} />
    </Suspense>
  );
}