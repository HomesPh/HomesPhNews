"use client";

import BlockEditor from "@/components/features/blogger/editor/BlockEditor";

export default function CreateBlogPage() {
    return (
        <div className="fixed inset-0 z-50 bg-white">
            <BlockEditor />
        </div>
    );
}
