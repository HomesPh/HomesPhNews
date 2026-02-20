import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Send multiple articles as a newsletter to subscribers
 * 
 * @param ids List of article IDs (UUIDs)
 * @param subscriberIds Optional list of specific subscriber IDs
 * @returns Response data
 */
export const bulkSendNewsletter = async (ids: string[], subscriberIds?: string[]) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/articles/bulk-send-newsletter`, {
        article_ids: ids,
        subscriber_ids: subscriberIds
    });
};
