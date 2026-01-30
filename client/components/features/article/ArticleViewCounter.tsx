"use client";

import { useEffect } from "react";
import { incrementArticleViews } from "@/lib/api-v2";

interface ArticleViewCounterProps {
    articleId: string;
}

export default function ArticleViewCounter({ articleId }: ArticleViewCounterProps) {
    useEffect(() => {
        // 5 second timer
        const timer = setTimeout(() => {
            incrementArticleViews(articleId);
        }, 5000);

        return () => clearTimeout(timer);
    }, [articleId]);

    return null; // This component doesn't render anything
}
