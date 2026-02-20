"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Event } from "../../../types/Event";

export interface CreateEventRequest {
  event_title: string;
  date: string; // date-time
  time?: string | null;
  location?: string | null;
  description?: string | null;
}

/**
 * Create an event
 * POST /admin/events
 */
export async function createEvent(
  body: CreateEventRequest
): Promise<AxiosResponse<Event>> {
  return AXIOS_INSTANCE_ADMIN.post<Event>("/v1/admin/events", body);
}

