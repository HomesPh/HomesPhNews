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
      <div
        className="flex flex-col gap-[16px] text-[16px] text-[#4b5563] tracking-[-0.5px] leading-[28px]"
        dangerouslySetInnerHTML={{ __html: content }}
      />

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
