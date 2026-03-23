import { CountryResource } from "./CountryResource";
import { ProvinceResource } from "./ProvinceResource";

export interface CityResource {
    city_id: number;
    country_id: string;
    province_id: string | number;
    name: string;
    is_active: boolean;
    country?: CountryResource;
    province?: ProvinceResource;
}
