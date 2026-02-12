"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CategoryResource, CategoryPayload } from "../../../types/CategoryResource";

export async function updateCategory(id: number, payload: Partial<CategoryPayload>): Promise<AxiosResponse<CategoryResource>> {
    return AXIOS_INSTANCE_ADMIN.patch<CategoryResource>(`/admin/categories/${id}`, payload);
}
