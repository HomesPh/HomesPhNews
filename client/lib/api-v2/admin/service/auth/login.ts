"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type UserResource from "../../../types/UserResource";
import type { AxiosResponse } from "axios";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: UserResource;
};

export async function login(body: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<LoginResponse>("/login", body);
}