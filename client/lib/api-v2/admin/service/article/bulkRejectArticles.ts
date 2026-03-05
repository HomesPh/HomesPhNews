import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Reject multiple articles at once
 * 
 * @param ids List of article IDs
 */
export const bulkRejectArticles = async (ids: string[]) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/articles/bulk-reject`, {
        ids
    });
};
