"use client";

import { Badge } from "@/components/ui/badge";

interface ArticleContentProps {
  content: string; // HTML string or plain text for now.
  topics: string[];
}

const AdPlaceholder = ({ label }: { label: string }) => (
  <div className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center my-8">
    <span className="text-gray-500 font-semibold mb-1">Advertisement Space</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

export default function ArticleContent({ content, topics }: ArticleContentProps) {
  return (
    <article className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
      {/* Advertisement Top */}
      <AdPlaceholder label="300x500 Leaderboard Ad" />

      {/* Main Content - Ideally this would be a rich text renderer or MDX */}
      {/* For now, we will just render the passed string as paragraphs if it was an array, or just displaying structure */}
      <div className="space-y-6" dangerouslySetInnerHTML={{ __html: content }} />

      {/* Topics */}
      <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
        <h3 className="text-sm font-bold uppercase text-gray-900 mb-4">Topics:</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="px-3 py-1 bg-white border border-gray-200 hover:bg-white hover:border-gray-300 text-gray-700 font-medium">
              {topic}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
