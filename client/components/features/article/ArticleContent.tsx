"use client";

import AdSpace from "@/components/features/admin/ads/AdSpace";
import { cn, decodeHtml, formatParagraphs } from "@/lib/utils";
import ContentBlocksRenderer from "./ContentBlocksRenderer";

interface ArticleContentProps {
  content: string;
  contentBlocks?: any[];
  topics: string[];
  originalUrl?: string;
  forceLight?: boolean;
}

export default function ArticleContent({ content, contentBlocks, topics, originalUrl, forceLight = false }: ArticleContentProps) {
  const darkClass = (cls: string) => !forceLight ? cls : '';
  const hasContentBlocks = Array.isArray(contentBlocks) && contentBlocks.length > 0;
  const firstTextBlockIndex = hasContentBlocks ? contentBlocks.findIndex((b: any) => b.type === 'text') : -1;

  return (
    <article className="my-8">
      {/* ... style tag ... */}
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
        :global(.dark) ${!forceLight ? '.drop-cap::first-letter' : '.drop-cap.use-dark-styles::first-letter'} {
          color: #ffffff;
        }
      `}</style>

      {/* Advertisement Top - Only for legacy content */}
      {!hasContentBlocks && (
        <AdSpace
          className="mb-6"
          width={728}
          height={90}
          rotateInterval={10000}
        />
      )}

      {/* Main Content Area */}
      <div className="prose prose-lg max-w-none mb-12">
        {hasContentBlocks ? (
          <ContentBlocksRenderer blocks={contentBlocks} forceLight={forceLight} />
        ) : (
          (() => {
            const decodedContent = formatParagraphs(content); // Use raw content directly, parsed for 5 sentences
            return (
              <div
                className={`whitespace-pre-wrap text-[18px] leading-[32px] text-[#0c0c0c] ${darkClass('dark:text-gray-100')} drop-cap break-words tiptap [&>b]:font-bold [&>i]:italic [&>u]:underline [&>a]:text-blue-600 [&>a]:underline [&_ul]:list-disc [&_ul]:pl-10 [&_ol]:list-decimal [&_ol]:pl-10 [&_li]:mb-1 [&_p[style*='text-align: center']]:text-center [&_p[style*='text-align: right']]:text-right [&_p[style*='text-align: justify']]:text-justify [&_div[style*='text-align: center']]:text-center [&_div[style*='text-align: right']]:text-right [&_div[style*='text-align: justify']]:text-justify [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 ${darkClass('[&>h1]:dark:text-white')} [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 ${darkClass('[&>h2]:dark:text-white')} [&_p]:min-h-[1.5em]`}
                dangerouslySetInnerHTML={{ __html: decodedContent }}
              />
            );
          })()
        )}
      </div>

      {/* Topics Section */}
      <div className={`bg-white ${darkClass('dark:bg-[#1a1d2e]')} border border-[#e5e7eb] ${darkClass('dark:border-[#2a2d3e]')} rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[10px] mt-8`}>
        <p className={`font-semibold text-[15px] text-[#111827] ${darkClass('dark:text-white')} tracking-[-0.5px] leading-[20px]`}>
          Topics:
        </p>
        <div className="flex gap-[7px] items-center flex-wrap">
          {topics.map(tag => (
            <span
              key={tag}
              className={`bg-white ${darkClass('dark:bg-[#252836]')} border border-[#e5e7eb] ${darkClass('dark:border-[#374151]')} px-[10px] py-[6px] rounded-[99px] font-normal text-[12px] text-black ${darkClass('dark:text-gray-200')} tracking-[-0.5px]`}
            >
              {tag}
            </span>
          ))}
        </div>

        {originalUrl && (
          <div className={`mt-4 pt-4 border-t border-[#e5e7eb] ${darkClass('dark:border-[#2a2d3e]')} opacity-60 hover:opacity-100 transition-opacity`}>
            <p className={`font-medium text-[11px] text-[#6b7280] ${darkClass('dark:text-gray-400')} uppercase tracking-wider mb-1`}>
              Source:
            </p>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[12px] text-[#6b7280] ${darkClass('dark:text-gray-400')} hover:text-[#3b82f6] ${darkClass('dark:hover:text-blue-400')} underline underline-offset-2 transition-colors break-all`}
            >
              {originalUrl.length > 80 ? originalUrl.substring(0, 80) + "..." : originalUrl}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
