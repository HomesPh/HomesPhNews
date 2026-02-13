"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CountryResource, CountryPayload } from "../../../types/CountryResource";

export async function createCountry(payload: CountryPayload): Promise<AxiosResponse<CountryResource>> {
    return AXIOS_INSTANCE_ADMIN.post<CountryResource>("/v1/admin/countries", payload);
}
