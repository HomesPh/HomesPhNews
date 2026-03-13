"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

export type GenerateImageRequest = {
    prompt: string;
    options?: {
        count?: number;
        quality?: string;
        aspect_ratio?: "square" | string;
        timeout?: number;
        disk?: string;
        directory?: string;
    };
};

export type GenerateImageResponse = {
    status: "success" | string;
    data: {
        urls: string[];
    };
};

/**
 * Generate images using the admin API.
 * POST /api/v1/admin/generate/image
 */
export async function generateImages(
    prompt: string,
    n: number = 1
): Promise<string[]> {
    const body: GenerateImageRequest = {
        prompt,
        options: { count: n }
    };

    const response = await AXIOS_INSTANCE_ADMIN.post<GenerateImageResponse>(
        "/v1/admin/generate/image",
        body
    );

    return response.data.data.urls;
}
