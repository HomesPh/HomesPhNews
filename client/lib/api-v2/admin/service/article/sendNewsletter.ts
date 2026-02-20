import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Send a specific article as a newsletter to relevant subscribers
 * 
 * @param id The article ID (UUID)
 * @returns Response data with status counts
 */
export const sendNewsletter = async (id: string, subscriberIds?: string[]) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/articles/${id}/send-newsletter`, {
        subscriber_ids: subscriberIds
    });
};
