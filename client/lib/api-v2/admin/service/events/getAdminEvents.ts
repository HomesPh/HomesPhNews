"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Event } from "../../../types/Event";

/**
 * List events
 * GET /admin/events
 */
export async function getAdminEvents(): Promise<AxiosResponse<Event[]>> {
  return AXIOS_INSTANCE_ADMIN.get<Event[]>("/v1/admin/events");
}

