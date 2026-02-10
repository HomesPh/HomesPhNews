"use client";

import AdSpace from "@/components/features/admin/ads/AdSpace";
import { cn, decodeHtml } from "@/lib/utils";

interface ArticleContentProps {
  content: string;
  topics: string[];
  originalUrl?: string;
  forceLight?: boolean;
}




export default function ArticleContent({ content, topics, originalUrl, forceLight = false }: ArticleContentProps) {
  const darkClass = (cls: string) => !forceLight ? cls : '';

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
        :global(.dark) ${!forceLight ? '.drop-cap::first-letter' : '.drop-cap.use-dark-styles::first-letter'} {
          color: #ffffff;
        }
        /* When forceLight is true, we want keys to simply not match unless we added a class. 
           But since we passed !forceLight above, if forceLight is true, the selector becomes .drop-cap.use-dark-styles...
           which won't match normal elements unless they have that class. */
      `}</style>
      {/* Advertisement Top */}
      <AdSpace
        className="mb-6"
        width={728}
        height={90}
        rotateInterval={10000}
      />

      {/* Main Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {(() => {
          const decodedContent = decodeHtml(content);
          return decodedContent.includes('<') ? (
            <div
              className={`text-[18px] leading-[32px] text-[#0c0c0c] ${darkClass('dark:text-gray-100')} drop-cap break-words [&>b]:font-bold [&>i]:italic [&>u]:underline [&>a]:text-blue-600 [&>a]:underline [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_p[style*='text-align: center']]:text-center [&_p[style*='text-align: right']]:text-right [&_p[style*='text-align: justify']]:text-justify [&_div[style*='text-align: center']]:text-center [&_div[style*='text-align: right']]:text-right [&_div[style*='text-align: justify']]:text-justify [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 ${darkClass('[&>h1]:dark:text-white')} [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 ${darkClass('[&>h2]:dark:text-white')}`}
              dangerouslySetInnerHTML={{ __html: decodedContent }}
            />
          ) : (
            (() => {
              const paragraphs = decodedContent.split(/\n\s*\n/).filter(p => p.trim());

              return paragraphs.map((para, idx) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                return (
                  <p
                    key={idx}
                    className={cn(
                      `text-[18px] leading-[32px] text-[#0c0c0c] ${darkClass('dark:text-gray-100')} font-normal break-words`,
                      idx === 0 && "drop-cap"
                    )}
                  >
                    {trimmed}
                  </p>
                );
              });
            })()
          );
        })()}
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
          <div className={`mt-4 pt-4 border-t border-[#e5e7eb] ${darkClass('dark:border-[#2a2d3e]')}`}>
            <p className={`font-semibold text-[15px] text-[#111827] ${darkClass('dark:text-white')} tracking-[-0.5px] leading-[20px] mb-2`}>
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
