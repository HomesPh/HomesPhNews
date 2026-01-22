import svgPaths from "./svg-u5e27irkly";
import imgImg from "figma:asset/dafae450bc508ebd08c3ee95f0584c6a055c5091.png";

function Div3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[129.063px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[#111827] text-[24px] tracking-[-0.5px] w-full">Edit Article</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 20">
        <g id="Frame">
          <path d="M15 20H0V0H15V20Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p36f06cb0} fill="var(--fill-0, #6B7280)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center justify-center left-0 top-[3.5px] w-[15px]" data-name="svg">
      <Frame />
    </div>
  );
}

function I() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[28px] left-[8.5px] top-[2px] w-[15px]" data-name="i">
      <Svg />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative rounded-[9999px] shrink-0 size-[32px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <I />
    </div>
  );
}

function Div2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[32px] py-[24px] relative w-full">
          <Div3 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[1036px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Article Title</p>
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[78.05px] not-italic text-[#ef4444] text-[14px] top-px tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[16px] text-black text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[1002px]">
        <p className="css-g0mm18 leading-[24px] overflow-hidden">{`Philippines Emerges as Southeast Asia's AI Outsourcing Leader`}</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label />
      <Input />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Frame">
          <g clipPath="url(#clip0_5_636)">
            <path d={svgPaths.p14080980} fill="var(--fill-0, #9CA3AF)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_636">
            <path d="M0 0H12V12H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[12px] top-[1.5px]" data-name="svg">
      <Frame1 />
    </div>
  );
}

function I1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[15px] left-[37.64px] top-[3px] w-[12px]" data-name="i">
      <Svg1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[1036px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">{`Slug `}</p>
      <I1 />
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[14px] text-black text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[1002px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">philippines-emerges-ai-outsourcing-leader</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label1 />
      <Input1 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">globalnews.com/articles/philippines-emerges-ai-outsourcing-leader</p>
    </div>
  );
}

function Label2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[1036px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Article Summary</p>
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[113.17px] not-italic text-[#ef4444] text-[14px] top-px tracking-[-0.5px]">*</p>
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[978.61px] not-italic text-[#6b7280] text-[14px] top-0 tracking-[-0.5px]">248/300</p>
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-white h-[98px] relative rounded-[8px] shrink-0 w-full" data-name="textarea">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[15px] not-italic text-[16px] text-black top-[13px] tracking-[-0.5px] w-[719px]">Major international companies turning to Filipino talent for AI development, creating thousands of high-paying jobs.</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label2 />
      <Textarea />
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[24px] items-start pb-0 pt-[32px] px-0 relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Div6 />
      <Div7 />
      <Div8 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[6px] items-center leading-[normal] min-h-px min-w-px not-italic relative text-[14px] tracking-[-0.5px]">
      <p className="css-ew64yg relative shrink-0 text-[#111827]">Featured Image</p>
      <p className="css-ew64yg relative shrink-0 text-[#ef4444]">*</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#3b82f6] text-[14px] tracking-[-0.5px]">Generate Image</p>
    </div>
  );
}

function Label3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex h-[18px] items-start justify-between px-0 py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function Img() {
  return (
    <div className="absolute left-0 pointer-events-none size-[1036px] top-0" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div13() {
  return <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[582.75px] left-0 top-0 w-[1036px]" data-name="div" />;
}

function Div12() {
  return (
    <div className="absolute bg-[#f3f4f6] border-0 border-[#e5e7eb] border-solid h-[503px] left-0 overflow-clip rounded-[12px] top-0 w-[754px]" data-name="div">
      <Img />
      <Div13 />
    </div>
  );
}

function Div11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[503px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div12 />
    </div>
  );
}

function P() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] mr-[-29px] relative shrink-0 w-[968px]" data-name="p">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[484.5px] not-italic text-[#374151] text-[16px] text-center top-[2px] tracking-[-0.5px] translate-x-[-50%]">Drag image here or click to browse</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[48px] relative shrink-0 w-[60px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 48">
        <g id="Frame">
          <path d="M60 48H0V0H60V48Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p334c8c00} fill="var(--fill-0, #9CA3AF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-center left-0 top-[5px] w-[60px]" data-name="svg">
      <Frame2 />
    </div>
  );
}

function I2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[59px] mr-[-29px] relative shrink-0 w-[60px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg2 />
    </div>
  );
}

function P1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] mr-[-29px] relative shrink-0 w-[968px]" data-name="p">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[484px] not-italic text-[#6b7280] text-[14px] text-center top-px tracking-[-0.5px] translate-x-[-50%]">Recommended: 1200×630px, max 5MB</p>
    </div>
  );
}

function Div14() {
  return (
    <div className="bg-[#f9fafb] content-center flex flex-wrap gap-[4px] items-center justify-center pl-0 pr-[29px] py-[29px] relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#d1d5db] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <P />
      <I2 />
      <P1 />
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label3 />
      <Div11 />
      <Div14 />
    </div>
  );
}

function Label4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[20px] left-0 not-italic text-[14px] top-0 tracking-[-0.5px] w-[1036px]" data-name="label">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 text-[#111827] top-px">Article Content</p>
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[102.23px] text-[#ef4444] top-px">*</p>
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[965.83px] text-[#6b7280] top-0">487 words</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute left-[89px] size-[17px] top-[7px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p2ec00180} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Select() {
  return (
    <div className="absolute bg-white border border-[#d1d5db] border-solid h-[33px] left-0 rounded-[4px] top-0 w-[115px]" data-name="select">
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[33px] justify-center leading-[0] left-[11px] not-italic overflow-hidden text-[14px] text-black text-ellipsis top-[15.5px] tracking-[-0.5px] translate-y-[-50%] w-[65px]">
        <p className="css-g0mm18 leading-[normal] overflow-hidden">Paragraph</p>
      </div>
      <Frame3 />
    </div>
  );
}

function Div18() {
  return <div className="absolute bg-[#d1d5db] border-0 border-[#e5e7eb] border-solid h-[24px] left-[123px] top-[4.5px] w-px" data-name="div" />;
}

function Frame4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 16">
        <g id="Frame">
          <path d="M12 16H0V0H12V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2d31a500} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg3() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[12px]" data-name="svg">
      <Frame4 />
    </div>
  );
}

function I3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[10px] top-[4px] w-[12px]" data-name="i">
      <Svg3 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[132px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[16px] relative shrink-0 w-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 16">
        <g id="Frame">
          <path d="M12 16H0V0H12V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2d696000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg4() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[12px]" data-name="svg">
      <Frame5 />
    </div>
  );
}

function I4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[10px] top-[4px] w-[12px]" data-name="i">
      <Svg4 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[172px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <path d="M14 16H0V0H14V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p7528b00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg5() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[14px]" data-name="svg">
      <Frame6 />
    </div>
  );
}

function I5() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[9px] top-[4px] w-[14px]" data-name="i">
      <Svg5 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[212px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I5 />
    </div>
  );
}

function Div19() {
  return <div className="absolute bg-[#d1d5db] border-0 border-[#e5e7eb] border-solid h-[24px] left-[252px] top-[4.5px] w-px" data-name="div" />;
}

function Frame7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p3d897a80} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[4px]" data-name="svg">
      <Frame7 />
    </div>
  );
}

function I6() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[8px] top-[4px] w-[16px]" data-name="i">
      <Svg6 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[261px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I6 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <g clipPath="url(#clip0_5_621)">
            <path d={svgPaths.p30dad200} fill="var(--fill-0, black)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_621">
            <path d="M0 0H16V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[4px]" data-name="svg">
      <Frame8 />
    </div>
  );
}

function I7() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[8px] top-[4px] w-[16px]" data-name="i">
      <Svg7 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[301px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I7 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <path d="M14 16H0V0H14V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p1f35b800} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg8() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[14px]" data-name="svg">
      <Frame9 />
    </div>
  );
}

function I8() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[9px] top-[4px] w-[14px]" data-name="i">
      <Svg8 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[341px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I8 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <path d="M14 16H0V0H14V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p37441500} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg9() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[14px]" data-name="svg">
      <Frame10 />
    </div>
  );
}

function I9() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[9px] top-[4px] w-[14px]" data-name="i">
      <Svg9 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[381px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I9 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <path d="M14 16H0V0H14V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p391a77f0} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg10() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[14px]" data-name="svg">
      <Frame11 />
    </div>
  );
}

function I10() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[9px] top-[4px] w-[14px]" data-name="i">
      <Svg10 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[421px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I10 />
    </div>
  );
}

function Div20() {
  return <div className="absolute bg-[#d1d5db] border-0 border-[#e5e7eb] border-solid h-[24px] left-[461px] top-[4.5px] w-px" data-name="div" />;
}

function Frame12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
        <g id="Frame">
          <g clipPath="url(#clip0_5_603)">
            <path d={svgPaths.p3527010} fill="var(--fill-0, black)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_603">
            <path d="M0 0H20V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg11() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[20px]" data-name="svg">
      <Frame12 />
    </div>
  );
}

function I11() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[6px] top-[4px] w-[20px]" data-name="i">
      <Svg11 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[470px] rounded-[4px] size-[32px] top-[0.5px]" data-name="button">
      <I11 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="h-[33px] relative shrink-0 w-[502px]">
      <Select />
      <Div18 />
      <Button1 />
      <Button2 />
      <Button3 />
      <Div19 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Div20 />
      <Button9 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p1012dc00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg12() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[4px]" data-name="svg">
      <Frame13 />
    </div>
  );
}

function I12() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[8px] top-[4px] w-[16px]" data-name="i">
      <Svg12 />
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-0 rounded-[4px] size-[32px] top-0" data-name="button">
      <I12 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p7fb5e80} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg13() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[4px]" data-name="svg">
      <Frame14 />
    </div>
  );
}

function I13() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[8px] top-[4px] w-[16px]" data-name="i">
      <Svg13 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[40px] rounded-[4px] size-[32px] top-0" data-name="button">
      <I13 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <path d="M14 16H0V0H14V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2d53bf00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg14() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[14px]" data-name="svg">
      <Frame15 />
    </div>
  );
}

function I14() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[9px] top-[4px] w-[14px]" data-name="i">
      <Svg14 />
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-[80px] rounded-[4px] size-[32px] top-0" data-name="button">
      <I14 />
    </div>
  );
}

function Div21() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[32px] relative shrink-0 w-[112px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Div17() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-between left-0 px-[16px] py-[12px] top-0 w-[753px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Frame24 />
      <Div21 />
    </div>
  );
}

function Textarea1() {
  return (
    <div className="absolute bg-white border-0 border-[#e5e7eb] border-solid h-[311px] left-0 overflow-clip top-[58px] w-[753px]" data-name="textarea">
      <div className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[26px] left-[20px] not-italic text-[#1d1d1e] text-[16px] top-[20px] tracking-[-0.5px] w-[716px]">
        <p className="css-4hzbpn mb-0">Major international companies increasingly turning to Filipino talent for AI development and training, creating thousands of high-paying jobs across the archipelago.</p>
        <p className="css-4hzbpn mb-0">&nbsp;</p>
        <p className="css-4hzbpn mb-0">{`The Philippines has emerged as a leading destination for artificial intelligence outsourcing, with tech giants and startups alike establishing operations in Manila, Cebu, and other major cities. This trend is driven by the country's large pool of English-speaking, tech-savvy workers and competitive labor costs.`}</p>
        <p className="css-4hzbpn mb-0">&nbsp;</p>
        <p className="css-4hzbpn">Industry experts predict this sector will continue to grow rapidly, potentially adding billions to the Philippine economy over the next decade.</p>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border border-[#d1d5db] border-solid h-[356px] left-0 overflow-clip rounded-[8px] top-[32px] w-[754px]" data-name="div">
      <Div17 />
      <Textarea1 />
    </div>
  );
}

function Div15() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[388px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label4 />
      <Div16 />
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[32px] items-start px-0 py-[32px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Div10 />
      <Div15 />
    </div>
  );
}

function Label5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Category</p>
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[62.73px] not-italic text-[#ef4444] text-[14px] top-px tracking-[-0.5px]">*</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.pfd263c0} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Select1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="select">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] py-0 relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[64px]">
            <p className="css-g0mm18 leading-[normal] overflow-hidden">Business</p>
          </div>
          <Frame16 />
        </div>
      </div>
    </div>
  );
}

function Div24() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label5 />
      <Select1 />
    </div>
  );
}

function Label6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Country</p>
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[54.94px] not-italic text-[#ef4444] text-[14px] top-px tracking-[-0.5px]">*</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.pfd263c0} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Select2() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="select">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] py-0 relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[77px]">
            <p className="css-g0mm18 leading-[normal] overflow-hidden">Philippines</p>
          </div>
          <Frame17 />
        </div>
      </div>
    </div>
  );
}

function Div25() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label6 />
      <Select2 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <Div24 />
      <Div25 />
    </div>
  );
}

function Label7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Tags</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="h-[12px] relative shrink-0 w-[9px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 12">
        <g id="Frame">
          <path d="M9 12H0V0H9V12Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2178b900} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg15() {
  return (
    <div className="absolute content-stretch flex h-[12px] items-center justify-center left-0 top-[1.5px] w-[9px]" data-name="svg">
      <Frame18 />
    </div>
  );
}

function I15() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[16px] left-[89.75px] top-[8.5px] w-[9px]" data-name="i">
      <Svg15 />
    </div>
  );
}

function Span() {
  return (
    <div className="bg-[#3b82f6] h-[33px] relative rounded-[20px] shrink-0 w-[110.75px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[12px] not-italic text-[14px] text-white top-[8px] tracking-[-0.5px]">{`Philippines `}</p>
      <I15 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="h-[12px] relative shrink-0 w-[9px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 12">
        <g id="Frame">
          <path d="M9 12H0V0H9V12Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2178b900} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg16() {
  return (
    <div className="absolute content-stretch flex h-[12px] items-center justify-center left-0 top-[1.5px] w-[9px]" data-name="svg">
      <Frame19 />
    </div>
  );
}

function I16() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[16px] left-[31.42px] top-[8.5px] w-[9px]" data-name="i">
      <Svg16 />
    </div>
  );
}

function Span1() {
  return (
    <div className="bg-[#3b82f6] h-[33px] relative rounded-[20px] shrink-0 w-[52.422px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[12px] not-italic text-[14px] text-white top-[8px] tracking-[-0.5px]">{`AI `}</p>
      <I16 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="h-[12px] relative shrink-0 w-[9px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 12">
        <g id="Frame">
          <path d="M9 12H0V0H9V12Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2178b900} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg17() {
  return (
    <div className="absolute content-stretch flex h-[12px] items-center justify-center left-0 top-[1.5px] w-[9px]" data-name="svg">
      <Frame20 />
    </div>
  );
}

function I17() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[16px] left-[96.47px] top-[8.5px] w-[9px]" data-name="i">
      <Svg17 />
    </div>
  );
}

function Span2() {
  return (
    <div className="bg-[#3b82f6] h-[33px] relative rounded-[20px] shrink-0 w-[117.469px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[12px] not-italic text-[14px] text-white top-[8px] tracking-[-0.5px]">{`outsourcing `}</p>
      <I17 />
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white h-[33px] relative shrink-0 w-[101px]" data-name="input">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[33px] justify-center leading-[0] left-0 not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[16.5px] tracking-[-0.5px] translate-y-[-50%] w-[175.359px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Add tag...</p>
      </div>
    </div>
  );
}

function Div27() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[13px] relative w-full">
          <Span />
          <Span1 />
          <Span2 />
          <Input2 />
        </div>
      </div>
    </div>
  );
}

function Div26() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label7 />
      <Div27 />
    </div>
  );
}

function Label8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Author</p>
    </div>
  );
}

function Select3() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="select">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-0 relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[94px]">
            <p className="css-g0mm18 leading-[normal] overflow-hidden">Maria Santos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Div28() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label8 />
      <Select3 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <Div26 />
      <Div28 />
    </div>
  );
}

function Div23() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame25 />
      <Frame26 />
    </div>
  );
}

function Div22() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start px-0 py-[32px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Div23 />
    </div>
  );
}

function Label9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Publish Date</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p347fa80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Svg18() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="svg">
      <Frame21 />
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-px relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[304px]">
            <p className="css-g0mm18 leading-[24px] overflow-hidden">2026-01-12</p>
          </div>
          <Svg18 />
        </div>
      </div>
    </div>
  );
}

function Div32() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label9 />
      <Input3 />
    </div>
  );
}

function Label10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Publish Time</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p19fddb00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Svg19() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="svg">
      <Frame27 />
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-px relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[292px]">
            <p className="css-g0mm18 leading-[24px] overflow-hidden">14:30</p>
          </div>
          <Svg19 />
        </div>
      </div>
    </div>
  );
}

function Div33() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label10 />
      <Input4 />
    </div>
  );
}

function Div31() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div32 />
      <Div33 />
    </div>
  );
}

function Label11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[988px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Publish To</p>
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[70.14px] not-italic text-[#ef4444] text-[14px] top-px tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input5() {
  return <div className="absolute bg-white border-[0.5px] border-black border-solid left-0 rounded-[1px] size-[16px] top-[4px]" data-name="input" />;
}

function Label12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-[988px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input5 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[28px] not-italic text-[#111827] text-[16px] top-0 tracking-[-0.5px]">FilipinoHomes</p>
    </div>
  );
}

function Input6() {
  return <div className="absolute bg-white border-[0.5px] border-black border-solid left-0 rounded-[1px] size-[16px] top-[4px]" data-name="input" />;
}

function Label13() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-[988px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input6 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[28px] not-italic text-[#111827] text-[16px] top-0 tracking-[-0.5px]">Rent.ph</p>
    </div>
  );
}

function Input7() {
  return <div className="absolute bg-white border-[0.5px] border-black border-solid left-0 rounded-[1px] size-[16px] top-[4px]" data-name="input" />;
}

function Label14() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-[988px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input7 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[28px] not-italic text-[#111827] text-[16px] top-0 tracking-[-0.5px]">Homes</p>
    </div>
  );
}

function Input8() {
  return <div className="absolute bg-white border-[0.5px] border-black border-solid left-0 rounded-[1px] size-[16px] top-[4px]" data-name="input" />;
}

function Label15() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-[988px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input8 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[28px] not-italic text-[#111827] text-[16px] top-0 tracking-[-0.5px]">Bayanihan</p>
    </div>
  );
}

function Check() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Check">
          <path d="M10 3L4.5 8.5L2 6" id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Div37() {
  return (
    <div className="absolute bg-[#111827] content-stretch flex items-center left-0 p-[2px] rounded-[1px] size-[16px] top-0" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#111827] border-solid inset-0 pointer-events-none rounded-[1px]" />
      <Check />
    </div>
  );
}

function Div36() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 size-[16px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div37 />
    </div>
  );
}

function Label16() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center relative shrink-0 w-[988px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div36 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Main News Portal</p>
    </div>
  );
}

function Div35() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label12 />
      <Label13 />
      <Label14 />
      <Label15 />
      <Label16 />
    </div>
  );
}

function Div34() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label11 />
      <Div35 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Article will be published to selected sites</p>
    </div>
  );
}

function Div30() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
        <Div31 />
        <Div34 />
      </div>
    </div>
  );
}

function Div29() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start px-0 py-[32px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Div30 />
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[776px] relative shrink-0 w-full" data-name="div">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[32px] py-0 relative size-full">
          <Div5 />
          <Div9 />
          <Div22 />
          <Div29 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[44px] relative rounded-[8px] shrink-0 w-[93.109px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[47.05px] not-italic text-[#374151] text-[16px] text-center top-[12px] tracking-[-0.5px] translate-x-[-50%]">Cancel</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <path d="M14 16H0V0H14V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p3031ba80} fill="var(--fill-0, #374151)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg20() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[14px]" data-name="svg">
      <Frame28 />
    </div>
  );
}

function I18() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-[14px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg20 />
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-white content-stretch flex gap-[12px] items-center justify-center px-[18px] py-[11px] relative rounded-[8px] shrink-0 w-[144px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I18 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[16px] text-center tracking-[-0.5px]">{` Save as Draft`}</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <g clipPath="url(#clip0_5_576)">
            <path d={svgPaths.p921bd00} fill="var(--fill-0, white)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_576">
            <path d="M0 0H14V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg21() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[14px]" data-name="svg">
      <Frame29 />
    </div>
  );
}

function I19() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-[14px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg21 />
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-[#3b82f6] content-stretch flex gap-[12px] items-center px-[18px] py-[10px] relative rounded-[8px] shrink-0" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I19 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.5px]">{` Save Changes`}</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <g clipPath="url(#clip0_5_576)">
            <path d={svgPaths.p921bd00} fill="var(--fill-0, white)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_576">
            <path d="M0 0H14V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg22() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[4px] w-[14px]" data-name="svg">
      <Frame30 />
    </div>
  );
}

function I20() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-[14px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg22 />
    </div>
  );
}

function Button16() {
  return (
    <div className="bg-[#16a34a] content-stretch flex gap-[12px] items-center px-[17px] py-[10px] relative rounded-[8px] shrink-0" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I20 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.5px]">{` Publish Now`}</p>
    </div>
  );
}

function Div39() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
    </div>
  );
}

function Div38() {
  return (
    <div className="bg-white h-[86px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[32px] py-[33px] relative size-full">
          <Div39 />
        </div>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[311px] rounded-[16px] top-[336px] w-[818px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)]" />
      <Div2 />
      <Div4 />
      <Div38 />
    </div>
  );
}

export default function Div() {
  return (
    <div className="bg-[rgba(0,0,0,0.4)] border-0 border-[#e5e7eb] border-solid relative size-full" data-name="div">
      <Div1 />
    </div>
  );
}