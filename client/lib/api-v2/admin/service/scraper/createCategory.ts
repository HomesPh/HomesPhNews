"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CategoryResource, CategoryPayload } from "../../../types/CategoryResource";

export async function createCategory(payload: CategoryPayload): Promise<AxiosResponse<CategoryResource>> {
    return AXIOS_INSTANCE_ADMIN.post<CategoryResource>("/v1/admin/categories", payload);
}
