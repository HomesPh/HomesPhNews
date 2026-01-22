import svgPaths from "./svg-l1spgqzmcv";
import imgImg from "figma:asset/bec21fc75386a86210d32bec8ca98fcb2380d21e.png";
import imgImg1 from "figma:asset/5dd8bf25056a2e777c434d97dc8134d7968b5a17.png";
import imgImg2 from "figma:asset/c84bca73046c8f3c7314a1ed5802acea60687588.png";
import imgImg3 from "figma:asset/64c04c8966fc1f6082ba2016172bbd81c37aaa97.png";
import imgImg4 from "figma:asset/3a1fcc6d1ca539dce00a1745d4a8cb7bf2744c97.png";

function Div3() {
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

function Div2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[10px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div3 />
      <Img />
    </div>
  );
}

function Div1() {
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
      <Div2 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[77px] items-start justify-center left-0 px-[32px] py-[24px] top-0 w-[1200px]" data-name="header">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <Div1 />
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[60px] relative shrink-0 w-[355.578px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#111827] text-[30px] top-0 tracking-[-0.5px]">Dashboard</p>
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4b5563] text-[14px] top-[40px] tracking-[-0.5px]">{`Welcome back, John. Here's what's happening today.`}</p>
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-between relative shrink-0 w-[1136px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div5 />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d="M24 24H0V0H24V24Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p23e8f500} fill="var(--fill-0, #155DFC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[18px]" data-name="svg">
      <Frame />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] tracking-[-0.5px]">Total Articles</p>
      <Svg />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[9px] relative shrink-0 w-[16px]" data-name="Icon">
        <div className="absolute inset-[-13.89%_-7.81%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.5 11.5">
            <path d={svgPaths.p24eedb10} id="Icon" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[14px] tracking-[-0.5px]">+15.3%</p>
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative w-full">
        <Frame18 />
        <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[38px] tracking-[-0.5px]">8</p>
        <Frame27 />
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[14px] tracking-[-0.5px]">Published</p>
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <div className="absolute inset-[-6.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.5 20.5">
            <path d={svgPaths.pa30fe0} id="Icon" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[9px] relative shrink-0 w-[16px]" data-name="Icon">
        <div className="absolute inset-[-13.89%_-7.81%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.5 11.5">
            <path d={svgPaths.p24eedb10} id="Icon" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[14px] tracking-[-0.5px]">{`+12.8% `}</p>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative w-full">
        <Frame19 />
        <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[36px] tracking-[-0.5px]">6</p>
        <Frame28 />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Frame">
          <g clipPath="url(#clip0_1_443)">
            <path d={svgPaths.p3d874c00} fill="var(--fill-0, #F59E0B)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_443">
            <path d="M0 0H18V18H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[14px] tracking-[-0.5px]">Pending Review</p>
      <Frame1 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[9px] relative shrink-0 w-[16px]" data-name="Icon">
        <div className="absolute inset-[-13.89%_-7.81%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.5 11.5">
            <path d={svgPaths.p24eedb10} id="Icon" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[14px] tracking-[-0.5px]">{`+18.5% `}</p>
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative w-full">
        <Frame20 />
        <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[36px] tracking-[-0.5px]">10</p>
        <Frame29 />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[27px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 24">
        <g id="Frame">
          <g clipPath="url(#clip0_1_396)">
            <path d={svgPaths.pc157c00} fill="var(--fill-0, #A13DE4)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_396">
            <path d="M0 0H27V24H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="content-stretch flex h-[18px] items-center justify-center relative shrink-0 w-[20px]" data-name="svg">
      <Frame2 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] tracking-[-0.5px]">Total Views</p>
      <Svg1 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[9px] relative shrink-0 w-[16px]" data-name="Icon">
        <div className="absolute inset-[-13.89%_-7.81%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.5 11.5">
            <path d={svgPaths.p24eedb10} id="Icon" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[14px] tracking-[-0.5px]">{`+2.3% `}</p>
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative w-full">
        <Frame21 />
        <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[36px] tracking-[-0.5px]">89.2K</p>
        <Frame30 />
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[24px] items-center relative shrink-0 w-[1136px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div7 />
      <Div8 />
      <Div9 />
      <Div10 />
    </div>
  );
}

function RecentArticles() {
  return (
    <div className="h-[18.554px] relative shrink-0 w-[168.21px]" data-name="Recent Articles">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 168.21 18.554">
        <g id="Recent Articles">
          <path d={svgPaths.p173abc80} fill="var(--fill-0, #111827)" id="Vector" />
          <path d={svgPaths.p31075f0} fill="var(--fill-0, #111827)" id="Vector_2" />
          <path d={svgPaths.p2ee7f770} fill="var(--fill-0, #111827)" id="Vector_3" />
          <path d={svgPaths.p6218200} fill="var(--fill-0, #111827)" id="Vector_4" />
          <path d={svgPaths.p348ab900} fill="var(--fill-0, #111827)" id="Vector_5" />
          <path d={svgPaths.p5f19800} fill="var(--fill-0, #111827)" id="Vector_6" />
          <path d={svgPaths.p22973200} fill="var(--fill-0, #111827)" id="Vector_7" />
          <path d={svgPaths.p15271000} fill="var(--fill-0, #111827)" id="Vector_8" />
          <path d={svgPaths.p2e829600} fill="var(--fill-0, #111827)" id="Vector_9" />
          <path d={svgPaths.p1fae6400} fill="var(--fill-0, #111827)" id="Vector_10" />
          <path d={svgPaths.pf271900} fill="var(--fill-0, #111827)" id="Vector_11" />
          <path d={svgPaths.p2cbcf00} fill="var(--fill-0, #111827)" id="Vector_12" />
          <path d={svgPaths.pf707af0} fill="var(--fill-0, #111827)" id="Vector_13" />
          <path d={svgPaths.p25569300} fill="var(--fill-0, #111827)" id="Vector_14" />
        </g>
      </svg>
    </div>
  );
}

function ViewAll() {
  return (
    <div className="h-[10.773px] relative shrink-0 w-[64.364px]" data-name="View All →">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64.364 10.7734">
        <g id="View All â">
          <path d={svgPaths.p7b1cb00} fill="var(--fill-0, #C10007)" id="Vector" />
          <path d={svgPaths.p1f675180} fill="var(--fill-0, #C10007)" id="Vector_2" />
          <path d={svgPaths.p5af4980} fill="var(--fill-0, #C10007)" id="Vector_3" />
          <path d={svgPaths.p380d5600} fill="var(--fill-0, #C10007)" id="Vector_4" />
          <path d={svgPaths.p1edbe600} fill="var(--fill-0, #C10007)" id="Vector_5" />
          <path d={svgPaths.p33340f00} fill="var(--fill-0, #C10007)" id="Vector_6" />
          <path d={svgPaths.pb058600} fill="var(--fill-0, #C10007)" id="Vector_7" />
          <path d={svgPaths.p283e800} fill="var(--fill-0, #C10007)" id="Vector_8" />
        </g>
      </svg>
    </div>
  );
}

function Div14() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start left-[677.83px] px-0 py-[4px] top-[6px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <ViewAll />
    </div>
  );
}

function Div13() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[10px] items-start px-[2px] py-[7px] relative shrink-0 w-[172.21px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <RecentArticles />
      <Div14 />
    </div>
  );
}

function Img1() {
  return (
    <div className="absolute left-0 pointer-events-none size-[80px] top-0" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg1} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div18() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative rounded-[8px] shrink-0 size-[80px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img1 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Span() {
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
      <Span />
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
      <div className="h-[13.333px] relative shrink-0 w-[12px]" data-name="Icon">
        <div className="absolute inset-[-5.63%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 14.8333">
            <path d={svgPaths.pc4ba600} id="Icon" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">January 14, 2026</p>
    </div>
  );
}

function Div21() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame10 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] tracking-[-0.5px] w-[9px]">
        <p className="css-4hzbpn leading-[24px]">•</p>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">100 views</p>
    </div>
  );
}

function Div19() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[622px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div20 />
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[-0.5px] w-[506px]">Self-Driving Cars Get Federal Approval: What This Means for the Future</p>
      <Div21 />
    </div>
  );
}

function Div17() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[13px] h-[80px] items-center relative shrink-0 w-[715px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div18 />
      <Div19 />
    </div>
  );
}

function Div16() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[17px] relative rounded-[8px] shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div17 />
    </div>
  );
}

function Img2() {
  return (
    <div className="absolute left-0 pointer-events-none size-[80px] top-[0.45px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg2} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div24() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative rounded-[8px] shrink-0 size-[80px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img2 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Span1() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">Technology</p>
    </div>
  );
}

function Div26() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Span1 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.5px]">|</p>
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">SINGAPORE</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[13.333px] relative shrink-0 w-[12px]" data-name="Icon">
        <div className="absolute inset-[-5.63%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 14.8333">
            <path d={svgPaths.pc4ba600} id="Icon" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">January 14, 2026</p>
    </div>
  );
}

function Div27() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame11 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] tracking-[-0.5px] w-[9px]">
        <p className="css-4hzbpn leading-[24px]">•</p>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">100 views</p>
    </div>
  );
}

function Div25() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[622px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div26 />
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[-0.5px] w-[624px]">{`Singapore Launches World's First AI-Powered Urban Management System`}</p>
      <Div27 />
    </div>
  );
}

function Div23() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[13px] h-[80px] items-center relative shrink-0 w-[715px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div24 />
      <Div25 />
    </div>
  );
}

function Div22() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[17px] relative rounded-[8px] shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div23 />
    </div>
  );
}

function Img3() {
  return (
    <div className="absolute left-0 pointer-events-none size-[80px] top-[0.45px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg3} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div30() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative rounded-[8px] shrink-0 size-[80px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img3 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Span2() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">Politics</p>
    </div>
  );
}

function Div32() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Span2 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.5px]">|</p>
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">EUROPE</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[13.333px] relative shrink-0 w-[12px]" data-name="Icon">
        <div className="absolute inset-[-5.63%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 14.8333">
            <path d={svgPaths.pc4ba600} id="Icon" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">January 14, 2026</p>
    </div>
  );
}

function Div33() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame12 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] tracking-[-0.5px] w-[9px]">
        <p className="css-4hzbpn leading-[24px]">•</p>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">100 views</p>
    </div>
  );
}

function Div31() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[622px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div32 />
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[-0.5px] w-[624px]">EU Passes Landmark AI Ethics Legislation: Tech Giants Face New Restrictions</p>
      <Div33 />
    </div>
  );
}

function Div29() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[13px] h-[80px] items-center relative shrink-0 w-[715px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div30 />
      <Div31 />
    </div>
  );
}

function Div28() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[17px] relative rounded-[8px] shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div29 />
    </div>
  );
}

function Img4() {
  return (
    <div className="absolute left-0 pointer-events-none size-[80px] top-[0.45px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg4} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div36() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative rounded-[8px] shrink-0 size-[80px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img4 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Span3() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">Business</p>
    </div>
  );
}

function Div38() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Span3 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.5px]">|</p>
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">PHILIPPINES</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[13.333px] relative shrink-0 w-[12px]" data-name="Icon">
        <div className="absolute inset-[-5.63%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 14.8333">
            <path d={svgPaths.pc4ba600} id="Icon" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">January 14, 2026</p>
    </div>
  );
}

function Div39() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame13 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] tracking-[-0.5px] w-[9px]">
        <p className="css-4hzbpn leading-[24px]">•</p>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">100 views</p>
    </div>
  );
}

function Div37() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[622px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div38 />
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[-0.5px] w-[624px]">{`Philippines Emerges as Southeast Asia's AI Outsourcing Leader`}</p>
      <Div39 />
    </div>
  );
}

function Div35() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[13px] h-[80px] items-center relative shrink-0 w-[715px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div36 />
      <Div37 />
    </div>
  );
}

function Div34() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[17px] relative rounded-[8px] shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div35 />
    </div>
  );
}

function Img5() {
  return (
    <div className="absolute left-0 pointer-events-none size-[80px] top-[0.45px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg4} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div42() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative rounded-[8px] shrink-0 size-[80px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img5 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Span4() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">Business</p>
    </div>
  );
}

function Div44() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Span4 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.5px]">|</p>
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">PHILIPPINES</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[13.333px] relative shrink-0 w-[12px]" data-name="Icon">
        <div className="absolute inset-[-5.63%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 14.8333">
            <path d={svgPaths.pc4ba600} id="Icon" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">January 14, 2026</p>
    </div>
  );
}

function Div45() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame14 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] tracking-[-0.5px] w-[9px]">
        <p className="css-4hzbpn leading-[24px]">•</p>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">100 views</p>
    </div>
  );
}

function Div43() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[622px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div44 />
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[-0.5px] w-[624px]">{`Philippines Emerges as Southeast Asia's AI Outsourcing Leader`}</p>
      <Div45 />
    </div>
  );
}

function Div41() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[13px] h-[80px] items-center relative shrink-0 w-[715px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div42 />
      <Div43 />
    </div>
  );
}

function Div40() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[17px] relative rounded-[8px] shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Div41 />
    </div>
  );
}

function Div15() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div16 />
      <Div22 />
      <Div28 />
      <Div34 />
      <Div40 />
    </div>
  );
}

function Div12() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[23px] items-start left-0 top-0 w-[749.328px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div13 />
      <Div15 />
    </div>
  );
}

function ArticleDistribution() {
  return (
    <div className="absolute h-[13.915px] left-[0.44px] top-[7.28px] w-[153.357px]" data-name="Article Distribution">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 153.357 13.9155">
        <g id="Article Distribution">
          <path d={svgPaths.p15139200} fill="var(--fill-0, #111827)" id="Vector" />
          <path d={svgPaths.p2f0f7c00} fill="var(--fill-0, #111827)" id="Vector_2" />
          <path d={svgPaths.p1c01df80} fill="var(--fill-0, #111827)" id="Vector_3" />
          <path d={svgPaths.p16e5ec00} fill="var(--fill-0, #111827)" id="Vector_4" />
          <path d={svgPaths.p7fa00} fill="var(--fill-0, #111827)" id="Vector_5" />
          <path d={svgPaths.p24d48080} fill="var(--fill-0, #111827)" id="Vector_6" />
          <path d={svgPaths.p2102a180} fill="var(--fill-0, #111827)" id="Vector_7" />
          <path d={svgPaths.p11d17080} fill="var(--fill-0, #111827)" id="Vector_8" />
          <path d={svgPaths.p31d1300} fill="var(--fill-0, #111827)" id="Vector_9" />
          <path d={svgPaths.p186b63c0} fill="var(--fill-0, #111827)" id="Vector_10" />
          <path d={svgPaths.p31b18e00} fill="var(--fill-0, #111827)" id="Vector_11" />
          <path d={svgPaths.p3529bd00} fill="var(--fill-0, #111827)" id="Vector_12" />
          <path d={svgPaths.p20ffe2c0} fill="var(--fill-0, #111827)" id="Vector_13" />
          <path d={svgPaths.p25bf1900} fill="var(--fill-0, #111827)" id="Vector_14" />
          <path d={svgPaths.p2040e980} fill="var(--fill-0, #111827)" id="Vector_15" />
          <path d={svgPaths.pff76a00} fill="var(--fill-0, #111827)" id="Vector_16" />
          <path d={svgPaths.p5bde880} fill="var(--fill-0, #111827)" id="Vector_17" />
          <path d={svgPaths.p1b596380} fill="var(--fill-0, #111827)" id="Vector_18" />
          <path d={svgPaths.p381d40c0} fill="var(--fill-0, #111827)" id="Vector_19" />
        </g>
      </svg>
    </div>
  );
}

function H() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[28px] relative shrink-0 w-[312.656px]" data-name="h3">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <ArticleDistribution />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 tracking-[-0.5px] w-[313px]">
      <p className="css-ew64yg relative shrink-0 text-[14px] text-black">Main Portal</p>
      <p className="css-ew64yg relative shrink-0 text-[#4b5563] text-[12px]">5 articles</p>
    </div>
  );
}

function Div50() {
  return <div className="bg-[#f3f4f6] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-0 mt-0 rounded-[9999px] row-1 w-[312.656px]" data-name="div" />;
}

function Div51() {
  return <div className="bg-[#c10007] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-[0.67px] mt-0 rounded-[9999px] row-1 w-[96px]" data-name="div" />;
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Div50 />
      <Div51 />
    </div>
  );
}

function Div49() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[11px] items-start relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame22 />
      <Group />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 tracking-[-0.5px] w-[313px]">
      <p className="css-ew64yg relative shrink-0 text-[14px] text-black">Filipino Homes</p>
      <p className="css-ew64yg relative shrink-0 text-[#4b5563] text-[12px]">6 articles</p>
    </div>
  );
}

function Div53() {
  return <div className="bg-[#f3f4f6] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-0 mt-0 rounded-[9999px] row-1 w-[312.656px]" data-name="div" />;
}

function Div54() {
  return <div className="bg-[#c10007] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-[0.67px] mt-0 rounded-[9999px] row-1 w-[163px]" data-name="div" />;
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Div53 />
      <Div54 />
    </div>
  );
}

function Div52() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[11px] items-start relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame23 />
      <Group1 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 tracking-[-0.5px] w-[313px]">
      <p className="css-ew64yg relative shrink-0 text-[14px] text-black">Rent.ph</p>
      <p className="css-ew64yg relative shrink-0 text-[#4b5563] text-[12px]">8 articles</p>
    </div>
  );
}

function Div56() {
  return <div className="bg-[#f3f4f6] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-0 mt-0 rounded-[9999px] row-1 w-[312.656px]" data-name="div" />;
}

function Div57() {
  return <div className="bg-[#c10007] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-[0.67px] mt-0 rounded-[9999px] row-1 w-[213px]" data-name="div" />;
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Div56 />
      <Div57 />
    </div>
  );
}

function Div55() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[11px] items-start relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame24 />
      <Group2 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 tracking-[-0.5px] w-[313px]">
      <p className="css-ew64yg relative shrink-0 text-[14px] text-black">HomesPh</p>
      <p className="css-ew64yg relative shrink-0 text-[#4b5563] text-[12px]">7 articles</p>
    </div>
  );
}

function Div59() {
  return <div className="bg-[#f3f4f6] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-0 mt-0 rounded-[9999px] row-1 w-[312.656px]" data-name="div" />;
}

function Div60() {
  return <div className="bg-[#c10007] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-[0.67px] mt-0 rounded-[9999px] row-1 w-[192px]" data-name="div" />;
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Div59 />
      <Div60 />
    </div>
  );
}

function Div58() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[11px] items-start relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame25 />
      <Group3 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 tracking-[-0.5px] w-[313px]">
      <p className="css-ew64yg relative shrink-0 text-[14px] text-black">Bayanihan</p>
      <p className="css-ew64yg relative shrink-0 text-[#4b5563] text-[12px]">6 articles</p>
    </div>
  );
}

function Div62() {
  return <div className="bg-[#f3f4f6] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-0 mt-0 rounded-[9999px] row-1 w-[312.656px]" data-name="div" />;
}

function Div63() {
  return <div className="bg-[#c10007] border-0 border-[#e5e7eb] border-solid col-1 h-[8px] ml-[0.67px] mt-0 rounded-[9999px] row-1 w-[163px]" data-name="div" />;
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Div62 />
      <Div63 />
    </div>
  );
}

function Div61() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[11px] items-start relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame26 />
      <Group4 />
    </div>
  );
}

function Div48() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div49 />
      <Div52 />
      <Div55 />
      <Div58 />
      <Div61 />
    </div>
  );
}

function Div47() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative w-full">
        <H />
        <Div48 />
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="absolute h-[14.849px] left-[0.96px] top-[7.28px] w-[113.47px]" data-name="Quick Actions">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 113.471 14.8487">
        <g id="Quick Actions">
          <path d={svgPaths.p1304b180} fill="var(--fill-0, #111827)" id="Vector" />
          <path d={svgPaths.p24a63500} fill="var(--fill-0, #111827)" id="Vector_2" />
          <path d={svgPaths.p185bbe20} fill="var(--fill-0, #111827)" id="Vector_3" />
          <path d={svgPaths.p4777400} fill="var(--fill-0, #111827)" id="Vector_4" />
          <path d={svgPaths.p2e9e2600} fill="var(--fill-0, #111827)" id="Vector_5" />
          <path d={svgPaths.p2a11d300} fill="var(--fill-0, #111827)" id="Vector_6" />
          <path d={svgPaths.p2412c1c0} fill="var(--fill-0, #111827)" id="Vector_7" />
          <path d={svgPaths.p83f1280} fill="var(--fill-0, #111827)" id="Vector_8" />
          <path d={svgPaths.p217bac00} fill="var(--fill-0, #111827)" id="Vector_9" />
          <path d={svgPaths.p1a5ed200} fill="var(--fill-0, #111827)" id="Vector_10" />
          <path d={svgPaths.p3e69c580} fill="var(--fill-0, #111827)" id="Vector_11" />
          <path d={svgPaths.p1382c740} fill="var(--fill-0, #111827)" id="Vector_12" />
        </g>
      </svg>
    </div>
  );
}

function H1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[28px] relative shrink-0 w-[312.656px]" data-name="h3">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <QuickActions />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex gap-[12px] h-[48px] items-center justify-center px-[20px] py-0 relative rounded-[8px] shrink-0 w-[313px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="h-[16.25px] relative shrink-0 w-[18.571px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.5714 16.25">
          <path d={svgPaths.p1d5c0e00} fill="var(--fill-0, black)" fillOpacity="0.7" id="Vector" />
        </svg>
      </div>
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.5px]">Manage Articles</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[17.5px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 20">
        <g id="Frame">
          <path d="M17.5 20H0V0H17.5V20Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p39376600} fill="var(--fill-0, #111827)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex gap-[12px] h-[48px] items-center justify-center px-[20px] py-0 relative rounded-[8px] shrink-0 w-[313px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame3 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.5px]">Create New Article</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d="M20 20H0V0H20V20Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p22876100} fill="var(--fill-0, #111827)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex gap-[12px] h-[48px] items-center justify-center px-[20px] py-0 relative rounded-[8px] shrink-0 w-[313px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame4 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.5px]">View Analytics</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[17.5px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 20">
        <g id="Frame">
          <g clipPath="url(#clip0_1_366)">
            <path d={svgPaths.p1d01b680} id="Icon" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_366">
            <path d="M0 0H17.5V20H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex gap-[12px] h-[48px] items-center justify-center px-[20px] py-0 relative rounded-[8px] shrink-0 w-[313px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame5 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Schedule Event</p>
    </div>
  );
}

function Div65() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Div64() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative w-full">
        <H1 />
        <Div65 />
      </div>
    </div>
  );
}

function Div46() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[24px] items-start left-[773.33px] top-0 w-[362.656px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div47 />
      <Div64 />
    </div>
  );
}

function Div11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[708px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div12 />
      <Div46 />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-0 p-[32px] top-[77px] w-[1200px]" data-name="main" style={{ backgroundImage: "linear-gradient(90deg, rgb(249, 250, 251) 0%, rgb(249, 250, 251) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)" }}>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div4 />
      <Div6 />
      <Div11 />
    </div>
  );
}

function Div() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[1091px] left-[240px] top-0 w-[1200px]" data-name="div">
      <Header />
      <Main />
    </div>
  );
}

function Frame6() {
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

function Svg2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[20px] top-[3.5px]" data-name="svg">
      <Frame6 />
    </div>
  );
}

function I() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[28px] left-[10px] top-[6px] w-[20px]" data-name="i">
      <Svg2 />
    </div>
  );
}

function Div69() {
  return (
    <div className="absolute bg-[#c10007] border-0 border-[#e5e7eb] border-solid left-0 rounded-[8px] size-[40px] top-[2px]" data-name="div">
      <I />
    </div>
  );
}

function Div70() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[44px] left-[48px] not-italic text-white top-0 tracking-[-0.5px] w-[147.641px]" data-name="div">
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 text-[20px] top-0">Global News</p>
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] top-[28px]">Network</p>
    </div>
  );
}

function Div68() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[44px] relative shrink-0 w-[195.641px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div69 />
      <Div70 />
    </div>
  );
}

function Div67() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[16px] relative shrink-0 w-[240px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Div68 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p1efa7f0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame7 />
    </div>
  );
}

function I1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg3 />
    </div>
  );
}

function Span5() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[20px] left-[48px] top-[14px] w-[94.92px]" data-name="span">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-0 not-italic text-[14px] text-white top-px tracking-[-0.5px]">Dashboard</p>
    </div>
  );
}

function Div71() {
  return (
    <div className="bg-[#c10007] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I1 />
      <Span5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p2ee32b00} fill="var(--fill-0, white)" fillOpacity="0.7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame8 />
    </div>
  );
}

function I2() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg4 />
    </div>
  );
}

function Div72() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I2 />
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
          <path d={svgPaths.p147cb180} fill="var(--fill-0, white)" fillOpacity="0.7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg5() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame9 />
    </div>
  );
}

function I3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg5 />
    </div>
  );
}

function Div73() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I3 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Analytics</p>
    </div>
  );
}

function Frame15() {
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

function Svg6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame15 />
    </div>
  );
}

function I4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg6 />
    </div>
  );
}

function Div74() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I4 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Sites</p>
    </div>
  );
}

function I5() {
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

function Div75() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I5 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">{`Ads `}</p>
    </div>
  );
}

function I6() {
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

function Div76() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I6 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Calendar</p>
    </div>
  );
}

function Frame16() {
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

function Svg7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame16 />
    </div>
  );
}

function I7() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg7 />
    </div>
  );
}

function Div77() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I7 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Settings</p>
    </div>
  );
}

function Nav() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[4px] items-start px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="nav">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div71 />
      <Div72 />
      <Div73 />
      <Div74 />
      <Div75 />
      <Div76 />
      <Div77 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Div67 />
      <Nav />
    </div>
  );
}

function I8() {
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

function Div78() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[32px] py-[20px] relative w-full">
          <I8 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)] tracking-[-0.5px]">Logout</p>
        </div>
      </div>
    </div>
  );
}

function Div66() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col h-[1155px] items-start justify-between left-0 top-0 w-[240px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame17 />
      <Div78 />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white border-0 border-[#e5e7eb] border-solid h-[1155px] left-[-2px] top-[-2px] w-[1440px]" data-name="body">
      <Div />
      <Div66 />
    </div>
  );
}

export default function Admin() {
  return (
    <div className="bg-white border-2 border-[#ced4da] border-solid overflow-clip relative rounded-[8px] size-full" data-name="Admin">
      <Body />
    </div>
  );
}