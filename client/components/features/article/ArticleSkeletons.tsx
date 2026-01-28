import { Skeleton } from "@/components/ui/skeleton";

export function BreadcrumbSkeleton() {
  return <Skeleton className="h-5 w-64 mb-4" />;
}

export function ArticleHeaderSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-4 items-center mb-6">
        <Skeleton className="h-8 w-24" />
        <div className="h-5 w-px bg-gray-200" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-[42px] md:h-[48px] w-full" />
      <Skeleton className="h-[42px] md:h-[48px] w-3/4" />
      <Skeleton className="h-6 w-full mt-4" />
      <Skeleton className="h-6 w-1/2" />

      <div className="flex items-center justify-between border-y border-[#e5e7eb] py-[20px] mt-12">
        <div className="flex gap-8 items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-[18px] w-[18px]" />
          <Skeleton className="h-[18px] w-[18px]" />
          <Skeleton className="h-[18px] w-[18px]" />
        </div>
      </div>
    </div>
  );
}

export function ArticleContentSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[95%]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-[112px] w-full rounded-xl" />
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  );
}
