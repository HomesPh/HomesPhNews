function Div() {
  return (
    <div className="bg-[#030213] content-stretch flex items-center justify-center px-[10px] py-[5px] relative rounded-[6px] shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.5px]">All News</p>
    </div>
  );
}

function Div1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center px-0 py-px relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[-0.5px]">Real Estate</p>
    </div>
  );
}

function Div2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center px-0 py-px relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[-0.5px]">Business</p>
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center px-0 py-px relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[-0.5px]">Politics</p>
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center px-0 py-px relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[-0.5px]">Technology</p>
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center px-0 py-px relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[-0.5px]">Economy</p>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center px-0 py-px relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#374151] text-[14px] tracking-[-0.5px]">Tourism</p>
    </div>
  );
}

export default function Nav() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[30px] items-center relative size-full" data-name="nav">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Div />
      <Div1 />
      <Div2 />
      <Div3 />
      <Div4 />
      <Div5 />
      <Div6 />
    </div>
  );
}