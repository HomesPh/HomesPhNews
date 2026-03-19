"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Download, RefreshCw, Type, Layout, Image as ImageIcon } from 'lucide-react';
import { SiteResource } from "@/lib/api-v2/types/SiteResource";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { getAdminSites } from "@/lib/api-v2/admin/service/sites/getAdminSites";

interface TemplateGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    article: ArticleResource;
}

type LogoVariant = 'original' | 'dark' | 'light';
type TemplateLayout = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'center-overlay';
type AspectRatio = '16:9' | '1:1' | '4:5';

export default function TemplateGenerator({ isOpen, onClose, article }: TemplateGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sites, setSites] = useState<SiteResource[]>([]);
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
    const [logoVariant, setLogoVariant] = useState<LogoVariant>('original');
    const [logoPosition, setLogoPosition] = useState<TemplateLayout>('top-right');
    const [titlePosition, setTitlePosition] = useState<TemplateLayout>('bottom-left');
    const [title, setTitle] = useState(article.title);
    const [logoSize, setLogoSize] = useState(180);
    const [titleSize, setTitleSize] = useState(48);
    const [titleColor, setTitleColor] = useState<'white' | 'black'>('white');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    
    // Caching refs for images
    const bgImageRef = useRef<HTMLImageElement | null>(null);
    const logoImageRef = useRef<HTMLImageElement | null>(null);
    const currentBgSrcRef = useRef<string | null>(null);
    const currentLogoSrcRef = useRef<string | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSites();
        }
    }, [isOpen]);

    const fetchSites = async () => {
        setIsLoading(true);
        try {
            const res = await getAdminSites();
            const allSites = res.data.data as SiteResource[];
            
            // Filter sites that the article is published to
            // backend returns string[] for published_sites
            const publishedSiteData = article.published_sites || article.sites || [];
            const publishedSiteNames = Array.isArray(publishedSiteData) 
                ? publishedSiteData.map(s => typeof s === 'string' ? s : (s as any).name)
                : [publishedSiteData].filter(Boolean).map(s => typeof s === 'string' ? s : (s as any).name);
            
            console.log("Published Site Names:", publishedSiteNames);
            
            const filteredSites = allSites.filter(site => 
                publishedSiteNames.some(name => {
                    const normalizedName = String(name).toLowerCase().replace(/\s+/g, '');
                    const normalizedSiteName = String(site.name).toLowerCase().replace(/\s+/g, '');
                    return normalizedName === normalizedSiteName || normalizedSiteName.includes(normalizedName) || normalizedName.includes(normalizedSiteName);
                })
            );
            
            console.log("Filtered Sites:", filteredSites);
            
            setSites(filteredSites);
            if (filteredSites.length > 0) {
                setSelectedSiteId(filteredSites[0].id);
            } else if (allSites.length > 0) {
                console.log("No matching sites found, showing all sites as fallback.");
                setSites(allSites);
                setSelectedSiteId(allSites[0].id);
            }
        } catch (error) {
            console.error("TemplateGenerator: Failed to fetch sites", error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedSite = sites.find(s => s.id === selectedSiteId);

    const getLogoUrl = () => {
        if (!selectedSite) return null;
        let url = logoVariant === 'dark' ? selectedSite.dark_logo : 
                  logoVariant === 'light' ? selectedSite.light_logo : 
                  selectedSite.image;
        
        if (!url) return null;
        
        // Handle relative URLs - if it starts with / and it's not a full URL
        // In this project, /images/ paths are usually on the client
        if (url.startsWith('/') && !url.startsWith('//')) {
            // Keep it relative so it loads from the current origin (localhost:3000)
            return url;
        }

        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api");
        
        // If it's an external URL (like S3), use our proxy
        if (url.startsWith('http') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
            return `${apiBase}/v1/upload/proxy?url=${encodeURIComponent(url)}`;
        }
        
        return url;
    };

    // Unified position selector options
    const positionOptions = [
        { id: 'top-left', label: 'Top Left' },
        { id: 'top-right', label: 'Top Right' },
        { id: 'bottom-left', label: 'Bottom Left' },
        { id: 'bottom-right', label: 'Bottom Right' }
    ] as { id: TemplateLayout, label: string }[];

    // Effect to pre-load background image
    useEffect(() => {
        const loadBg = async () => {
            const getFirstImage = () => {
                if (article.image) return article.image;
                if (article.image_url) return article.image_url;
                if (article.content_blocks && Array.isArray(article.content_blocks)) {
                    const imgBlock = article.content_blocks.find(b => 
                        (b.type === 'image' || b.type === 'centered-image') && 
                        (b.content?.src || b.content?.image)
                    );
                    if (imgBlock) return imgBlock.content?.src || imgBlock.content?.image;
                }
                if (article.galleryImages && article.galleryImages.length > 0) return article.galleryImages[0];
                const match = article.content?.match(/<img[^>]+src=["']([^"']+)["']/);
                if (match) return match[1];
                return null;
            };

            const src = getFirstImage();
            if (!src) return;

            const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api");
            let fullSrc = src;
            if (fullSrc.startsWith('http') && !fullSrc.includes('localhost') && !fullSrc.includes('127.0.0.1')) {
                fullSrc = `${apiBase}/v1/upload/proxy?url=${encodeURIComponent(fullSrc)}`;
            } else if (!fullSrc.startsWith('http')) {
                if (!fullSrc.startsWith('/')) fullSrc = '/' + fullSrc;
            }

            if (currentBgSrcRef.current === fullSrc) return;
            currentBgSrcRef.current = fullSrc;

            setIsGenerating(true);
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = fullSrc + (fullSrc.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
            img.onload = () => {
                bgImageRef.current = img;
                drawPreview();
            };
            img.onerror = () => {
                bgImageRef.current = null;
                drawPreview();
            };
        };

        if (isOpen) loadBg();
    }, [isOpen, article]);

    // Effect to pre-load logo image
    useEffect(() => {
        const loadLogo = async () => {
            const url = getLogoUrl();
            if (!url) {
                logoImageRef.current = null;
                currentLogoSrcRef.current = null;
                drawPreview();
                return;
            }

            if (currentLogoSrcRef.current === url) return;
            currentLogoSrcRef.current = url;

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            img.onload = () => {
                logoImageRef.current = img;
                drawPreview();
            };
            img.onerror = () => {
                logoImageRef.current = null;
                drawPreview();
            };
        };

        if (isOpen && selectedSiteId) loadLogo();
    }, [isOpen, selectedSiteId, logoVariant]);

    // Redraw whenever parameters change
    useEffect(() => {
        if (isOpen) {
            drawPreview();
        }
    }, [title, logoSize, titleSize, titlePosition, logoPosition, titleColor, aspectRatio, isOpen]);

    const drawPreview = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bgImg = bgImageRef.current;
        const logoImg = logoImageRef.current;

        if (!bgImg) {
            // Draw fallback or loading
            canvas.width = 1200;
            canvas.height = 675;
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(0, 0, 1200, 675);
            ctx.fillStyle = '#9ca3af';
            ctx.font = '24px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(isGenerating ? 'Loading Background...' : 'No image found', 600, 337);
            return;
        }

        setIsGenerating(false);

        // Set canvas size
        let targetWidth = 1200;
        let targetHeight = 675;
        
        if (aspectRatio === '1:1') {
            targetWidth = 1080;
            targetHeight = 1080;
        } else if (aspectRatio === '4:5') {
            targetWidth = 1080;
            targetHeight = 1350;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // 1. Draw Background Image (Object Fit Cover)
        const canvasRatio = targetWidth / targetHeight;
        const imgRatio = bgImg.width / bgImg.height;

        let sx, sy, sWidth, sHeight;

        if (imgRatio > canvasRatio) {
            sHeight = bgImg.height;
            sWidth = bgImg.height * canvasRatio;
            sx = (bgImg.width - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = bgImg.width;
            sHeight = bgImg.width / canvasRatio;
            sx = 0;
            sy = (bgImg.height - sHeight) / 2;
        }

        ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

        // 2. Add subtle overlay
        const gradient = ctx.createLinearGradient(0, targetHeight * 0.4, 0, targetHeight);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // 3. Draw Title
        ctx.fillStyle = titleColor === 'white' ? '#ffffff' : '#000000';
        ctx.font = `bold ${titleSize}px Inter, system-ui, -apple-system, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        
        const margin = 50;
        const maxWidth = targetWidth - (margin * 2);
        
        // Wrap text
        const words = title.split(' ');
        let line = '';
        const lines = [];
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        const lineHeight = titleSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;
        
        let titleY = 0;
        if (titlePosition === 'top-left' || titlePosition === 'top-right') {
            titleY = margin + (lineHeight / 2);
        } else { // bottom
            titleY = targetHeight - margin - totalTextHeight + (lineHeight / 2);
        }

        let titleX = margin;
        if (titlePosition === 'top-right' || titlePosition === 'bottom-right') {
            ctx.textAlign = 'right';
            titleX = targetWidth - margin;
        }

        lines.forEach((l, i) => {
            ctx.fillText(l.trim(), titleX, titleY + (i * lineHeight));
        });

        // 4. Draw Logo
        if (logoImg) {
            const logoWidth = logoSize;
            const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
            
            let logoX = margin;
            let logoY = margin;

            if (logoPosition === 'top-right') {
                logoX = targetWidth - logoWidth - margin;
                logoY = margin;
            } else if (logoPosition === 'bottom-right') {
                logoX = targetWidth - logoWidth - margin;
                logoY = targetHeight - logoHeight - margin;
            } else if (logoPosition === 'bottom-left') {
                logoX = margin;
                logoY = targetHeight - logoHeight - margin;
            } else if (logoPosition === 'top-left') {
                logoX = margin;
                logoY = margin;
            }

            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.download = `template-${article.slug || 'export'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1428AE]/10 rounded-xl flex items-center justify-center text-[#1428AE]">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Template Generator</h2>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Create watermarked content</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* Sidebar / Controls */}
                    <div className="w-full lg:w-80 border-r border-gray-100 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
                        {/* Site Selection */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5" /> Select Site
                            </label>
                            <select 
                                value={selectedSiteId || ''}
                                onChange={(e) => setSelectedSiteId(Number(e.target.value))}
                                className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-[8px] text-[14px] focus:ring-2 focus:ring-[#1428AE]/20 focus:border-[#1428AE] transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat tracking-[-0.5px]"
                            >
                                {sites.length === 0 && <option value="">No sites found</option>}
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>{site.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Logo Variant */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <Layout className="w-3.5 h-3.5" /> Logo Variant
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['original', 'dark', 'light'] as LogoVariant[]).map((variant) => (
                                    <button
                                        key={variant}
                                        onClick={() => setLogoVariant(variant)}
                                        className={`px-3 py-2.5 text-[13px] font-medium rounded-[8px] border transition-all tracking-[-0.5px] ${
                                            logoVariant === variant 
                                                ? 'bg-[#1428AE] text-white border-[#1428AE] shadow-md shadow-[#1428AE]/20' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1428AE]/40'
                                        }`}
                                    >
                                        {variant.charAt(0).toUpperCase() + variant.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect Ratio */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <Layout className="w-3.5 h-3.5" /> Format
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['16:9', '1:1', '4:5'] as AspectRatio[]).map((ratio) => (
                                    <button
                                        key={ratio}
                                        onClick={() => setAspectRatio(ratio)}
                                        className={`px-3 py-2.5 text-[13px] font-medium rounded-[8px] border transition-all tracking-[-0.5px] ${
                                            aspectRatio === ratio 
                                                ? 'bg-[#1428AE] text-white border-[#1428AE] shadow-md shadow-[#1428AE]/20' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1428AE]/40'
                                        }`}
                                    >
                                        {ratio === '16:9' ? 'Landscape' : ratio === '1:1' ? 'Square' : 'Portrait'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Layout Options */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <Layout className="w-3.5 h-3.5" /> Logo Position
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {positionOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setLogoPosition(opt.id)}
                                        className={`px-3 py-2.5 text-[13px] font-medium rounded-[8px] border transition-all tracking-[-0.5px] ${
                                            logoPosition === opt.id 
                                                ? 'bg-[#1428AE] text-white border-[#1428AE] shadow-md shadow-[#1428AE]/20' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1428AE]/40'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Logo Size Control */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Layout className="w-3.5 h-3.5" /> Logo Size
                                </span>
                                <span className="text-gray-400 font-mono text-[11px]">{logoSize}px</span>
                            </label>
                            <input 
                                type="range" 
                                min="50" 
                                max="400" 
                                value={logoSize}
                                onChange={(e) => setLogoSize(Number(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1428AE]"
                            />
                        </div>

                        {/* Title Options */}
                        <div className="space-y-4 pt-2 border-t border-gray-100">
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <Type className="w-3.5 h-3.5" /> Title Position
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {positionOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setTitlePosition(opt.id)}
                                            className={`px-3 py-2.5 text-[13px] font-medium rounded-[8px] border transition-all tracking-[-0.5px] ${
                                                titlePosition === opt.id 
                                                    ? 'bg-[#1428AE] text-white border-[#1428AE] shadow-md shadow-[#1428AE]/20' 
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#1428AE]/40'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Type className="w-3.5 h-3.5" /> Title Size
                                    </span>
                                    <span className="text-gray-400 font-mono text-[11px]">{titleSize}px</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="24" 
                                    max="120" 
                                    value={titleSize}
                                    onChange={(e) => setTitleSize(Number(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1428AE]"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <Type className="w-3.5 h-3.5" /> Title Color
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['white', 'black'] as const).map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setTitleColor(color)}
                                            className={`px-3 py-2.5 text-[13px] font-medium rounded-[8px] border transition-all tracking-[-0.5px] capitalize ${
                                                titleColor === color 
                                                    ? 'bg-[#1428AE] text-white border-[#1428AE] shadow-md shadow-[#1428AE]/20' 
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#1428AE]/40'
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Editable Title */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <Type className="w-3.5 h-3.5" /> Custom Title
                            </label>
                            <textarea
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1428AE]/20 focus:border-[#1428AE] transition-all resize-none tracking-[-0.5px]"
                                placeholder="Enter title to display on image..."
                            />
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 bg-gray-100/50 p-6 lg:p-10 flex items-center justify-center overflow-auto ring-inner ring-gray-100">
                        <div className="relative group max-w-full">
                            <div className="bg-white p-2 rounded-xl shadow-2xl ring-1 ring-black/5">
                                <canvas 
                                    ref={canvasRef}
                                    className="max-w-full h-auto rounded-lg shadow-inner bg-gray-200"
                                    style={{ maxHeight: '60vh' }}
                                />
                                {isGenerating && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCw className="w-8 h-8 text-[#1428AE] animate-spin" />
                                            <p className="text-sm font-bold text-[#1428AE] animate-pulse">Generating Preview...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <p className="mt-4 text-center text-xs text-gray-400 font-medium">
                                Preview shows how the exported image will look
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-500">
                        <p className="text-xs font-medium">Export Format: {aspectRatio === '16:9' ? 'Landscape (1200x675)' : aspectRatio === '1:1' ? 'Square (1080x1080)' : 'Portrait (1080x1350)'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClose}
                            className="px-5 py-2.5 text-[14px] font-medium text-[#6b7280] hover:text-[#111827] transition-colors tracking-[-0.5px]"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDownload}
                            disabled={isGenerating || !selectedSiteId}
                            className="px-5 py-2.5 bg-[#1428AE] text-white rounded-[8px] text-[14px] font-medium transition-colors hover:bg-[#000785] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 tracking-[-0.5px]"
                        >
                            <Download className="w-4 h-4" />
                            Download Design
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

