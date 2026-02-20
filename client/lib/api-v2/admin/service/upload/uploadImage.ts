"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface UploadImageResponse {
  message: string;
  url: string;
  filename: string;
  path: string;
}

/**
 * Handle generic image upload
 * POST /admin/upload/image
 */
export async function uploadImage(
  image: File
): Promise<AxiosResponse<UploadImageResponse>> {
  const formData = new FormData();
  formData.append("image", image);

  return AXIOS_INSTANCE_ADMIN.post<UploadImageResponse>(
    "/v1/admin/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    }
  );
}
