"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CEOPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/ceo/articles");
    }, [router]);

    return null;
}
