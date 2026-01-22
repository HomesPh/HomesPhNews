import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlesSkeleton() {
    return (
        <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-[13px] p-5 border-b border-[#f3f4f6]">
                    {/* Thumbnail Skeleton */}
                    <Skeleton className="w-[118px] h-[106px] rounded-[8px] flex-shrink-0" />

                    <div className="flex-1 flex flex-col justify-between min-h-[106px]">
                        {/* Category Skeleton */}
                        <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-6 w-24 rounded-[4px]" />
                        </div>

                        {/* Title Skeleton */}
                        <Skeleton className="h-7 w-3/4 mb-2" />

                        {/* Description Skeleton */}
                        <Skeleton className="h-4 w-full mb-2" />

                        {/* Meta Skeleton */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
