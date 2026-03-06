"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { UserResource } from "../../../types/UserResource";
import type { AxiosResponse } from "axios";

export type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  token: string;
  user: UserResource;
  otp_expires_in: number;
};

/**
 * Register a new user and trigger OTP email.
 * 
 * @param body Registration data
 * @returns Axios response with registration data and token
 */
export async function register(body: RegisterRequest): Promise<AxiosResponse<RegisterResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<RegisterResponse>("/v1/auth/register", body);
}
