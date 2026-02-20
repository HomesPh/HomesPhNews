import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CityResource } from "../../../types/CityResource";

export interface CreateCityData {
    country_id: string;
    name: string;
    is_active?: boolean;
}

export async function createCity(data: CreateCityData): Promise<AxiosResponse<{ message: string; data: CityResource }>> {
    return AXIOS_INSTANCE_ADMIN.post("/v1/admin/cities", data);
}
