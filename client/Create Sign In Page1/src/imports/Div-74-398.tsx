import svgPaths from "./svg-d24tdqwtuu";

function Div() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[129.063px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[#111827] text-[24px] tracking-[-0.5px]">Create Event</p>
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
          <Div />
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
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Event Title</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[1002px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Enter event title</p>
      </div>
    </div>
  );
}

function Div2() {
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
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Date</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.pd4ed5c0} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="svg">
      <Frame1 />
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-px relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[304px]">
            <p className="css-g0mm18 leading-[24px] overflow-hidden">mm/ dd / yyyy</p>
          </div>
          <Svg1 />
        </div>
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label1 />
      <Input1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-0 py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Time</p>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-px relative w-full">
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[160px]">
            <p className="css-g0mm18 leading-[24px] overflow-hidden">--:-- --</p>
          </div>
          <div className="relative shrink-0 size-[18px]" data-name="Icon">
            <div className="absolute inset-[-4.44%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.6 19.6">
                <path d={svgPaths.p376743c0} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label2 />
      <Input2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <Div3 />
      <Div4 />
    </div>
  );
}

function Label3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Location</p>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[886px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Enter even location</p>
      </div>
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label3 />
      <Input3 />
    </div>
  );
}

function Label4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Details</p>
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-white h-[84px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[720px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Enter event details</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label4 />
      <Input4 />
    </div>
  );
}

function Label5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Category</p>
    </div>
  );
}

function Frame2() {
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
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[64px]">
            <p className="css-g0mm18 leading-[normal] overflow-hidden">Business</p>
          </div>
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label5 />
      <Select />
    </div>
  );
}

function Label6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">Country</p>
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
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis tracking-[-0.5px] w-[77px]">
            <p className="css-g0mm18 leading-[normal] overflow-hidden">Philippines</p>
          </div>
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label6 />
      <Select1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-start min-h-px min-w-px relative">
      <Div7 />
      <Div8 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Frame4 />
    </div>
  );
}

function Label7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Color</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[34px] relative shrink-0 w-[186px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 186 34">
        <g id="Frame 57">
          <circle cx="17" cy="17" fill="var(--fill-0, #DBEAFE)" id="Ellipse 25" r="16" stroke="var(--stroke-0, black)" strokeWidth="2" />
          <circle cx="57" cy="17" fill="var(--fill-0, #F3E8FF)" id="Ellipse 26" r="14.5" stroke="var(--stroke-0, #D1D5DC)" />
          <circle cx="95" cy="17" fill="var(--fill-0, #DBFCE7)" id="Ellipse 27" r="14.5" stroke="var(--stroke-0, #D1D5DC)" />
          <circle cx="133" cy="17" fill="var(--fill-0, #FEF3C6)" id="Ellipse 28" r="14.5" stroke="var(--stroke-0, #D1D5DC)" />
          <circle cx="171" cy="17" fill="var(--fill-0, #FFE4E6)" id="Ellipse 29" r="14.5" stroke="var(--stroke-0, #D1D5DC)" />
        </g>
      </svg>
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label7 />
      <Frame7 />
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[24px] items-start px-0 py-[32px] relative shrink-0 w-full" data-name="div">
      <Div2 />
      <Frame5 />
      <Div5 />
      <Div6 />
      <Frame6 />
      <Div9 />
    </div>
  );
}

function Div11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[32px] py-0 relative w-full">
          <Div10 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

export default function Div12() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[16px] size-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)]" />
      <Div1 />
      <Div11 />
    </div>
  );
}