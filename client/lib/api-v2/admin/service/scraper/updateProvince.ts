"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ProvinceResource } from "../../../types/ProvinceResource";

export async function updateProvince(id: number, payload: Partial<ProvinceResource>): Promise<AxiosResponse<ProvinceResource>> {
    return AXIOS_INSTANCE_ADMIN.put<ProvinceResource>(`/v1/admin/provinces/${id}`, payload);
}
