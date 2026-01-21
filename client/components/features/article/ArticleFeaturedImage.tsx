import Image from "next/image";

interface ArticleFeaturedImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function ArticleFeaturedImage({ src, alt, caption }: ArticleFeaturedImageProps) {
  return (
    <div className="my-8">
      <div className="w-full h-[400px] md:h-[600px] rounded-[16px] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
      {caption && (
        <p className="text-sm text-gray-500 mt-2 text-center italic">{caption}</p>
      )}
    </div>
  );
}
