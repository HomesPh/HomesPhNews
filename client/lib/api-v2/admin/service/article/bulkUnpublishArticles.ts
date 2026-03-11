import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Unpublish multiple articles at once
 * 
 * @param ids List of article IDs
 */
export const bulkUnpublishArticles = async (ids: string[]) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/articles/bulk-unpublish`, {
        ids
    });
};
