"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import { AxiosResponse } from "axios";

export type LogoutResponse = {
  message: string;
};

/**
 * Logout the authenticated user
 * @param body 
 * @returns 
 */
export async function logout(): Promise<AxiosResponse<LogoutResponse>> {
  const res = await AXIOS_INSTANCE_ADMIN.post<LogoutResponse>("/v1/logout");

  // remove from localstorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");

  return res;
}