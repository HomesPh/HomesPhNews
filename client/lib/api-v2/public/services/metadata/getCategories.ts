import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { CategoryResource } from "../../../types/CategoryResource";

export async function getPublicCategories(): Promise<CategoryResource[]> {
    const response = await AXIOS_INSTANCE_PUBLIC.get<CategoryResource[]>("/v1/categories");
    return response.data;
}
