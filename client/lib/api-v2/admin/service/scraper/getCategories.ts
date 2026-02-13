"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CategoryResource } from "../../../types/CategoryResource";

export async function getCategories(): Promise<AxiosResponse<CategoryResource[]>> {
    return AXIOS_INSTANCE_ADMIN.get<CategoryResource[]>("/v1/admin/categories");
}
