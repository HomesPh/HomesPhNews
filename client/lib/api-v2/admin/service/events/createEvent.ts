"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Event, CreateEventPayload } from "../../../types/Event";

/**
 * Create an event
 * POST /admin/events
 */
export async function createEvent(
  body: CreateEventPayload
): Promise<AxiosResponse<Event>> {
  return AXIOS_INSTANCE_ADMIN.post<Event>("/v1/admin/events", body);
}
