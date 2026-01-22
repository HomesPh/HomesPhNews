import svgPaths from "./svg-yuh92usfq2";
import imgImg from "figma:asset/bec21fc75386a86210d32bec8ca98fcb2380d21e.png";
import imgImg1 from "figma:asset/5dd8bf25056a2e777c434d97dc8134d7968b5a17.png";

function Div() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-px items-end relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.5px]">John Smith</p>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.5px]">Admin</p>
    </div>
  );
}

function Img() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[50px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[9999px] size-full" src={imgImg} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Div1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[10px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div />
      <Img />
    </div>
  );
}

function Div2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="h-[16px] relative shrink-0 w-[24px]" data-name="Icon">
        <div className="absolute inset-[-9.38%_-6.25%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 19">
            <path d={svgPaths.p3ee77780} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <Div1 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[77px] items-start justify-center left-0 px-[32px] py-[24px] top-0 w-[1200px]" data-name="header">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <Div2 />
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[60px] relative shrink-0 w-[355.578px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#111827] text-[30px] top-0 tracking-[-0.5px]">Article Management</p>
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4b5563] text-[14px] top-[40px] tracking-[-0.5px]">Manage and review all articles across the platform</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <path d="M14 16H0V0H14V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2cd26500} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[2px] w-[14px]" data-name="svg">
      <Frame />
    </div>
  );
}

function I() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[14px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#c10007] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[20px] py-[12px] relative rounded-[6px] shrink-0" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <I />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.5px]">New Article</p>
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-between relative shrink-0 w-[1136px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div3 />
      <Button />
    </div>
  );
}

function Span() {
  return (
    <div className="bg-[#c10007] h-[25px] relative rounded-[9999px] shrink-0 w-[24.969px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[12.48px] not-italic text-[14px] text-center text-white top-[4px] tracking-[-0.5px] translate-x-[-50%]">8</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[15px] items-center justify-center relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#c10007] text-[16px] text-center tracking-[-0.5px]">{`All Articles `}</p>
      <Span />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] flex-[1_0_0] h-[44px] min-h-px min-w-px relative" data-name="button">
      <div aria-hidden="true" className="absolute border-[#c10007] border-b-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[8px] py-0 relative size-full">
          <Frame16 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Frame">
          <g clipPath="url(#clip0_1_708)">
            <path d={svgPaths.p921bd00} fill="var(--fill-0, #4B5563)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_708">
            <path d="M0 0H14V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[2px] w-[14px]" data-name="svg">
      <Frame1 />
    </div>
  );
}

function I1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[14px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg1 />
    </div>
  );
}

function Span1() {
  return (
    <div className="bg-[#e5e7eb] h-[25px] relative rounded-[9999px] shrink-0 w-[24.453px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[12.73px] not-italic text-[#4b5563] text-[14px] text-center top-[4px] tracking-[-0.5px] translate-x-[-50%]">5</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] flex-[1_0_0] min-h-px min-w-px relative" data-name="button">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-center px-[8px] py-0 relative w-full">
          <I1 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] text-center tracking-[-0.5px]">{`Published `}</p>
          <Span1 />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <g clipPath="url(#clip0_1_711)">
            <path d={svgPaths.p803d900} fill="var(--fill-0, #4B5563)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_711">
            <path d="M0 0H16V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[2px]" data-name="svg">
      <Frame2 />
    </div>
  );
}

function I2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[16px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg2 />
    </div>
  );
}

function Span2() {
  return (
    <div className="bg-[#e5e7eb] h-[25px] relative rounded-[9999px] shrink-0 w-[24.781px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[12.39px] not-italic text-[#4b5563] text-[14px] text-center top-[4px] tracking-[-0.5px] translate-x-[-50%]">3</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] flex-[1_0_0] min-h-px min-w-px relative" data-name="button">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[14px] items-center justify-center px-[8px] py-0 relative w-full">
          <I2 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] text-center tracking-[-0.5px]">{`Pending Review `}</p>
          <Span2 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 16">
        <g id="Frame">
          <path d="M12 16H0V0H12V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.pf5d1f80} fill="var(--fill-0, #4B5563)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg3() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[2px] w-[12px]" data-name="svg">
      <Frame3 />
    </div>
  );
}

function I3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[12px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg3 />
    </div>
  );
}

function Span3() {
  return (
    <div className="bg-[#e5e7eb] h-[25px] relative rounded-[9999px] shrink-0 w-[25.047px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[12.52px] not-italic text-[#4b5563] text-[14px] text-center top-[4px] tracking-[-0.5px] translate-x-[-50%]">0</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] flex-[1_0_0] min-h-px min-w-px relative" data-name="button">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-center px-[8px] py-0 relative w-full">
          <I3 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] text-center tracking-[-0.5px]">{`Rejected `}</p>
          <Span3 />
        </div>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Div5 />
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start pb-0 pt-[20px] px-0 relative rounded-tl-[12px] rounded-tr-[12px] shrink-0 w-full" data-name="div">
      <Div6 />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] left-[48px] not-italic overflow-hidden text-[#adaebc] text-[16px] text-ellipsis top-[25px] tracking-[-0.5px] translate-y-[-50%] w-[843px]">
        <p className="css-g0mm18 leading-[24px] overflow-hidden">Search articles...</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <g clipPath="url(#clip0_1_696)">
            <path d={svgPaths.p1d73a600} fill="var(--fill-0, #9CA3AF)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_696">
            <path d="M0 0H16V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[4px]" data-name="svg">
      <Frame4 />
    </div>
  );
}

function I4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] h-[24px] left-[16px] top-[13px] w-[16px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg4 />
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[746px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input />
      <I4 />
    </div>
  );
}

function Select() {
  return (
    <div className="bg-white h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="select">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[50px] justify-center leading-[0] left-[12px] not-italic overflow-hidden text-[16px] text-black text-ellipsis top-[25px] tracking-[-0.5px] translate-y-[-50%] w-[88px]">
        <p className="css-g0mm18 leading-[normal] overflow-hidden">All Category</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p10900d80} fill="var(--fill-0, #9CA3AF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg5() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[4px]" data-name="svg">
      <Frame5 />
    </div>
  );
}

function I5() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] h-[24px] left-[128px] top-[13px] w-[16px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg5 />
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Select />
      <I5 />
    </div>
  );
}

function Select1() {
  return (
    <div className="bg-white h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="select">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[50px] justify-center leading-[0] left-[12px] not-italic overflow-hidden text-[16px] text-black text-ellipsis top-[25px] tracking-[-0.5px] translate-y-[-50%] w-[90px]">
        <p className="css-g0mm18 leading-[normal] overflow-hidden">All Countries</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p10900d80} fill="var(--fill-0, #9CA3AF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[4px]" data-name="svg">
      <Frame6 />
    </div>
  );
}

function I6() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] h-[24px] left-[131px] top-[13px] w-[16px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg6 />
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Select1 />
      <I6 />
    </div>
  );
}

function Div11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[16px] items-center relative shrink-0 w-[1101px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div8 />
      <Div9 />
      <Div10 />
    </div>
  );
}

function Div12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start p-[20px] relative w-full">
        <Div11 />
      </div>
    </div>
  );
}

function Img1() {
  return (
    <div className="absolute h-[106px] left-0 pointer-events-none top-[-0.05px] w-[118px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg1} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div13() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[106px] relative rounded-[8px] shrink-0 w-[118px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img1 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Span4() {
  return (
    <div className="bg-white h-[24px] relative rounded-[4px] shrink-0 w-[84.094px]" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[42.05px] not-italic text-[12px] text-black text-center top-[4px] tracking-[-0.5px] translate-x-[-50%]">Technology</p>
    </div>
  );
}

function Div14() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Span4 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.5px]">|</p>
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">USA</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[12px] relative shrink-0 w-[11px]" data-name="Icon">
        <div className="absolute inset-[-6.25%_-6.82%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 13.5">
            <path d={svgPaths.p17fac00} id="Icon" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[13px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px] w-[91px]">
        <p className="css-4hzbpn leading-[20px]">January 14, 2026</p>
      </div>
    </div>
  );
}

function Div15() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame10 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[13px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] tracking-[-0.5px] w-[9px]">
        <p className="css-4hzbpn leading-[24px]">•</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[13px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px] w-[53px]">
        <p className="css-4hzbpn leading-[20px]">100 views</p>
      </div>
    </div>
  );
}

function Span5() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">Main Portal</p>
    </div>
  );
}

function Span6() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">Bayanihan</p>
    </div>
  );
}

function Div16() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Published on:</p>
      <Span5 />
      <Span6 />
    </div>
  );
}

function Div17() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col h-[152px] items-start justify-between min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div14 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[18px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] tracking-[-0.5px] w-full">
        <p className="css-4hzbpn leading-[32px]">AI Revolution: How Machine Learning is Transforming Healthcare in North America</p>
      </div>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#4b5563] text-[14px] tracking-[-0.5px] w-[min-content]">Computer researchers develop groundbreaking AI system that can detect early signs of cancer with 98% accuracy, potentially saving thousands of lives annually.</p>
      <Div15 />
      <Div16 />
    </div>
  );
}

function Div18() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[13px] items-start p-[20px] relative w-full">
        <Div13 />
        <Div17 />
      </div>
    </div>
  );
}

function Img2() {
  return (
    <div className="absolute h-[106px] left-0 pointer-events-none top-[-0.05px] w-[118px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg1} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div19() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[106px] relative rounded-[8px] shrink-0 w-[118px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img2 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Span7() {
  return (
    <div className="bg-white h-[24px] relative rounded-[4px] shrink-0 w-[84.094px]" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[42.05px] not-italic text-[12px] text-black text-center top-[4px] tracking-[-0.5px] translate-x-[-50%]">Technology</p>
    </div>
  );
}

function Div20() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Span7 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.5px]">|</p>
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">USA</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[12px] relative shrink-0 w-[11px]" data-name="Icon">
        <div className="absolute inset-[-6.25%_-6.82%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 13.5">
            <path d={svgPaths.p17fac00} id="Icon" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[13px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px] w-[91px]">
        <p className="css-4hzbpn leading-[20px]">January 14, 2026</p>
      </div>
    </div>
  );
}

function Div21() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame11 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[13px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] tracking-[-0.5px] w-[9px]">
        <p className="css-4hzbpn leading-[24px]">•</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[13px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px] w-[53px]">
        <p className="css-4hzbpn leading-[20px]">100 views</p>
      </div>
    </div>
  );
}

function Span8() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">Main Portal</p>
    </div>
  );
}

function Span9() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">Bayanihan</p>
    </div>
  );
}

function Div22() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Published on:</p>
      <Span8 />
      <Span9 />
    </div>
  );
}

function Div23() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col h-[152px] items-start justify-between min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div20 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[18px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] tracking-[-0.5px] w-full">
        <p className="css-4hzbpn leading-[32px]">AI Revolution: How Machine Learning is Transforming Healthcare in North America</p>
      </div>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#4b5563] text-[14px] tracking-[-0.5px] w-[min-content]">Computer researchers develop groundbreaking AI system that can detect early signs of cancer with 98% accuracy, potentially saving thousands of lives annually.</p>
      <Div21 />
      <Div22 />
    </div>
  );
}

function Div24() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div className="content-stretch flex gap-[13px] items-start p-[20px] relative w-full">
        <Div19 />
        <Div23 />
      </div>
    </div>
  );
}

function Div25() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-[1136px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Div7 />
      <Div12 />
      {[...Array(2).keys()].map((_, i) => (
        <Div18 key={i} />
      ))}
      <Div24 />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col gap-[32px] h-[1014px] items-start left-0 p-[32px] top-[77px] w-[1200px]" data-name="main">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div4 />
      <Div25 />
    </div>
  );
}

function Div26() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[1091px] left-[240px] top-0 w-[1200px]" data-name="div">
      <Header />
      <Main />
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <g clipPath="url(#clip0_1_360)">
            <path d={svgPaths.p1c7a5700} fill="var(--fill-0, white)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_360">
            <path d="M0 0H20V20H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[20px] top-[3.5px]" data-name="svg">
      <Frame7 />
    </div>
  );
}

function I7() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[28px] left-[10px] top-[6px] w-[20px]" data-name="i">
      <Svg7 />
    </div>
  );
}

function Div27() {
  return (
    <div className="absolute bg-[#c10007] border-0 border-[#e5e7eb] border-solid left-0 rounded-[8px] size-[40px] top-[2px]" data-name="div">
      <I7 />
    </div>
  );
}

function Div28() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[44px] left-[48px] not-italic text-white top-0 tracking-[-0.5px] w-[147.641px]" data-name="div">
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 text-[20px] top-0">Global News</p>
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] top-[28px]">Network</p>
    </div>
  );
}

function Div29() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[44px] relative shrink-0 w-[195.641px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div27 />
      <Div28 />
    </div>
  );
}

function Div30() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[16px] relative shrink-0 w-[240px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Div29 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p1efa7f0} fill="var(--fill-0, white)" fillOpacity="0.7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg8() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame8 />
    </div>
  );
}

function I8() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg8 />
    </div>
  );
}

function Div31() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I8 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Articles</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2ee32b00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg9() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-name="svg">
      <Frame9 />
    </div>
  );
}

function Div32() {
  return (
    <div className="bg-[#c10007] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[16px] py-[12px] relative size-full">
          <Svg9 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.5px]">Articles</p>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p147cb180} fill="var(--fill-0, white)" fillOpacity="0.7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg10() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame12 />
    </div>
  );
}

function I9() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg10 />
    </div>
  );
}

function Div33() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I9 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Analytics</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <g clipPath="url(#clip0_1_341)">
            <path d={svgPaths.p33d8d640} fill="var(--fill-0, white)" fillOpacity="0.7" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_341">
            <path d="M0 0H16V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg11() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame13 />
    </div>
  );
}

function I10() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg11 />
    </div>
  );
}

function Div34() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I10 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Sites</p>
    </div>
  );
}

function I11() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 24">
        <g id="i">
          <path d="M20 24H0V0H20V24Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p33af9430} id="Icon" stroke="var(--stroke-0, #B7B9BF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Div35() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I11 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">{`Ads `}</p>
    </div>
  );
}

function I12() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 24">
        <g id="i">
          <path d="M20 24H0V0H20V24Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.pfeb1ff0} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Div36() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I12 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Calendar</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <g clipPath="url(#clip0_1_335)">
            <path d={svgPaths.p21a72d80} fill="var(--fill-0, white)" fillOpacity="0.7" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_335">
            <path d="M0 0H16V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg12() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame14 />
    </div>
  );
}

function I13() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg12 />
    </div>
  );
}

function Div37() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I13 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Settings</p>
    </div>
  );
}

function Nav() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[4px] items-start px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="nav">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div31 />
      <Div32 />
      <Div33 />
      <Div34 />
      <Div35 />
      <Div36 />
      <Div37 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Div30 />
      <Nav />
    </div>
  );
}

function I14() {
  return (
    <div className="h-[24px] relative shrink-0 w-[20px]" data-name="i">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 24">
        <g id="i">
          <path d="M20 24H0V0H20V24Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p25eadc00} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function Div38() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[32px] py-[20px] relative w-full">
          <I14 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)] tracking-[-0.5px]">Logout</p>
        </div>
      </div>
    </div>
  );
}

function Div39() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col h-[1091px] items-start justify-between left-0 top-0 w-[240px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame15 />
      <Div38 />
    </div>
  );
}

function Body() {
  return (
    <div className="bg-white h-[1091px] relative shrink-0 w-[1440px]" data-name="body">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div26 />
      <Div39 />
    </div>
  );
}

export default function Admin() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Admin">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Body />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#ced4da] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}