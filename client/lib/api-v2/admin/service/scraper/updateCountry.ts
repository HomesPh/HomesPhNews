"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CountryResource, CountryPayload } from "../../../types/CountryResource";

export async function updateCountry(id: string, payload: Partial<CountryPayload>): Promise<AxiosResponse<CountryResource>> {
    return AXIOS_INSTANCE_ADMIN.patch<CountryResource>(`/v1/admin/countries/${id}`, payload);
}
