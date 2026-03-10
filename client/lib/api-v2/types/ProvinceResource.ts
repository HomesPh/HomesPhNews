import { CountryResource } from "./CountryResource";

export interface ProvinceResource {
    id: number;
    country_id: string;
    name: string;
    is_active: boolean;
    country?: CountryResource;
}
