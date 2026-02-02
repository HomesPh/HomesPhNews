"use client";

import { useState, useRef } from 'react';
import { Info, X, Upload, ImageIcon, Check, Loader2, GripVertical, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";
import TemplateSelector, { TemplateType } from "./TemplateSelector";
import { uploadArticleImage } from "@/lib/api-v2";
import { ContentBlock } from "../ArticleEditorModal";
import ArticleRichTextEditor from "./ArticleRichTextEditor";
import ImageGeneratorDialog from "./ImageGeneratorDialog";

interface ArticleEditorFormProps {
    data: {
        title: string;
        slug: string;
        summary: string;
        content: string;
        category: string;
        country: string;
        image: string | null;
        tags: string[];
        author: string;
        publishDate: string;
        publishTime: string;
        publishTo: string[];
        galleryImages: string[];
        splitImages: string[];
        contentBlocks: ContentBlock[];
    };
    availableSites: string[];
    onDataChange: (field: string, value: any) => void;
    template: TemplateType;
    onTemplateChange: (template: TemplateType) => void;
}

export default function ArticleEditorForm({
    data,
    availableSites,
    onDataChange,
    template,
    onTemplateChange
}: ArticleEditorFormProps) {
    const [activeTab, setActiveTab] = useState<'content' | 'template'>('content');
    const [isUploading, setIsUploading] = useState(false);
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAiImageSelect = (url: string) => {
        onDataChange('image', url);
    };

    const handleTitleChange = (value: string) => {
        onDataChange('title', value);
        // Basic slug generation
        const slug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        onDataChange('slug', slug);
    };

    const removeTag = (tagToRemove: string) => {
        onDataChange('tags', data.tags.filter(t => t !== tagToRemove));
    };

    const toggleSite = (site: string) => {
        if (data.publishTo.includes(site)) {
            onDataChange('publishTo', data.publishTo.filter(s => s !== site));
        } else {
            onDataChange('publishTo', [...data.publishTo, site]);
        }
    };

    // Convert file to base64 data URL (hold on client, don't upload yet)
    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Hold image as data URL on client (will upload to S3 on save)
            const dataUrl = await fileToDataUrl(file);
            onDataChange('image', dataUrl);
        } catch (error) {
            console.error("Failed to read image", error);
            alert("Failed to process image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'galleryImages' | 'splitImages', index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Hold image as data URL on client (will upload to S3 on save)
            const dataUrl = await fileToDataUrl(file);
            const currentImages = [...(data as any)[field]];
            currentImages[index] = dataUrl;
            onDataChange(field, currentImages);
        } catch (error) {
            console.error("Failed to read image", error);
            alert("Failed to process image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleBlockFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Hold image as data URL on client (will upload to S3 on save)
            const dataUrl = await fileToDataUrl(file);
            const updated = [...data.contentBlocks];
            updated[index] = { ...updated[index], image: dataUrl };
            onDataChange('contentBlocks', updated);
        } catch (error) {
            console.error("Failed to read image", error);
            alert("Failed to process image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const updateBlockContent = (index: number, content: string) => {
        const updated = [...data.contentBlocks];
        updated[index] = { ...updated[index], content };
        onDataChange('contentBlocks', updated);
    };

    const updateBlockCaption = (index: number, caption: string) => {
        const updated = [...data.contentBlocks];
        updated[index] = { ...updated[index], caption };
        onDataChange('contentBlocks', updated);
    };

    const updateBlockPosition = (index: number, position: 'left' | 'right') => {
        const updated = [...data.contentBlocks];
        updated[index] = { ...updated[index], position };
        onDataChange('contentBlocks', updated);
    };

    const handleTemplateSelection = (newTemplate: TemplateType) => {
        onTemplateChange(newTemplate);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-[600px] border-r border-[#e5e7eb] flex flex-col bg-white">
            {/* Tabs */}
            <div className="border-b border-[#e5e7eb] bg-white sticky top-0 z-10">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={cn(
                            "flex-1 px-6 py-4 text-[15px] font-bold tracking-[-0.5px] border-b-2 transition-colors",
                            activeTab === 'content'
                                ? "border-[#C10007] text-[#C10007]"
                                : "border-transparent text-[#6b7280] hover:text-[#111827]"
                        )}
                    >
                        Content
                    </button>
                    <button
                        onClick={() => setActiveTab('template')}
                        className={cn(
                            "flex-1 px-6 py-4 text-[15px] font-bold tracking-[-0.5px] border-b-2 transition-colors",
                            activeTab === 'template'
                                ? "border-[#C10007] text-[#C10007]"
                                : "border-transparent text-[#6b7280] hover:text-[#111827]"
                        )}
                    >
                        Template
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {activeTab === 'content' ? (
                    <>
                        {/* Title */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Article Title <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Enter article title"
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
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
                                value={data.slug}
                                onChange={(e) => onDataChange('slug', e.target.value)}
                                placeholder="article-slug"
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                            />
                            <p className="text-[12px] text-[#9ca3af] mt-1 tracking-[-0.5px]">
                                globalnews.com/articles/blog/{data.slug || 'your-article-slug'}
                            </p>
                        </div>

                        {/* Summary */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Article Summary <span className="text-[#ef4444]">*</span>
                            </label>
                            <ArticleRichTextEditor
                                value={data.summary}
                                onChange={(val) => onDataChange('summary', val)}
                                placeholder="Brief summary of the article"
                                rows={3}
                            />
                        </div>

                        {/* Featured Image - Only for Single template */}
                        {template === 'single' && (
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Featured Image <span className="text-[#ef4444]">*</span>
                                </label>
                                <div className="border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden bg-gray-50 group relative cursor-pointer min-h-[160px] flex items-center justify-center">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin" />
                                            <p className="text-[13px] text-[#6b7280]">Uploading...</p>
                                        </div>
                                    ) : data.image ? (
                                        <>
                                            <img src={data.image} alt="Featured" className="w-full h-auto" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={handleUploadClick}
                                                    className="px-4 py-2 bg-white rounded-[6px] text-[14px] font-medium text-[#111827]"
                                                >
                                                    Change Image
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-12 px-6 text-center w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-colors" onClick={handleUploadClick}>
                                            <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
                                            <p className="text-[14px] text-[#6b7280] mb-1 font-medium tracking-[-0.5px]">
                                                Drag image here or click to browse
                                            </p>
                                            <p className="text-[12px] text-[#9ca3af] tracking-[-0.5px]">
                                                Recommended: 1920x1080, max 5MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-[12px] font-medium text-[#6b7280] mb-1">Or direct URL:</label>
                                        <input
                                            type="text"
                                            value={data.image || ''}
                                            onChange={(e) => onDataChange('image', e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full px-3 py-2 border border-[#d1d5db] rounded-[6px] text-[13px] text-[#111827]"
                                        />
                                    </div>
                                    <div className="pt-6">
                                        <button
                                            onClick={() => setIsAiDialogOpen(true)}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[6px] text-[13px] font-medium shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Generate AI
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gallery Template - Specific Fields */}
                        {template === 'gallery' && (
                            <div className="space-y-4">
                                <label className="block text-[14px] font-bold text-[#111827] tracking-[-0.5px]">
                                    Gallery Images (3 Slots)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[0, 1].map((idx) => (
                                        <div key={idx} className="border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden bg-gray-50 aspect-video flex items-center justify-center relative group">
                                            {data.galleryImages[idx] ? (
                                                <img src={data.galleryImages[idx]} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center p-2 cursor-pointer" onClick={() => document.getElementById(`gallery-input-${idx}`)?.click()}>
                                                    <Upload className="w-6 h-6 text-[#9ca3af] mx-auto mb-1" />
                                                    <p className="text-[11px] text-[#6b7280]">Slot {idx + 1}</p>
                                                </div>
                                            )}
                                            <input
                                                id={`gallery-input-${idx}`}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleSubFileChange(e, 'galleryImages', idx)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden bg-gray-50 aspect-[21/9] flex items-center justify-center relative group">
                                    {data.galleryImages[2] ? (
                                        <img src={data.galleryImages[2]} alt="Gallery 2" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-2 cursor-pointer" onClick={() => document.getElementById(`gallery-input-2`)?.click()}>
                                            <Upload className="w-8 h-8 text-[#9ca3af] mx-auto mb-1" />
                                            <p className="text-[12px] text-[#6b7280]">Large Gallery Slot (Bottom)</p>
                                        </div>
                                    )}
                                    <input
                                        id={`gallery-input-2`}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleSubFileChange(e, 'galleryImages', 2)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Split Template - Specific Fields */}
                        {template === 'split' && (
                            <div className="space-y-4">
                                <label className="block text-[14px] font-bold text-[#111827] tracking-[-0.5px]">
                                    Split Layout Images (2 Slots)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[0, 1].map((idx) => (
                                        <div key={idx} className="border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden bg-gray-50 aspect-square flex items-center justify-center relative group">
                                            {data.splitImages[idx] ? (
                                                <img src={data.splitImages[idx]} alt={`Split ${idx}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center p-2 cursor-pointer" onClick={() => document.getElementById(`split-input-${idx}`)?.click()}>
                                                    <Upload className="w-8 h-8 text-[#9ca3af] mx-auto mb-2" />
                                                    <p className="text-[12px] text-[#6b7280]">{idx === 0 ? 'Left' : 'Right'} Image</p>
                                                </div>
                                            )}
                                            <input
                                                id={`split-input-${idx}`}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleSubFileChange(e, 'splitImages', idx)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Article Content / Rich Text Editor / Blocks */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Article Content <span className="text-[#ef4444]">*</span>
                            </label>

                            {['inline', 'textwrap', 'fullwidth'].includes(template) ? (
                                <div className="space-y-6">
                                    {data.contentBlocks.map((block, idx) => (
                                        <div key={block.id} className="border border-[#d1d5db] rounded-[8px] p-4 space-y-3 bg-[#f9fafb] relative group">
                                            {/* Block Controls - Delete */}
                                            <button
                                                onClick={() => {
                                                    const updated = [...data.contentBlocks];
                                                    updated.splice(idx, 1);
                                                    onDataChange('contentBlocks', updated);
                                                }}
                                                className="absolute top-2 right-2 p-1 text-[#ef4444] opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                                                title="Delete section"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            <div className="flex items-center gap-2 mb-2">
                                                <GripVertical className="w-4 h-4 text-[#9ca3af] cursor-grab" />
                                                <span className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">
                                                    {block.type.toUpperCase()} Section {idx + 1}
                                                </span>
                                            </div>

                                            {block.type === 'text' && (
                                                <ArticleRichTextEditor
                                                    value={block.content || ''}
                                                    onChange={(val) => updateBlockContent(idx, val)}
                                                    placeholder="Write content for this section..."
                                                    rows={4}
                                                />
                                            )}

                                            {block.type === 'image' && (
                                                <div className="space-y-3">
                                                    <div className="relative border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden bg-white aspect-video flex items-center justify-center">
                                                        {block.image ? (
                                                            <img src={block.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-center cursor-pointer" onClick={() => document.getElementById(`block-input-${idx}`)?.click()}>
                                                                <Upload className="w-6 h-6 text-[#9ca3af] mx-auto mb-1" />
                                                                <p className="text-[11px] text-[#6b7280]">Add Image</p>
                                                            </div>
                                                        )}
                                                        <input
                                                            id={`block-input-${idx}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleBlockFileChange(e, idx)}
                                                        />
                                                    </div>
                                                    {template === 'textwrap' ? (
                                                        <>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <select
                                                                    value={block.position || 'left'}
                                                                    onChange={(e) => updateBlockPosition(idx, e.target.value as 'left' | 'right')}
                                                                    className="w-full px-3 py-2 border border-[#d1d5db] rounded-[6px] text-[13px] text-[#111827] bg-white"
                                                                >
                                                                    <option value="left">Float Left</option>
                                                                    <option value="right">Float Right</option>
                                                                </select>
                                                                <div className="text-[11px] text-[#6b7280] flex items-center italic">
                                                                    Image will appear {block.position || 'left'} of text
                                                                </div>
                                                            </div>
                                                            <ArticleRichTextEditor
                                                                value={block.content || ''}
                                                                onChange={(val) => updateBlockContent(idx, val)}
                                                                placeholder="Content that wraps around this image..."
                                                                rows={4}
                                                            />
                                                        </>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={block.caption || ''}
                                                            onChange={(e) => updateBlockCaption(idx, e.target.value)}
                                                            placeholder="Image caption"
                                                            className="w-full px-3 py-2 border border-[#d1d5db] rounded-[6px] text-[13px] text-[#111827] bg-white"
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {block.type === 'image-caption' && (
                                                <div className="space-y-3">
                                                    <div className="relative border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden bg-white aspect-video flex items-center justify-center">
                                                        {block.image ? (
                                                            <img src={block.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-center cursor-pointer" onClick={() => document.getElementById(`block-input-${idx}`)?.click()}>
                                                                <Upload className="w-8 h-8 text-[#9ca3af] mx-auto mb-1" />
                                                                <p className="text-[12px] text-[#6b7280]">Full Width Image</p>
                                                            </div>
                                                        )}
                                                        <input
                                                            id={`block-input-${idx}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleBlockFileChange(e, idx)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={block.caption || ''}
                                                        onChange={(e) => updateBlockCaption(idx, e.target.value)}
                                                        placeholder="Caption (optional)"
                                                        className="w-full px-3 py-2 border border-[#d1d5db] rounded-[6px] text-[13px] text-[#111827] bg-white"
                                                    />
                                                    <ArticleRichTextEditor
                                                        value={block.content || ''}
                                                        onChange={(val) => updateBlockContent(idx, val)}
                                                        placeholder="Content after image..."
                                                        rows={4}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="flex gap-3 pt-2">
                                        {template === 'textwrap' ? (
                                            <button
                                                onClick={() => {
                                                    const newId = Math.max(0, ...data.contentBlocks.map(b => b.id)) + 1;
                                                    onDataChange('contentBlocks', [...data.contentBlocks, { id: newId, type: 'image', image: '', position: 'left', content: '' }]);
                                                }}
                                                className="w-full py-3 border-2 border-dashed border-[#e5e7eb] rounded-[8px] text-[13px] text-[#6b7280] font-bold hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="text-[16px]">+</span> Add New Section
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        const newId = Math.max(0, ...data.contentBlocks.map(b => b.id)) + 1;
                                                        onDataChange('contentBlocks', [...data.contentBlocks, { id: newId, type: 'text', content: '', image: '', caption: '' }]);
                                                    }}
                                                    className="flex-1 py-3 border-2 border-dashed border-[#e5e7eb] rounded-[8px] text-[13px] text-[#6b7280] font-bold hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span className="text-[16px]">+</span> Add Text Section
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newId = Math.max(0, ...data.contentBlocks.map(b => b.id)) + 1;
                                                        // Always default to 'image' type for the Image Section button. 
                                                        // 'image-caption' remains supported for existing data but new additions are cleaner.
                                                        onDataChange('contentBlocks', [...data.contentBlocks, { id: newId, type: 'image', image: '', caption: '', content: '' }]);
                                                    }}
                                                    className="flex-1 py-3 border-2 border-dashed border-[#e5e7eb] rounded-[8px] text-[13px] text-[#6b7280] font-bold hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span className="text-[16px]">+</span> Add Image Section
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <ArticleRichTextEditor
                                    value={data.content}
                                    onChange={(val) => onDataChange('content', val)}
                                    placeholder="Write your article content here..."
                                    rows={12}
                                />
                            )}
                        </div>

                        {/* Category & Tags Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Category <span className="text-[#ef4444]">*</span>
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => onDataChange('category', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] bg-white"
                                >
                                    <option value="">Select Category</option>
                                    <option value="All News">All News</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Business">Business</option>
                                    <option value="Politics">Politics</option>
                                    <option value="Technology">Technology</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Country
                                </label>
                                <select
                                    value={data.country}
                                    onChange={(e) => onDataChange('country', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] bg-white"
                                >
                                    <option value="Philippines">Philippines</option>
                                    <option value="USA">USA</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="Global">Global</option>
                                </select>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {data.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 rounded-full text-[13px]"
                                    >
                                        {tag}
                                        <X className="w-3 h-3 cursor-pointer hover:text-[#2563eb]" onClick={() => removeTag(tag)} />
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Add tag and press Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                        onDataChange('tags', [...data.tags, e.currentTarget.value]);
                                        e.currentTarget.value = '';
                                    }
                                }}
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[14px] text-[#111827]"
                            />
                        </div>

                        {/* Author & Schedule */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    value={data.author}
                                    onChange={(e) => onDataChange('author', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                        Publish Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.publishDate}
                                        onChange={(e) => onDataChange('publishDate', e.target.value)}
                                        className="w-full px-2 py-3 border border-[#d1d5db] rounded-[6px] text-[14px]"
                                    />
                                </div>
                                <div className="w-[100px]">
                                    <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={data.publishTime}
                                        onChange={(e) => onDataChange('publishTime', e.target.value)}
                                        className="w-full px-2 py-3 border border-[#d1d5db] rounded-[6px] text-[14px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Publish To */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">
                                Publish To:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {availableSites.map((site) => (
                                    <button
                                        key={site}
                                        onClick={() => toggleSite(site)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-[8px] border text-[14px] font-medium transition-all text-left",
                                            data.publishTo.includes(site)
                                                ? "border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]"
                                                : "border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#3b82f6]/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-sm border flex items-center justify-center transition-all",
                                            data.publishTo.includes(site)
                                                ? "bg-[#3b82f6] border-[#3b82f6]"
                                                : "border-[#d1d5db]"
                                        )}>
                                            {data.publishTo.includes(site) && (
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            )}
                                        </div>
                                        {site}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-[13px] text-blue-700 leading-relaxed">
                                Choose a template to automatically structure your article layout. You can still customize content blocks afterward.
                            </p>
                        </div>
                        <TemplateSelector
                            selectedTemplate={template}
                            onSelect={handleTemplateSelection}
                        />
                    </div>
                )}
            </div>

            <ImageGeneratorDialog
                isOpen={isAiDialogOpen}
                onClose={() => setIsAiDialogOpen(false)}
                onSelectImage={handleAiImageSelect}
                articleTitle={data.title}
            />

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


