"use client";

import { useState, useEffect } from 'react';
import { X, Upload, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, Image as ImageIcon, Link as LinkIcon, RotateCcw, RotateCw, Maximize, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import { updatePendingArticle } from "@/lib/api/admin/articles";

interface ArticleEditorModalProps {
    mode: 'create' | 'edit';
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function ArticleEditorModal({ mode, isOpen, onClose, initialData }: ArticleEditorModalProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [summary, setSummary] = useState(initialData?.description || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [country, setCountry] = useState(initialData?.location || 'Philippines');
    const [tags, setTags] = useState<string[]>(initialData?.tags || ['Technology', 'AI', 'Singapore']);
    const [author, setAuthor] = useState(initialData?.author || 'Maria Santos');
    const [publishDate, setPublishDate] = useState(initialData?.date || '2026-01-15');
    const [publishTime, setPublishTime] = useState('14:30');
    const [publishTo, setPublishTo] = useState(initialData?.sites?.reduce((acc: any, site: string) => {
        if (site === 'Filipino Homes') acc.filipinoHomes = true;
        if (site === 'Rent.ph') acc.rentPh = true;
        if (site === 'HomesPh') acc.homesPh = true;
        if (site === 'Bayanihan') acc.bayanihan = true;
        if (site === 'Main Portal') acc.mainNewsPortal = true;
        return acc;
    }, {
        filipinoHomes: true,
        rentPh: true,
        homesPh: false,
        bayanihan: false,
        mainNewsPortal: true,
    }) || {
        filipinoHomes: true,
        rentPh: true,
        homesPh: false,
        bayanihan: false,
        mainNewsPortal: true,
    });

    const [featuredImage, setFeaturedImage] = useState<string | null>(initialData?.image || null);

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title || '');
            setSlug(initialData.slug || '');
            setSummary(initialData.description || '');
            setCategory(initialData.category || '');
            setCountry(initialData.location || 'Philippines');
            setTags(initialData.tags || []);
            setAuthor(initialData.author || 'Maria Santos');
            setPublishDate(initialData.date || '2026-01-15');
            setFeaturedImage(initialData.image || null);

            const sitesObj = {
                filipinoHomes: initialData.sites?.includes('Filipino Homes') || false,
                rentPh: initialData.sites?.includes('Rent.ph') || false,
                homesPh: initialData.sites?.includes('HomesPh') || false,
                bayanihan: initialData.sites?.includes('Bayanihan') || false,
                mainNewsPortal: initialData.sites?.includes('Main Portal') || false,
            };
            setPublishTo(sitesObj);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (mode === 'create') {
            setSlug(generateSlug(value));
        }
    };

    const toggleSite = (site: keyof typeof publishTo) => {
        setPublishTo({ ...publishTo, [site]: !publishTo[site] });
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = async () => {
        // For now, only wire real saving for pending (Redis) articles.
        if (mode === 'edit' && initialData?.status === 'pending') {
            try {
                await updatePendingArticle(initialData.id, {
                    title,
                    summary,
                    content,
                    category,
                    country,
                    image_url: featuredImage || undefined,
                    topics: tags,
                    // keywords could be derived later; keep optional
                });
                // Simple UX: reload the page so details + list reflect updated data
                onClose();
                if (typeof window !== "undefined") {
                    window.location.reload();
                }
                return;
            } catch (e) {
                console.error("Failed to update pending article", e);
                alert("Failed to save changes. Please try again.");
                return;
            }
        }

        // Fallback: existing dummy behavior for non-pending / create flow
        alert(mode === 'create' ? 'Article published!' : 'Changes saved');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-[100] p-4 overflow-y-auto animate-in fade-in duration-200 backdrop-blur-[2px]">
            <div className="bg-white rounded-[12px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] my-8 flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-[12px]">
                    <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">
                        {mode === 'create' ? 'Create Article' : 'Edit Article'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X className="w-5 h-5 text-[#9ca3af] group-hover:text-[#111827]" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        {/* Article Title */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Article Title <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Enter article title"
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] transition-all"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="flex items-center gap-2 text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Slug
                                <Info className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="article-slug"
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] transition-all"
                            />
                            <p className="text-[12px] text-[#9ca3af] mt-1 tracking-[-0.5px]">
                                globalnews.com/articles/{slug || 'philippines-emerges-ai-outsourcing-leader'}
                            </p>
                        </div>

                        {/* Article Summary */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Article Summary <span className="text-[#ef4444]">*</span>
                            </label>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Brief summary of the article"
                                rows={3}
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] resize-none transition-all"
                            />
                        </div>

                        {/* Featured Image */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-[14px] font-bold text-[#111827] tracking-[-0.5px]">
                                    Featured Image <span className="text-[#ef4444]">*</span>
                                </label>
                                <button className="text-[12px] text-[#3b82f6] hover:underline tracking-[-0.5px]">
                                    Generate Image
                                </button>
                            </div>
                            <div className="border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden mb-4">
                                {featuredImage ? (
                                    <div className="relative group">
                                        <img src={featuredImage} alt="Featured" className="w-full h-auto" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                className="px-4 py-2 bg-white rounded-[6px] text-[14px] font-medium text-[#111827] shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                                            >
                                                Change Image
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 px-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                        <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
                                        <p className="text-[14px] text-[#6b7280] mb-1 tracking-[-0.5px]">
                                            Drag image here or click to browse
                                        </p>
                                        <p className="text-[12px] text-[#9ca3af] tracking-[-0.5px]">
                                            Recommended: 1920x1080, max 5MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Image URL Field */}
                            <div className="relative">
                                <label className="block text-[14px] font-medium text-[#4b5563] mb-2 tracking-[-0.5px]">
                                    Or enter image URL:
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={featuredImage || ''}
                                        onChange={(e) => setFeaturedImage(e.target.value)}
                                        placeholder="https://example.com/ad-image.jpg"
                                        className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] pr-10 transition-all font-light"
                                    />
                                    <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Article Content <span className="text-[#ef4444]">*</span>
                            </label>

                            {/* Toolbar */}
                            <div className="border border-[#d1d5db] rounded-t-[6px] px-3 py-2 flex items-center gap-1 bg-[#f9fafb] overflow-x-auto no-scrollbar">
                                <select className="px-2 py-1 text-[13px] border border-[#d1d5db] rounded bg-white focus:outline-none">
                                    <option>Paragraph</option>
                                    <option>Heading 1</option>
                                    <option>Heading 2</option>
                                </select>
                                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                                {[Bold, Italic, Underline].map((Icon, idx) => (
                                    <button key={idx} className="p-1.5 hover:bg-white rounded transition-colors group">
                                        <Icon className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                                    </button>
                                ))}
                                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                                {[List, ListOrdered].map((Icon, idx) => (
                                    <button key={idx} className="p-1.5 hover:bg-white rounded transition-colors group">
                                        <Icon className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                                    </button>
                                ))}
                                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                                {[AlignLeft, AlignCenter].map((Icon, idx) => (
                                    <button key={idx} className="p-1.5 hover:bg-white rounded transition-colors group">
                                        <Icon className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                                    </button>
                                ))}
                                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                                {[ImageIcon, LinkIcon].map((Icon, idx) => (
                                    <button key={idx} className="p-1.5 hover:bg-white rounded transition-colors group">
                                        <Icon className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                                    </button>
                                ))}
                                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                                {[RotateCcw, RotateCw].map((Icon, idx) => (
                                    <button key={idx} className="p-1.5 hover:bg-white rounded transition-colors group">
                                        <Icon className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                                    </button>
                                ))}
                                <button className="p-1.5 hover:bg-white rounded transition-colors ml-auto group">
                                    <Maximize className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                                </button>
                            </div>

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your article content here..."
                                rows={8}
                                className="w-full px-4 py-3 border border-t-0 border-[#d1d5db] rounded-b-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] resize-none transition-all"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Category <span className="text-[#ef4444]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-[50px] px-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="All News">All News</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Business">Business</option>
                                    <option value="Politics">Politics</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Economy">Economy</option>
                                    <option value="Tourism">Tourism</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#3b82f6] text-white rounded-[4px] text-[13px] tracking-[-0.5px]"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-blue-100 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Add a tag and press Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                        e.preventDefault();
                                        if (!tags.includes(e.currentTarget.value)) {
                                            setTags([...tags, e.currentTarget.value]);
                                        }
                                        e.currentTarget.value = '';
                                    }
                                }}
                                className="w-full px-4 py-2 border border-[#d1d5db] rounded-[6px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] transition-all"
                            />
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Author
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Author name"
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] transition-all"
                            />
                        </div>

                        {/* Publish Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Publish Date
                                </label>
                                <input
                                    type="date"
                                    value={publishDate}
                                    onChange={(e) => setPublishDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Publish Time
                                </label>
                                <input
                                    type="time"
                                    value={publishTime}
                                    onChange={(e) => setPublishTime(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] transition-all"
                                />
                            </div>
                        </div>

                        {/* Publish To */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">
                                Publish To:
                            </label>
                            <div className="space-y-3">
                                {[
                                    { id: 'filipinoHomes', label: 'FilipinoHomes' },
                                    { id: 'rentPh', label: 'Rent.ph' },
                                    { id: 'homesPh', label: 'HomesPh' },
                                    { id: 'bayanihan', label: 'Bayanihan' },
                                    { id: 'mainNewsPortal', label: 'Main News Portal' },
                                ].map((site) => (
                                    <label key={site.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={publishTo[site.id as keyof typeof publishTo]}
                                            onChange={() => toggleSite(site.id as keyof typeof publishTo)}
                                            className="w-5 h-5 rounded border-[#d1d5db] text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0 cursor-pointer"
                                        />
                                        <span className="text-[14px] text-[#111827] group-hover:text-[#3b82f6] transition-colors tracking-[-0.5px]">{site.label}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-[12px] text-[#9ca3af] mt-3 tracking-[-0.5px]">
                                Article will be published on selected sites
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#e5e7eb] px-4 py-4 flex items-center justify-end gap-2 rounded-b-[12px] bg-[#fdfdfd] overflow-x-auto no-scrollbar">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-[15px] text-[#6b7280] hover:text-[#111827] transition-colors tracking-[-0.5px] font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => alert('Saved as draft')}
                        className="flex items-center gap-2 px-5 py-2 bg-white border border-[#d1d5db] text-[#374151] rounded-[8px] hover:bg-gray-50 transition-all text-[15px] font-medium tracking-[-0.5px] shadow-sm active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save as Draft
                    </button>
                    {mode === 'edit' ? (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-5 py-2 bg-[#3b82f6] text-white rounded-[8px] hover:bg-[#2563eb] transition-all text-[15px] font-medium tracking-[-0.5px] shadow-sm active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </button>
                    ) : null}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-2 bg-[#10b981] text-white rounded-[8px] hover:bg-[#059669] transition-all text-[15px] font-medium tracking-[-0.5px] shadow-sm active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Publish Now
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
