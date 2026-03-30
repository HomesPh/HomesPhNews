"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { CityResource } from "../../../types/CityResource";

export async function getPublicCities(provinceId?: number): Promise<CityResource[]> {
    const params = provinceId ? { province_id: provinceId } : undefined;
    const response = await AXIOS_INSTANCE_PUBLIC.get<CityResource[] | { data: CityResource[] }>("/v1/cities", { params });
    const raw = response.data;
    return Array.isArray(raw) ? raw : (raw as any).data ?? [];
}
