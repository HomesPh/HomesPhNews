import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdPlaceholder({ className, message = "Space Available" }: { className?: string, message?: string }) {
  return (
    <Card className={cn("relative w-full overflow-hidden border-dashed border-2", className)}>
      <div className="flex h-full w-full items-center justify-center bg-muted/10 p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center">
          {message}
        </p>
      </div>
    </Card>
  );
}
