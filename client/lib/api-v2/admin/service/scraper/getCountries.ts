"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CountryResource } from "../../../types/CountryResource";

export async function getCountries(): Promise<AxiosResponse<CountryResource[]>> {
    return AXIOS_INSTANCE_ADMIN.get<CountryResource[]>("/v1/admin/countries");
}
