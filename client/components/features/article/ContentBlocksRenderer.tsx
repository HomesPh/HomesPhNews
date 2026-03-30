"use client";

import AdSpace from "@/components/features/admin/ads/AdSpace";
import { cn, decodeHtml } from "@/lib/utils";

interface ContentBlocksRendererProps {
  blocks: any[];
  forceLight?: boolean;
}

export default function ContentBlocksRenderer({ blocks, forceLight = false }: ContentBlocksRendererProps) {
  const darkClass = (cls: string) => (!forceLight ? cls : "");
  let textBlockCount = 0;

  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="space-y-8">
      {blocks.map((block: any, idx: number) => {
        const { type, content: bContent, settings } = block;

        const blockStyle = {
          textAlign: settings?.textAlign || "left",
          fontSize: settings?.fontSize || "18px",
          color: settings?.color || "inherit",
          fontWeight: settings?.fontWeight || "normal",
          fontStyle: settings?.isItalic ? "italic" : "normal",
          textDecoration: settings?.isUnderline ? "underline" : "none",
        } as React.CSSProperties;

        return (
          <div key={block.id || idx}>
            <div className="mb-10">
              {/* 1. TEXT BLOCKS */}
              {type === "text" &&
                (() => {
                  const isFirstText = textBlockCount === 0;
                  textBlockCount++;
                  return (
                    <div
                      style={blockStyle}
                      className={cn(
                        "whitespace-pre-wrap text-[18px] leading-[32px] tracking-[-0.5px] tiptap [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&_p]:min-h-[1.5em] [&_ul]:list-disc [&_ul]:pl-10 [&_ol]:list-decimal [&_ol]:pl-10 [&_li]:mb-1",
                        darkClass("text-[#0c0c0c] dark:text-gray-100"),
                        settings?.listType === "bullet" && "list-disc ml-6",
                        settings?.listType === "number" && "list-decimal ml-6",
                        isFirstText && "drop-cap"
                      )}
                      dangerouslySetInnerHTML={{ __html: decodeHtml(bContent?.text || bContent || "") }}
                    />
                  );
                })()}

              {/* 2. STANDARD IMAGE BLOCKS */}
              {(type === "image" || type === "centered-image") && (
                <figure
                  className={cn(
                    "my-8",
                    type === "centered-image" && "max-w-[80%] mx-auto text-center"
                  )}
                >
                  <img
                    src={bContent?.src || block.image}
                    alt={bContent?.caption || block.caption || ""}
                    className={cn(
                      "w-full rounded-xl shadow-sm border border-gray-100",
                      type === "centered-image" ? "max-h-[600px] object-cover" : "h-auto"
                    )}
                  />
                  {(bContent?.caption || block.caption) && (
                    <figcaption
                      className={cn(
                        "text-sm text-center mt-4 italic",
                        darkClass("text-gray-500 dark:text-gray-400")
                      )}
                    >
                      {bContent?.caption || block.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* 3. SIDE IMAGES */}
              {(type === "left-image" || type === "right-image") && (
                <div
                  className={cn(
                    "my-12 flex gap-10 items-start flex-col md:flex-row",
                    type === "right-image" && "md:flex-row-reverse"
                  )}
                >
                  <div className="w-full md:w-[280px] shrink-0">
                    <img
                      src={bContent?.image || bContent?.src || block.image}
                      alt=""
                      className="w-full aspect-square object-cover rounded-2xl shadow-md"
                    />
                    {(bContent?.caption || block.caption) && (
                      <p
                        className={cn(
                          "text-xs mt-3 italic text-center leading-tight",
                          darkClass("text-gray-400")
                        )}
                      >
                        {bContent?.caption || block.caption}
                      </p>
                    )}
                  </div>
                  <div
                    style={blockStyle}
                    className={cn(
                      "whitespace-pre-wrap flex-1 text-[18px] leading-[34px] tiptap [&_p]:min-h-[1.5em] [&_ul]:list-disc [&_ul]:pl-10 [&_ol]:list-decimal [&_ol]:pl-10 [&_li]:mb-1",
                      darkClass("text-[#0c0c0c] dark:text-gray-200")
                    )}
                    dangerouslySetInnerHTML={{ __html: decodeHtml(bContent?.text || bContent || "") }}
                  />
                </div>
              )}

              {/* 4. GRIDS */}
              {type === "grid" && (
                <div
                  className={cn(
                    "my-10 grid gap-6",
                    bContent?.images?.length === 3 ? "grid-cols-3" : "grid-cols-2"
                  )}
                >
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
              {(type === "split-left" || type === "split-right") && (
                <div
                  className={cn(
                    "my-12 flex flex-col md:flex-row rounded-3xl overflow-hidden min-h-[450px] shadow-sm border border-gray-100/10",
                    darkClass("bg-gray-50 dark:bg-white/5"),
                    type === "split-right" && "md:flex-row-reverse"
                  )}
                >
                  <div className="flex-1 min-h-[350px]">
                    <img
                      src={bContent?.image || block.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    style={blockStyle}
                    className={cn(
                      "whitespace-pre-wrap flex-1 p-10 md:p-14 flex items-center text-[22px] leading-[1.4] font-medium tracking-tight tiptap [&_p]:min-h-[1.5em] [&_ul]:list-disc [&_ul]:pl-10 [&_ol]:list-decimal [&_ol]:pl-10 [&_li]:mb-1",
                      darkClass("text-[#111827] dark:text-white")
                    )}
                    dangerouslySetInnerHTML={{ __html: decodeHtml(bContent?.text || bContent || "") }}
                  />
                </div>
              )}

              {/* 6. DYNAMIC IMAGES */}
              {type === "dynamic-images" && (
                <div className="my-10 space-y-6">
                  {bContent?.images?.map((img: string, i: number) => (
                    <img key={i} src={img} className="w-full rounded-2xl shadow-md" />
                  ))}
                </div>
              )}
            </div>

            {/* Ad after first block */}
            {idx === 0 && (
              <AdSpace className="my-10" width={728} height={90} rotateInterval={10000} />
            )}
          </div>
        );
      })}
    </div>
  );
}
