import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface MostReadTodayProps {
  title?: string;
  items?: {
    id: number;
    title: string;
    views: number;
    imageUrl: string;
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
          <div key={article.id} className="grid grid-cols-[72px_1fr] gap-4 items-center">
            {/* image */}
            <div className="relative w-full aspect-square">
              <Image
                src={article.imageUrl}
                alt="article image"
                fill
                className="object-cover rounded-md"
              />
            </div>
            {/* everything else */}
            <div className="flex flex-col">
              <span className="font-semibold leading-tight">{article.title}</span>
              <span className="text-sm text-gray-500">{article.views.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}