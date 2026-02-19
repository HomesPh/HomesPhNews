"use client";

import { useState, useEffect } from "react";
import { X, Link2 } from "lucide-react";

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (url: string) => void;
    initialUrl?: string;
}

export default function LinkModal({ isOpen, onClose, onSave, initialUrl = "" }: LinkModalProps) {
    const [url, setUrl] = useState(initialUrl);

    useEffect(() => {
        if (isOpen) {
            setUrl(initialUrl);
        }
    }, [isOpen, initialUrl]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Add Link</h2>
                        <p className="text-sm text-gray-500">Enter a URL to link to</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onSave(url);
                                onClose();
                            }}
                            className="px-6 py-2 text-sm font-bold text-white bg-[#C10007] hover:bg-[#a00006] rounded-lg shadow-sm shadow-red-100 transition-all"
                        >
                            Save Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
