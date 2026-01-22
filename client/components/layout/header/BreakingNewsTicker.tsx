"use client";

import { useEffect, useRef } from "react";

interface BreakingNewsTickerProps {
    items: string[];
}

export default function BreakingNewsTicker({ items }: BreakingNewsTickerProps) {
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ticker = tickerRef.current;
        if (!ticker || items.length === 0) return;

        let position = 0;
        const speed = 1; // pixels per frame

        const animate = () => {
            position -= speed;

            // Reset when first set of items has scrolled completely
            if (Math.abs(position) >= ticker.scrollWidth / 2) {
                position = 0;
            }

            ticker.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [items]);

    const duplicatedItems = [...items, ...items, ...items, ...items];

    return (
        <div className="bg-[#c10007] h-[48px] relative shrink-0 w-full overflow-hidden flex items-center">
            <div className="bg-[#c10007] z-10 px-4 md:px-[110px] h-full flex items-center shrink-0">
                <p className="font-semibold text-[16px] text-white tracking-[-0.5px] whitespace-nowrap">
                    BREAKING NEWS
                </p>
            </div>
            <div
                ref={tickerRef}
                className="flex gap-[20px] items-center h-full whitespace-nowrap"
                style={{ willChange: 'transform' }}
            >
                {duplicatedItems.map((item, index) => (
                    <div key={index} className="flex gap-[20px] items-center shrink-0">
                        <p className="font-normal text-[16px] text-white tracking-[-0.5px]">
                            •
                        </p>
                        <p className="font-normal text-[16px] text-white tracking-[-0.5px]">
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
