import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CityResource } from "../../../types/CityResource";

let citiesCache: Promise<AxiosResponse<CityResource[]>> | null = null;

export async function getCities(): Promise<AxiosResponse<CityResource[]>> {
    if (!citiesCache) {
        citiesCache = AXIOS_INSTANCE_ADMIN.get<CityResource[]>("/v1/admin/cities");
    }
    return citiesCache;
}
