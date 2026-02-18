"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import { UserResource } from "../../../types/UserResource";

export interface CreateUserRequest {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

export interface CreateUserResponse {
    data: UserResource;
}

/**
 * Create a new user via the admin API.
 * POST /v2/users
 */
export async function createUser(
    body: CreateUserRequest
): Promise<AxiosResponse<UserResource>> {
    return AXIOS_INSTANCE_ADMIN.post<UserResource>("/v2/users", body);
}
