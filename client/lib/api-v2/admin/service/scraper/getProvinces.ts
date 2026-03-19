"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ProvinceResource } from "../../../types/ProvinceResource";

let provincesCache: Promise<AxiosResponse<{ data: ProvinceResource[] }>> | null = null;

export async function getProvinces(forceRefresh = false): Promise<AxiosResponse<{ data: ProvinceResource[] }>> {
    if (!provincesCache || forceRefresh) {
        provincesCache = AXIOS_INSTANCE_ADMIN.get<{ data: ProvinceResource[] }>("/v1/admin/provinces");
    }
    return provincesCache;
}

export function clearProvincesCache() {
    provincesCache = null;
}
