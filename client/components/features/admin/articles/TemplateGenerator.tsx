"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Download, RefreshCw, Type, Layout, Image as ImageIcon, ChevronDown, Check, Pipette } from 'lucide-react';
import { SiteResource } from "@/lib/api-v2/types/SiteResource";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { getAdminSites } from "@/lib/api-v2/admin/service/sites/getAdminSites";

interface TemplateGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    article: ArticleResource;
}

type LogoVariant = 'original' | 'dark' | 'light';
type LogoPosition = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type TextAlignment = 'left' | 'center' | 'right' | 'justify';
type AspectRatio = '16:9' | '1:1' | '4:5';

// --- Color Conversion Utilities ---
const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToRgb = (h: number, s: number, v: number) => {
    h /= 360; s /= 100; v /= 100;
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

function PremiumColorPicker({ color, opacity, onChange, onOpacityChange }: { 
    color: string, 
    opacity: number, 
    onChange: (color: string) => void,
    onOpacityChange: (opacity: number) => void
}) {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const rgb = hexToRgb(color);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateHsv = (h: number, s: number, v: number) => {
        const { r, g, b } = hsvToRgb(h, s, v);
        onChange(rgbToHex(r, g, b));
    };

    const handleEyedropper = async () => {
        if (typeof window === 'undefined' || !(window as any).EyeDropper) {
            console.warn("Eyedropper API not supported in this browser");
            return;
        }
        try {
            const eyeDropper = new (window as any).EyeDropper();
            const result = await eyeDropper.open();
            onChange(result.sRGBHex.toUpperCase());
        } catch (e) {
            console.error("Eyedropper failed", e);
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 bg-white border transition-all overflow-hidden group ${
                    isOpen 
                        ? 'border-[#1428AE] ring-4 ring-[#1428AE]/20 shadow-[0_4px_20px_rgba(20,40,174,0.15)] rounded-t-[12px] rounded-b-none' 
                        : 'border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:border-[#1428AE]/30 rounded-[12px]'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div 
                        className="w-6 h-6 rounded-[6px] border border-gray-200 shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color, opacity: opacity / 100 }}
                    />
                    <span className="font-semibold text-gray-900 uppercase text-[14px] tracking-tight">{color}</span>
                    <span className="text-[11px] text-gray-400 font-bold">{opacity}%</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#1428AE] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-[4px] w-full min-w-[260px] bg-white rounded-b-2xl rounded-t-none shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#1428AE]/20 border-t-0 p-4 z-[200] animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Picker</span>
                        <div className="flex items-center gap-2">
                            {typeof window !== 'undefined' && (window as any).EyeDropper && (
                                <button 
                                    onClick={handleEyedropper}
                                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-[#1428AE] transition-all"
                                    title="Eyedropper"
                                >
                                    <Pipette className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Saturation/Brightness Area */}
                    <div 
                        className="relative w-full h-[160px] rounded-[10px] mb-4 cursor-crosshair overflow-hidden"
                        style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
                        onMouseDown={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const update = (moveEvent: MouseEvent) => {
                                const x = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
                                const y = Math.max(0, Math.min(1, (moveEvent.clientY - rect.top) / rect.height));
                                updateHsv(hsv.h, x * 100, (1 - y) * 100);
                            };
                            update(e as any);
                            window.addEventListener('mousemove', update);
                            window.addEventListener('mouseup', () => window.removeEventListener('mousemove', update), { once: true });
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                        <div 
                            className="absolute w-3.5 h-3.5 border-2 border-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
                        />
                    </div>

                    {/* Sliders Area */}
                    <div className="space-y-4">
                        {/* Hue Slider */}
                        <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-[#ff0000] via-[#ffff00] via-[#00ff00] via-[#00ffff] via-[#0000ff] via-[#ff00ff] to-[#ff0000] cursor-pointer">
                            <input 
                                type="range" min="0" max="360" value={hsv.h}
                                onChange={(e) => updateHsv(Number(e.target.value), hsv.s, hsv.v)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div 
                                className="absolute w-3 h-3 bg-white border-2 border-white rounded-full shadow-md transform -translate-x-1/2 pointer-events-none top-0"
                                style={{ left: `${(hsv.h / 360) * 100}%` }}
                            />
                        </div>

                        {/* Opacity Slider */}
                        <div className="relative h-3 rounded-full cursor-pointer bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACBJREFUGF5jYmBgYGBkZGRkYGBgYGBkYGBkYGBkYGBkYGCYp8MAHwEFAAAAAElFTkSuQmCC')] bg-repeat">
                            <div 
                                className="absolute inset-0 rounded-full"
                                style={{ background: `linear-gradient(to right, transparent, ${color})` }}
                            />
                            <input 
                                type="range" min="0" max="100" value={opacity}
                                onChange={(e) => onOpacityChange(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div 
                                className="absolute w-3 h-3 bg-white border-2 border-white rounded-full shadow-md transform -translate-x-1/2 pointer-events-none top-0"
                                style={{ left: `${opacity}%` }}
                            />
                        </div>
                    </div>

                    {/* HEX Input */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">HEX</span>
                            <input 
                                type="text" value={color.replace('#', '')}
                                onChange={(e) => {
                                    const val = e.target.value.toUpperCase();
                                    if (/^[0-9A-F]{0,6}$/.test(val)) {
                                        if (val.length === 6) onChange('#' + val);
                                    }
                                }}
                                className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-mono font-bold focus:outline-none focus:border-[#1428AE]/30"
                            />
                        </div>
                        <div className="text-[12px] font-bold text-gray-900">{opacity}%</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TemplateGenerator({ isOpen, onClose, article }: TemplateGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sites, setSites] = useState<SiteResource[]>([]);
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
    const [logoVariant, setLogoVariant] = useState<LogoVariant>('original');
    const [logoPosition, setLogoPosition] = useState<LogoPosition>('top-right');
    const [titlePosition, setTitlePosition] = useState<LogoPosition>('bottom-left');
    const [titleAlignment, setTitleAlignment] = useState<TextAlignment>('left');
    const [title, setTitle] = useState(article.title);
    const [logoWidth, setLogoWidth] = useState(250);
    const [logoHeight, setLogoHeight] = useState(70);
    const [fontSize, setFontSize] = useState(60);
    const [lineHeight, setLineHeight] = useState(75);
    const [fontFamily, setFontFamily] = useState('Outfit');
    const [fontWeight, setFontWeight] = useState(400);
    const [titleColor, setTitleColor] = useState<'white' | 'black'>('white');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [selectedLogoSize, setSelectedLogoSize] = useState<'small' | 'regular' | 'large' | 'manual'>('regular');
    const [selectedTextSize, setSelectedTextSize] = useState<'small' | 'regular' | 'large' | 'manual'>('regular');
    
    // Overlay States
    const [overlayDirection, setOverlayDirection] = useState<'none' | 'top' | 'bottom' | 'left' | 'right' | 'full'>('bottom');
    const [overlayColor, setOverlayColor] = useState('#000000');
    const [overlayOpacity, setOverlayOpacity] = useState(80); // 0-100
    
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
    // Logo position selector options
    const logoPositionOptions = [
        { id: 'top-left', label: 'Top Left' },
        { id: 'top-center', label: 'Top Center' },
        { id: 'top-right', label: 'Top Right' },
        { id: 'center-left', label: 'Center Left' },
        { id: 'center', label: 'Center' },
        { id: 'center-right', label: 'Center Right' },
        { id: 'bottom-left', label: 'Bottom Left' },
        { id: 'bottom-center', label: 'Bottom Center' },
        { id: 'bottom-right', label: 'Bottom Right' }
    ] as { id: LogoPosition, label: string }[];

    // Title area options
    const titleAreaOptions = [
        { id: 'top-left', label: 'Top Left' },
        { id: 'top-right', label: 'Top Right' },
        { id: 'bottom-left', label: 'Bottom Left' },
        { id: 'bottom-right', label: 'Bottom Right' }
    ] as { id: LogoPosition, label: string }[];

    const logoPresets = [
        { label: 'Small', w: 150, h: 42 },
        { label: 'Regular', w: 250, h: 70 },
        { label: 'Large', w: 350, h: 98 }
    ];

    const textPresets = [
        { label: 'Small', size: 40, lh: 50 },
        { label: 'Regular', size: 60, lh: 75 },
        { label: 'Large', size: 80, lh: 100 }
    ];

    const fontFamilies = ['Outfit', 'Poppins', 'Inter', 'Roboto', 'Montserrat'];
    const fontWeights = [
        { label: 'Thin', value: 100 },
        { label: 'ExtraLight', value: 200 },
        { label: 'Light', value: 300 },
        { label: 'Regular', value: 400 },
        { label: 'Medium', value: 500 },
        { label: 'SemiBold', value: 600 },
        { label: 'Bold', value: 700 },
        { label: 'ExtraBold', value: 800 },
        { label: 'Black', value: 900 }
    ];

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
    }, [title, logoWidth, logoHeight, fontSize, lineHeight, fontFamily, fontWeight, titlePosition, titleAlignment, logoPosition, titleColor, aspectRatio, overlayDirection, overlayColor, overlayOpacity, isOpen]);

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
        let targetWidth = 1408;
        let targetHeight = 768;
        
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

        // 2. Add Dynamic Overlay
        if (overlayDirection !== 'none') {
            const hexToRgb = (hex: string) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 0, g: 0, b: 0 };
            };
            const rgb = hexToRgb(overlayColor);
            const opacity = overlayOpacity / 100;
            const colorStart = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`;
            const colorEnd = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

            if (overlayDirection === 'full') {
                ctx.fillStyle = colorEnd;
                ctx.fillRect(0, 0, targetWidth, targetHeight);
            } else {
                let gradient;
                switch (overlayDirection) {
                    case 'top':
                        gradient = ctx.createLinearGradient(0, targetHeight * 0.6, 0, 0);
                        break;
                    case 'left':
                        gradient = ctx.createLinearGradient(targetWidth * 0.6, 0, 0, 0);
                        break;
                    case 'right':
                        gradient = ctx.createLinearGradient(targetWidth * 0.4, 0, targetWidth, 0);
                        break;
                    default: // bottom
                        gradient = ctx.createLinearGradient(0, targetHeight * 0.4, 0, targetHeight);
                        break;
                }
                gradient.addColorStop(0, colorStart);
                gradient.addColorStop(1, colorEnd);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, targetWidth, targetHeight);
            }
        }

        // 3. Draw Title
        ctx.fillStyle = titleColor === 'white' ? '#ffffff' : '#000000';
        ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", system-ui, -apple-system, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = titleAlignment === 'justify' ? 'left' : titleAlignment;
        
        const marginX = 90;
        const marginY = 40;
        const maxWidth = targetWidth - (marginX * 2);
        
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

        const actualLineHeight = lineHeight || fontSize * 1.25;
        const totalTextHeight = lines.length * actualLineHeight;
        
        let titleY = 0;
        if (titlePosition.startsWith('top-')) {
            titleY = marginY + (actualLineHeight / 2);
        } else { // bottom
            titleY = targetHeight - marginY - totalTextHeight + (actualLineHeight / 2);
        }

        let titleX = marginX;
        // Text Alignment takes horizontal precedence
        if (titleAlignment === 'center') {
            titleX = targetWidth / 2;
            ctx.textAlign = 'center';
        } else if (titleAlignment === 'right') {
            titleX = targetWidth - marginX;
            ctx.textAlign = 'right';
        } else if (titleAlignment === 'justify') {
            titleX = marginX;
            ctx.textAlign = 'left';
        } else {
            // Left - follow Area position
            if (titlePosition.endsWith('-right')) {
                titleX = targetWidth - marginX;
                ctx.textAlign = 'right';
            } else if (titlePosition.endsWith('-center')) {
                titleX = targetWidth / 2;
                ctx.textAlign = 'center';
            } else {
                titleX = marginX;
                ctx.textAlign = 'left';
            }
        }

        lines.forEach((l, i) => {
            const currentY = titleY + (i * actualLineHeight);
            const textString = l.trim();
            
            if (titleAlignment === 'justify' && i < lines.length - 1) {
                const wordsInLine = textString.split(' ');
                const totalWordsWidth = wordsInLine.reduce((sum, word) => sum + ctx.measureText(word).width, 0);
                const spaceCount = wordsInLine.length - 1;
                const totalSpaceWidth = maxWidth - totalWordsWidth;
                const spaceWidth = totalSpaceWidth / spaceCount;
                
                let currentLineX = marginX;
                // For justify, we always use the full width box starting at marginX
                ctx.textAlign = 'left';
                
                wordsInLine.forEach((word, wordIdx) => {
                    ctx.fillText(word, currentLineX, currentY);
                    currentLineX += ctx.measureText(word).width + spaceWidth;
                });
            } else {
                ctx.fillText(textString, titleX, currentY);
            }
        });

        // 4. Draw Logo
        if (logoImg) {
            const logoW = logoWidth;
            const logoH = logoHeight;
            
            let logoX = marginX;
            let logoY = marginY;

            // X Position
            if (logoPosition.endsWith('-right')) {
                logoX = targetWidth - logoW - marginX;
            } else if (logoPosition.endsWith('-center')) {
                logoX = (targetWidth - logoW) / 2;
            } else if (logoPosition === 'center') {
                logoX = (targetWidth - logoW) / 2;
            }

            // Y Position
            if (logoPosition.startsWith('bottom-')) {
                logoY = targetHeight - logoH - marginY;
            } else if (logoPosition.startsWith('center-')) {
                logoY = (targetHeight - logoH) / 2;
            } else if (logoPosition === 'center') {
                logoY = (targetHeight - logoH) / 2;
            }

            ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
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
                        <CustomDropdown
                            label="Select Site"
                            value={selectedSiteId}
                            options={sites.map(s => ({ id: s.id, label: s.name }))}
                            onChange={(val) => setSelectedSiteId(val)}
                        />

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

                        {/* Logo Position */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <Layout className="w-3.5 h-3.5" /> Logo Position
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {logoPositionOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setLogoPosition(opt.id)}
                                        className={`px-2 py-2 text-[11px] font-medium rounded-[8px] border transition-all tracking-[-0.5px] ${
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
                            </label>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {logoPresets.map((p) => (
                                    <button
                                        key={p.label}
                                        onClick={() => {
                                            setLogoWidth(p.w);
                                            setLogoHeight(p.h);
                                            setSelectedLogoSize(p.label.toLowerCase() as any);
                                        }}
                                        className={`px-3 py-2 text-[12px] font-medium rounded-[8px] border transition-all ${
                                            selectedLogoSize === p.label.toLowerCase()
                                                ? 'bg-[#1428AE] text-white border-[#1428AE]' 
                                                : 'bg-white text-gray-600 border-gray-200'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <span className="text-[10px] text-gray-400 uppercase ml-1">Width</span>
                                    <input 
                                        type="number" 
                                        value={logoWidth}
                                        onChange={(e) => setLogoWidth(Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[8px] text-[13px] focus:ring-2 focus:ring-[#1428AE]/20 shadow-sm"
                                    />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] text-gray-400 uppercase ml-1">Height</span>
                                    <input 
                                        type="number" 
                                        value={logoHeight}
                                        onChange={(e) => setLogoHeight(Number(e.target.value))}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[8px] text-[13px] focus:ring-2 focus:ring-[#1428AE]/20 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Typography Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <label className="text-[14px] font-black text-gray-900 uppercase tracking-[1px] flex items-center gap-2">
                                <Type className="w-4 h-4" /> Typography
                            </label>

                            <CustomDropdown
                                label="Font Style"
                                value={fontFamily}
                                options={fontFamilies.map(f => ({ id: f, label: f }))}
                                onChange={(val) => setFontFamily(val)}
                            />

                            <CustomDropdown
                                label="Weight"
                                value={fontWeight}
                                options={fontWeights.map(w => ({ id: w.value, label: w.label }))}
                                onChange={(val) => setFontWeight(val)}
                            />

                            <div className="space-y-3">
                                <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                                    Text Size
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {textPresets.map((p) => (
                                        <button
                                            key={p.label}
                                            onClick={() => {
                                                setFontSize(p.size);
                                                setLineHeight(p.lh);
                                            }}
                                            className={`px-3 py-2 text-[12px] font-medium rounded-[8px] border transition-all ${
                                                fontSize === p.size && lineHeight === p.lh
                                                    ? 'bg-[#1428AE] text-white border-[#1428AE]' 
                                                    : 'bg-white text-gray-600 border-gray-200'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <span className="text-[10px] text-gray-400 uppercase ml-1">Font Size</span>
                                        <input 
                                            type="number" 
                                            value={fontSize}
                                            onChange={(e) => setFontSize(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[8px] text-[13px] focus:ring-2 focus:ring-[#1428AE]/20 shadow-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] text-gray-400 uppercase ml-1">Line Height</span>
                                        <input 
                                            type="number" 
                                            value={lineHeight}
                                            onChange={(e) => setLineHeight(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[8px] text-[13px] focus:ring-2 focus:ring-[#1428AE]/20 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Text Align</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                                        <button
                                            key={align}
                                            onClick={() => setTitleAlignment(align)}
                                            className={`px-1 py-2 text-[10px] font-bold uppercase rounded-[8px] border transition-all ${
                                                titleAlignment === align 
                                                    ? 'bg-[#1428AE] text-white border-[#1428AE]' 
                                                    : 'bg-white text-gray-600 border-gray-200'
                                            }`}
                                        >
                                            {align}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Text Area</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {titleAreaOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setTitlePosition(opt.id)}
                                            className={`px-3 py-2 text-[12px] font-medium rounded-[8px] border transition-all ${
                                                titlePosition === opt.id 
                                                    ? 'bg-[#1428AE] text-white border-[#1428AE]' 
                                                    : 'bg-white text-gray-600 border-gray-200'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Title Options */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
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

                        {/* Overlay Controls */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <label className="text-[14px] font-black text-gray-900 uppercase tracking-[1px] flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Overlay
                            </label>

                            <CustomDropdown
                                label="Shading Direction"
                                value={overlayDirection}
                                options={[
                                    { id: 'none', label: 'None' },
                                    { id: 'top', label: 'Top' },
                                    { id: 'bottom', label: 'Bottom' },
                                    { id: 'left', label: 'Left' },
                                    { id: 'right', label: 'Right' },
                                    { id: 'full', label: 'Solid' }
                                ]}
                                onChange={(val) => setOverlayDirection(val as any)}
                            />

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" /> Overlay Color & Opacity
                                </label>
                                <PremiumColorPicker 
                                    color={overlayColor}
                                    opacity={overlayOpacity}
                                    onChange={setOverlayColor}
                                    onOpacityChange={setOverlayOpacity}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <span className="text-[10px] text-gray-400 uppercase ml-1 block">Recommended</span>
                                <div className="flex flex-wrap gap-2">
                                    {['#000000', '#ffffff', '#1428AE', '#FF6B00', '#2E7D32'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setOverlayColor(c)}
                                            className="w-7 h-7 rounded-[8px] border border-gray-200 shadow-sm transition-all hover:scale-110 active:scale-95 ring-offset-2 hover:ring-2 hover:ring-[#1428AE]/20"
                                            style={{ backgroundColor: c }}
                                        />
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
                    <div className="flex-1 bg-gray-100/50 overflow-auto ring-inner ring-gray-100">
                        <div className="min-h-full p-6 lg:p-10 flex flex-col items-center justify-center">
                            <div className="relative group max-w-full">
                                <div className="bg-white p-2 shadow-2xl ring-1 ring-black/5">
                                    <canvas 
                                        ref={canvasRef}
                                        className="max-w-full h-auto shadow-inner bg-gray-200"
                                        style={{ maxHeight: '60vh' }}
                                    />
                                    {isGenerating && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="flex flex-col items-center gap-3">
                                                <RefreshCw className="w-8 h-8 text-[#1428AE] animate-spin" />
                                                <p className="text-sm font-bold text-[#1428AE] animate-pulse">Generating Preview...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="mt-4 text-center text-xs text-gray-400 font-medium font-sans">
                                    Preview shows how the exported image will look
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-500">
                        <p className="text-xs font-medium">Export Format: {aspectRatio === '16:9' ? 'Landscape (1408x768)' : aspectRatio === '1:1' ? 'Square (1080x1080)' : 'Portrait (1080x1350)'}</p>
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

function CustomDropdown<T extends unknown>({ 
    label, 
    value, 
    options, 
    onChange 
}: { 
    label: string, 
    value: T | null, 
    options: { id: T, label: string }[], 
    onChange: (val: T) => void
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.id === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Layout className="w-3.5 h-3.5" /> {label}
            </label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 bg-white border transition-all shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-left ${
                    isOpen 
                        ? 'border-[#1428AE] ring-4 ring-[#1428AE]/20 shadow-[0_4px_20px_rgba(20,40,174,0.15)] rounded-t-[12px] rounded-b-none' 
                        : 'border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:border-[#1428AE]/30 rounded-[12px]'
                }`}
            >
                <span className="font-semibold text-gray-900 text-[14px]">{selectedOption?.label || (value ? String(value) : 'Select...')}</span>
                <ChevronDown className={`w-4 h-4 text-[#1428AE] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-[200] mt-[4px] w-full bg-white border border-[#1428AE]/20 border-t-0 rounded-b-[16px] rounded-t-none shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-h-[240px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 p-1.5 scrollbar-hover-only">
                    {options.map((opt) => (
                        <button
                            key={String(opt.id)}
                            onClick={() => {
                                onChange(opt.id);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-[10px] text-[14px] transition-all flex items-center justify-between group mb-0.5 last:mb-0 ${
                                value === opt.id 
                                    ? 'bg-[#1428AE] text-white font-bold' 
                                    : 'text-gray-700 hover:bg-[#1428AE]/5 hover:text-[#1428AE] border border-transparent hover:border-[#1428AE]/10'
                            }`}
                        >
                            {opt.label}
                            {value === opt.id && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

