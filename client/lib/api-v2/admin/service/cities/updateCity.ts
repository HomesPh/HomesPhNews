import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CityResource } from "../../../types/CityResource";

export interface UpdateCityData {
    country_id?: string;
    name?: string;
    is_active?: boolean;
}

export async function updateCity(id: number, data: UpdateCityData): Promise<AxiosResponse<{ message: string; data: CityResource }>> {
    return AXIOS_INSTANCE_ADMIN.put(`/v1/admin/cities/${id}`, data);
}
