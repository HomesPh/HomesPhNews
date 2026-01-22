function Div() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[7px] items-center relative shrink-0 w-full" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="css-g0mm18 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#c70036] text-[12px] tracking-[-0.5px]">
        <p className="css-ew64yg leading-[normal]">22</p>
      </div>
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[normal] not-italic relative shrink-0 text-[#c70036] text-[12px] tracking-[-0.5px] w-[159px]">
        <p className="css-4hzbpn mb-0">AI in Business Conference</p>
        <p className="css-4hzbpn font-['Inter:Light',sans-serif] font-light">10:00 AM</p>
      </div>
    </div>
  );
}

export default function Div1() {
  return (
    <div className="bg-[#ffe4e6] content-stretch flex flex-col items-start justify-center px-[12px] py-[10px] relative rounded-[6px] size-full" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Div />
    </div>
  );
}