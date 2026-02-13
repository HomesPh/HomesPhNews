"use client";

import { ChevronLeft, Eye, Save, Send } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditorHeaderProps {
    onSave: () => void;
    onPublish: () => void;
    onPreview: () => void;
    onClose?: () => void;
}

export default function EditorHeader({ onSave, onPublish, onPreview, onClose }: EditorHeaderProps) {
    const router = useRouter();

    return (
        <div className="h-[60px] px-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 z-50">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onClose ? onClose() : router.back()}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="font-bold text-gray-900 leading-tight">Create New Blog</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="text-xs text-gray-500 font-medium">Draft - Last saved just now</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onPreview}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                >
                    <Eye className="w-4 h-4" />
                    Preview
                </button>
                <div className="h-6 w-[1px] bg-gray-200"></div>
                <button
                    onClick={onSave}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                >
                    Save as Draft
                </button>
                <div className="h-6 w-[1px] bg-gray-200"></div>
                <button
                    onClick={onPublish}
                    className="px-5 py-2 text-sm font-semibold text-white bg-[#C10007] hover:bg-[#a00006] rounded-lg shadow-sm shadow-[#C10007]/20 transition-all flex items-center gap-2"
                >
                    Publish
                </button>
            </div>
        </div>
    );
}
