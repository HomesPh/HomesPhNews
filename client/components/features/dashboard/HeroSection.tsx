import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'
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
  isFeatured?: boolean
  onReadMore?: () => void
  readMoreText?: string
}

export default function HeroSection({
  id = 'hero-article', // fallback to avoid breaking if not passed, but arguably should be passed
  title,
  description,
  category,
  country,
  imageUrl,
  imageAlt = 'Hero image',
  timeAgo,
  isFeatured = false,
  onReadMore,
  readMoreText = 'Read Full Story'
}: HeroSectionProps) {
  return (
    <div className="group relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 shadow-xl transition-transform hover:scale-[1.01]">
      <div className="absolute inset-0 opacity-30">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="mb-4 flex items-center gap-2">
          {isFeatured && (
            <Badge className="bg-red-600 hover:bg-red-700">FEATURED</Badge>
          )}
          {country && (
            <Badge className="bg-blue-600 hover:bg-blue-700">
              {country.toUpperCase()}
            </Badge>
          )}
          <Badge className="bg-purple-600 hover:bg-purple-700">
            {category.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-white/80">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mb-6 max-w-2xl text-base text-white/90 md:text-lg">
          {description}
        </p>

        <Link href={`/article?id=${id}`}>
          <Button
            className="bg-red-600 hover:bg-red-700"
            size="lg"
            onClick={onReadMore}
          >
            {readMoreText}
          </Button>
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
    </div>
  )
}