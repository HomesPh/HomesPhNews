import { useState } from 'react';
import svgPaths from "../imports/svg-2sml3b9ok2";

interface CustomizeTitlesModalProps {
  onClose: () => void;
  publishTo: {
    filipinoHomes: boolean;
    rentPh: boolean;
    homes: boolean;
    bayanihan: boolean;
    mainNewsPortal: boolean;
  };
  originalTitle?: string;
}

export function CustomizeTitlesModal({ onClose, publishTo, originalTitle = "Philippines Property Sector Attracts $2.3B Foreign Investment" }: CustomizeTitlesModalProps) {
  
  const [titles, setTitles] = useState({
    filipinoHomes: originalTitle,
    rentPh: originalTitle,
    homes: originalTitle,
    bayanihan: originalTitle,
    mainNewsPortal: originalTitle,
  });

  const handleSave = () => {
    // Save logic here
    alert('Titles saved!');
    onClose();
  };

  const updateTitle = (site: keyof typeof titles, value: string) => {
    setTitles({ ...titles, [site]: value });
  };

  const siteLabels = {
    filipinoHomes: 'FilipinoHomes',
    rentPh: 'Rent.ph',
    homes: 'Homes',
    bayanihan: 'Bayanihan',
    mainNewsPortal: 'Main News Portal',
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-[600px] flex flex-col">
        {/* Header */}
        <div className="p-8 pb-0">
          <div className="relative h-[74px] mb-8">
            <div>
              <h2 className="font-['Inter'] font-bold text-[28px] leading-[42px] text-[#111827] tracking-[-0.5px]">
                Customize Titles Per Site
              </h2>
              <p className="font-['Inter'] font-normal text-[16px] leading-[24px] text-[#6b7280] tracking-[-0.5px] mt-2">
                Tailor the headline for each publishing platform
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute right-0 top-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-[15px] h-5" fill="none" viewBox="0 0 15 20">
                <path d={svgPaths.p36f06cb0} fill="#9CA3AF" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 flex flex-col gap-6">
          {/* Original Title */}
          <div>
            <label className="block font-['Inter'] font-bold text-[14px] text-[#111827] tracking-[-0.5px] mb-2">
              Original Title
            </label>
            <div className="bg-[#f9fafb] rounded-[6px] h-[56px] flex items-center px-4">
              <p className="font-['Inter'] font-normal text-[16px] text-[#374151] tracking-[-0.5px]">
                {originalTitle}
              </p>
            </div>
          </div>

          {/* Site-specific Titles */}
          <div className="flex flex-col gap-6">
            {(Object.keys(publishTo) as Array<keyof typeof publishTo>).map((site) => {
              if (!publishTo[site]) return null;
              
              return (
                <div key={site}>
                  <label className="block font-['Inter'] font-bold text-[16px] leading-[24px] text-[#111827] tracking-[-0.5px] mb-2">
                    {siteLabels[site]}
                  </label>
                  <input
                    type="text"
                    value={titles[site]}
                    onChange={(e) => updateTitle(site, e.target.value)}
                    placeholder={originalTitle}
                    className="w-full h-[48px] px-4 bg-white border border-[#d1d5db] rounded-[6px] font-['Inter'] font-normal text-[15px] leading-[23px] text-[#111827] placeholder:text-[#adaebc] tracking-[-0.5px] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 h-[65px] border-t border-[#e5e7eb] px-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-[44px] px-6 font-['Inter'] font-normal text-[16px] text-[#6b7280] tracking-[-0.5px] hover:text-[#111827] transition-colors rounded-[6px] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-[40px] px-[25px] bg-[#3b82f6] text-white rounded-[8px] font-['Inter'] font-normal text-[16px] tracking-[-0.5px] hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
