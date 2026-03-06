import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import { UserResource } from "../../../types/UserResource";

export interface GetUsersParams {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface GetUsersResponse {
    data: UserResource[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
}

/**
 * Fetch paginated list of users from the admin API.
 * GET /v2/users
 */
export async function getUsers(
    params: GetUsersParams = {}
): Promise<AxiosResponse<GetUsersResponse>> {
    return AXIOS_INSTANCE_ADMIN.get<GetUsersResponse>("/v2/users", { params });
}
