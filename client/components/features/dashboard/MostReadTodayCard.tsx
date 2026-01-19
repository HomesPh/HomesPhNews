import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface MostReadTodayProps {
  title?: string;
  items?: {
    id: number;
    title: string;
    views: number;
    imageUrl: string;
    href?: string;
  }[];
}

export default function MostReadTodayCard({ title = "Most Read Today", items = [] }: MostReadTodayProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* article list */}
        {items.map((article) => (
          /* article */
          <Link key={article.id} href={article.href || "/article"} className="grid grid-cols-[72px_1fr] gap-4 items-center group">
            {/* image */}
            <div className="relative w-full aspect-square overflow-hidden rounded-md">
              <Image
                src={article.imageUrl}
                alt="article image"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* everything else */}
            <div className="flex flex-col">
              <span className="font-semibold leading-tight group-hover:text-red-600 transition-colors">{article.title}</span>
              <span className="text-sm text-gray-500">{article.views.toLocaleString()}</span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}