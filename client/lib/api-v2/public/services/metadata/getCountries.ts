import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { CountryResource } from "../../../types/CountryResource";

export async function getPublicCountries(): Promise<CountryResource[]> {
    const response = await AXIOS_INSTANCE_PUBLIC.get<CountryResource[]>("/v1/countries");
    return response.data;
}
