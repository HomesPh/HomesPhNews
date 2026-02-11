import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import { Campaign } from "@/lib/api-v2/types/Campaign";

export const createCampaign = async (data: Partial<Campaign>) => {
  const response = await AXIOS_INSTANCE_ADMIN.post<Campaign>("/admin/campaigns", data);
  return response;
};
