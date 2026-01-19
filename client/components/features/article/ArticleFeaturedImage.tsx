"use client";

import Image from "next/image";

interface ArticleFeaturedImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function ArticleFeaturedImage({ src, alt, caption }: ArticleFeaturedImageProps) {
  return (
    <figure className="mb-10 w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-500 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
