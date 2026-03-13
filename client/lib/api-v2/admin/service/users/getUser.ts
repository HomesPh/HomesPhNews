import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import { UserResource } from "../../../types/UserResource";

/**
 * Fetch a single user by ID from the admin API.
 * GET /v2/users/{id}
 */
export async function getUser(id: string | number): Promise<AxiosResponse<{ data: UserResource }>> {
    return AXIOS_INSTANCE_ADMIN.get<{ data: UserResource }>(`/v2/users/${id}`);
}
