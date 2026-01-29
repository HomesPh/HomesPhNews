"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Event } from "../../../types/Event";

export interface UpdateEventRequest {
  event_title?: string | null;
  date?: string | null; // date-time
  time?: string | null;
  location?: string | null;
  description?: string | null;
}

/**
 * Update an event
 * PUT /admin/events/{event}
 */
export async function updateEvent(
  eventId: number,
  body: UpdateEventRequest
): Promise<AxiosResponse<Event>> {
  return AXIOS_INSTANCE_ADMIN.put<Event>(`/admin/events/${eventId}`, body);
}

