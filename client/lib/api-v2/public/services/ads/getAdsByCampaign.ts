import AXIOS_INSTANCE_PUBLIC from "@/lib/api-v2/public/axios-instance";
import { Ad } from "@/lib/api-v2/types/Ad";

export const getAdsByCampaign = async (campaign: string) => {
  const response = await AXIOS_INSTANCE_PUBLIC.get<{
    name: string;
    ads: Ad[];
  }>(`/v1/ads/${campaign}`);
  return response.data;
};
