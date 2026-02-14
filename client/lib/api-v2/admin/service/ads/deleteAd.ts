import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";

export const deleteAd = async (id: number) => {
  const response = await AXIOS_INSTANCE_ADMIN.delete(`/v1/admin/ads/${id}`);
  return response;
};
