"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleResource } from "@/lib/api-v2";
import LandingHeroGrid from './LandingHeroGrid';

interface HeroSlide {
    id: string;
    label: string;
    articles: ArticleResource[];
}

interface LandingHeroCarouselProps {
    slides: HeroSlide[];
    basePath?: string;
}

export default function LandingHeroCarousel({ slides, basePath }: LandingHeroCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Reset current slide when slides array changes significantly (e.g. category switch)
    useEffect(() => {
        setCurrent(0);
    }, [slides.length, slides[0]?.id]);

    // Auto-advance functionality
    useEffect(() => {
        if (isHovered || slides.length === 0) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 10000); // 10 seconds per slide

        return () => clearInterval(timer);
    }, [slides.length, isHovered]);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    if (!slides.length) return null;

    // Safety check: ensure current index is valid
    const activeSlide = slides[current] || slides[0];
    const safeCurrent = slides[current] ? current : 0;

    return (
        <div
            className="relative group mb-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Carousel Track */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${safeCurrent * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className="min-w-full px-1">
                            {/* Slide Label/Indicator within the grid context if needed, 
                                but we'll stick to the grid itself. 
                                We might want a header or just the grid. 
                                The grid doesn't currently include a header. 
                            */}
                            <LandingHeroGrid articles={slide.articles} basePath={basePath} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons (visible on hover) - Only if multiple slides */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-20 backdrop-blur-sm"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-20 backdrop-blur-sm"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Bottom Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {slides.map((slide, idx) => (
                            <button
                                key={slide.id}
                                onClick={() => setCurrent(idx)}
                                className={`h-1.5 rounded-full transition-colors duration-300 w-12 ${safeCurrent === idx
                                    ? "bg-[#cc0000]"
                                    : "bg-white/30 hover:bg-white/50"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Section Title Overlay (Optional - shows what section this is: News, Blogs, etc) */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest shadow-lg">
                    {activeSlide.label}
                </span>
            </div>
        </div>
    );
}
