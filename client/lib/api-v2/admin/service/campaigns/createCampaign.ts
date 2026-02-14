import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import { Campaign } from "@/lib/api-v2/types/Campaign";

export const createCampaign = async (data: Partial<Campaign> & { ads?: number[] }) => {
  const response = await AXIOS_INSTANCE_ADMIN.post<Campaign>("/v1/admin/campaigns", data);
  return response;
};
