"use client";

import AdSpace from "@/components/features/admin/ads/AdSpace";
import { cn, decodeHtml } from "@/lib/utils";

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
          <div className="space-y-8">
            {contentBlocks.map((block: any, idx: number) => {
              const { type, content: bContent, settings } = block;
              const blockStyle = {
                textAlign: settings?.textAlign || 'left',
                fontSize: settings?.fontSize || '18px',
                color: settings?.color || 'inherit',
                fontWeight: settings?.fontWeight || 'normal',
                fontStyle: settings?.isItalic ? 'italic' : 'normal',
                textDecoration: settings?.isUnderline ? 'underline' : 'none',
              } as React.CSSProperties;

              return (
                <div key={block.id || idx}>
                  <div className="mb-10">
                    {/* 1. TEXT */}
                    {type === 'text' && (
                      <div
                        style={blockStyle}
                        className={cn(
                          "whitespace-pre-wrap text-[18px] leading-[32px] tracking-[-0.5px] [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&_p]:min-h-[1.5em]",
                          darkClass("text-[#0c0c0c] dark:text-gray-100"),
                          settings?.listType === 'bullet' && "list-disc ml-8",
                          settings?.listType === 'number' && "list-decimal ml-8",
                          idx === 0 && "drop-cap"
                        )}
                        dangerouslySetInnerHTML={{ __html: bContent?.text || bContent || '' }}
                      />
                    )}

                    {/* 2. IMAGES */}
                    {(type === 'image' || type === 'centered-image') && (
                      <figure className={cn("my-10", type === 'centered-image' && "max-w-[90%] mx-auto")}>
                        <img
                          src={bContent?.src || block.image}
                          alt={bContent?.caption || block.caption || ""}
                          className="w-full rounded-2xl shadow-lg border border-gray-100/10"
                        />
                        {(bContent?.caption || block.caption) && (
                          <figcaption className={cn("text-sm text-center mt-4 italic", darkClass("text-gray-500 dark:text-gray-400"))}>
                            {bContent?.caption || block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {/* 3. SIDE IMAGES */}
                    {(type === 'left-image' || type === 'right-image') && (
                      <div className={cn(
                        "my-12 flex gap-10 items-start flex-col md:flex-row",
                        type === 'right-image' && "md:flex-row-reverse"
                      )}>
                        <div className="w-full md:w-[280px] shrink-0">
                          <img
                            src={bContent?.image || bContent?.src || block.image}
                            alt=""
                            className="w-full aspect-square object-cover rounded-2xl shadow-md"
                          />
                          {(bContent?.caption || block.caption) && (
                            <p className={cn("text-xs mt-3 italic text-center leading-tight", darkClass("text-gray-400"))}>
                              {bContent?.caption || block.caption}
                            </p>
                          )}
                        </div>
                        <div
                          style={blockStyle}
                          className={cn("whitespace-pre-wrap flex-1 text-[18px] leading-[34px] [&_p]:min-h-[1.5em]", darkClass("text-[#0c0c0c] dark:text-gray-200"))}
                          dangerouslySetInnerHTML={{ __html: bContent?.text || bContent || '' }}
                        />
                      </div>
                    )}

                    {/* 4. GRIDS */}
                    {type === 'grid' && (
                      <div className={cn(
                        "my-10 grid gap-6",
                        (bContent?.images?.length === 3) ? "grid-cols-3" : "grid-cols-2"
                      )}>
                        {bContent?.images?.map((img: string, i: number) => (
                          <img
                            key={i}
                            src={img}
                            className="w-full aspect-square object-cover rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-300"
                          />
                        ))}
                      </div>
                    )}

                    {/* 5. SPLIT VIEW */}
                    {(type === 'split-left' || type === 'split-right') && (
                      <div className={cn(
                        "my-12 flex flex-col md:flex-row rounded-3xl overflow-hidden min-h-[450px] shadow-sm border border-gray-100/10",
                        darkClass("bg-gray-50 dark:bg-white/5"),
                        type === 'split-right' && "md:flex-row-reverse"
                      )}>
                        <div className="flex-1 min-h-[350px]">
                          <img
                            src={bContent?.image || block.image}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          style={blockStyle}
                          className={cn("whitespace-pre-wrap flex-1 p-10 md:p-14 flex items-center text-[22px] leading-[1.4] font-medium tracking-tight [&_p]:min-h-[1.5em]", darkClass("text-[#111827] dark:text-white"))}
                          dangerouslySetInnerHTML={{ __html: bContent?.text || bContent || '' }}
                        />
                      </div>
                    )}

                    {/* 6. DYNAMIC IMAGES */}
                    {type === 'dynamic-images' && (
                      <div className="my-10 space-y-6">
                        {bContent?.images?.map((img: string, i: number) => (
                          <img
                            key={i}
                            src={img}
                            className="w-full rounded-2xl shadow-md"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ad after first block */}
                  {idx === 0 && (
                    <AdSpace
                      className="my-10"
                      width={728}
                      height={90}
                      rotateInterval={10000}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          (() => {
            const decodedContent = content; // Use raw content directly
            return decodedContent.includes('<') ? (
              <div
                className={`whitespace-pre-wrap text-[18px] leading-[32px] text-[#0c0c0c] ${darkClass('dark:text-gray-100')} drop-cap break-words [&>b]:font-bold [&>i]:italic [&>u]:underline [&>a]:text-blue-600 [&>a]:underline [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_p[style*='text-align: center']]:text-center [&_p[style*='text-align: right']]:text-right [&_p[style*='text-align: justify']]:text-justify [&_div[style*='text-align: center']]:text-center [&_div[style*='text-align: right']]:text-right [&_div[style*='text-align: justify']]:text-justify [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 ${darkClass('[&>h1]:dark:text-white')} [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 ${darkClass('[&>h2]:dark:text-white')} [&_p]:min-h-[1.5em]`}
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
                        `whitespace-pre-wrap text-[18px] leading-[32px] text-[#0c0c0c] ${darkClass('dark:text-gray-100')} font-normal break-words min-h-[1.5em]`,
                        idx === 0 && "drop-cap"
                      )}
                    >
                      {trimmed}
                    </p>
                  );
                });
              })()
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
