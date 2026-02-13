import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import { Ad } from "@/lib/api-v2/types/Ad";

export const getAds = async (page: number = 1) => {
  const response = await AXIOS_INSTANCE_ADMIN.get<Ad[]>("/v1/admin/ads", {
    params: { page },
  });
  return response;
};
