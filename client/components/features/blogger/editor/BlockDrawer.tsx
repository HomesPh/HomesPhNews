"use client";

import { useState } from "react";
import {
    LayoutGrid, FileText, Image, Grid, Columns, Maximize,
    Plus, Minus, X, Info, AlignCenter, AlignLeft, AlignRight, Layout, User, Type
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogDetails, BlockType } from "@/hooks/useBlockEditor";

interface BlockDrawerProps {
    details: BlogDetails;
    onUpdateDetails: (updates: Partial<BlogDetails>) => void;
    onAddBlock: (type: BlockType) => void;
}

export default function BlockDrawer({ details, onUpdateDetails, onAddBlock }: BlockDrawerProps) {
    const [activeTab, setActiveTab] = useState<'blocks' | 'details'>('blocks');

    const blockGroups = [
        {
            title: "Standard Blocks",
            items: [
                { type: 'text' as BlockType, name: 'Text Block', icon: FileText, description: 'Standard paragraph' },
                { type: 'image' as BlockType, name: 'Full Image', icon: Image, description: 'Full width image' },
                { type: 'centered-image' as BlockType, name: 'Centered', icon: AlignCenter, description: 'Centered small image' },
            ]
        },
        {
            title: "Layout Blocks",
            items: [
                { type: 'grid' as BlockType, name: 'Grid', icon: Grid, description: '2x2 image gallery' },
                { type: 'left-image' as BlockType, name: 'Left Image', icon: AlignLeft, description: 'Left image, right text' },
                { type: 'right-image' as BlockType, name: 'Right Image', icon: AlignRight, description: 'Right image, left text' },
            ]
        },
        {
            title: "Special Layouts",
            items: [
                { type: 'split-left' as BlockType, name: 'Split Left', icon: Columns, description: '50/50 split' },
                { type: 'split-right' as BlockType, name: 'Split Right', icon: Layout, description: '50/50 split' },
                { type: 'dynamic-images' as BlockType, name: 'Stack', icon: Maximize, description: 'Vertical stack' },
            ]
        }
    ];

    const PLATFORMS = ["Apply Na", "Bayanihan", "Faceofmind", "FilipinoHomes", "globalreality", "Homes", "Main News Portal", "PicklePlay"];
    const CATEGORIES = ["Community", "Real Estate", "Technology", "AI", "Investment", "Lifestyle"];
    const COUNTRIES = ["PHILIPPINES", "AUSTRALIA", "SINGAPORE", "USA", "UAE"];

    return (
        <aside className="w-[360px] bg-white border-r border-gray-100 flex flex-col shrink-0 z-30 shadow-[4px_0_20px_rgba(0,0,0,0.02)] h-full">
            <div className="flex border-b border-gray-100 p-2 gap-2 bg-gray-50/50">
                <button
                    onClick={() => setActiveTab('blocks')}
                    className={cn(
                        "flex-1 py-3 text-xs font-black transition-all rounded-xl uppercase tracking-widest",
                        activeTab === 'blocks' ? "bg-white text-[#C10007] shadow-sm ring-1 ring-gray-100" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Library
                </button>
                <button
                    onClick={() => setActiveTab('details')}
                    className={cn(
                        "flex-1 py-3 text-xs font-black transition-all rounded-xl uppercase tracking-widest",
                        activeTab === 'details' ? "bg-white text-[#C10007] shadow-sm ring-1 ring-gray-100" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Settings
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'blocks' ? (
                    <div className="p-6 space-y-8">
                        {blockGroups.map((group) => (
                            <div key={group.title}>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#C10007]" />
                                    {group.title}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {group.items.map((block) => (
                                        <button
                                            key={block.type}
                                            onClick={() => onAddBlock(block.type)}
                                            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl hover:bg-[#fff5f5] hover:border-[#ffd6d6] transition-all group shadow-sm hover:shadow-md"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                                                <block.icon className="w-5 h-5 text-gray-400 group-hover:text-[#C10007] transition-colors" />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-700 text-center">{block.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        <section>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[#C10007]" />
                                Meta Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Internal Title</label>
                                    <input
                                        type="text"
                                        value={details.title}
                                        onChange={(e) => onUpdateDetails({ title: e.target.value })}
                                        placeholder="Enter title"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C10007]/20 transition-all font-inter text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Summary / Abstract</label>
                                    <textarea
                                        value={details.summary}
                                        onChange={(e) => onUpdateDetails({ summary: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C10007]/20 transition-all text-gray-600 leading-relaxed"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">URL Slug</label>
                                    <input
                                        type="text"
                                        value={details.slug}
                                        onChange={(e) => onUpdateDetails({ slug: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none transition-all font-mono text-gray-400"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-gray-100">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[#C10007]" />
                                Publishing Config
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Category</label>
                                    <select
                                        value={details.category}
                                        onChange={(e) => onUpdateDetails({ category: e.target.value })}
                                        className="w-full px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none font-bold"
                                    >
                                        <option value="">Select Category</option>
                                        {/* Dynamic or Hardcoded Categories */}
                                        {["Community", "Real Estate", "Technology", "AI", "Investment", "Lifestyle", "Business", "Entertainment", "Sports", "Politics", "Health", "Travel", "Food"].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Country</label>
                                    <select
                                        value={details.country}
                                        onChange={(e) => onUpdateDetails({ country: e.target.value })}
                                        className="w-full px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none font-bold"
                                    >
                                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Author (Auto-detected)</label>
                                <input
                                    type="text"
                                    value={details.author}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Publish Date</label>
                                    <input
                                        type="date"
                                        value={details.publishDate}
                                        onChange={(e) => onUpdateDetails({ publishDate: e.target.value })}
                                        className="w-full px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none font-bold text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Publish Time</label>
                                    <input
                                        type="time"
                                        value={details.publishTime}
                                        onChange={(e) => onUpdateDetails({ publishTime: e.target.value })}
                                        className="w-full px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none font-bold text-gray-700"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-gray-100">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[#C10007]" />
                                Target Platforms
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {PLATFORMS.map(platform => (
                                    <label key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-white border border-transparent hover:border-gray-100 transition-all group">
                                        <span className="text-[12px] font-bold text-gray-600 group-hover:text-gray-900">{platform}</span>
                                        <input
                                            type="checkbox"
                                            checked={details.platforms.includes(platform)}
                                            onChange={(e) => {
                                                const newPlatforms = e.target.checked
                                                    ? [...details.platforms, platform]
                                                    : details.platforms.filter(p => p !== platform);
                                                onUpdateDetails({ platforms: newPlatforms });
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-[#C10007] focus:ring-[#C10007]"
                                        />
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </aside>
    );
}
