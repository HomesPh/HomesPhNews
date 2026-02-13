"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Event } from "../../../types/Event";

/**
 * Get a single event
 * GET /admin/events/{event}
 */
export async function getEventById(
  eventId: number
): Promise<AxiosResponse<Event>> {
  return AXIOS_INSTANCE_ADMIN.get<Event>(`/v1/admin/events/${eventId}`);
}

