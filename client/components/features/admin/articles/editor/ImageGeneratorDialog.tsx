"use client";

import { useState, useEffect } from 'react';
import { ImageIcon, Loader2, Sparkles, X } from 'lucide-react';
import { generateImages } from "@/lib/api-v2";
import { cn } from "@/lib/utils";

interface ImageGeneratorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (url: string) => void;
    articleTitle?: string;
}

export default function ImageGeneratorDialog({
    isOpen,
    onClose,
    onSelectImage,
    articleTitle = ""
}: ImageGeneratorDialogProps) {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    // Update prompt when articleTitle changes or dialog opens
    useEffect(() => {
        if (isOpen && articleTitle) {
            setPrompt(`Professional photo of ${articleTitle}`);
        }
    }, [articleTitle, isOpen]);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setGeneratedUrl(null);
        try {
            const urls = await generateImages(prompt, 1);
            if (urls && urls.length > 0) {
                setGeneratedUrl(urls[0]);
            }
        } catch (error) {
            console.error("AI Generation failed", error);
            alert("Failed to generate image. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUseImage = () => {
        if (generatedUrl) {
            onSelectImage(generatedUrl);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[500px] rounded-[16px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-600 rounded-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">AI Image Generator</h3>
                            <p className="text-[11px] text-purple-600 font-medium uppercase tracking-wider">Powered by HomesPh AI</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-gray-700">Visual Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to create..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[15px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none min-h-[100px]"
                            rows={3}
                        />
                        <p className="text-[11px] text-gray-400">Be specific about style, lighting, and subjects for better results.</p>
                    </div>

                    {/* Preview Area */}
                    <div className={cn(
                        "relative aspect-video rounded-[12px] overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center transition-all",
                        generatedUrl && "border-solid border-purple-200"
                    )}>
                        {isGenerating ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                                <p className="text-[14px] font-medium text-gray-500 animate-pulse">Generating your masterpiece...</p>
                            </div>
                        ) : generatedUrl ? (
                            <img src={generatedUrl} alt="Generated" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-6">
                                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-[13px] text-gray-400">Generated image will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[14px] font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    {generatedUrl ? (
                        <button
                            onClick={handleUseImage}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[10px] text-[14px] font-bold shadow-lg shadow-purple-200 hover:opacity-90 transition-all"
                        >
                            Use This Image
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="px-6 py-2 bg-gray-900 text-white rounded-[10px] text-[14px] font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-all flex items-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Generate Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
