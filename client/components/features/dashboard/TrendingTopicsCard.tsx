import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { Flame } from "lucide-react";
import Link from "next/link";

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
          <Link href={`/search?topic=${encodeURIComponent(item.label)}`} key={item.id} className="flex items-center gap-4 group cursor-pointer">
            <span className="flex h-8 w-6 items-center justify-center text-2xl font-bold text-slate-200 group-hover:text-red-500 transition-colors">
              {index + 1}
            </span>
            <span className="text-sm font-semibold text-slate-800 group-hover:text-red-600 transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}