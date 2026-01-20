"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

interface CustomizeTitlesModalProps {
    isOpen: boolean;
    onClose: () => void;
    publishTo: {
        filipinoHomes: boolean;
        rentPh: boolean;
        homesPh: boolean;
        bayanihan: boolean;
        mainPortal: boolean;
    };
    originalTitle: string;
}

export default function CustomizeTitlesModal({
    isOpen,
    onClose,
    publishTo,
    originalTitle
}: CustomizeTitlesModalProps) {
    const [titles, setTitles] = useState({
        filipinoHomes: originalTitle,
        rentPh: originalTitle,
        homesPh: originalTitle,
        bayanihan: originalTitle,
        mainPortal: originalTitle,
    });

    if (!isOpen) return null;

    const handleSave = () => {
        alert('Titles saved!');
        onClose();
    };

    const updateTitle = (site: keyof typeof titles, value: string) => {
        setTitles({ ...titles, [site]: value });
    };

    const siteLabels = {
        filipinoHomes: 'FilipinoHomes',
        rentPh: 'Rent.ph',
        homesPh: 'HomesPh',
        bayanihan: 'Bayanihan',
        mainPortal: 'Main News Portal',
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] animate-in fade-in duration-200 backdrop-blur-[2px]">
            <div className="bg-white rounded-[12px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-8 pb-0">
                    <div className="relative mb-8">
                        <div>
                            <h2 className="font-bold text-[28px] leading-[42px] text-[#111827] tracking-[-0.5px]">
                                Customize Titles Per Site
                            </h2>
                            <p className="font-normal text-[16px] leading-[24px] text-[#6b7280] tracking-[-0.5px] mt-2">
                                Tailor the headline for each publishing platform
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute right-0 top-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors group"
                        >
                            <X className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#111827]" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 flex flex-col gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Original Title */}
                    <div>
                        <label className="block font-bold text-[14px] text-[#111827] tracking-[-0.5px] mb-2">
                            Original Title
                        </label>
                        <div className="bg-[#f9fafb] rounded-[6px] min-h-[56px] flex items-center px-4 py-3">
                            <p className="font-normal text-[16px] text-[#374151] tracking-[-0.5px]">
                                {originalTitle}
                            </p>
                        </div>
                    </div>

                    {/* Site-specific Titles */}
                    <div className="flex flex-col gap-6 pb-4">
                        {(Object.keys(publishTo) as Array<keyof typeof publishTo>).map((site) => {
                            if (!publishTo[site]) return null;

                            return (
                                <div key={site}>
                                    <label className="block font-bold text-[16px] leading-[24px] text-[#111827] tracking-[-0.5px] mb-2">
                                        {siteLabels[site]}
                                    </label>
                                    <input
                                        type="text"
                                        value={titles[site]}
                                        onChange={(e) => updateTitle(site, e.target.value)}
                                        placeholder={originalTitle}
                                        className="w-full h-[48px] px-4 bg-white border border-[#d1d5db] rounded-[6px] font-normal text-[15px] leading-[23px] text-[#111827] placeholder:text-[#adaebc] tracking-[-0.5px] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 h-[75px] border-t border-[#e5e7eb] px-8 flex items-center justify-end gap-3 rounded-b-[12px] bg-[#fdfdfd]">
                    <button
                        onClick={onClose}
                        className="h-[44px] px-6 font-normal text-[16px] text-[#6b7280] tracking-[-0.5px] hover:text-[#111827] transition-colors rounded-[6px] hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="h-[44px] px-[25px] bg-[#3b82f6] text-white rounded-[8px] font-semibold text-[16px] tracking-[-0.5px] hover:bg-[#2563eb] transition-all active:scale-95 shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}
