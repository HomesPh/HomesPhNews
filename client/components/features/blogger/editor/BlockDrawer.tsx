"use client";

import { useState, useEffect, useMemo } from "react";
import {
    LayoutGrid, FileText, Image, Grid, Columns, Maximize,
    Plus, Minus, X, Info, AlignCenter, AlignLeft, AlignRight, Layout, User, Type,
    ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogDetails, BlockType } from "@/hooks/useBlockEditor";
import { getCategories } from "@/lib/api-v2/admin/service/scraper/getCategories";
import { getCountries } from "@/lib/api-v2/admin/service/scraper/getCountries";
import { getProvinces } from "@/lib/api-v2/admin/service/scraper/getProvinces";
import { getCities } from "@/lib/api-v2/admin/service/cities/getCities";
import { Button } from "@/components/ui/button";

// props type for on generate title and summary
interface OnGenerateProps {
    loading: boolean;
    action: () => void;
}

interface BlockDrawerProps {
    details: BlogDetails;
    availableCategories?: (string | { name: string; count: number })[];
    availableCountries?: (string | { name: string; count: number })[];
    availableSites?: string[];
    isEditor?: boolean;

    // callbacks
    onUpdateDetails: (updates: Partial<BlogDetails>) => void;
    onAddBlock: (type: BlockType) => void;

    // props
    onGenerateTitle: OnGenerateProps,
    onGenerateSummary: OnGenerateProps
}

function TagsInput({ tags, onChange }: { tags: string[], onChange: (tags: string[]) => void }) {
    const [inputValue, setInputValue] = useState(tags.join(", "));

    useEffect(() => {
        setInputValue(tags.join(", "));
    }, [tags]);

    const handleBlur = () => {
        const newTags = inputValue.split(',').map(t => t.trim()).filter(Boolean);
        onChange(newTags);
        // Standardize the display once they leave the field
        setInputValue(newTags.join(", "));
    };

    return (
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleBlur();
            }}
            placeholder="e.g. Technology, AI, Startup"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none transition-all font-inter text-gray-800"
        />
    );
}

export default function BlockDrawer({
    details,
    availableCategories: propsCategories,
    availableCountries: propsCountries,
    availableSites,
    isEditor,
    onUpdateDetails,
    onAddBlock,

    onGenerateTitle,
    onGenerateSummary,
}: BlockDrawerProps) {
    const [activeTab, setActiveTab] = useState<'blocks' | 'details'>('blocks');
    const [internalCategories, setInternalCategories] = useState<(string | { name: string; count: number })[]>([]);
    const [internalCountries, setInternalCountries] = useState<(string | { name: string; count: number })[]>([]);
    const [internalProvinces, setInternalProvinces] = useState<any[]>([]);
    const [internalCities, setInternalCities] = useState<any[]>([]);
    const [allCountries, setAllCountries] = useState<any[]>([]);
    const [showAllPlatforms, setShowAllPlatforms] = useState(false);

    useEffect(() => {
        // Fetch categories if not provided as props
        if (!propsCategories || propsCategories.length === 0) {
            getCategories().then(res => {
                if (Array.isArray(res.data)) {
                    // Map objects to names if they are objects
                    const names = res.data.map((c: any) => typeof c === 'string' ? c : c.name);
                    setInternalCategories(names);
                }
            }).catch(err => {
                console.error("Failed to fetch categories in BlockDrawer:", err);
                // Fallback to defaults
                setInternalCategories(["Community", "Real Estate", "Technology", "AI", "Investment", "Lifestyle"]);
            });
        }
    }, [propsCategories]);

    // Consolidate initial data fetching
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Countries
                const countryRes = await getCountries();
                const countryData = (countryRes.data as any).data || countryRes.data;
                if (Array.isArray(countryData)) {
                    setAllCountries(countryData);
                    if (!propsCountries || propsCountries.length === 0) {
                        setInternalCountries(countryData.map((c: any) => c.name));
                    }
                }

                // Fetch Provinces
                const provinceRes = await getProvinces();
                const provinceData = (provinceRes.data as any).data || provinceRes.data;
                if (Array.isArray(provinceData)) {
                    setInternalProvinces(provinceData);
                }

                // Fetch Cities
                const cityRes = await getCities();
                const cityData = (cityRes.data as any).data || cityRes.data;
                if (Array.isArray(cityData)) {
                    setInternalCities(cityData);
                }
            } catch (err) {
                console.error("BlockDrawer: Failed to fetch initial location data:", err);
            }
        };

        fetchInitialData();
    }, []); // Only fetch once on mount

    // Update internal countries if props change later (e.g. parent filter loads)
    useEffect(() => {
        if (propsCountries && propsCountries.length > 0 && allCountries.length > 0) {
            // No action needed as finalCountries handle it, but we keep this effect hook 
            // available if we need to sync specific state later.
        }
    }, [propsCountries, allCountries.length]);

    const finalCategories = (propsCategories && propsCategories.length > 0) ? propsCategories : internalCategories;
    const finalCountries = (propsCountries && propsCountries.length > 0) ? propsCountries : internalCountries;

    // Filter Logic
    const selectedCountryId = useMemo(() => {
        if (!details.country || !allCountries.length) return null;
        const normalizedInput = details.country.trim().toUpperCase();
        const countryObj = allCountries.find(c =>
            c.name?.trim().toUpperCase() === normalizedInput ||
            c.id?.trim().toUpperCase() === normalizedInput
        );
        return countryObj?.id || null;
    }, [details.country, allCountries]);

    const filteredProvinces = useMemo(() => {
        if (!selectedCountryId) {
            // If we have a country selected but haven't resolved the ID yet, show nothing
            // rather than showing everything.
            if (details.country) return [];
            return internalProvinces;
        }

        const countryIdUpper = selectedCountryId.toUpperCase();
        return internalProvinces.filter(p =>
            p.country_id?.trim().toUpperCase() === countryIdUpper
        );
    }, [selectedCountryId, details.country, internalProvinces]);

    const filteredCities = useMemo(() => {
        if (!selectedCountryId) {
            // Same as above: prevent showing wrong cities during load or if mapping failed
            if (details.country) return [];
            return internalCities;
        }

        const countryIdUpper = selectedCountryId.toUpperCase();
        let filtered = internalCities.filter(c =>
            c.country_id?.trim().toUpperCase() === countryIdUpper
        );

        // Only sub-filter by province if one is actually selected
        if (details.province_id && details.province_id !== "" && details.province_id !== "0") {
            const provinceIdStr = String(details.province_id);
            filtered = filtered.filter(c => String(c.province_id) === provinceIdStr);
        }

        return filtered;
    }, [selectedCountryId, details.province_id, internalCities]);

    const getOptionData = (opt: string | { name: string; count: number }) => {
        if (typeof opt === 'string') return { value: opt, label: opt };
        return { value: opt.name, label: opt.name };
    };

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

    const sortedPlatforms = useMemo(() => {
        const list = availableSites !== undefined
            ? availableSites
            : ["Apply Na", "Bayanihan", "Faceofmind", "FilipinoHomes", "globalreality", "Homes", "Main News Portal", "PicklePlay"];
        return [...list].sort((a, b) => a.localeCompare(b));
    }, [availableSites]);

    const displayedPlatforms = showAllPlatforms ? sortedPlatforms : sortedPlatforms.slice(0, 5);

    useEffect(() => {
        if (isEditor && !details.platforms.includes("Main News Portal")) {
            onUpdateDetails({ platforms: ["Main News Portal"] });
        }
    }, [isEditor, details.platforms, onUpdateDetails]);

    return (
        <aside className="w-[360px] bg-white border-r border-gray-100 flex flex-col shrink-0 z-30 shadow-[4px_0_20px_rgba(0,0,0,0.02)] h-full">
            <div className="flex border-b border-gray-100 p-2 gap-2 bg-gray-50/50">
                <button
                    onClick={() => setActiveTab('blocks')}
                    className={cn(
                        "flex-1 py-3 text-xs font-black transition-all rounded-xl uppercase tracking-widest",
                        activeTab === 'blocks' ? "bg-white text-[#1428AE] shadow-sm ring-1 ring-gray-100" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Library
                </button>
                <button
                    onClick={() => setActiveTab('details')}
                    className={cn(
                        "flex-1 py-3 text-xs font-black transition-all rounded-xl uppercase tracking-widest",
                        activeTab === 'details' ? "bg-white text-[#1428AE] shadow-sm ring-1 ring-gray-100" : "text-gray-400 hover:text-gray-600"
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
                                    <div className="w-1 h-1 rounded-full bg-[#1428AE]" />
                                    {group.title}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {group.items.map((block) => (
                                        <button
                                            key={block.type}
                                            onClick={() => onAddBlock(block.type)}
                                            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all group shadow-sm hover:shadow-md"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                                                <block.icon className="w-5 h-5 text-gray-400 group-hover:text-[#1428AE] transition-colors" />
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
                                <div className="w-1 h-1 rounded-full bg-[#1428AE]" />
                                Meta Details
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Internal Title</label>
                                    <input
                                        type="text"
                                        value={details.title}
                                        onChange={(e) => onUpdateDetails({ title: e.target.value })}
                                        placeholder="Enter title"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1428AE]/20 transition-all font-inter text-gray-800"
                                    />
                                    <Button
                                        className="w-full"
                                        onClick={onGenerateTitle.action}
                                        disabled={onGenerateTitle.loading}
                                    >
                                        Generate Title
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Summary / Abstract</label>
                                    <textarea
                                        value={details.summary}
                                        onChange={(e) => onUpdateDetails({ summary: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1428AE]/20 transition-all text-gray-600 leading-relaxed"
                                    />
                                    <Button
                                        className="w-full"
                                        onClick={onGenerateSummary.action}
                                        disabled={onGenerateSummary.loading}
                                    >
                                        Generate Summary
                                    </Button>
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
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Original Source (URL)</label>
                                    <input
                                        type="text"
                                        value={details.original_url || ""}
                                        onChange={(e) => onUpdateDetails({ original_url: e.target.value })}
                                        placeholder="e.g. https://example.com/article"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none transition-all font-inter text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Topics</label>
                                    <TagsInput
                                        tags={details.tags}
                                        onChange={(tags) => onUpdateDetails({ tags })}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1.5 italic">Note: Separate each topic with a comma</p>
                                </div>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-gray-100">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[#1428AE]" />
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
                                        {finalCategories.map((c: any) => {
                                            const data = getOptionData(c);
                                            return <option key={data.value} value={data.value}>{data.label}</option>;
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Country</label>
                                    <select
                                        value={details.country}
                                        onChange={(e) => onUpdateDetails({ country: e.target.value, province_id: "", city_id: "" })}
                                        className="w-full px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none font-bold"
                                    >
                                        <option value="">Select Country</option>
                                        {finalCountries.map((c: any) => {
                                            const data = getOptionData(c);
                                            return <option key={data.value} value={data.value}>{data.label}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Province</label>
                                    <select
                                        value={details.province_id}
                                        onChange={(e) => onUpdateDetails({ province_id: e.target.value, city_id: "" })}
                                        className="w-full px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none font-bold"
                                    >
                                        <option value="">Select Province</option>
                                        {filteredProvinces.map((p: any) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">City</label>
                                    <select
                                        value={details.city_id}
                                        onChange={(e) => onUpdateDetails({ city_id: e.target.value })}
                                        className="w-full px-3 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none font-bold"
                                    >
                                        <option value="">Select City</option>
                                        {filteredCities.map((c: any) => (
                                            <option key={c.city_id} value={c.city_id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Author</label>
                                <input
                                    type="text"
                                    value={details.author}
                                    onChange={(e) => !isEditor && onUpdateDetails({ author: e.target.value })}
                                    disabled={isEditor}
                                    placeholder="HOMESPH NEWS"
                                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1428AE]/20 transition-all font-inter ${isEditor ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                                />
                            </div>

                            {!isEditor && (
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
                            )}
                        </section>

                        {!isEditor && (
                            <section className="pt-6 border-t border-gray-100">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#1428AE]" />
                                    Target Platforms
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {displayedPlatforms.map(platform => (
                                        <label key={platform} className={`flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-transparent transition-all group ${isEditor && platform !== "Main News Portal" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white hover:border-gray-100'}`}>
                                            <span className={`text-[12px] font-bold ${isEditor && platform !== "Main News Portal" ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-900'}`}>{platform}</span>
                                            <input
                                                type="checkbox"
                                                disabled={isEditor && platform !== "Main News Portal"}
                                                checked={details.platforms.includes(platform)}
                                                onChange={(e) => {
                                                    const newPlatforms = e.target.checked
                                                        ? [...details.platforms, platform]
                                                        : details.platforms.filter(p => p !== platform);
                                                    onUpdateDetails({ platforms: newPlatforms });
                                                }}
                                                className="w-4 h-4 rounded border-gray-300 text-[#F4AA1D] focus:ring-[#F4AA1D] disabled:opacity-50"
                                            />
                                        </label>
                                    ))}
                                </div>

                                {sortedPlatforms.length > 5 && (
                                    <button
                                        onClick={() => setShowAllPlatforms(!showAllPlatforms)}
                                        className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-[11px] font-black text-[#1428AE] bg-[#1428AE]/5 rounded-xl hover:bg-[#1428AE]/10 transition-all uppercase tracking-widest"
                                    >
                                        {showAllPlatforms ? (
                                            <>
                                                Show Less <ChevronUp className="w-3.5 h-3.5" />
                                            </>
                                        ) : (
                                            <>
                                                Show All ({sortedPlatforms.length}) <ChevronDown className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}
