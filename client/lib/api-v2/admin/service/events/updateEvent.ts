"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Event, CreateEventPayload } from "../../../types/Event";

/**
 * Update an event
 * PUT /admin/events/{event}
 */
export async function updateEvent(
  eventId: number,
  body: Partial<CreateEventPayload>
): Promise<AxiosResponse<Event>> {
  return AXIOS_INSTANCE_ADMIN.put<Event>(`/v1/admin/events/${eventId}`, body);
}
