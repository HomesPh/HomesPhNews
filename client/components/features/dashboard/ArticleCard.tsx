import { Badge } from '@/components/ui/badge'
import { Clock, Eye } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  category: string
  location?: string
  title: string
  description: string
  timeAgo: string
  views: string
  imageSrc: string
  imageAlt?: string
  className?: string
}

export default function ArticleCard({
  category,
  location,
  title,
  description,
  timeAgo,
  views,
  imageSrc,
  imageAlt = "Article Image",
  className
}: ArticleCardProps) {
  return (
    <article className={cn(
      'group flex gap-4 rounded-xl border bg-white p-4 transition-all hover:shadow-lg',
      className
    )}>
      <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-neutral-200 to-neutral-300">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 192px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-semibold">
              {category}
            </Badge>
            {location && (
              <>
                <span className="text-neutral-300">|</span>
                <span className="text-xs font-medium text-neutral-500">
                  {location}
                </span>
              </>
            )}
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-neutral-900 transition-colors group-hover:text-red-600">
            {title}
          </h3>

          <p className="line-clamp-2 text-sm text-neutral-600">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{views}</span>
          </div>
        </div>
      </div>
    </article>
  )
}