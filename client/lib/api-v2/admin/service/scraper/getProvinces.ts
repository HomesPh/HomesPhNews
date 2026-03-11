"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ProvinceResource } from "../../../types/ProvinceResource";

export async function getProvinces(): Promise<AxiosResponse<{ data: ProvinceResource[] }>> {
    return AXIOS_INSTANCE_ADMIN.get<{ data: ProvinceResource[] }>("/v1/admin/provinces");
}
