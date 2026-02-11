import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";

export const deleteCampaign = async (id: number) => {
  const response = await AXIOS_INSTANCE_ADMIN.delete(`/admin/campaigns/${id}`);
  return response;
};
