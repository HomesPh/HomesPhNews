import { Block } from "@/hooks/useBlockEditor";
import { BlockType } from "@/hooks/useBlockEditor";

export const htmlToBlocks = (html: string): Block[] => {
    if (!html) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks: Block[] = [];

    // Helper to create a unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    let currentTextContent = "";

    const flushText = () => {
        if (currentTextContent.trim()) {
            blocks.push({
                id: generateId(),
                type: 'text',
                content: { text: currentTextContent },
                settings: { textAlign: 'left', fontSize: '18px' }
            });
        }
        currentTextContent = "";
    };

    const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Check specific text content
            const text = node.textContent;
            // Only add if it has non-whitespace content OR if we are inside a tag ensuring layout (captured via wrapper logic)
            // But since we are stripping wrappers when recursing, we rely on this.
            // We should trim to avoid " " blocks, but if it's a significant space between expected inline elements...
            // Block editor separates by blocks. Inline text in one block is handled by flush.
            // So treating " " as nothing is 99% correct for block conversion.
            if (text && text.trim().length > 0) {
                currentTextContent += `<p>${text}</p>`;
            }
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const tagName = element.tagName.toLowerCase();

            // Helper to get best Src
            const getSrc = (el: HTMLElement) => {
                let src = el.getAttribute('src') ||
                    el.getAttribute('data-src') ||
                    el.getAttribute('data-original') ||
                    el.getAttribute('data-url');

                // Fix relative URLs if possible (heuristic for uploaded content)
                // If it starts with /uploads, it might be needing the backend URL, but we don't have it here easily.
                // However, the browser handles relative URLs by appending to current origin.
                // Admin might be on different origin than public site?
                // We leave it as is, but ensure we don't return null.
                return src || "";
            };

            // 1. Direct Image
            if (tagName === 'img') {
                const src = getSrc(element);
                // Always add block if it's an image, even if src is empty (placeholder)
                // to let user know there was an image.
                flushText();
                blocks.push({
                    id: generateId(),
                    type: 'image',
                    content: {
                        src: src,
                        caption: element.getAttribute('alt') || element.getAttribute('title') || ""
                    },
                    settings: { textAlign: 'center' }
                });
                return;
            }

            // 2. Picture Tag (Extract img inside)
            if (tagName === 'picture') {
                const img = element.querySelector('img');
                if (img) {
                    const src = getSrc(img);
                    flushText();
                    blocks.push({
                        id: generateId(),
                        type: 'image',
                        content: {
                            src: src,
                            caption: img.getAttribute('alt') || img.getAttribute('title') || ""
                        },
                        settings: { textAlign: 'center' }
                    });
                    return;
                }
            }

            // 3. Figure with Image (Handle Caption)
            if (tagName === 'figure') {
                const img = element.querySelector('img');
                if (img) {
                    const src = getSrc(img);
                    flushText();
                    const captionEl = element.querySelector('figcaption');
                    blocks.push({
                        id: generateId(),
                        type: 'image',
                        content: {
                            src: src,
                            caption: captionEl ? captionEl.textContent || "" : (img.getAttribute('alt') || img.getAttribute('title') || "")
                        },
                        settings: { textAlign: 'center' }
                    });
                    return;
                }
            }

            // 4. Container with nested Image?
            // Use querySelectorAll to be sure we see it.
            if (element.querySelectorAll('img').length > 0) {
                // Descend recursively
                element.childNodes.forEach((child) => processNode(child));
            } else {
                // 5. No image inside -> Keep formatting (h1, p, div, etc)
                currentTextContent += element.outerHTML;
            }
        }
    };

    Array.from(doc.body.childNodes).forEach(processNode);
    flushText();

    return blocks;
};
