"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LandingHeroCarouselSkeleton() {
    return (
        <div className="w-full h-[400px] md:h-[500px] bg-gray-100 dark:bg-[#1a1d2e] rounded-sm overflow-hidden mb-12 relative">
            <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full md:w-2/3" />
                <Skeleton className="h-10 w-1/2 md:w-1/3" />
            </div>
        </div>
    );
}

export function LandingNewsBlockSkeleton({ variant = 1 }: { variant?: 1 | 2 | 3 }) {
    if (variant === 1) {
        return (
            <div className="mb-12">
                <div className="bg-[#cc0000] px-4 py-1 inline-block mb-8 h-6 w-40" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="aspect-video w-full rounded-sm" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 2) {
        return (
            <div className="mb-12">
                <div className="bg-[#cc0000] px-4 py-1 inline-block mb-8 h-6 w-40" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Skeleton className="aspect-[4/3] w-full rounded-sm" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-24 w-24 shrink-0 rounded-sm" />
                                <div className="flex-1 space-y-2 py-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-12">
            <div className="bg-[#cc0000] px-4 py-1 inline-block mb-8 h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-[16/10] w-full rounded-sm" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LatestPostsSectionSkeleton() {
    return (
        <div className="space-y-12">
            <div className="bg-[#cc0000] px-4 py-1 inline-block mb-8 h-6 w-32" />
            <div className="space-y-10">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-8">
                        <Skeleton className="md:w-1/3 aspect-[4/3] shrink-0 rounded-sm" />
                        <div className="flex-1 space-y-4 py-2">
                            <Skeleton className="h-8 w-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex gap-4 mt-auto pt-4">
                                <Skeleton className="h-6 w-32 rounded-full" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function DashboardSidebarSkeleton() {
    return (
        <div className="space-y-10">
            {/* Ad Space Skeleton */}
            <Skeleton className="h-28 w-full rounded-md" />

            {/* Most Read Skeleton */}
            <div className="space-y-4">
                <div className="bg-[#cc0000] px-4 py-1 mb-6 h-5 w-32" />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-3">
                        <Skeleton className="h-16 w-16 shrink-0 rounded-md" />
                        <div className="flex-1 space-y-2 py-1">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-2 w-16" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Trending Skeleton */}
            <div className="space-y-4">
                <div className="bg-[#cc0000] px-4 py-1 mb-6 h-5 w-32" />
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-8 w-24 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Categories Skeleton */}
            <div className="space-y-4">
                <div className="bg-[#cc0000] px-4 py-1 mb-6 h-5 w-32" />
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-md" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SearchSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="aspect-video w-full rounded-sm" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between items-center mt-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
            <LandingHeroCarouselSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <LandingNewsBlockSkeleton variant={1} />
                    <LandingNewsBlockSkeleton variant={2} />
                    <LandingNewsBlockSkeleton variant={3} />
                    <LatestPostsSectionSkeleton />
                </div>
                <div className="lg:col-span-4">
                    <DashboardSidebarSkeleton />
                </div>
            </div>
        </div>
    );
}
