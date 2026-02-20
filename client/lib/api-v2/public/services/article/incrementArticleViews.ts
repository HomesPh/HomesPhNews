"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { AxiosResponse } from "axios";

export async function incrementArticleViews(id: string): Promise<AxiosResponse<void>> {
  return AXIOS_INSTANCE_PUBLIC.post<void>(`/v1/articles/${id}/view`);
}
