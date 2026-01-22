import svgPaths from "./svg-ios10q3l7k";

function Div2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start relative shrink-0 w-[129.063px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[32px] not-italic relative shrink-0 text-[#111827] text-[24px] tracking-[-0.5px]">Add Partner Site</p>
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
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Site Name</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[1002px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Enter site name</p>
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
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Domain</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[738px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">example.com</p>
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
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Contact Name</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[337px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">John Doe</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label2 />
      <Input2 />
    </div>
  );
}

function Label3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Contact Email</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[324px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">john@example.com</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label3 />
      <Input3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <Div7 />
      <Div8 />
    </div>
  );
}

function Label4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[5px] items-center px-0 py-px relative shrink-0 w-[86px]" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#111827] text-[14px] tracking-[-0.5px]">Description</p>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] tracking-[-0.5px]">*</p>
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-white h-[110px] relative rounded-[8px] shrink-0 w-full" data-name="input">
      <div aria-hidden="true" className="absolute border border-[#d1d5db] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] left-[16px] not-italic overflow-hidden text-[#adaebc] text-[14px] text-ellipsis top-[24px] tracking-[-0.5px] translate-y-[-50%] w-[738px]">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Brief description of the partner site</p>
      </div>
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label4 />
      <Input4 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[6px] items-center leading-[normal] min-h-px min-w-px not-italic relative text-[14px] tracking-[-0.5px]">
      <p className="css-ew64yg relative shrink-0 text-[#111827]">Logo</p>
      <p className="css-ew64yg relative shrink-0 text-[#ef4444]">*</p>
    </div>
  );
}

function Label5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex h-[18px] items-start justify-between px-0 py-px relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Frame3 />
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

function Frame1() {
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
      <Frame1 />
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

function Div11() {
  return (
    <div className="bg-[#f9fafb] content-center flex flex-wrap gap-[4px] items-center justify-center pl-0 pr-[29px] py-[29px] relative rounded-[12px] shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-2 border-[#d1d5db] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <P />
      <I1 />
      <P1 />
    </div>
  );
}

function Label6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[20px] relative shrink-0 w-full" data-name="label">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="absolute css-ew64yg font-['Inter:Light','Noto_Sans:Light',sans-serif] font-light leading-[normal] left-0 not-italic text-[#111827] text-[14px] top-px tracking-[-0.5px]">{`Or enter logo URL: `}</p>
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
          <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#adaebc] text-[14px] text-ellipsis tracking-[-0.5px] w-[268px]">
            <p className="css-g0mm18 leading-[20px] overflow-hidden">htttps://example.com/logo.jpg</p>
          </div>
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Div12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label6 />
      <Select />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Div12 />
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Label5 />
      <Div11 />
      <Frame4 />
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col gap-[24px] items-start px-0 py-[32px] relative shrink-0 w-full" data-name="div">
      <Div5 />
      <Div6 />
      <Frame5 />
      <Div9 />
      <Div10 />
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] relative shrink-0 w-full" data-name="div">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[32px] py-0 relative w-full">
          <Div4 />
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