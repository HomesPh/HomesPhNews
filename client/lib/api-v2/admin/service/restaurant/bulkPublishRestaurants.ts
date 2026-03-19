import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Approve and publish multiple restaurants at once
 * 
 * @param ids List of restaurant IDs
 * @param publishedSites List of site names to publish to
 */
export const bulkPublishRestaurants = async (ids: string[], publishedSites: string[]) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/restaurants/bulk-publish`, {
        ids,
        published_sites: publishedSites
    });
};
