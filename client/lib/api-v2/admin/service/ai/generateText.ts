"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export type GenerateTextRequest = {
  prompt: string;
  options?: {
    instructions?: string;
  };
};

export type GenerateTextResponse = {
  status: "success" | string;
  data: {
    text: string;
  };
};

/**
 * Generate text using the admin API.
 * POST /api/v1/admin/generate/text
 */
export async function generateText(
  body: GenerateTextRequest
): Promise<AxiosResponse<GenerateTextResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<GenerateTextResponse>(
    "/v1/admin/generate/text",
    body
  );
}

