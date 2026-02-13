import { Block } from "@/hooks/useBlockEditor";
import { decodeHtml } from "@/lib/utils";

/**
 * Converts an array of content blocks to HTML string.
 * This is used for legacy compatibility and SEO.
 */
export function blocksToHtml(blocks: Block[]): string {
    if (!blocks || !Array.isArray(blocks)) return "";

    return blocks.map(block => {
        const { type, content, settings } = block;

        // Handle missing content
        if (!content) return "";

        // Style helper - matches BlockRenderer's default text styling
        const style = settings ? `style="font-size: ${settings.fontSize || '18px'}; text-align: ${settings.textAlign || 'left'}; color: ${settings.color || 'inherit'}; font-weight: ${settings.fontWeight || 'normal'}; ${settings.isItalic ? 'font-style: italic;' : ''} ${settings.isUnderline ? 'text-decoration: underline;' : ''}"` : '';

        switch (type) {
            case 'text':
                const ListTag = settings?.listType === 'number' ? 'ol' : settings?.listType === 'bullet' ? 'ul' : 'div';
                const listStyle = settings?.listType ? 'style="list-style-position: inside; margin: 1rem 0;"' : '';
                const textContent = content.text || "";

                if (settings?.listType) {
                    return `<${ListTag} ${listStyle}><li><span ${style}>${textContent}</span></li></${ListTag}>`;
                }
                return `<div ${style} class="mb-4">${textContent}</div>`;

            case 'image':
            case 'centered-image':
                const src = content.src || content.image || "";
                const caption = content.caption || "";
                const isCentered = type === 'centered-image' || settings?.textAlign === 'center';
                if (!src) return "";

                return `<figure style="margin: 2rem auto; ${isCentered ? 'max-width: 80%;' : 'width: 100%;'} text-align: center;">
                    <img src="${src}" alt="${caption}" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);" />
                    ${caption ? `<figcaption style="font-style: italic; color: #6b7280; font-size: 0.875rem; margin-top: 0.75rem;">${caption}</figcaption>` : ""}
                </figure>`;

            case 'left-image':
            case 'right-image':
                const sideImg = content.image || content.src || "";
                const sideText = content.text || "";
                const sideCaption = content.caption || "";
                const isLeft = type === 'left-image';
                if (!sideImg && !sideText) return "";

                return `<div style="display: flex; flex-direction: ${isLeft ? 'row' : 'row-reverse'}; gap: 2rem; margin: 2.5rem 0; align-items: flex-start;">
                    <div style="flex: 0 0 30%; min-width: 200px;">
                        <img src="${sideImg}" alt="${sideCaption}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px;" />
                        ${sideCaption ? `<p style="font-style: italic; color: #9ca3af; font-size: 0.75rem; text-align: center; margin-top: 0.5rem;">${sideCaption}</p>` : ""}
                    </div>
                    <div style="flex: 1;" ${style}>${sideText}</div>
                </div>`;

            case 'grid':
                const gridImages = content.images || [];
                if (!gridImages.length) return "";
                const columns = gridImages.length === 1 ? 1 : gridImages.length === 2 ? 2 : gridImages.length === 3 ? 3 : 2;

                return `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 1rem; margin: 2rem 0;">
                    ${gridImages.map((img: string) => img ? `<img src="${img}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px;" />` : "").join('')}
                </div>`;

            case 'split-left':
            case 'split-right':
                const splitImg = content.image || "";
                const splitText = content.text || "";
                const isSplitLeft = type === 'split-left';

                return `<div style="display: flex; flex-direction: ${isSplitLeft ? 'row' : 'row-reverse'}; gap: 0; margin: 2rem 0; background: #f9fafb; border-radius: 16px; overflow: hidden;">
                    <div style="flex: 1; height: 400px;">
                        <img src="${splitImg}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div style="flex: 1; padding: 2rem; display: flex; align-items: center;" ${style}>
                        ${splitText}
                    </div>
                </div>`;

            case 'dynamic-images':
                const dynImages = content.images || [];
                return `<div style="margin: 2rem 0;">
                    ${dynImages.map((img: string) => img ? `<img src="${img}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 1rem;" />` : "").join('')}
                </div>`;

            default:
                console.warn(`Unknown block type for HTML conversion: ${type}`);
                return "";
        }
    }).join("\n");
}
