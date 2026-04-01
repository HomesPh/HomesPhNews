"use client";

import TemplateGenerator from "@/components/features/admin/articles/TemplateGenerator";

export default function CeoTemplateGeneratorPage() {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <TemplateGenerator isPage={true} />
        </div>
    );
}
