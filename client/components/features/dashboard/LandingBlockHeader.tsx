"use client";

import React from 'react';

interface LandingBlockHeaderProps {
    title: string;
}

export default function LandingBlockHeader({ title }: LandingBlockHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b-2 border-gray-400 dark:border-gray-600 pb-1 mb-6">
            <div className="bg-[#1a1a1a] px-4 py-1">
                <h2 className="text-white text-xs font-black uppercase tracking-widest">{title}</h2>
            </div>
            <button className="bg-[#cc0000] text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter hover:bg-black transition-colors">
                More Posts
            </button>
        </div>
    );
}
