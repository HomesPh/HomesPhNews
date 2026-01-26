"use client";

import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

export type TemplateType = 'single' | 'gallery' | 'split' | 'inline' | 'textwrap' | 'fullwidth';

interface TemplateOption {
    id: TemplateType;
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface TemplateSelectorProps {
    selectedTemplate: TemplateType;
    onSelect: (template: TemplateType) => void;
}

export default function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
    const templates: TemplateOption[] = [
        {
            id: 'single',
            title: 'Single Image',
            description: 'Classic article layout',
            icon: (
                <div className="bg-white rounded-[6px] overflow-hidden border border-[#e5e7eb] p-3 space-y-2 w-full">
                    <div className="w-full h-12 bg-[#e5e7eb] rounded" />
                    <div className="h-1.5 bg-[#e5e7eb] rounded w-full" />
                    <div className="h-1.5 bg-[#f3f4f6] rounded w-full" />
                    <div className="h-1.5 bg-[#f3f4f6] rounded w-3/4" />
                </div>
            )
        },
        {
            id: 'gallery',
            title: 'Gallery Grid',
            description: 'Multiple images in grid',
            icon: (
                <div className="bg-white rounded-[6px] overflow-hidden border border-[#e5e7eb] p-3 space-y-2 w-full">
                    <div className="grid grid-cols-2 gap-1.5">
                        <div className="w-full h-8 bg-[#e5e7eb] rounded" />
                        <div className="w-full h-8 bg-[#e5e7eb] rounded" />
                    </div>
                    <div className="w-full h-8 bg-[#e5e7eb] rounded" />
                    <div className="h-1.5 bg-[#f3f4f6] rounded w-full" />
                </div>
            )
        },
        {
            id: 'split',
            title: 'Split Layout',
            description: 'Two column layout',
            icon: (
                <div className="bg-white rounded-[6px] overflow-hidden border border-[#e5e7eb] p-3 w-full">
                    <div className="flex gap-2">
                        <div className="w-1/2 h-20 bg-[#e5e7eb] rounded" />
                        <div className="w-1/2 h-20 bg-[#e5e7eb] rounded" />
                    </div>
                </div>
            )
        },
        {
            id: 'inline',
            title: 'Inline Images',
            description: 'Images within text flow',
            icon: (
                <div className="bg-white rounded-[6px] overflow-hidden border border-[#e5e7eb] p-3 space-y-2 w-full">
                    <div className="h-1.5 bg-[#f3f4f6] rounded w-full" />
                    <div className="w-full h-8 bg-[#e5e7eb] rounded" />
                    <div className="h-1.5 bg-[#f3f4f6] rounded w-full" />
                    <div className="w-full h-8 bg-[#e5e7eb] rounded" />
                </div>
            )
        },
        {
            id: 'textwrap',
            title: 'Text Wrap',
            description: 'Text wrapping around images',
            icon: (
                <div className="bg-white rounded-[6px] overflow-hidden border border-[#e5e7eb] p-3 space-y-2 w-full">
                    <div className="flex gap-2">
                        <div className="w-12 h-12 bg-[#e5e7eb] rounded shrink-0" />
                        <div className="flex-1 space-y-1">
                            <div className="h-1.5 bg-[#f3f4f6] rounded w-full" />
                            <div className="h-1.5 bg-[#f3f4f6] rounded w-full" />
                            <div className="h-1.5 bg-[#f3f4f6] rounded w-full" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'fullwidth',
            title: 'Full Width',
            description: 'Edge-to-edge images',
            icon: (
                <div className="bg-white rounded-[6px] overflow-hidden border border-[#e5e7eb] p-3 space-y-2 w-full">
                    <div className="w-full h-16 bg-[#e5e7eb] rounded -mx-3" />
                    <div className="h-1.5 bg-[#f3f4f6] rounded w-full" />
                </div>
            )
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
                <button
                    key={template.id}
                    onClick={() => onSelect(template.id)}
                    className={cn(
                        "group bg-white rounded-[12px] overflow-hidden border-2 transition-all text-left flex flex-col",
                        selectedTemplate === template.id
                            ? "border-[#C10007] shadow-lg"
                            : "border-[#e5e7eb] hover:border-[#3b82f6] hover:shadow-md"
                    )}
                >
                    <div className="p-4 border-b border-[#e5e7eb]">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[16px] font-bold text-[#111827] tracking-[-0.5px]">
                                {template.title}
                            </h3>
                            {selectedTemplate === template.id && (
                                <div className="w-5 h-5 rounded-full bg-[#C10007] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <p className="text-[12px] text-[#6b7280] tracking-[-0.5px]">
                            {template.description}
                        </p>
                    </div>
                    <div className="p-4 bg-[#f9fafb] flex-1 flex items-center justify-center">
                        {template.icon}
                    </div>
                </button>
            ))}
        </div>
    );
}
