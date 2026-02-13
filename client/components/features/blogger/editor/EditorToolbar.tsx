"use client";

import {
    Undo2, Redo2, Minus, Plus, Type, Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Link2, List, ListOrdered, Palette, ChevronDown, Monitor, Tablet, Smartphone
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/hooks/useEditorStore";
import { Block } from "@/hooks/useBlockEditor";

interface EditorToolbarProps {
    activeBlock: Block | null;
    onUpdateSettings: (updates: Partial<Block['settings']>) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    zoom: number;
    onZoomChange: (val: number) => void;
    viewMode: 'desktop' | 'tablet' | 'mobile';
    onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
    setIsLinkModalOpen: (isOpen: boolean) => void;
}

export default function EditorToolbar({
    activeBlock,
    onUpdateSettings,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    zoom,
    onZoomChange,
    viewMode,
    onViewModeChange,
    setIsLinkModalOpen
}: EditorToolbarProps) {
    const { activeEditor } = useEditorStore();
    const [showFontFamily, setShowFontFamily] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const settings = activeBlock?.settings || {};

    const fontFamilies = [
        "Inter", "Roboto", "Playfair Display", "Merriweather", "Open Sans", "Lato"
    ];

    const colors = [
        "#000000", "#4B5563", "#9CA3AF", "#FFFFFF",
        "#C10007", "#B91C1C", "#F87171",
        "#1D4ED8", "#3B82F6",
        "#047857", "#10B981",
        "#D97706", "#F59E0B"
    ];

    // Helper to determine if a mark/style is active (Tiptap or Block Settings)
    const isBold = activeEditor ? activeEditor.isActive('bold') : settings.fontWeight === '700';
    const isItalic = activeEditor ? activeEditor.isActive('italic') : settings.isItalic;
    const isUnderline = activeEditor ? activeEditor.isActive('underline') : settings.isUnderline;
    const currentTextAlign = activeEditor ? (activeEditor.isActive({ textAlign: 'left' }) ? 'left' : activeEditor.isActive({ textAlign: 'center' }) ? 'center' : activeEditor.isActive({ textAlign: 'right' }) ? 'right' : activeEditor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left') : settings.textAlign || 'left';
    const isBulletList = activeEditor ? activeEditor.isActive('bulletList') : settings.listType === 'bullet';
    const isOrderedList = activeEditor ? activeEditor.isActive('orderedList') : settings.listType === 'number';
    const currentColor = activeEditor ? activeEditor.getAttributes('textStyle').color : settings.color;
    const currentFontSize = activeEditor ? activeEditor.getAttributes('textStyle').fontSize : settings.fontSize;
    const currentFont = activeEditor ? activeEditor.getAttributes('textStyle').fontFamily : settings.fontFamily;

    const handleFormat = (format: string, value?: any) => {
        if (activeEditor) {
            activeEditor.chain().focus();
            switch (format) {
                case 'bold': activeEditor.chain().toggleBold().run(); break;
                case 'italic': activeEditor.chain().toggleItalic().run(); break;
                case 'underline': activeEditor.chain().toggleUnderline().run(); break;
                case 'align': activeEditor.chain().setTextAlign(value).run(); break;
                case 'bullet': activeEditor.chain().toggleBulletList().run(); break;
                case 'number': activeEditor.chain().toggleOrderedList().run(); break;
                case 'color': activeEditor.chain().setColor(value).run(); break;
                case 'fontFamily': activeEditor.chain().setFontFamily(value).run(); break;
                case 'fontSize': activeEditor.chain().setFontSize(value).run(); break;
                case 'unsetLink': activeEditor.chain().unsetLink().run(); break;
            }
        } else {
            // Fallback to block settings for non-text blocks (or legacy behavior)
            const updates: any = {};
            if (format === 'bold') updates.fontWeight = settings.fontWeight === '700' ? '400' : '700';
            if (format === 'italic') updates.isItalic = !settings.isItalic;
            if (format === 'underline') updates.isUnderline = !settings.isUnderline;
            if (format === 'align') updates.textAlign = value;
            if (format === 'bullet') updates.listType = settings.listType === 'bullet' ? undefined : 'bullet';
            if (format === 'number') updates.listType = settings.listType === 'number' ? undefined : 'number';
            if (format === 'color') updates.color = value;
            if (format === 'fontFamily') updates.fontFamily = value;
            // For font size fallback
            if (format === 'fontSize') updates.fontSize = value;
            onUpdateSettings(updates);
        }
    };

    // Helper for font size update
    const updateFontSize = (newSize: string) => {
        handleFormat('fontSize', newSize);
        // Removed block-level update to prevent overwriting inline styles for the whole block
        // onUpdateSettings({ fontSize: newSize }); 
    }

    return (
        <div className="h-[64px] bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0 shadow-sm z-20 sticky top-0">
            {/* History & Mode Group */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all text-gray-600"
                >
                    <Undo2 className="w-4 h-4" />
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all text-gray-600"
                >
                    <Redo2 className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                <div className="flex items-center gap-1">
                    {[
                        { id: 'desktop', icon: Monitor },
                        { id: 'tablet', icon: Tablet },
                        { id: 'mobile', icon: Smartphone }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => onViewModeChange(mode.id as any)}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === mode.id ? "bg-white shadow-sm text-[#C10007]" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <mode.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Typography & Styling Group */}
            <div className="flex-1 flex items-center justify-center gap-2 px-6">
                {/* Font Family & Size */}
                <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100 relative">
                    <button
                        onClick={() => setShowFontFamily(!showFontFamily)}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-sm font-bold text-gray-700 min-w-[120px] justify-between"
                    >
                        {currentFont || settings.fontFamily || "Inter"}
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>

                    {/* Font Dropdown */}
                    {showFontFamily && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden">
                            {fontFamilies.map(font => (
                                <button
                                    key={font}
                                    onClick={() => {
                                        handleFormat('fontFamily', font);
                                        setShowFontFamily(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 hover:text-[#C10007]"
                                    style={{ fontFamily: font }}
                                >
                                    {font}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="w-[1px] h-4 bg-gray-200" />
                    {/* Font Size - Tiptap complex, keeping basic block setting for now or custom extension later */}
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                const val = parseInt((currentFontSize || settings.fontSize || '18').replace('px', '')) - 1;
                                updateFontSize(val + 'px');
                            }}
                            className="p-1.5 hover:text-[#C10007] transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <input
                            type="text"
                            className="w-10 bg-transparent text-center text-sm font-bold focus:outline-none"
                            value={(currentFontSize || settings.fontSize || '18').replace('px', '')}
                            onChange={(e) => updateFontSize(e.target.value + 'px')}
                        />
                        <button
                            onClick={() => {
                                const val = parseInt((currentFontSize || settings.fontSize || '18').replace('px', '')) + 1;
                                updateFontSize(val + 'px');
                            }}
                            className="p-1.5 hover:text-[#C10007] transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Text Styles */}
                <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 relative">
                    <button
                        onClick={() => handleFormat('bold')}
                        className={cn("p-2 rounded-lg transition-all", isBold ? "bg-white shadow-sm text-[#C10007]" : "text-gray-500 hover:text-gray-900")}
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleFormat('italic')}
                        className={cn("p-2 rounded-lg transition-all", isItalic ? "bg-white shadow-sm text-[#C10007]" : "text-gray-500 hover:text-gray-900")}
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleFormat('underline')}
                        className={cn("p-2 rounded-lg transition-all", isUnderline ? "bg-white shadow-sm text-[#C10007]" : "text-gray-500 hover:text-gray-900")}
                    >
                        <Underline className="w-4 h-4" />
                    </button>

                    {/* Color Picker */}
                    <div className="relative">
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className={cn("p-2 rounded-lg transition-all flex items-center gap-1", !!currentColor ? "bg-white shadow-sm text-[#C10007]" : "text-gray-500 hover:text-gray-900")}
                        >
                            <Palette className="w-4 h-4" />
                            {currentColor && (
                                <div className="w-2 h-2 rounded-full border border-gray-200" style={{ backgroundColor: currentColor }} />
                            )}
                        </button>
                        {showColorPicker && (
                            <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-xl shadow-xl border border-gray-100 z-50 grid grid-cols-4 gap-2 w-[180px]">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            handleFormat('color', color);
                                            setShowColorPicker(false);
                                        }}
                                        className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                                <button
                                    onClick={() => {
                                        handleFormat('color', undefined);
                                        setShowColorPicker(false);
                                    }}
                                    className="col-span-4 text-xs font-bold text-gray-500 hover:text-[#C10007] mt-2 text-center"
                                >
                                    Reset Color
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                    <button
                        onClick={() => setIsLinkModalOpen(true)}
                        className={cn("p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 hover:text-gray-900", activeEditor?.isActive('link') && "bg-white shadow-sm text-[#C10007]")}
                    >
                        <Link2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100">
                    {[
                        { id: 'left', icon: AlignLeft },
                        { id: 'center', icon: AlignCenter },
                        { id: 'right', icon: AlignRight },
                        { id: 'justify', icon: AlignJustify }
                    ].map((align) => (
                        <button
                            key={align.id}
                            onClick={() => handleFormat('align', align.id)}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                currentTextAlign === align.id ? "bg-white shadow-sm text-[#C10007]" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <align.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100">
                    <button
                        onClick={() => handleFormat('bullet')}
                        className={cn("p-2 rounded-lg transition-all", isBulletList ? "bg-white shadow-sm text-[#C10007]" : "text-gray-500 hover:text-gray-900")}
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleFormat('number')}
                        className={cn("p-2 rounded-lg transition-all", isOrderedList ? "bg-white shadow-sm text-[#C10007]" : "text-gray-500 hover:text-gray-900")}
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Zoom Controls Area */}
            <div className="flex items-center gap-3 pl-4">
                <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100 px-3 py-1.5">
                    <button
                        onClick={() => onZoomChange(Math.max(50, zoom - 10))}
                        className="text-gray-400 hover:text-[#C10007] transition-colors"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-700 min-w-[32px] text-center">{zoom}%</span>
                    <button
                        onClick={() => onZoomChange(Math.min(200, zoom + 10))}
                        className="text-gray-400 hover:text-[#C10007] transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
