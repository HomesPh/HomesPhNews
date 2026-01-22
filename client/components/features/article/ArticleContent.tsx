"use client";

interface ArticleContentProps {
  content: string;
  topics: string[];
}

const AdPlaceholder = ({ label }: { label: string }) => (
  <div className="bg-white border border-dashed border-[#e5e7eb] rounded-[12px] p-[40px] text-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] my-8">
    <p className="font-semibold text-[16px] text-[#111827] tracking-[-0.5px] leading-[20px] mb-[10px]">
      Advertisement Space
    </p>
    <p className="font-normal text-[12px] text-[#6b7280] tracking-[-0.5px]">
      {label}
    </p>
  </div>
);

export default function ArticleContent({ content, topics }: ArticleContentProps) {
  return (
    <article className="my-8">
      {/* Advertisement Top */}
      <AdPlaceholder label="300x600 Leaderboard Ad" />

      {/* Main Content */}
      {/* Main Content - CNN Style */}
      <div className="prose prose-lg max-w-none mb-12">
        {content.includes('<p>') ? (
          // If content is already HTML, use it directly but style the first paragraph via CSS if possible, 
          // or just render it. For now, let's render standard HTML with updated typography.
          <div
            className="text-[18px] leading-[32px] text-[#0c0c0c] [&>p]:mb-6 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:text-[72px] [&>p:first-of-type]:first-letter:leading-[64px] [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:font-bold"
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
              if (idx === 0) {
                const firstChar = trimmed.charAt(0);
                const restOfText = trimmed.slice(1);
                return (
                  <p
                    key={idx}
                    className="text-[19px] leading-[32px] text-[#0c0c0c] mb-6 font-normal"
                  >
                    <span className="float-left text-[72px] leading-[64px] mr-3 mt-1 font-bold text-[#0c0c0c]">
                      {firstChar}
                    </span>
                    {restOfText}
                  </p>
                );
              }

              // Regular paragraphs
              return (
                <p
                  key={idx}
                  className="text-[18px] leading-[32px] text-[#0c0c0c] mb-6 font-normal"
                >
                  {trimmed}
                </p>
              );
            });
          })()
        )}
      </div>

      {/* Topics Section */}
      <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[10px] mt-8">
        <p className="font-semibold text-[15px] text-[#111827] tracking-[-0.5px] leading-[20px]">
          Topics:
        </p>
        <div className="flex gap-[7px] items-center flex-wrap">
          {topics.map(tag => (
            <span
              key={tag}
              className="bg-white border border-[#e5e7eb] px-[10px] py-[6px] rounded-[99px] font-normal text-[12px] text-black tracking-[-0.5px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
