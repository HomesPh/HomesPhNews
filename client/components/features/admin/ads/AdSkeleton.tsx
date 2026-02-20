import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AdSkeleton({ className, width, height }: { className?: string; width?: number; height?: number }) {
  return (
    <div className="w-full flex flex-col items-center">
      <Card
        className={cn("relative overflow-hidden border-none bg-muted/30 mx-auto", className)}
        style={{ maxWidth: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%', width: '100%' }}
      >
        <Skeleton className="h-full w-full absolute inset-0" />
        <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
          <Skeleton className="h-8 w-8 rounded-full opacity-20" />
        </div>
      </Card>
    </div>
  );
}
