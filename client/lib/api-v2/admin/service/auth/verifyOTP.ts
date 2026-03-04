"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export type VerifyOTPRequest = {
  email: string;
  otp: string;
};

export type VerifyOTPResponse = {
  message: string;
};

/**
 * Verify OTP for the user's email.
 * 
 * @param body Verification data (email and otp)
 * @returns Axios response with status message
 */
export async function verifyOTP(body: VerifyOTPRequest): Promise<AxiosResponse<VerifyOTPResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<VerifyOTPResponse>("/v1/otp/verify", body);
}
