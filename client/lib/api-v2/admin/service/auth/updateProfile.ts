"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { UserResource } from "../../../types/UserResource";
import type { AxiosResponse } from "axios";

export type UpdateProfilePayload = {
    first_name: string;
    last_name: string;
    avatar?: string | null;
};

export type UpdateProfileResponse = {
    data: UserResource;
};

/**
 * Update the authenticated user's profile
 * @param payload 
 * @returns 
 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<AxiosResponse<UpdateProfileResponse>> {
    const res = await AXIOS_INSTANCE_ADMIN.patch<UpdateProfileResponse>("/v1/user/profile", payload);
    return res;
}
