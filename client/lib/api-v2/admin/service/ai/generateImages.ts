import axios from "axios";

const AI_API_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

interface GenerateImagesResponse {
    urls: string[];
}

/**
 * Generate images using the Python AI Service.
 * @param prompt The visual prompt for the AI.
 * @param n Number of images to generate (default 1).
 */
export async function generateImages(prompt: string, n: number = 1): Promise<string[]> {
    try {
        const response = await axios.post<GenerateImagesResponse>(`${AI_API_URL}/generate-images`, {
            prompt,
            n
        });
        return response.data.urls;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
