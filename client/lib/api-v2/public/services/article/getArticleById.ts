"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { ArticleResource } from "../../../types/ArticleResource";
import type { AxiosResponse } from "axios";

export type ArticleByIdResponse = {
  data: ArticleResource;
}

export async function getArticleById(id: string): Promise<AxiosResponse<ArticleByIdResponse>> {
  return AXIOS_INSTANCE_PUBLIC.get<ArticleByIdResponse>(`/articles/${id}`);
}