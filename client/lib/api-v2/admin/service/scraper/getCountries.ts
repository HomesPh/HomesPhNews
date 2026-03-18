"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { CountryResource } from "../../../types/CountryResource";

let countriesCache: Promise<AxiosResponse<CountryResource[]>> | null = null;

export async function getCountries(): Promise<AxiosResponse<CountryResource[]>> {
    if (!countriesCache) {
        countriesCache = AXIOS_INSTANCE_ADMIN.get<CountryResource[]>("/v1/admin/countries");
    }
    return countriesCache;
}
