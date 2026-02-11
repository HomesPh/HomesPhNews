import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import { Campaign } from "@/lib/api-v2/types/Campaign";

export const getCampaigns = async (page: number = 1) => {
  const response = await AXIOS_INSTANCE_ADMIN.get<Campaign[]>("/admin/campaigns", {
    params: { page },
  });
  return response;
};
