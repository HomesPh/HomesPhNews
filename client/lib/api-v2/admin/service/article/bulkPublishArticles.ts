import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Approve and publish multiple articles at once
 * 
 * @param ids List of article IDs
 * @param publishedSites List of site names to publish to
 */
export const bulkPublishArticles = async (ids: string[], publishedSites: string[]) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/articles/bulk-publish`, {
        ids,
        published_sites: publishedSites
    });
};
