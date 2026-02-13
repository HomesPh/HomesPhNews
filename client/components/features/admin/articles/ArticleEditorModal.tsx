"use client";

import { useState, useEffect } from 'react';
import { X, ArrowLeft, Save, Send } from 'lucide-react';
import { cn } from "@/lib/utils";
import { getSiteNames, updatePendingArticle, createArticle, updateArticle, publishArticle, uploadArticleImage } from "@/lib/api-v2";
import ArticleEditorForm from "./editor/ArticleEditorForm";

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

    // Initialize articleData with initialData if available, otherwise use defaults
    const getInitialArticleData = () => {
        if (initialData) {
            return {
                title: initialData.title || '',
                slug: initialData.slug || (initialData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                summary: initialData.summary || initialData.description || '',
                content: initialData.content || '',
                category: initialData.category || 'All',
                country: initialData.country || initialData.location || 'Philippines',
                image: initialData.image || null,
                tags: initialData.topics || initialData.tags || [],
                author: initialData.author || 'Maria Santos',
                publishDate: initialData.date || new Date().toISOString().split('T')[0],
                publishTime: '14:30',
                publishTo: initialData.published_sites || initialData.sites || [],
                galleryImages: initialData.gallery_images || [],
                splitImages: initialData.split_images || [],
                contentBlocks: initialData.content_blocks || [],
                image_position: initialData.image_position || 0,
                image_position_x: initialData.image_position_x || 50
            };
        }

        // Default empty state for create mode
        return {
            title: '',
            slug: '',
            summary: '',
            content: '',
            category: 'All',
            country: 'Philippines',
            image: null as string | null,
            tags: [] as string[],
            author: 'Maria Santos',
            publishDate: new Date().toISOString().split('T')[0],
            publishTime: '14:30',
            publishTo: [] as string[],
            galleryImages: [] as string[],
            splitImages: [] as string[],
            contentBlocks: [] as ContentBlock[],
            image_position: 50,
            image_position_x: 50
        };
    };

    const [articleData, setArticleData] = useState(getInitialArticleData());

    useEffect(() => {
        getSiteNames().then(res => setAvailableSites(res.data as string[])).catch(console.error);
    }, []);

    useEffect(() => {
        console.log("ArticleEditorModal useEffect triggered:", { isOpen, hasInitialData: !!initialData });
        if (isOpen && initialData) {
            console.log("Setting articleData from initialData:", initialData);
            setArticleData({
                title: initialData.title || '',
                slug: initialData.slug || (initialData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                summary: initialData.summary || initialData.description || '',
                content: initialData.content || '',
                category: initialData.category || 'All',
                country: initialData.country || initialData.location || 'Philippines',
                image: initialData.image || null,
                tags: initialData.topics || initialData.tags || [],
                author: initialData.author || 'Maria Santos',
                publishDate: initialData.date || new Date().toISOString().split('T')[0],
                publishTime: '14:30',
                publishTo: initialData.published_sites || initialData.sites || [],
                galleryImages: initialData.gallery_images || [],
                splitImages: initialData.split_images || [],
                contentBlocks: initialData.content_blocks || [],
                image_position: initialData.image_position || 0,
                image_position_x: initialData.image_position_x || 50
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
                category: 'All',
                country: 'Philippines',
                image: null,
                tags: ['Technology', 'AI', 'Singapore'],
                author: 'Maria Santos',
                publishDate: new Date().toISOString().split('T')[0],
                publishTime: '14:30',
                publishTo: [],
                galleryImages: [],
                splitImages: [],
                contentBlocks: [],
                image_position: 0,
                image_position_x: 50
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
                .map((b: any) => b.content)
                .filter((c: any) => c && !isPlaceholder(c))
                .join('<br><br>');

            if (blocksData) {
                if (consolidatedText) consolidatedText += '<br><br>' + blocksData;
                else consolidatedText = blocksData;
            }

            // Try to find an image if none is set
            if (!consolidatedImage) {
                consolidatedImage = prev.contentBlocks.find((b: any) => b.image)?.image || null;
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

    // Helper: Convert base64 data URL to File object
    const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
    };

    // Helper: Check if string is a base64 data URL
    const isDataUrl = (str: string) => str?.startsWith('data:');

    // Helper: Upload image to S3 if it's a data URL, otherwise return as-is
    const uploadIfDataUrl = async (imageUrl: string | null): Promise<string | null> => {
        if (!imageUrl || !isDataUrl(imageUrl)) return imageUrl;
        try {
            const file = await dataUrlToFile(imageUrl, `image-${Date.now()}.jpg`);
            const response = await uploadArticleImage(file);
            return response.data.url;
        } catch (error) {
            console.error('Failed to upload image:', error);
            throw error;
        }
    };

    const handleSave = async (isPublish: boolean = false) => {
        try {
            // Upload any base64 images to S3 first
            let finalImage = articleData.image;
            let finalGalleryImages = [...articleData.galleryImages];
            let finalContentBlocks = [...articleData.contentBlocks];

            // Show uploading state
            console.log('Uploading images to S3...');

            // Upload main image if it's a data URL
            if (isDataUrl(finalImage || '')) {
                finalImage = await uploadIfDataUrl(finalImage);
            }

            // Upload gallery images
            for (let i = 0; i < finalGalleryImages.length; i++) {
                if (isDataUrl(finalGalleryImages[i])) {
                    finalGalleryImages[i] = await uploadIfDataUrl(finalGalleryImages[i]) || '';
                }
            }

            // Upload content block images
            for (let i = 0; i < finalContentBlocks.length; i++) {
                if (finalContentBlocks[i].image && isDataUrl(finalContentBlocks[i].image || '')) {
                    finalContentBlocks[i] = {
                        ...finalContentBlocks[i],
                        image: await uploadIfDataUrl(finalContentBlocks[i].image || null) || undefined
                    };
                }
            }

            const payload = {
                title: articleData.title,
                slug: articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                summary: articleData.summary,
                content: articleData.content,
                category: articleData.category,
                country: articleData.country,
                image: finalImage,
                published_sites: articleData.publishTo,
                status: (isPublish ? 'published' : 'pending review') as 'published' | 'pending review',
                topics: articleData.tags,
                author: articleData.author,
                date: articleData.publishDate,
                gallery_images: finalGalleryImages,
                split_images: articleData.splitImages,
                content_blocks: finalContentBlocks,
                template: template,
                image_position: articleData.image_position,
                image_position_x: articleData.image_position_x
            };

            // Use the is_redis flag from our Resource to determine the save path
            const isFromRedis = initialData?.is_redis === true;

            console.log('handleSave debug:', {
                mode,
                isFromRedis,
                status: initialData?.status,
                id: initialData?.id,
                isPublish
            });

            console.log('Publish validation:', { isPublish, publishToLength: articleData.publishTo.length, publishTo: articleData.publishTo });

            if (isPublish && articleData.publishTo.length === 0) {
                console.log('Validation failed: No sites selected');
                alert('Please select at least one site to publish to.');
                return;
            }

            console.log('Validation passed, continuing with save/publish');

            if (mode === 'create') {
                // Create article directly in MySQL database
                await createArticle(payload);
                alert(`Article ${isPublish ? 'published' : 'created'} successfully!`);
            } else if (mode === 'edit' && isFromRedis) {
                // For Redis articles (from scraper), first update the Redis cache
                await updatePendingArticle(initialData.id, {
                    ...payload,
                    image_url: finalImage || undefined,
                });

                // If publishing, also move from Redis to MySQL database
                if (isPublish) {
                    await publishArticle(initialData.id, {
                        published_sites: articleData.publishTo,
                    });
                    alert('Article published successfully!');
                } else {
                    alert('Article updated successfully!');
                }
            } else if (mode === 'edit') {
                // DB articles (including 'pending review' and restored ones)
                if (isPublish) {
                    // When publishing, first update the article data, then call publish endpoint
                    await updateArticle(initialData.id, payload);
                    await publishArticle(initialData.id, {
                        published_sites: articleData.publishTo,
                    });
                    alert('Article published successfully!');
                } else {
                    // When just saving, only update
                    await updateArticle(initialData.id, payload);
                    alert('Article updated successfully!');
                }
            }

            onClose();
            window.location.reload();
        } catch (error: any) {
            console.error("Failed to save article", error);
            const status = error.response?.status || error.status || '';
            const msg = error.response?.data?.message || error.message || "Failed to save changes. Please try again.";
            alert(`Error ${status}: ${msg}`);
        }
    };

    return (
        <div className="force-light fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-200">
            <ArticleEditorForm
                data={articleData}
                availableSites={availableSites}
                onDataChange={handleDataChange}
                template={template}
                onTemplateChange={handleTemplateChange}
                onSave={() => handleSave(false)}
                onPublish={() => handleSave(true)}
                onClose={onClose}
            />
        </div>
    );
}
