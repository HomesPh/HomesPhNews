"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ProvinceResource } from "../../../types/ProvinceResource";

let provincesCache: Promise<AxiosResponse<{ data: ProvinceResource[] }>> | null = null;

export async function getProvinces(): Promise<AxiosResponse<{ data: ProvinceResource[] }>> {
    if (!provincesCache) {
        provincesCache = AXIOS_INSTANCE_ADMIN.get<{ data: ProvinceResource[] }>("/v1/admin/provinces");
    }
    return provincesCache;
}
