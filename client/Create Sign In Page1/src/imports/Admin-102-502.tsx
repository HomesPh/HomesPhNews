import svgPaths from "./svg-6tz0yzf2do";
import imgImg from "figma:asset/bec21fc75386a86210d32bec8ca98fcb2380d21e.png";
import imgImg1 from "figma:asset/c84bca73046c8f3c7314a1ed5802acea60687588.png";
import imgImg2 from "figma:asset/5dd8bf25056a2e777c434d97dc8134d7968b5a17.png";

function Frame() {
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

function Svg() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[20px] top-[3.5px]" data-name="svg">
      <Frame />
    </div>
  );
}

function I() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[28px] left-[10px] top-[6px] w-[20px]" data-name="i">
      <Svg />
    </div>
  );
}

function Div() {
  return (
    <div className="absolute bg-[#c10007] border-0 border-[#e5e7eb] border-solid left-0 rounded-[8px] size-[40px] top-[2px]" data-name="div">
      <I />
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[44px] left-[48px] not-italic text-white top-0 tracking-[-0.5px] w-[147.641px]" data-name="div">
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 text-[20px] top-0">Global News</p>
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] top-[28px]">Network</p>
    </div>
  );
}

function Div2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[44px] relative shrink-0 w-[195.641px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div />
      <Div1 />
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[16px] relative shrink-0 w-[240px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Div2 />
    </div>
  );
}

function Frame1() {
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

function Svg1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame1 />
    </div>
  );
}

function I1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg1 />
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I1 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Articles</p>
    </div>
  );
}

function Frame2() {
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

function Svg2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame2 />
    </div>
  );
}

function I2() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg2 />
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I2 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Articles</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute left-[2px] size-[16px] top-[4px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M16 16H0V0H16V16Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p147cb180} fill="var(--fill-0, white)" fillOpacity="0.7" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function I3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Frame3 />
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I3 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Analytics</p>
    </div>
  );
}

function Frame4() {
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

function Svg3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame4 />
    </div>
  );
}

function I4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg3 />
    </div>
  );
}

function Div7() {
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
    <div className="h-[24px] relative shrink-0 w-[20px]" data-name="i">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 24">
        <g id="i">
          <path d="M20 24H0V0H20V24Z" stroke="var(--stroke-0, white)" />
          <path d={svgPaths.p33af9430} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[#c10007] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[16px] py-[12px] relative size-full">
          <I5 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.5px]">{`Ads `}</p>
        </div>
      </div>
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

function Div9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I6 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Calendar</p>
    </div>
  );
}

function Frame5() {
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

function Svg4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame5 />
    </div>
  );
}

function I7() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg4 />
    </div>
  );
}

function Div10() {
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
      <Div4 />
      <Div5 />
      <Div6 />
      <Div7 />
      <Div8 />
      <Div9 />
      <Div10 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Div3 />
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

function Div11() {
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

function Div12() {
  return (
    <div className="bg-[#0f172a] content-stretch flex flex-col items-start justify-between relative self-stretch shrink-0 w-[240px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame17 />
      <Div11 />
    </div>
  );
}

function Div13() {
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

function Div14() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[10px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div13 />
      <Img />
    </div>
  );
}

function Div15() {
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
      <Div14 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white h-[77px] relative shrink-0 w-full" data-name="header">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[32px] py-[24px] relative size-full">
          <Div15 />
        </div>
      </div>
    </div>
  );
}

function Div16() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[60px] relative shrink-0 w-[355.578px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#111827] text-[30px] top-0 tracking-[-0.5px]">Ads Management</p>
      <p className="absolute css-ew64yg font-['Inter:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4b5563] text-[14px] top-[40px] tracking-[-0.5px]">{`Manage advertisements across all platforms `}</p>
    </div>
  );
}

function Frame6() {
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

function Svg5() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-[2px] w-[14px]" data-name="svg">
      <Frame6 />
    </div>
  );
}

function I9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[14px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg5 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#c10007] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[20px] py-[12px] relative rounded-[6px] shrink-0" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <I9 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.5px]">Create New Ad</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Button />
    </div>
  );
}

function Div17() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-between relative shrink-0 w-[1136px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div16 />
      <Frame26 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] tracking-[-0.5px]">Total Revenue</p>
      <div className="h-[18px] relative shrink-0 w-[10px]" data-name="Icon">
        <div className="absolute inset-[-5.56%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 20">
            <path d={svgPaths.p2899d780} id="Icon" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
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
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[14px] tracking-[-0.5px]">+15.3% from last month</p>
    </div>
  );
}

function Div18() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative w-full">
        <Frame18 />
        <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[38px] tracking-[-0.5px]">$60,500</p>
        <Frame27 />
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] tracking-[-0.5px]">Active Ads</p>
      <div className="h-[18px] relative shrink-0 w-[28px]" data-name="Icon">
        <div className="absolute inset-[-6.94%_-4.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.5 20.5">
            <g id="Icon">
              <path d={svgPaths.p23ddf780} stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              <path d={svgPaths.p42a0c0} stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Div19() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative w-full">
        <Frame19 />
        <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[38px] tracking-[-0.5px]">3</p>
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[14px] tracking-[-0.5px]">Out of 4 total</p>
      </div>
    </div>
  );
}

function Frame7() {
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

function Frame20() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] tracking-[-0.5px]">Total Impressions</p>
      <Frame7 />
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
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[14px] tracking-[-0.5px]">+8% this week</p>
    </div>
  );
}

function Div20() {
  return (
    <div className="bg-white flex-[1_0_0] h-[157px] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative size-full">
        <Frame20 />
        <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[38px] tracking-[-0.5px]">940,000</p>
        <Frame28 />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Frame">
          <g clipPath="url(#clip0_15_1293)">
            <path d={svgPaths.p6665d70} id="Icon" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_15_1293">
            <path d="M0 0H18V18H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] tracking-[-0.5px]">Total Clicks</p>
      <Frame8 />
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
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[14px] tracking-[-0.5px]">+8% this week</p>
    </div>
  );
}

function Div21() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[25px] relative w-full">
        <Frame23 />
        <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[38px] tracking-[-0.5px]">13,260</p>
        <Frame29 />
      </div>
    </div>
  );
}

function Div22() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[24px] items-center relative shrink-0 w-[1136px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div18 />
      <Div19 />
      <Div20 />
      <Div21 />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[50px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] left-[48px] not-italic overflow-hidden text-[#adaebc] text-[16px] text-ellipsis top-[25px] tracking-[-0.5px] translate-y-[-50%] w-[843px]">
        <p className="css-g0mm18 leading-[24px] overflow-hidden">Search ads or clients...</p>
      </div>
    </div>
  );
}

function Frame9() {
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

function Svg6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[16px] top-[4px]" data-name="svg">
      <Frame9 />
    </div>
  );
}

function I10() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] h-[24px] left-[16px] top-[13px] w-[16px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg6 />
    </div>
  );
}

function Div23() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[731px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input />
      <I10 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#c10008] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[6px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-4 border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] relative size-full">
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.5px]">{`All (4) `}</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f3f4f6] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[6px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-4 border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] relative size-full">
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] text-center tracking-[-0.5px]">{`Active (3) `}</p>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f3f4f6] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[6px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-4 border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] relative size-full">
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#4b5563] text-[16px] text-center tracking-[-0.5px]">Inactive (1)</p>
        </div>
      </div>
    </div>
  );
}

function Div24() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] gap-[10px] h-[50px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Div25() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[16px] items-center relative shrink-0 w-[1101px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div23 />
      <Div24 />
    </div>
  );
}

function Div26() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start p-[20px] relative w-full">
        <Div25 />
      </div>
    </div>
  );
}

function Img1() {
  return (
    <div className="absolute h-[106px] left-0 pointer-events-none top-0 w-[118px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg1} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div27() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[106px] relative rounded-[8px] shrink-0 w-[118px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img1 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-[#dbfce3] content-stretch flex items-center justify-center px-[10px] py-[2px] relative rounded-[999px] shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#00825e] text-[12px] text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">Active</p>
      </div>
    </div>
  );
}

function Div28() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="css-g0mm18 flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] tracking-[-0.5px]">
        <p className="css-ew64yg leading-[32px]">Real Estate Expo 2026</p>
      </div>
      <Frame31 />
    </div>
  );
}

function Span() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">{`News Portal - Top `}</p>
    </div>
  );
}

function Span1() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">Article Pages - Top</p>
    </div>
  );
}

function Div29() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Ad Placement:</p>
      <Span />
      <Span1 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="h-[16.667px] relative shrink-0 w-[119px]">
      <div className="absolute inset-[-7.5%_-0.84%_-6%_-1.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 121.25 18.9167">
          <g id="Frame 49">
            <g id="Icon">
              <path d={svgPaths.p34620680} stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              <path d={svgPaths.p1bff1b80} stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </g>
            <path d={svgPaths.p86fe1c0} id="Icon_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p929b080} id="Icon_3" stroke="var(--stroke-0, #C10008)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">
        <p className="css-ew64yg">
          <span className="leading-[20px]">{`Revenue: `}</span>
          <span className="leading-[20px] text-[#10b981]">{`₱15,000          `}</span>
          <span className="leading-[20px]">{`Impressions: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">{`245,000          `}</span>
          <span className="leading-[20px]">{`Clicks: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">{`3,420          `}</span>
          <span className="leading-[20px]">{`Period: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">2026-01-01 to 2026-03-31</span>
        </p>
      </div>
      <Frame33 />
    </div>
  );
}

function Div30() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col h-[140px] items-start justify-between min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div28 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#4b5563] text-[14px] tracking-[-0.5px] w-[min-content]">
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal]">Client:</span>
        <span className="leading-[normal]">{` Dubai Property Developers `}</span>
        <span className="font-['Inter:Medium',sans-serif] font-medium leading-[normal]">{`| `}</span>
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal]">{`Type: `}</span>
        <span className="leading-[normal]">Leaderboard (728x90)</span>
      </p>
      <Div29 />
      <Frame32 />
    </div>
  );
}

function Div31() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[13px] items-start p-[20px] relative w-full">
        <Div27 />
        <Div30 />
      </div>
    </div>
  );
}

function Img2() {
  return (
    <div className="absolute h-[106px] left-0 pointer-events-none top-0 w-[118px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg1} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div32() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[106px] relative rounded-[8px] shrink-0 w-[118px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img2 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-[#dbfce3] content-stretch flex items-center justify-center px-[10px] py-[2px] relative rounded-[999px] shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#00825e] text-[12px] text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">Active</p>
      </div>
    </div>
  );
}

function Div33() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="css-g0mm18 flex flex-col font-['Inter:Bold','Noto_Sans:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] tracking-[-0.5px]">
        <p className="css-ew64yg leading-[32px]">{`AI Business Summit `}</p>
      </div>
      <Frame34 />
    </div>
  );
}

function Span2() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">Sidebar - All Pages</p>
    </div>
  );
}

function Span3() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">Article Pages - In-feed</p>
    </div>
  );
}

function Div34() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Ad Placement:</p>
      <Span2 />
      <Span3 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="h-[16.667px] relative shrink-0 w-[119px]">
      <div className="absolute inset-[-7.5%_-0.84%_-6%_-1.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 121.25 18.9167">
          <g id="Frame 49">
            <g id="Icon">
              <path d={svgPaths.p34620680} stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              <path d={svgPaths.p1bff1b80} stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </g>
            <path d={svgPaths.p86fe1c0} id="Icon_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p929b080} id="Icon_3" stroke="var(--stroke-0, #C10008)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">
        <p className="css-ew64yg">
          <span className="leading-[20px]">{`Revenue: `}</span>
          <span className="leading-[20px] text-[#10b981]">{`₱8,500      `}</span>
          <span className="leading-[20px]">{`Impressions: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">{`180,000        `}</span>
          <span className="leading-[20px]">{`Clicks: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">{`2,150          `}</span>
          <span className="leading-[20px]">{`Period: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">2026-01-15 to 2026-06-30</span>
        </p>
      </div>
      <Frame35 />
    </div>
  );
}

function Div35() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col h-[140px] items-start justify-between min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div33 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#4b5563] text-[14px] tracking-[-0.5px] w-[min-content]">
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal]">Client: Tech Conference Inc</span>
        <span className="leading-[normal]"> </span>
        <span className="font-['Inter:Medium',sans-serif] font-medium leading-[normal]">|</span>
        <span className="leading-[normal]"> </span>
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal]">{`Type: `}</span>
        <span className="leading-[normal]">Rectangle (300x250)</span>
      </p>
      <Div34 />
      <Frame36 />
    </div>
  );
}

function Div36() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[13px] items-start p-[20px] relative w-full">
        <Div32 />
        <Div35 />
      </div>
    </div>
  );
}

function Img3() {
  return (
    <div className="absolute h-[106px] left-0 pointer-events-none top-[-0.05px] w-[118px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImg2} />
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0" />
    </div>
  );
}

function Div37() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[106px] relative rounded-[8px] shrink-0 w-[118px]" data-name="div">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Img3 />
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame37() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[10px] py-[2px] relative rounded-[999px] shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">Inactive</p>
      </div>
    </div>
  );
}

function Div38() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="css-g0mm18 flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[18px] tracking-[-0.5px]">
        <p className="css-ew64yg leading-[32px]">Tourism Philippines Campaign</p>
      </div>
      <Frame37 />
    </div>
  );
}

function Span4() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">{`News Portal - Top `}</p>
    </div>
  );
}

function Span5() {
  return (
    <div className="bg-[#f3f4f6] content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[4px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[12px] text-center tracking-[-0.5px]">Article Pages - Top</p>
    </div>
  );
}

function Div39() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Ad Placement:</p>
      <Span4 />
      <Span5 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="h-[16.667px] relative shrink-0 w-[119px]">
      <div className="absolute inset-[-7.5%_-0.84%_-6%_-1.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 121.25 18.9167">
          <g id="Frame 49">
            <g id="Icon">
              <path d={svgPaths.p27b95f00} stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              <path d={svgPaths.p191ef980} stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </g>
            <path d={svgPaths.p86fe1c0} id="Icon_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p929b080} id="Icon_3" stroke="var(--stroke-0, #C10008)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">
        <p className="css-ew64yg">
          <span className="leading-[20px]">{`Revenue: `}</span>
          <span className="leading-[20px] text-[#10b981]">{`₱15,000          `}</span>
          <span className="leading-[20px]">{`Impressions: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">{`245,000          `}</span>
          <span className="leading-[20px]">{`Clicks: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">{`3,420          `}</span>
          <span className="leading-[20px]">{`Period: `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic">2026-01-01 to 2026-03-31</span>
        </p>
      </div>
      <Frame38 />
    </div>
  );
}

function Div40() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col h-[140px] items-start justify-between min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div38 />
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#4b5563] text-[14px] tracking-[-0.5px] w-[min-content]">
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal]">Client:</span>
        <span className="leading-[normal]">{` Dubai Property Developers `}</span>
        <span className="font-['Inter:Medium',sans-serif] font-medium leading-[normal]">|</span>
        <span className="leading-[normal]"> </span>
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal]">{`Type: `}</span>
        <span className="leading-[normal]">Leaderboard (728x90)</span>
      </p>
      <Div39 />
      <Frame39 />
    </div>
  );
}

function Div41() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div className="content-stretch flex gap-[13px] items-start p-[20px] relative w-full">
        <Div37 />
        <Div40 />
      </div>
    </div>
  );
}

function Div42() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 w-[1136px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Div26 />
      <Div31 />
      <Div36 />
      <Div41 />
    </div>
  );
}

function Main() {
  return (
    <div className="bg-[#f9fafb] relative shrink-0 w-full" data-name="main">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[32px] relative w-full">
        <Div17 />
        <Div22 />
        <Div42 />
      </div>
    </div>
  );
}

function Div43() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[1200px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Header />
      <Main />
    </div>
  );
}

function Body() {
  return (
    <div className="bg-white content-stretch flex items-start justify-between relative shrink-0 w-[1440px]" data-name="body">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div12 />
      <Div43 />
    </div>
  );
}

function Admin() {
  return (
    <div className="absolute bg-white left-0 rounded-[8px] top-0" data-name="Admin">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
        <Body />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#ced4da] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Div44() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[129.063px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[#111827] text-[24px] tracking-[-0.5px]">Create New Advertisement</p>
    </div>
  );
}

function Frame10() {
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

function Svg7() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center justify-center left-0 top-[3.5px] w-[15px]" data-name="svg">
      <Frame10 />
    </div>
  );
}

function I11() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[28px] left-[8.5px] top-[2px] w-[15px]" data-name="i">
      <Svg7 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative rounded-[9999px] shrink-0 size-[32px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <I11 />
    </div>
  );
}

function Div45() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[32px] py-[24px] relative w-full">
          <Div44 />
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Ad Name / Campaign Title</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[1002px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Real Estate Expo 2026</p>
      </div>
    </div>
  );
}

function Div46() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label />
      <Input1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Client / Advertiser Name</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[886px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Dubai Property Developers</p>
      </div>
    </div>
  );
}

function Div47() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label1 />
      <Input2 />
    </div>
  );
}

function Label2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Ad Size</p>
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[54.94px] not-italic text-[#ef4444] text-[14px] top-px tracking-[-0.5px]">*</p>
    </div>
  );
}

function Frame11() {
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

function Select() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="select">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[186px]">
            <p className="css-g0mm18 leading-[normal] overflow-hidden">300x250 (Rectangle)</p>
          </div>
          <Frame11 />
        </div>
      </div>
    </div>
  );
}

function Div48() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label2 />
      <Select />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Div48 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[6px] items-center leading-[normal] min-h-px min-w-px not-italic relative text-[14px] tracking-[-0.5px]">
      <p className="css-ew64yg relative shrink-0 text-[#111827]">Ad Image</p>
      <p className="css-ew64yg relative shrink-0 text-[#ef4444]">*</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#3b82f6] text-[14px] tracking-[-0.5px]">Generate Image</p>
    </div>
  );
}

function Label3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex h-[18px] items-start justify-between py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame21 />
      <Frame22 />
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

function Frame12() {
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

function Svg8() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-center left-0 top-[5px] w-[60px]" data-name="svg">
      <Frame12 />
    </div>
  );
}

function I12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[59px] mr-[-29px] relative shrink-0 w-[60px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg8 />
    </div>
  );
}

function P1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] mr-[-29px] relative shrink-0 w-[968px]" data-name="p">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[484px] not-italic text-[#6b7280] text-[14px] text-center top-px tracking-[-0.5px] translate-x-[-50%]">Recommended: 300x250, max 5MB</p>
    </div>
  );
}

function Div49() {
  return (
    <div className="bg-[#f9fafb] content-center flex flex-wrap gap-[4px] items-center justify-center pr-[29px] py-[29px] relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#d1d5db] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <P />
      <I12 />
      <P1 />
    </div>
  );
}

function Label4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Light','Noto_Sans:Light',sans-serif] font-light leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">{`Or enter image URL: `}</p>
    </div>
  );
}

function Frame13() {
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
        <div className="content-stretch flex items-center justify-between px-[10px] relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#adaebc] text-[14px] text-ellipsis tracking-[-0.5px] w-[268px]">
            <p className="css-g0mm18 leading-[20px] overflow-hidden">htttps://example.com/ad-image.jpg</p>
          </div>
          <Frame13 />
        </div>
      </div>
    </div>
  );
}

function Div50() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label4 />
      <Select1 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Div50 />
    </div>
  );
}

function Div51() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label3 />
      <Div49 />
      <Frame30 />
    </div>
  );
}

function Label5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">{`Target URL `}</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[886px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">htttps://example.com/landing-page</p>
      </div>
    </div>
  );
}

function Div52() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label5 />
      <Input3 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Where users will be redirected when clicking the ad</p>
    </div>
  );
}

function Label6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">{`Ad Placement `}</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[2] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input4 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">News Portal - Sidebar</p>
    </div>
  );
}

function Input5() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[1] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input5 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">News Portal - Bottom</p>
    </div>
  );
}

function Input6() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[3] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input6 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Article Pages - Bottom</p>
    </div>
  );
}

function Input7() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[2] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input7 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Article Pages - Top</p>
    </div>
  );
}

function Input8() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[4] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input8 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Sidebar - All Pages</p>
    </div>
  );
}

function Input9() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[3] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input9 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Article Pages - In-feed</p>
    </div>
  );
}

function Input10() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label13() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[5] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input10 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Homepage - Banner</p>
    </div>
  );
}

function Input11() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label14() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[4] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input11 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Category Pages - Top</p>
    </div>
  );
}

function Input12() {
  return (
    <div className="bg-white relative rounded-[1px] shrink-0 size-[16px]" data-name="input">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[1px]" />
    </div>
  );
}

function Label15() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[5] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input12 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Homepage - Sidebar</p>
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

function Div53() {
  return (
    <div className="absolute bg-[#111827] content-stretch flex items-center left-0 p-[2px] rounded-[1px] size-[16px] top-0" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#111827] border-solid inset-0 pointer-events-none rounded-[1px]" />
      <Check />
    </div>
  );
}

function Div54() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 size-[16px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div53 />
    </div>
  );
}

function Label16() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[1] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div54 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">News Portal - Top</p>
    </div>
  );
}

function Div55() {
  return (
    <div className="bg-[rgba(0,0,0,0)] gap-[12px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(5,_fit-content(100%))] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label7 />
      <Label8 />
      <Label9 />
      <Label10 />
      <Label11 />
      <Label12 />
      <Label13 />
      <Label14 />
      <Label15 />
      <Label16 />
    </div>
  );
}

function Div56() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div55 />
    </div>
  );
}

function Div57() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start p-[24px] relative w-full">
        <Div56 />
      </div>
    </div>
  );
}

function Div58() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label6 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Select where this ad should appear (choose one or more)</p>
      <Div57 />
    </div>
  );
}

function Label17() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Start Date</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Frame14() {
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

function Svg9() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="svg">
      <Frame14 />
    </div>
  );
}

function Input13() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-px relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[304px]">
            <p className="css-g0mm18 leading-[24px] overflow-hidden">mm/ dd / yyyy</p>
          </div>
          <Svg9 />
        </div>
      </div>
    </div>
  );
}

function Div59() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label17 />
      <Input13 />
    </div>
  );
}

function Label18() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">End Date</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Frame15() {
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

function Svg10() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="svg">
      <Frame15 />
    </div>
  );
}

function Input14() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-px relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[304px]">
            <p className="css-g0mm18 leading-[24px] overflow-hidden">mm/ dd / yyyy</p>
          </div>
          <Svg10 />
        </div>
      </div>
    </div>
  );
}

function Div60() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label18 />
      <Input14 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <Div59 />
      <Div60 />
    </div>
  );
}

function Label19() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Campaign Revenue ($)</p>
    </div>
  );
}

function Input15() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[16px] text-black text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[886px]">
        <p className="css-g0mm18 leading-[24px] overflow-hidden">0</p>
      </div>
    </div>
  );
}

function Div61() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label19 />
      <Input15 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Expected or actual revenue from this ad campaign</p>
    </div>
  );
}

function Div62() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[24px] items-start pt-[32px] relative shrink-0 w-full" data-name="div">
      <Div46 />
      <Div47 />
      <Frame24 />
      <Div51 />
      <Div52 />
      <Div58 />
      <Frame25 />
      <Div61 />
    </div>
  );
}

function Check1() {
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

function Div63() {
  return (
    <div className="absolute bg-[#c10008] content-stretch flex items-center left-0 p-[2px] rounded-[1px] size-[16px] top-0" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#c10008] border-solid inset-0 pointer-events-none rounded-[1px]" />
      <Check1 />
    </div>
  );
}

function Div64() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 size-[16px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div63 />
    </div>
  );
}

function Label20() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center relative shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div64 />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Set ad as active immediately</p>
    </div>
  );
}

function Div65() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label20 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Active ads will be displayed on selected placements</p>
    </div>
  );
}

function Div66() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start py-[32px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Div65 />
    </div>
  );
}

function Div67() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[470px] relative shrink-0 w-full" data-name="div">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[32px] relative size-full">
          <Div62 />
          <Div66 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[44px] relative rounded-[8px] shrink-0 w-[93.109px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[47.05px] not-italic text-[#374151] text-[16px] text-center top-[12px] tracking-[-0.5px] translate-x-[-50%]">Cancel</p>
    </div>
  );
}

function Frame16() {
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

function Svg11() {
  return (
    <div className="content-stretch flex h-[16px] items-center justify-center relative shrink-0 w-[14px]" data-name="svg">
      <Frame16 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#3b82f6] content-stretch flex gap-[9px] h-[44px] items-center px-[20px] py-[10px] relative rounded-[8px] shrink-0" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Svg11 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.5px]">Create Advertisement</p>
    </div>
  );
}

function Div68() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Div69() {
  return (
    <div className="bg-white h-[86px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[32px] py-[33px] relative size-full">
          <Div68 />
        </div>
      </div>
    </div>
  );
}

function Div70() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[311px] rounded-[16px] top-[267px] w-[818px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)]" />
      <Div45 />
      <Div67 />
      <Div69 />
    </div>
  );
}

function Div71() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.4)] border-0 border-[#e5e7eb] border-solid h-[1052px] left-0 overflow-clip top-0 w-[1440px]" data-name="div">
      <Div70 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <Admin />
      <Div71 />
    </div>
  );
}

export default function Admin1() {
  return (
    <div className="relative size-full" data-name="Admin">
      <Group />
    </div>
  );
}