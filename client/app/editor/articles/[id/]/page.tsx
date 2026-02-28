"use client";

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ArticleDetail from "@/components/features/admin/articles/ArticleDetail";

export default function EditorArticleDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    return (
        <Suspense fallback={<div className="p-20 text-center text-[#6b7280]">Loading article details...</div>}>
            {id ? (
                <ArticleDetail id={id} />
            ) : (
                <div className="p-20 text-center text-[#6b7280]">Invalid article ID.</div>
            )}
        </Suspense>
    );
}
