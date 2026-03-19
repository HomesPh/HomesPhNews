import { CountryResource } from "./CountryResource";

export interface CityResource {
    city_id: number;
    country_id: string;
    province_id: string | number;
    name: string;
    is_active: boolean;
    country?: CountryResource;
}
