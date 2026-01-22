import svgPaths from "./svg-k0d24edesm";

function Div2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[129.063px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[#111827] text-[24px] tracking-[-0.5px]">Create New Advertisement</p>
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

function Div1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[32px] py-[24px] relative w-full">
          <Div2 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Ad Name / Campaign Title</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[1002px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Real Estate Expo 2026</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label />
      <Input />
    </div>
  );
}

function Label1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Client / Advertiser Name</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[886px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Dubai Property Developers</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label1 />
      <Input1 />
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

function Frame1() {
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
        <div className="content-stretch flex items-center justify-between px-[10px] py-0 relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[186px]">
            <p className="css-g0mm18 leading-[normal] overflow-hidden">300x250 (Rectangle)</p>
          </div>
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label2 />
      <Select />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Div7 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[6px] items-center leading-[normal] min-h-px min-w-px not-italic relative text-[14px] tracking-[-0.5px]">
      <p className="css-ew64yg relative shrink-0 text-[#111827]">Ad Image</p>
      <p className="css-ew64yg relative shrink-0 text-[#ef4444]">*</p>
    </div>
  );
}

function Frame7() {
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
      <Frame6 />
      <Frame7 />
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

function Svg1() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-center left-0 top-[5px] w-[60px]" data-name="svg">
      <Frame2 />
    </div>
  );
}

function I1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[59px] mr-[-29px] relative shrink-0 w-[60px]" data-name="i">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Svg1 />
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

function Div9() {
  return (
    <div className="bg-[#f9fafb] content-center flex flex-wrap gap-[4px] items-center justify-center pl-0 pr-[29px] py-[29px] relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#d1d5db] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <P />
      <I1 />
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

function Frame3() {
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
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#adaebc] text-[14px] text-ellipsis tracking-[-0.5px] w-[268px]">
            <p className="css-g0mm18 leading-[20px] overflow-hidden">htttps://example.com/ad-image.jpg</p>
          </div>
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label4 />
      <Select1 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Div10 />
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label3 />
      <Div9 />
      <Frame9 />
    </div>
  );
}

function Label5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">{`Target URL `}</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[886px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">htttps://example.com/landing-page</p>
      </div>
    </div>
  );
}

function Div11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label5 />
      <Input2 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Where users will be redirected when clicking the ad</p>
    </div>
  );
}

function Label6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">{`Ad Placement `}</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input3() {
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
      <Input3 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">News Portal - Sidebar</p>
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

function Label8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[1] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input4 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">News Portal - Bottom</p>
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

function Label9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[3] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input5 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Article Pages - Bottom</p>
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

function Label10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[2] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input6 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Article Pages - Top</p>
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

function Label11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[4] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input7 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Sidebar - All Pages</p>
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

function Label12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[3] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input8 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Article Pages - In-feed</p>
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

function Label13() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[5] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input9 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Homepage - Banner</p>
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

function Label14() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[4] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input10 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">Category Pages - Top</p>
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

function Label15() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[2] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[5] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Input11 />
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

function Div17() {
  return (
    <div className="absolute bg-[#111827] content-stretch flex items-center left-0 p-[2px] rounded-[1px] size-[16px] top-0" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#111827] border-solid inset-0 pointer-events-none rounded-[1px]" />
      <Check />
    </div>
  );
}

function Div16() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 size-[16px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div17 />
    </div>
  );
}

function Label16() {
  return (
    <div className="bg-[rgba(0,0,0,0)] col-[1] content-stretch css-uwkwlr flex gap-[12px] items-center relative row-[1] self-start shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div16 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#111827] text-[16px] tracking-[-0.5px]">News Portal - Top</p>
    </div>
  );
}

function Div15() {
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

function Div14() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div15 />
    </div>
  );
}

function Div13() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start p-[24px] relative w-full">
        <Div14 />
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label6 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Select where this ad should appear (choose one or more)</p>
      <Div13 />
    </div>
  );
}

function Label17() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Start Date</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Frame4() {
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

function Svg2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="svg">
      <Frame4 />
    </div>
  );
}

function Input12() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-px relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[304px]">
            <p className="css-g0mm18 leading-[24px] overflow-hidden">mm/ dd / yyyy</p>
          </div>
          <Svg2 />
        </div>
      </div>
    </div>
  );
}

function Div18() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label17 />
      <Input12 />
    </div>
  );
}

function Label18() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">End Date</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Frame5() {
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

function Svg3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="svg">
      <Frame5 />
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
          <Svg3 />
        </div>
      </div>
    </div>
  );
}

function Div19() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label18 />
      <Input13 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <Div18 />
      <Div19 />
    </div>
  );
}

function Label19() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Campaign Revenue ($)</p>
    </div>
  );
}

function Input14() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[16px] text-black text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[886px]">
        <p className="css-g0mm18 leading-[24px] overflow-hidden">0</p>
      </div>
    </div>
  );
}

function Div20() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label19 />
      <Input14 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Expected or actual revenue from this ad campaign</p>
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[24px] items-start pb-0 pt-[32px] px-0 relative shrink-0 w-full" data-name="div">
      <Div5 />
      <Div6 />
      <Frame8 />
      <Div8 />
      <Div11 />
      <Div12 />
      <Frame10 />
      <Div20 />
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

function Div24() {
  return (
    <div className="absolute bg-[#c10008] content-stretch flex items-center left-0 p-[2px] rounded-[1px] size-[16px] top-0" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#c10008] border-solid inset-0 pointer-events-none rounded-[1px]" />
      <Check1 />
    </div>
  );
}

function Div23() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 size-[16px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div24 />
    </div>
  );
}

function Label20() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center relative shrink-0" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div23 />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Set ad as active immediately</p>
    </div>
  );
}

function Div22() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label20 />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[-0.5px]">Active ads will be displayed on selected placements</p>
    </div>
  );
}

function Div21() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start px-0 py-[32px] relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Div22 />
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[32px] py-0 relative w-full">
          <Div4 />
          <Div21 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

export default function Div() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[16px] size-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)]" />
      <Div1 />
      <Div3 />
    </div>
  );
}