"use client";


import {
    Trash2, Type, Image as ImageIcon,
    Grid, Plus, GripVertical, Move, Check, X as XIcon
} from "lucide-react";
import { Block, BlockType } from "@/hooks/useBlockEditor";
import { cn } from "@/lib/utils";
import { useDrag, useDrop } from 'react-dnd';
import { useRef, useEffect, useState } from 'react';
import RichTextEditor from "./RichTextEditor";

interface BlockRendererProps {
    index: number;
    block: Block;
    isActive: boolean;
    onSelect: () => void;
    onUpdate: (id: string, content: any) => void;
    onRemove: (id: string) => void;
    onMove: (id: string, direction: 'up' | 'down') => void;
    onReorder: (dragIndex: number, hoverIndex: number) => void;
    // New prop to update settings directly
    onUpdateSettings?: (id: string, settings: any) => void;
}

// --- Reusable Draggable Image Component ---
interface DraggableImageProps {
    src: string;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imagePosition?: { x: number; y: number };
    onPositionChange?: (pos: { x: number; y: number }) => void;
    className?: string;
    placeholderLabel?: string;
    readOnly?: boolean;
    allowRemove?: boolean;
    onRemove?: () => void;
    autoHeight?: boolean;
}

const DraggableImage = ({
    src,
    onUpload,
    imagePosition,
    onPositionChange,
    className,
    placeholderLabel = "Upload Media",
    allowRemove,
    onRemove,
    autoHeight = false
}: DraggableImageProps) => {
    const [isRepositioning, setIsRepositioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const getObjectPosition = () => {
        if (imagePosition) {
            return `${imagePosition.x}% ${imagePosition.y}%`;
        }
        return 'center top';
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isRepositioning) return;
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !isRepositioning || !onPositionChange) return;
        e.preventDefault();
        e.stopPropagation();

        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;

        const currentPos = imagePosition || { x: 50, y: 0 };
        const sensitivity = 0.2;

        let newX = currentPos.x - (deltaX * sensitivity);
        let newY = currentPos.y - (deltaY * sensitivity);

        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        onPositionChange({ x: newX, y: newY });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group/img relative overflow-hidden shadow-inner",
                isRepositioning && "ring-2 ring-[#C10007] ring-offset-2 cursor-move",
                !src && "min-h-[200px]", // Force min-height for placeholder
                className
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {src ? (
                <img
                    src={src}
                    className={cn(
                        "w-full object-cover",
                        autoHeight ? "h-auto" : "h-full",
                        isRepositioning && "pointer-events-none"
                    )}
                    style={{ objectPosition: getObjectPosition() }}
                />
            ) : (
                <label className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center p-4 hover:bg-gray-100 transition-colors">
                    <ImageIcon className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <span className="text-xs font-bold text-[#C10007] bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 block whitespace-nowrap">
                        {placeholderLabel}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
                </label>
            )}

            {src && !isRepositioning && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {onPositionChange && !autoHeight && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsRepositioning(true); }}
                            className="bg-white/10 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                        >
                            <Move className="w-3.5 h-3.5" /> Reposition
                        </button>
                    )}
                    <label className="cursor-pointer bg-white/10 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/20 px-2 py-1 rounded transition-colors">
                        Change
                        <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
                    </label>
                    {allowRemove && onRemove && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="bg-red-500/80 backdrop-blur-sm text-white p-1 rounded hover:bg-red-600 transition-colors"
                            title="Remove image"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            )}

            {isRepositioning && (
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsRepositioning(false); }}
                        className="bg-[#C10007] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:bg-[#a00006] transition-colors"
                    >
                        <Check className="w-3.5 h-3.5" /> Done
                    </button>
                </div>
            )}
            {isRepositioning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm">
                        Drag to reposition
                    </div>
                </div>
            )}
        </div>
    );
};

const AutoResizeTextarea = ({ value, onChange, className, style, placeholder }: { value: string, onChange: (v: string) => void, className?: string, style?: any, placeholder?: string }) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        if (ref.current) {
            ref.current.style.height = '0px';
            const scrollHeight = ref.current.scrollHeight;
            ref.current.style.height = `${Math.ceil(scrollHeight) + 4}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
        if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
            const observer = new ResizeObserver(adjustHeight);
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }
    }, [value]);

    return (
        <textarea
            ref={ref}
            className={cn("w-full bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden block", className)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onInput={adjustHeight}
            style={{
                ...style,
                minHeight: '1.2em',
                boxSizing: 'border-box'
            }}
            placeholder={placeholder}
            rows={1}
            spellCheck={false}
        />
    );
};

export default function BlockRenderer({
    index,
    block,
    isActive,
    onSelect,
    onUpdate,
    onRemove,
    onMove,
    onReorder,
    onUpdateSettings
}: BlockRendererProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isRepositioning, setIsRepositioning] = useState(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const isDraggingImage = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Drag and Drop Logic
    const [{ isDragging }, drag] = useDrag({
        type: 'BLOCK',
        item: { index },
        // Disable drag if we are repositioning an image
        canDrag: !isRepositioning,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'BLOCK',
        hover: (item: { index: number }, monitor) => {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            onReorder(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const settings = block.settings || {};
    const style: React.CSSProperties = {
        textAlign: settings.textAlign || 'left',
        fontSize: settings.fontSize || '18px',
        fontWeight: settings.fontWeight || '400',
        fontStyle: settings.isItalic ? 'italic' : 'normal',
        textDecoration: settings.isUnderline ? 'underline' : 'none',
        color: settings.color || 'inherit',
        fontFamily: settings.fontFamily || 'inherit',
    };

    const handleUpdateImagePosition = (pos: { x: number, y: number }, key?: string) => {
        if (key && block.type === 'grid') {
            const currentPositions = block.content.imagePositions || {};
            onUpdate(block.id, { imagePositions: { ...currentPositions, [key]: pos } });
        } else {
            if (onUpdateSettings) {
                onUpdateSettings(block.id, { imagePosition: pos });
            }
        }
    };

    const renderBlockContent = () => {
        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
            const file = e.target.files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                callback(url);
            }
        };

        // Text Block with List Support
        if (block.type === 'text') {
            const ListWrapper = settings.listType === 'number' ? 'ol' : settings.listType === 'bullet' ? 'ul' : 'div';
            const listClass = settings.listType === 'number' ? 'list-decimal list-inside' : settings.listType === 'bullet' ? 'list-disc list-inside' : '';

            return (
                <ListWrapper className={listClass}>
                    <li className={settings.listType ? 'marker:text-[#C10007]' : ''}>
                        <RichTextEditor
                            content={block.content.text}
                            onChange={(val) => onUpdate(block.id, { text: val })}
                            placeholder={settings.listType ? "List item..." : "Start typing..."}
                            style={style}
                            blockId={block.id}
                        />
                    </li>
                </ListWrapper>
            );
        }

        switch (block.type) {
            case 'image':
            case 'centered-image':
                console.log("Rendering Image Block:", {
                    id: block.id,
                    type: block.type,
                    src: block.content.src,
                    caption: block.content.caption,
                    settings: block.settings
                });

                return (
                    <div className={cn("space-y-3", block.type === 'centered-image' && "max-w-[400px] mx-auto")}>
                        <DraggableImage
                            src={block.content.src}
                            onUpload={(e) => handleFileSelect(e, (url) => onUpdate(block.id, { src: url }))}
                            imagePosition={settings.imagePosition}
                            onPositionChange={handleUpdateImagePosition}
                            autoHeight={true}
                        />
                        <input
                            type="text"
                            value={block.content.caption || ""}
                            onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
                            placeholder="Add a figure caption..."
                            className={cn(
                                "w-full text-xs text-gray-400 italic border-none focus:ring-0 bg-transparent",
                                `text-${settings.textAlign || 'center'}`
                            )}
                        />
                    </div>
                );
            case 'left-image':
            case 'right-image':
                const isLeft = block.type === 'left-image';
                return (
                    <div className={cn("flex gap-8 items-start flex-col md:flex-row", !isLeft && "md:flex-row-reverse")}>
                        <div className="w-full md:w-[180px] shrink-0">
                            <DraggableImage
                                src={block.content.image || block.content.src}
                                onUpload={(e) => handleFileSelect(e, (url) => onUpdate(block.id, { image: url }))}
                                imagePosition={settings.imagePosition}
                                onPositionChange={handleUpdateImagePosition}
                                className="aspect-square"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <RichTextEditor
                                content={block.content.text || ""}
                                onChange={(val) => onUpdate(block.id, { text: val })}
                                placeholder="Enter text alongside image..."
                                style={style}
                                blockId={block.id}
                            />
                        </div>
                    </div>
                );
            case 'grid':
                const images = block.content.images || ["", ""];
                const imagePositions = block.content.imagePositions || {};

                // Dynamic Grid Layout
                const gridClass = images.length === 1 ? 'grid-cols-1' :
                    images.length === 2 ? 'grid-cols-2' :
                        images.length === 3 ? 'grid-cols-3' : 'grid-cols-2';

                return (
                    <div className="space-y-4">
                        <div className={cn("grid gap-4", gridClass)}>
                            {images.map((img: string, idx: number) => (
                                <DraggableImage
                                    key={idx}
                                    src={img}
                                    onUpload={(e) => handleFileSelect(e, (url) => {
                                        const newImages = [...images];
                                        newImages[idx] = url;
                                        onUpdate(block.id, { images: newImages });
                                    })}
                                    imagePosition={imagePositions[idx]}
                                    onPositionChange={(pos) => handleUpdateImagePosition(pos, idx.toString())}
                                    className="aspect-square"
                                    allowRemove={images.length > 1}
                                    onRemove={() => {
                                        const newImages = images.filter((_: string, i: number) => i !== idx);
                                        // Also need to clean up position for deleted index
                                        const newPositions = { ...imagePositions };
                                        delete newPositions[idx];
                                        // Ideally shift indices in positions map, but for now simple delete
                                        onUpdate(block.id, { images: newImages });
                                    }}
                                />
                            ))}
                            {/* Add Image Button for Grid */}
                            {images.length < 4 && (
                                <button
                                    onClick={() => {
                                        onUpdate(block.id, { images: [...images, ""] });
                                    }}
                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-[#C10007] hover:border-[#C10007] transition-all bg-gray-50/50 hover:bg-white"
                                >
                                    <Plus className="w-8 h-8 mb-2" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Add Image</span>
                                </button>
                            )}
                        </div>
                    </div>
                );
            default:
                return <div className="p-4 bg-red-50 text-red-500 rounded-lg text-xs font-bold">Unsupported block type: {block.type}</div>;
        }
    };

    return (
        <div
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            className={cn(
                "group relative bg-transparent rounded-xl transition-all duration-200 mb-2",
                isActive ? "ring-2 ring-[#C10007] ring-offset-8 z-10" : "hover:bg-gray-50/50",
                isDragging && "opacity-20 scale-95"
            )}
        >
            {/* Block Controls (Left) */}
            <div className={cn(
                "absolute -left-14 top-0 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-all duration-200",
                isActive && "opacity-100"
            )}>
                <div className="p-1 px-1.5 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col gap-0.5">
                    <button
                        className="p-1.5 hover:bg-gray-50 rounded-md text-gray-400 hover:text-[#C10007] cursor-grab active:cursor-grabbing"
                        title="Drag to reorder"
                    >
                        <GripVertical className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(block.id); }}
                        className="p-1.5 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-600"
                        title="Remove block"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Block Type Label (Top Right) */}
            <div className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <span className="bg-white px-2 py-0.5 rounded-full border border-gray-100 text-[9px] font-black text-gray-300 uppercase tracking-widest shadow-sm">
                    {block.type.replace('-', ' ')}
                </span>
            </div>

            {/* Main Content Padding */}
            <div className="p-4">
                {renderBlockContent()}
            </div>
        </div>
    );
}
