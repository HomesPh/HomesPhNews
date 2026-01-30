"use client";

import { useState, useEffect } from 'react';
import { X, ArrowLeft, Save, Send } from 'lucide-react';
import { cn } from "@/lib/utils";
import { getSiteNames, updatePendingArticle, createArticle, updateArticle } from "@/lib/api-v2";
import ArticleEditorForm from "./editor/ArticleEditorForm";
import ArticleEditorPreview from "./editor/ArticleEditorPreview";
import { TemplateType } from "./editor/TemplateSelector";

export interface ContentBlock {
    id: number;
    type: 'text' | 'image' | 'image-caption' | 'gallery' | 'split';
    content?: string;
    image?: string;
    caption?: string;
    position?: 'left' | 'right';
    images?: string[];
}

interface ArticleEditorModalProps {
    mode: 'create' | 'edit';
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function ArticleEditorModal({ mode, isOpen, onClose, initialData }: ArticleEditorModalProps) {
    const [template, setTemplate] = useState<TemplateType>('single');
    const [availableSites, setAvailableSites] = useState<string[]>([]);

    const [articleData, setArticleData] = useState({
        title: '',
        slug: '',
        summary: '',
        content: '',
        category: '',
        country: 'Philippines',
        image: null as string | null,
        tags: [] as string[],
        author: 'Maria Santos',
        publishDate: new Date().toISOString().split('T')[0],
        publishTime: '14:30',
        publishTo: [] as string[],
        galleryImages: [] as string[],
        splitImages: [] as string[],
        contentBlocks: [] as ContentBlock[]
    });

    useEffect(() => {
        getSiteNames().then(res => setAvailableSites(res.data as string[])).catch(console.error);
    }, []);

    useEffect(() => {
        if (isOpen && initialData) {
            setArticleData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                summary: initialData.summary || initialData.description || '',
                content: initialData.content || '',
                category: initialData.category || '',
                country: initialData.country || initialData.location || 'Philippines',
                image: initialData.image || null,
                tags: initialData.topics || initialData.tags || [],
                author: initialData.author || 'Maria Santos',
                publishDate: initialData.date || new Date().toISOString().split('T')[0],
                publishTime: '14:30',
                publishTo: initialData.published_sites || initialData.sites || [],
                galleryImages: initialData.gallery_images || [],
                splitImages: initialData.split_images || [],
                contentBlocks: initialData.content_blocks || []
            });
            if (initialData.template) {
                setTemplate(initialData.template);
            }
        } else if (isOpen) {
            // Reset for create mode
            setArticleData({
                title: '',
                slug: '',
                summary: '',
                content: '',
                category: '',
                country: 'Philippines',
                image: null,
                tags: ['Technology', 'AI', 'Singapore'],
                author: 'Maria Santos',
                publishDate: new Date().toISOString().split('T')[0],
                publishTime: '14:30',
                publishTo: [],
                galleryImages: [],
                splitImages: [],
                contentBlocks: []
            });
            setTemplate('single');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleDataChange = (field: string, value: any) => {
        setArticleData(prev => ({ ...prev, [field]: value }));
    };

    const handleTemplateChange = (newTemplate: TemplateType) => {
        const oldTemplate = template;
        setTemplate(newTemplate);

        // Content Preservation Logic (Deep Consolidation)
        setArticleData(prev => {
            let consolidatedText = '';
            let consolidatedImage = prev.image;

            // Helper to detect if content is just a placeholder
            const isPlaceholder = (text: string) => {
                if (!text) return true;
                const stripped = text.replace(/<[^>]*>/g, '').trim();
                const placeholders = [
                    '',
                    'Article content will appear here...',
                    'Write your article content here...',
                    'First section content...',
                    'First section content before the image...',
                    'Content that wraps around the left-floating image...',
                    'Content for section 1...',
                    'Content flowing around image...',
                    'Text section content...'
                ];
                return placeholders.includes(stripped);
            };

            // 1. COLLECT: From everywhere
            // Always take from main content if not placeholder
            if (!isPlaceholder(prev.content)) {
                consolidatedText = prev.content;
            }

            // Always add from blocks (if they have meaningful content)
            const blocksData = prev.contentBlocks
                .map(b => b.content)
                .filter(c => c && !isPlaceholder(c))
                .join('<br><br>');

            if (blocksData) {
                if (consolidatedText) consolidatedText += '<br><br>' + blocksData;
                else consolidatedText = blocksData;
            }

            // Try to find an image if none is set
            if (!consolidatedImage) {
                consolidatedImage = prev.contentBlocks.find(b => b.image)?.image || null;
            }

            // 2. REDISTRIBUTE: Into the new structure
            let newBlocks: ContentBlock[] = [];
            const blockTemplates: TemplateType[] = ['inline', 'textwrap', 'fullwidth'];

            if (newTemplate === 'inline') {
                newBlocks = [
                    { id: 1, type: 'text', content: consolidatedText || '' },
                    { id: 2, type: 'image', image: consolidatedImage || '', caption: '' },
                    { id: 3, type: 'text', content: '' },
                ];
            } else if (newTemplate === 'textwrap') {
                newBlocks = [
                    { id: 1, type: 'image', image: consolidatedImage || '', position: 'left', content: consolidatedText || '' },
                ];
            } else if (newTemplate === 'fullwidth') {
                newBlocks = [
                    { id: 1, type: 'image-caption', image: consolidatedImage || '', caption: '', content: consolidatedText || '' },
                ];
            }

            // 3. CLEAN UP: If we are going to a non-block template, put everything back into 'content'
            let finalContent = consolidatedText;
            if (!blockTemplates.includes(newTemplate)) {
                newBlocks = [];
            } else {
                // If it's a block template, the first block usually holds the starting text
                // which should have the dropcap. We don't need to change the content string itself
                // but we might want to wipe 'content' to avoid duplication if the preview uses both
                // Actually, preview uses RenderContent() for non-blocks.
            }

            return {
                ...prev,
                content: finalContent,
                image: consolidatedImage,
                contentBlocks: newBlocks
            };
        });
    };

    const handleSave = async (isPublish: boolean = false) => {
        try {
            const payload = {
                title: articleData.title,
                slug: articleData.slug,
                summary: articleData.summary,
                content: articleData.content,
                category: articleData.category,
                country: articleData.country,
                image: articleData.image,
                published_sites: articleData.publishTo,
                status: (isPublish ? 'published' : 'pending review') as 'published' | 'pending review',
                topics: articleData.tags,
                author: articleData.author,
                date: articleData.publishDate,
                gallery_images: articleData.galleryImages,
                split_images: articleData.splitImages,
                content_blocks: articleData.contentBlocks,
                template: template
            };

            if (mode === 'create') {
                await createArticle(payload);
                alert(`Article ${isPublish ? 'published' : 'created'} successfully!`);
            } else if (mode === 'edit' && (initialData?.status === 'pending' || initialData?.status === 'pending review')) {
                await updatePendingArticle(initialData.id, {
                    ...payload,
                    image_url: articleData.image || undefined,
                });
                alert('Article updated successfully!');
            } else if (mode === 'edit') {
                await updateArticle(initialData.id, payload);
                alert('Article updated successfully!');
            }

            onClose();
            window.location.reload();
        } catch (error: any) {
            console.error("Failed to save article", error);
            const msg = error.response?.data?.message || "Failed to save changes. Please try again.";
            alert(`Error ${error.response?.status || ''}: ${msg}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-200">
            {/* Full Screen Header */}
            <div className="h-[70px] border-b border-[#e5e7eb] px-6 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#6b7280] group-hover:text-[#111827]" />
                    </button>
                    <div>
                        <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                            {mode === 'create' ? 'Create New Article' : 'Edit Article'}
                        </h2>
                        <p className="text-[12px] text-[#6b7280] tracking-[-0.5px]">
                            {mode === 'create' ? 'Drafting a new story' : `Editing: ${articleData.title.substring(0, 40)}${articleData.title.length > 40 ? '...' : ''}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d1d5db] text-[#374151] rounded-[8px] hover:bg-gray-50 transition-all text-[14px] font-bold tracking-[-0.5px] shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        Save as Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-all text-[14px] font-bold tracking-[-0.5px] shadow-md shadow-red-900/10"
                    >
                        <Send className="w-4 h-4" />
                        Publish Now
                    </button>
                    <div className="w-px h-8 bg-gray-200 mx-2" />
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-[#9ca3af]" />
                    </button>
                </div>
            </div>

            {/* Main Dual Panel Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Form Side */}
                <ArticleEditorForm
                    data={articleData}
                    availableSites={availableSites}
                    onDataChange={handleDataChange}
                    template={template}
                    onTemplateChange={handleTemplateChange}
                />

                {/* Preview Side */}
                <ArticleEditorPreview
                    data={{
                        ...articleData,
                        timestamp: `${articleData.publishDate}T${articleData.publishTime}:00Z`
                    }}
                    template={template}
                    onDataChange={handleDataChange}
                />
            </div>
        </div>
    );
}
