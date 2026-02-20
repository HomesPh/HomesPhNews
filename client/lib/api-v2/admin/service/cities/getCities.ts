import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CityResource } from "../../../types/CityResource";

export async function getCities(): Promise<AxiosResponse<CityResource[]>> {
    return AXIOS_INSTANCE_ADMIN.get<CityResource[]>("/v1/admin/cities");
}
