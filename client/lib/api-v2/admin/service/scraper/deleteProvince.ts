"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export async function deleteProvince(id: number): Promise<AxiosResponse<void>> {
    return AXIOS_INSTANCE_ADMIN.delete<void>(`/v1/admin/provinces/${id}`);
}
