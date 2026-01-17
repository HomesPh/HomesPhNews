import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { Flame } from "lucide-react";

interface TrendingTopicsProps {
  title?: string;
  items?: { id: number; label: string; }[]
  className?: string;
}

export default function TrendingTopicsCard({ title = "Trending Topics", items = [], className }: TrendingTopicsProps) {

  return (
    <Card className={clsx(["shadow-sm border-none", className])}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-4">
            <span className="flex h-8 w-6 items-center justify-center text-2xl font-bold text-slate-200">
              {index + 1}
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {item.label}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}