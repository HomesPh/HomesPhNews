import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AdSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("relative w-full overflow-hidden border-none bg-muted/30", className)}>
      <Skeleton className="h-full w-full absolute inset-0" />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        <Skeleton className="h-8 w-8 rounded-full opacity-20" />
      </div>
    </Card>
  );
}
