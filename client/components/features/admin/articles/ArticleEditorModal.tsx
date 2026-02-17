"use client";

import { useState, useEffect } from 'react';
import { X, ArrowLeft, Save, Send } from 'lucide-react';
import { cn } from "@/lib/utils";
import { getSiteNames, updatePendingArticle, createArticle, updateArticle, publishArticle, uploadArticleImage } from "@/lib/api-v2";
import { blocksToHtml } from "@/lib/converter/blocksToHtml";
import ArticleEditorForm from "./editor/ArticleEditorForm";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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

    // Helper: Convert Data or Blob URL to File object
    const localUrlToFile = async (url: string): Promise<File> => {
        const res = await fetch(url);
        const blob = await res.blob();
        const mime = blob.type;
        const ext = mime.split('/')[1] || 'jpg';
        const filename = `image-${Date.now()}.${ext}`;
        return new File([blob], filename, { type: mime });
    };

    // Helper: Check if string is a local URL (data: or blob:)
    const isDataUrl = (str: string) => str?.startsWith('data:') || str?.startsWith('blob:');

    // Helper: Upload image to S3 if it's a data or blob URL, otherwise return as-is
    const uploadIfDataUrl = async (imageUrl: string | null): Promise<string | null> => {
        if (!imageUrl || !isDataUrl(imageUrl)) return imageUrl;
        try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();

            // Detect extension from MIME type
            const mime = blob.type;
            const ext = mime.split('/')[1]?.split('+')[0] || 'jpg';
            const file = new File([blob], `image-${Date.now()}.${ext}`, { type: mime });

            const response = await uploadArticleImage(file);

            if (response.data && response.data.url) {
                return response.data.url;
            } else {
                throw new Error('Server response missing image URL');
            }
        } catch (error: any) {
            console.error('Failed to upload image:', error);
            throw new Error(`Media upload failed: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleSave = async (isPublish: boolean = false, currentEditorData?: any) => {
        // Map currentEditorData if provided, otherwise use current state
        const workingData = currentEditorData ? {
            ...articleData,
            title: currentEditorData.title,
            slug: currentEditorData.slug,
            summary: currentEditorData.summary,
            category: currentEditorData.category,
            country: currentEditorData.country,
            publishTo: currentEditorData.platforms,
            content: currentEditorData.content,
            contentBlocks: currentEditorData.contentBlocks,
            author: currentEditorData.author,
            publishDate: currentEditorData.publishDate,
            publishTime: currentEditorData.publishTime
        } : articleData;

        // Validation Logic - Check before processing
        console.log('Publish validation:', { isPublish, publishToLength: workingData.publishTo.length, publishTo: workingData.publishTo });

        if (isPublish && (!workingData.publishTo || workingData.publishTo.length === 0)) {
            console.log('Validation failed: No sites selected');
            alert('Please select at least one site to publish to.');
            return;
        }

        try {
            setIsProcessing(true);

            // Processing state
            console.log('Deep-cloning data and uploading images to S3...');

            // 1. Process Main Image
            const finalImage = await uploadIfDataUrl(workingData.image);

            // 2. Process Gallery Images
            const finalGalleryImages = [...workingData.galleryImages];
            for (let i = 0; i < finalGalleryImages.length; i++) {
                finalGalleryImages[i] = await uploadIfDataUrl(finalGalleryImages[i]) || '';
            }

            // 3. Process Content Blocks (Deep Clone to avoid state mutation)
            const finalContentBlocks = JSON.parse(JSON.stringify(workingData.contentBlocks));
            for (let i = 0; i < finalContentBlocks.length; i++) {
                const block = finalContentBlocks[i];

                if (block.image) {
                    block.image = (await uploadIfDataUrl(block.image)) || undefined;
                }

                if (block.content && typeof block.content === 'object') {
                    if (block.content.src) {
                        block.content.src = await uploadIfDataUrl(block.content.src);
                    }
                    if (block.content.image) {
                        block.content.image = await uploadIfDataUrl(block.content.image);
                    }
                    if (Array.isArray(block.content.images)) {
                        for (let j = 0; j < block.content.images.length; j++) {
                            block.content.images[j] = await uploadIfDataUrl(block.content.images[j]);
                        }
                    }
                }
            }

            // 4. Process Legacy Split Images
            const finalSplitImages = [...workingData.splitImages];
            for (let i = 0; i < finalSplitImages.length; i++) {
                finalSplitImages[i] = await uploadIfDataUrl(finalSplitImages[i]) || '';
            }

            // --- FEATURED IMAGE FALLBACK LOGIC ---
            // If no featured image is set, try to find the first image in content blocks or content string
            let effectiveFinalImage = finalImage;
            if (!effectiveFinalImage) {
                console.log('No featured image set. Attempting to find fallback image from content...');

                // 1. Check Content Blocks
                for (const block of finalContentBlocks) {
                    if (effectiveFinalImage) break;

                    if (block.type === 'image' && block.image) {
                        effectiveFinalImage = block.image;
                    } else if (block.type === 'image-caption' && block.image) {
                        effectiveFinalImage = block.image;
                    } else if (block.type === 'split' && block.image) {
                        effectiveFinalImage = block.image;
                    } else if (block.type === 'gallery' && block.images && block.images.length > 0) {
                        effectiveFinalImage = block.images[0];
                    }
                }

                // 2. Check HTML Content (if still no image)
                // This covers cases where content was pasted directly or comes from legacy source
                if (!effectiveFinalImage && workingData.content) {
                    const imgMatch = workingData.content.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch && imgMatch[1]) {
                        console.log('Found fallback image in HTML content:', imgMatch[1]);
                        // We might need to upload this if it's a data URL, but usually it's already a URL
                        // if it's in the content string. 
                        // However, if the user pasted a data URL image, it might be in the content.
                        // For safety, let's run it through uploadIfDataUrl just in case.
                        effectiveFinalImage = await uploadIfDataUrl(imgMatch[1]);
                    }
                }

                if (effectiveFinalImage) {
                    console.log('Setting fallback featured image:', effectiveFinalImage);
                } else {
                    console.log('No fallback image found in content.');
                }
            }

            console.log('Image processing complete. Regenerating HTML...');

            // RE-GENERATE HTML content after all images are uploaded to S3
            const finalHtmlContent = blocksToHtml(finalContentBlocks as any);

            const payload = {
                title: workingData.title,
                slug: workingData.slug || workingData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                summary: workingData.summary,
                content: finalHtmlContent,
                category: workingData.category,
                country: workingData.country,
                image: effectiveFinalImage,
                published_sites: workingData.publishTo,
                status: (isPublish ? 'published' : 'pending review') as 'published' | 'pending review',
                topics: workingData.tags,
                author: workingData.author,
                date: workingData.publishDate,
                gallery_images: finalGalleryImages,
                split_images: finalSplitImages,
                content_blocks: finalContentBlocks,
                template: template,
                image_position: workingData.image_position,
                image_position_x: workingData.image_position_x
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

            console.log('Validation passed, continuing with save/publish');

            if (mode === 'create') {
                // For new articles, createArticle handles everything including status and sites
                await createArticle(payload);
                alert(`Article ${isPublish ? 'published' : 'created'} successfully!`);
            } else if (mode === 'edit' && isFromRedis) {
                // For Redis articles, we now have an atomic publish that handles the migration
                if (isPublish) {
                    await publishArticle(initialData.id, {
                        ...payload,
                        published_sites: payload.published_sites,
                    } as any);
                    alert('Article migrated and published successfully!');
                } else {
                    // Just update Redis
                    await updatePendingArticle(initialData.id, payload);
                    alert('Article draft updated successfully!');
                }
            } else if (mode === 'edit') {
                // DB articles
                if (isPublish) {
                    // Atomic publish: saves data and updates status in one go with the new inclusive backend
                    await publishArticle(initialData.id, {
                        ...payload,
                        published_sites: payload.published_sites,
                    } as any);
                    alert('Article changes published successfully!');
                } else {
                    await updateArticle(initialData.id, payload);
                    alert('Article changes saved successfully!');
                }
            }

            onClose();
            window.location.reload();
        } catch (error: any) {
            console.error('Error saving article:', error);
            const message = error.response?.data?.message || error.message || 'An error occurred while saving the article.';
            alert(message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePublishClick = (latestData: any) => {
        if (!latestData.platforms || latestData.platforms.length === 0) {
            alert('Please select at least one site to publish to.');
            return;
        }
        // Save the latest data for when they click confirm in the dialog
        setArticleData(prev => ({
            ...prev,
            ...latestData,
            publishTo: latestData.platforms,
            tags: latestData.tags || prev.tags
        }));
        setShowPublishDialog(true);
    };

    return (
        <div className="force-light fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-200">
            <ArticleEditorForm
                data={articleData}
                availableSites={availableSites}
                onDataChange={handleDataChange}
                template={template}
                onTemplateChange={handleTemplateChange}
                onSave={(data) => handleSave(false, data)}
                onPublish={(data) => handlePublishClick(data)}
                onClose={onClose}
            />

            <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <AlertDialogContent className="z-[200]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This article will be published to <strong>{articleData.publishTo.length}</strong> selected platforms.
                            Users on those platforms will be able to see it immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleSave(true); // Uses updated articleData from handlePublishClick
                            }}
                            disabled={isProcessing}
                            className="bg-[#3b82f6] hover:bg-[#2563eb]"
                        >
                            {isProcessing ? 'Processing...' : 'Confirm Publish'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
