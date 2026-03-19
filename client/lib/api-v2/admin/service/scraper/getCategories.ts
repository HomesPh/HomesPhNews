"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CategoryResource } from "../../../types/CategoryResource";

let categoriesCache: Promise<AxiosResponse<CategoryResource[]>> | null = null;

export async function getCategories(): Promise<AxiosResponse<CategoryResource[]>> {
    if (!categoriesCache) {
        categoriesCache = AXIOS_INSTANCE_ADMIN.get<CategoryResource[]>("/v1/admin/categories");
    }
    return categoriesCache;
}
