"use client";

import { cn } from "@/lib/utils";

interface ArticleContentProps {
  content: string;
  topics: string[];
  originalUrl?: string;
}

const AdPlaceholder = ({ label }: { label: string }) => (
  <div className="bg-white dark:bg-[#1a1d2e] border border-dashed border-[#e5e7eb] dark:border-[#2a2d3e] rounded-[12px] p-[40px] text-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] my-8">
    <p className="font-semibold text-[16px] text-[#111827] dark:text-white tracking-[-0.5px] leading-[20px] mb-[10px]">
      Advertisement Space
    </p>
    <p className="font-normal text-[12px] text-[#6b7280] dark:text-gray-400 tracking-[-0.5px]">
      {label}
    </p>
  </div>
);

export default function ArticleContent({ content, topics, originalUrl }: ArticleContentProps) {
  return (
    <article className="my-8">
      <style jsx global>{`
        .drop-cap::first-letter {
          float: left;
          font-size: 72px;
          line-height: 64px;
          margin-right: 12px;
          margin-top: 4px;
          font-weight: bold;
          color: #0c0c0c;
        }
        :global(.dark) .drop-cap::first-letter {
          color: #ffffff;
        }
      `}</style>
      {/* Advertisement Top */}
      <AdPlaceholder label="300x600 Leaderboard Ad" />

      {/* Main Content */}
      {/* Main Content - CNN Style */}
      <div className="prose prose-lg max-w-none mb-12">
        {content.includes('<') ? (
          <div
            className="text-[18px] leading-[32px] text-[#0c0c0c] dark:text-gray-100 drop-cap break-words [&>p]:mb-6 [&>b]:font-bold [&>i]:italic [&>u]:underline [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:dark:text-white [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:dark:text-white"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          // Use the custom plain-text parser from Admin Preview
          (() => {
            const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());

            return paragraphs.map((para, idx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // First paragraph gets special styling with drop cap
              return (
                <p
                  key={idx}
                  className={cn(
                    "text-[18px] leading-[32px] text-[#0c0c0c] dark:text-gray-100 mb-6 font-normal break-words",
                    idx === 0 && "drop-cap"
                  )}
                >
                  {trimmed}
                </p>
              );
            });
          })()
        )}
      </div>

      {/* Topics Section */}
      <div className="bg-white dark:bg-[#1a1d2e] border border-[#e5e7eb] dark:border-[#2a2d3e] rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[10px] mt-8">
        <p className="font-semibold text-[15px] text-[#111827] dark:text-white tracking-[-0.5px] leading-[20px]">
          Topics:
        </p>
        <div className="flex gap-[7px] items-center flex-wrap">
          {topics.map(tag => (
            <span
              key={tag}
              className="bg-white dark:bg-[#252836] border border-[#e5e7eb] dark:border-[#374151] px-[10px] py-[6px] rounded-[99px] font-normal text-[12px] text-black dark:text-gray-200 tracking-[-0.5px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {originalUrl && (
          <div className="mt-4 pt-4 border-t border-[#e5e7eb] dark:border-[#2a2d3e]">
            <p className="font-semibold text-[15px] text-[#111827] dark:text-white tracking-[-0.5px] leading-[20px] mb-2">
              Source:
            </p>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#3b82f6] hover:underline break-all"
            >
              {originalUrl.length > 60 ? originalUrl.substring(0, 60) + "..." : originalUrl}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
