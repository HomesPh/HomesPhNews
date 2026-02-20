import { CountryResource } from "./CountryResource";

export interface CityResource {
    city_id: number;
    country_id: string;
    name: string;
    is_active: boolean;
    country?: CountryResource;
}
