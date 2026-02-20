"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

/**
 * Delete an event
 * DELETE /admin/events/{event}
 */
export async function deleteEvent(
  eventId: number
): Promise<AxiosResponse<void>> {
  return AXIOS_INSTANCE_ADMIN.delete<void>(`/v1/admin/events/${eventId}`);
}

