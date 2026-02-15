import Image from "next/image";

interface ArticleFeaturedImageProps {
  src: string;
  alt: string;
  caption?: string;
  image_position?: number;
  image_position_x?: number;
  unoptimized?: boolean;
}

export default function ArticleFeaturedImage({
  src,
  alt,
  caption,
  image_position,
  image_position_x,
  unoptimized = true
}: ArticleFeaturedImageProps) {
  return (
    <div className="my-8">
      <div className="w-full h-[400px] md:h-[600px] rounded-[16px] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={600}
          unoptimized={unoptimized}
          className="w-full h-full object-cover transition-transform duration-300 transform scale-110"
          style={{ objectPosition: `${image_position_x ?? 50}% ${image_position ?? 0}%` }}
        />
      </div>
      {caption && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">{caption}</p>
      )}
    </div>
  );
}
