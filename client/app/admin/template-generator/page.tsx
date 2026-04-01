"use client";

import TemplateGenerator from "@/components/features/admin/articles/TemplateGenerator";
import { useEffect, useState } from "react";

export default function AdminTemplateGeneratorPage() {
    const [height, setHeight] = useState("calc(100vh - 89px)");

    useEffect(() => {
        const updateHeight = () => {
            const header = document.querySelector('header');
            if (header) {
                const availableHeight = window.innerHeight - header.getBoundingClientRect().height;
                setHeight(`${availableHeight}px`);
            }
        };
        
        // Initial setup
        updateHeight();
        
        // Prevent body scrolling
        document.body.style.overflow = "hidden";
        
        window.addEventListener("resize", updateHeight);
        return () => {
            window.removeEventListener("resize", updateHeight);
            // Restore normal body flow when leaving the page
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white" style={{ height }}>
            <TemplateGenerator isPage={true} />
        </div>
    );
}
