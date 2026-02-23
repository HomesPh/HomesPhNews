import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export async function deleteCity(id: number): Promise<AxiosResponse<{ message: string }>> {
    return AXIOS_INSTANCE_ADMIN.delete(`/v1/admin/cities/${id}`);
}
