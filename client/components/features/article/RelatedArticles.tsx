"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
}

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <section className="mt-12 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Articles</h2>

      {/* Advertisement Space */}
      <div className="w-full bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center my-6 h-32">
        <span className="text-gray-400 text-xs">Advertisement Space</span>
        <span className="text-xs text-gray-300">300x500 Leaderboard Ad</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {articles.map((article) => (
          <Link key={article.id} href={article.href} className="group">
            <Card className="h-full overflow-hidden border-0 bg-transparent shadow-none hover:shadow-none">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-0">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">{article.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
