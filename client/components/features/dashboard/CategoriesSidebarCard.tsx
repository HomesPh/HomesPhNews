"use client";

import React from 'react';
import Link from 'next/link';
import { Categories } from "@/app/data";

export default function CategoriesSidebarCard() {
    return (
        <section>
            <div className="bg-[#cc0000] px-4 py-1 mb-6">
                <h3 className="text-white text-xs font-black uppercase tracking-widest">Categories</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
                {Categories.filter(cat => cat.id !== "All").map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/?category=${encodeURIComponent(cat.id)}`}
                        className="flex items-center justify-between py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#cc0000] transition-colors text-left"
                    >
                        <span>{cat.label}</span>
                        <span className="text-gray-300">(12)</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
