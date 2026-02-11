import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdPlaceholder({ className, message = "Space Available", width, height }: { className?: string; message?: string; width?: number; height?: number }) {
  return (
    <div className="w-full flex flex-col items-center">
      <Card
        className={cn("relative overflow-hidden border-dashed border-2 mx-auto", className)}
        style={{ maxWidth: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%', width: '100%' }}
      >
        <div className="flex h-full w-full items-center justify-center bg-muted/10 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center">
            {message}
          </p>
        </div>
      </Card>
    </div>
  );
}
