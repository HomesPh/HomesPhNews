
import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface SubscriptionData {
  email: string;
  category: string | string[];
  country: string | string[];
  features?: string;
  time?: string;
}

export interface GetSubscriptionResponse extends SubscriptionData {
  id: string;
}

export interface UpdateSubscriptionRequest {
  categories: string[];
  countries: string[];
  features?: string;
  time?: string;
}

/**
 * Get subscription by ID
 * GET /subscribe/:id
 */
export async function getSubscriptionById(
  id: string
): Promise<AxiosResponse<GetSubscriptionResponse>> {
  return AXIOS_INSTANCE_PUBLIC.get<GetSubscriptionResponse>(`/subscribe/${id}`);
}

/**
 * Update subscription preferences
 * PATCH /subscribe/:id
 */
export async function updateSubscription(
  id: string,
  data: UpdateSubscriptionRequest
): Promise<AxiosResponse<GetSubscriptionResponse>> {
  return AXIOS_INSTANCE_PUBLIC.patch<GetSubscriptionResponse>(`/subscribe/${id}`, data);
}
