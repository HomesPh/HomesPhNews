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
  const res = await AXIOS_INSTANCE_ADMIN.post<LoginResponse>("/login", body);

  const token = res?.data?.access_token;
  if (typeof window !== "undefined" && token) {
    try {
      localStorage.setItem("access_token", token);
      localStorage.setItem("token", token);

      // also set a cookie so withCredentials requests can use it if needed
      document.cookie = `access_token=${encodeURIComponent(token)}; path=/`;
    } catch (e) {
      // ignore storage errors
    }
  }

  console.log("Login response:", res);

  return res;
}