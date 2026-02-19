"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface UploadArticleImageResponse {
  message: string;
  url: string;
  filename: string;
  path: string;
}

/**
 * Handle image upload for articles
 * POST /admin/upload/image
 */
export async function uploadArticleImage(
  image: File
): Promise<AxiosResponse<UploadArticleImageResponse>> {
  const formData = new FormData();
  formData.append("image", image);

  return AXIOS_INSTANCE_ADMIN.post<UploadArticleImageResponse>(
    "/v1/admin/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}

