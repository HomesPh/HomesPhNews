import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import { Ad } from "@/lib/api-v2/types/Ad";

export const updateAd = async (id: number, data: Partial<Ad>) => {
  const response = await AXIOS_INSTANCE_ADMIN.put<Ad>(`/admin/ads/${id}`, data);
  return response;
};
