"use client";

import BlockEditor from "@/components/features/blogger/editor/BlockEditor";

export default function EditBlogPage({ params }: { params: { id: string } }) {
    // In a real app, we'd fetch the blog by ID and pass it to BlockEditor
    return (
        <div className="fixed inset-0 z-50 bg-white">
            <BlockEditor />
        </div>
    );
}
