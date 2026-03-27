"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { ProvinceResource } from "../../../types/ProvinceResource";

export async function getPublicProvinces(countryId?: string): Promise<ProvinceResource[]> {
    const params = countryId ? { country_id: countryId } : undefined;
    const response = await AXIOS_INSTANCE_PUBLIC.get<ProvinceResource[] | { data: ProvinceResource[] }>("/v1/provinces", { params });
    const raw = response.data;
    return Array.isArray(raw) ? raw : (raw as any).data ?? [];
}
