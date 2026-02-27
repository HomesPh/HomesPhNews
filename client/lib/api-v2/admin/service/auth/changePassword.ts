"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export type ChangePasswordPayload = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};

export type ChangePasswordResponse = {
    message: string;
};

/**
 * Change the authenticated user's password
 * @param payload 
 * @returns 
 */
export async function changePassword(payload: ChangePasswordPayload): Promise<AxiosResponse<ChangePasswordResponse>> {
    const res = await AXIOS_INSTANCE_ADMIN.patch<ChangePasswordResponse>("/v1/user/password", payload);
    return res;
}
