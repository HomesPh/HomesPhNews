"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { UserResource } from "../../../types/UserResource";
import type { AxiosResponse } from "axios";

export type GetUserAuthResponse = {
  data: UserResource;
};

/**
 * Get the authenticated user
 * @returns 
 */
export async function getUser(): Promise<AxiosResponse<GetUserAuthResponse>> {
  const res = await AXIOS_INSTANCE_ADMIN.get<GetUserAuthResponse>("/user");
  return res;
}