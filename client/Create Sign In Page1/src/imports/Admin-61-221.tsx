import svgPaths from "./svg-grni6jkmrc";
import imgImg from "figma:asset/bec21fc75386a86210d32bec8ca98fcb2380d21e.png";
import imgImage2 from "figma:asset/292c1d179a96fee18e347887f2a9f5ac3898537b.png";

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

function Div3() {
  return (
    <div className="absolute bg-[#c10007] border-0 border-[#e5e7eb] border-solid left-0 rounded-[8px] size-[40px] top-[2px]" data-name="div">
      <I />
    </div>
  );
}

function Div4() {
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
      <Div3 />
      <Div4 />
    </div>
  );
}

function Div1() {
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

function Div5() {
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
          <path d={svgPaths.p2ee32b00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-name="svg">
      <Frame2 />
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[#c10007] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[16px] py-[12px] relative size-full">
          <Svg2 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.5px]">Articles</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
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

function Svg3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame3 />
    </div>
  );
}

function I2() {
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
      <I2 />
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

function Svg4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame4 />
    </div>
  );
}

function I3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg4 />
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I3 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Sites</p>
    </div>
  );
}

function I4() {
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

function Div9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I4 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">{`Ads `}</p>
    </div>
  );
}

function I5() {
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

function Div10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I5 />
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

function Svg5() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[2px] size-[16px] top-[4px]" data-name="svg">
      <Frame5 />
    </div>
  );
}

function I6() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[24px] left-[16px] top-[12px] w-[20px]" data-name="i">
      <Svg5 />
    </div>
  );
}

function Div11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I6 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[48px] not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[14px] tracking-[-0.5px]">Settings</p>
    </div>
  );
}

function Nav() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[4px] items-start px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="nav">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div5 />
      <Div6 />
      <Div7 />
      <Div8 />
      <Div9 />
      <Div10 />
      <Div11 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Div1 />
      <Nav />
    </div>
  );
}

function I7() {
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

function Div12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[32px] py-[20px] relative w-full">
          <I7 />
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)] tracking-[-0.5px]">Logout</p>
        </div>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="bg-[#0f172a] content-stretch flex flex-col items-start justify-between relative self-stretch shrink-0 w-[240px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame17 />
      <Div12 />
    </div>
  );
}

function Div16() {
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

function Div15() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[10px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div16 />
      <Img />
    </div>
  );
}

function Div14() {
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
      <Div15 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white h-[77px] relative shrink-0 w-full" data-name="header">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[32px] py-[24px] relative size-full">
          <Div14 />
        </div>
      </div>
    </div>
  );
}

function Span() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[-0.5px]">Technology</p>
    </div>
  );
}

function Div19() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[8px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Span />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.5px]">|</p>
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">SINGAPORE</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start not-italic relative shrink-0 tracking-[-0.5px] w-full">
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[32px] relative shrink-0 text-[#111827] text-[35px] w-full">Singapore Unveils First AI-Powered Urban Management System</p>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#4b5563] text-[20px] w-full">The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency.</p>
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

function Frame11() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
      <div className="h-[9.333px] relative shrink-0 w-[12.833px]" data-name="Icon">
        <div className="absolute inset-[-8.04%_-5.84%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3333 10.8333">
            <g id="Icon">
              <path d={svgPaths.p2e139a00} stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d={svgPaths.p2fcbee00} stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">100 views</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[34px] items-center relative shrink-0">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#6b7280] text-[14px] tracking-[-0.5px]">By Author</p>
      <Frame10 />
      <Frame11 />
    </div>
  );
}

function Div20() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex h-[69px] items-center relative shrink-0 w-[729px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid border-t inset-0 pointer-events-none" />
      <Frame12 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[28px] items-start p-[20px] relative w-full">
        <Div19 />
        <Frame7 />
        <Div20 />
        <div className="aspect-[1220/723] relative rounded-[12px] shrink-0 w-full" data-name="image 2">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
            <img alt="" className="absolute h-[130.15%] left-0 max-w-none top-[-16.6%] w-[100.01%]" src={imgImage2} />
          </div>
        </div>
        <div className="font-['Inter:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[24px] min-w-full not-italic relative shrink-0 text-[#4b5563] text-[20px] tracking-[-0.5px] w-[min-content]">
          <p className="css-4hzbpn mb-0">{`The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency. `}</p>
          <p className="css-4hzbpn mb-0">{` `}</p>
          <p className="css-4hzbpn mb-0">{`Singapore has launched the world's most advanced AI-powered urban management system, representing a quantum leap in smart city technology. The comprehensive platform integrates traffic management, energy distribution, waste collection, and emergency services into a single, intelligent network. `}</p>
          <p className="css-4hzbpn mb-0">{` `}</p>
          <p className="css-4hzbpn mb-0">{`Prime Minister Lee Hsien Yang unveiled the system at a ceremony in Marina Bay, describing it as "the future of urban living." The AI system processes data from millions of sensors throughout the city, making real-time decisions to optimize urban operations.`}</p>
          <p className="css-4hzbpn mb-0">&nbsp;</p>
          <p className="css-4hzbpn mb-0">{`The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency. `}</p>
          <p className="css-4hzbpn mb-0">{` `}</p>
          <p className="css-4hzbpn mb-0">{`Singapore has launched the world's most advanced AI-powered urban management system, representing a quantum leap in smart city technology. The comprehensive platform integrates traffic management, energy distribution, waste collection, and emergency services into a single, intelligent network. `}</p>
          <p className="css-4hzbpn mb-0">{` `}</p>
          <p className="css-4hzbpn">{`Prime Minister Lee Hsien Yang unveiled the system at a ceremony in Marina Bay, describing it as "the future of urban living." The AI system processes data from millions of sensors throughout the city, making real-time decisions to optimize urban operations.`}</p>
        </div>
      </div>
    </div>
  );
}

function Span1() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[6px] relative rounded-[99px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">Singapore</p>
    </div>
  );
}

function Span2() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[6px] relative rounded-[99px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">smart city</p>
    </div>
  );
}

function Span3() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[6px] relative rounded-[99px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">urban management</p>
    </div>
  );
}

function Span4() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[10px] py-[6px] relative rounded-[99px] shrink-0" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center tracking-[-0.5px]">AI technology</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[7px] items-center relative shrink-0">
      <Span1 />
      <Span2 />
      <Span3 />
      <Span4 />
    </div>
  );
}

function Div21() {
  return (
    <div className="bg-white h-[106px] relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[10px] items-start justify-center p-[20px] relative size-full">
          <p className="css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-w-full not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[-0.5px] w-[min-content]">Topics:</p>
          <Frame15 />
        </div>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-[749.33px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-4hzbpn font-['Inter:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#4b5563] text-[16px] tracking-[-0.5px] w-full">{`Articles  /  Details `}</p>
      <Frame19 />
      <Div21 />
    </div>
  );
}

function Div25() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[#111827] text-[16px] top-0 tracking-[-0.5px]">Publish to:</p>
    </div>
  );
}

function Check() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Check">
          <path d={svgPaths.p39be50} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Div28() {
  return (
    <div className="absolute bg-[#111827] content-stretch flex items-center left-0 p-[2px] rounded-[4px] top-0" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#111827] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Check />
    </div>
  );
}

function Div27() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 size-[20px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div28 />
    </div>
  );
}

function Div30() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-0 not-italic text-[#111827] text-[16px] top-[2px] tracking-[-0.5px]">FilipinoHomes</p>
    </div>
  );
}

function Div29() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[285px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div30 />
    </div>
  );
}

function Label() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div27 />
      <Div29 />
    </div>
  );
}

function Check1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Check">
          <path d={svgPaths.p39be50} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Div31() {
  return (
    <div className="bg-[#111827] content-stretch flex items-center p-[2px] relative rounded-[4px] shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#111827] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Check1 />
    </div>
  );
}

function Div33() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-0 not-italic text-[#111827] text-[16px] top-[2px] tracking-[-0.5px]">Rent.ph</p>
    </div>
  );
}

function Div32() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[285px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div33 />
    </div>
  );
}

function Label1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div31 />
      <Div32 />
    </div>
  );
}

function Div35() {
  return <div className="absolute bg-white border-2 border-[#d1d5db] border-solid left-0 rounded-[4px] size-[20px] top-0" data-name="div" />;
}

function Div34() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 size-[20px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div35 />
    </div>
  );
}

function Div37() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-0 not-italic text-[#111827] text-[16px] top-[2px] tracking-[-0.5px]">Homes</p>
    </div>
  );
}

function Div36() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[285px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div37 />
    </div>
  );
}

function Label2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div34 />
      <Div36 />
    </div>
  );
}

function Div39() {
  return <div className="absolute bg-white border-2 border-[#d1d5db] border-solid left-0 rounded-[4px] size-[20px] top-0" data-name="div" />;
}

function Div38() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid left-0 size-[20px] top-[2px]" data-name="div">
      <Div39 />
    </div>
  );
}

function Div41() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-0 not-italic text-[#111827] text-[16px] top-[2px] tracking-[-0.5px]">Bayanihan</p>
    </div>
  );
}

function Div40() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start left-[27.66px] top-0 w-[285px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div41 />
    </div>
  );
}

function Label3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[44px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div38 />
      <Div40 />
    </div>
  );
}

function Check2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Check">
          <path d={svgPaths.p39be50} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Div42() {
  return (
    <div className="bg-[#111827] content-stretch flex items-center p-[2px] relative rounded-[4px] shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#111827] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Check2 />
    </div>
  );
}

function Div44() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[24px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-0 not-italic text-[#111827] text-[16px] top-[2px] tracking-[-0.5px]">Main News Portal</p>
    </div>
  );
}

function Div43() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[285px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div44 />
    </div>
  );
}

function Label4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div42 />
      <Div43 />
    </div>
  );
}

function Div26() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label />
      <Label1 />
      <Label2 />
      <Label3 />
      <Label4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Frame">
          <g clipPath="url(#clip0_5_231)">
            <path d={svgPaths.p34d28400} fill="var(--fill-0, #374151)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_231">
            <path d="M0 0H14V14H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-[2.75px]" data-name="svg">
      <Frame6 />
    </div>
  );
}

function I8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[14px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg6 />
    </div>
  );
}

function Span5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[71.109px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[35.55px] not-italic text-[#374151] text-[14px] text-center top-px tracking-[-0.5px] translate-x-[-50%]">Customize</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center justify-center px-[21px] py-[11px] relative rounded-[8px] shrink-0 w-[180px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I8 />
      <Span5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Frame">
          <g clipPath="url(#clip0_5_218)">
            <path d={svgPaths.p393af80} fill="var(--fill-0, white)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_218">
            <path d="M0 0H14V14H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[14px] top-[2.75px]" data-name="svg">
      <Frame8 />
    </div>
  );
}

function I9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[14px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg7 />
    </div>
  );
}

function Span6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-[49.938px]" data-name="span">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[25.47px] not-italic text-[14px] text-center text-white top-px tracking-[-0.5px] translate-x-[-50%]">Publish</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#3b82f6] content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <I9 />
      <Span6 />
    </div>
  );
}

function Div45() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Button />
      <Button1 />
    </div>
  );
}

function Div24() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[22px] items-start p-[25px] relative w-full">
        <Div25 />
        <Div26 />
        <Div45 />
      </div>
    </div>
  );
}

function Div23() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div24 />
    </div>
  );
}

function H() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center px-px py-0 relative shrink-0" data-name="h3">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[18px] tracking-[-0.5px]">Article Statistics</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="h-[14px] relative shrink-0 w-[15.75px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.75 14">
        <g id="Frame">
          <g clipPath="url(#clip0_5_228)">
            <path d={svgPaths.p32af75f0} fill="var(--fill-0, #9CA3AF)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_228">
            <path d="M0 0H15.75V14H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-center justify-center left-0 overflow-clip top-[18.75px] w-[15.75px]" data-name="Frame">
      <Frame13 />
    </div>
  );
}

function Div48() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[53px] relative shrink-0 w-[312px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-b border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[23.75px] not-italic text-[#4b5563] text-[14px] top-[16px] tracking-[-0.5px]">{` Total Views`}</p>
      <Frame9 />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[258.45px] not-italic text-[#111827] text-[20px] top-[12px] tracking-[-0.5px]">1,923</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Frame">
          <g clipPath="url(#clip0_5_215)">
            <path d={svgPaths.p3a17b200} fill="var(--fill-0, #9CA3AF)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_215">
            <path d="M0 0H14V14H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 overflow-clip size-[14px] top-[18.75px]" data-name="Frame">
      <Frame16 />
    </div>
  );
}

function Div49() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[52px] relative shrink-0 w-[312px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[22px] not-italic text-[#4b5563] text-[14px] top-[16px] tracking-[-0.5px]">{` Published Sites`}</p>
      <Frame14 />
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[298.5px] not-italic text-[#111827] text-[20px] top-[12px] tracking-[-0.5px]">0</p>
    </div>
  );
}

function Div47() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div48 />
      <Div49 />
    </div>
  );
}

function Div46() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative w-full">
        <H />
        <Div47 />
      </div>
    </div>
  );
}

function H1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center px-px py-0 relative shrink-0" data-name="h3">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[18px] tracking-[-0.5px]">Quick Actions</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex gap-[12px] h-[48px] items-center justify-center px-[20px] py-0 relative rounded-[8px] shrink-0 w-[313px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[16.768px]" data-name="Icon">
        <div className="absolute inset-[-7.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2678 19.2678">
            <path d={svgPaths.p33378900} id="Icon" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.5px]">{` Edit Article`}</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <g clipPath="url(#clip0_5_210)">
            <path d={svgPaths.p335e1900} id="Icon" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2.5" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_5_210">
            <path d="M0 0H20V20H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#fef2f2] content-stretch flex gap-[12px] h-[48px] items-center justify-center px-[20px] py-0 relative rounded-[8px] shrink-0 w-[313px]" data-name="button">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame18 />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.5px]">{` Reject Article`}</p>
    </div>
  );
}

function Div51() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Div50() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative w-full">
        <H1 />
        <Div51 />
      </div>
    </div>
  );
}

function Div22() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[362.656px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div23 />
      <Div46 />
      <Div50 />
    </div>
  );
}

function Div17() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div18 />
      <Div22 />
    </div>
  );
}

function Main() {
  return (
    <div className="bg-[#f9fafb] relative shrink-0 w-full" data-name="main">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[32px] relative w-full">
        <Div17 />
      </div>
    </div>
  );
}

function Div13() {
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
      <Div />
      <Div13 />
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