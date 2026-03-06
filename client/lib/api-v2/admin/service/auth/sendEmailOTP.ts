"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export type SendEmailOTPRequest = {
  email: string;
};

export type SendEmailOTPResponse = {
  message: string;
};

/**
 * Send an OTP to the user's email address for verification.
 *
 * @param body The request body containing the user's email
 * @returns Axios response with a status message
 */
export async function sendEmailOTP(body: SendEmailOTPRequest): Promise<AxiosResponse<SendEmailOTPResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<SendEmailOTPResponse>("/v1/otp/email/send", body);
}
