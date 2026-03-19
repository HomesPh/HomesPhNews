import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Unpublish multiple restaurants at once
 * 
 * @param ids List of restaurant IDs
 */
export const bulkUnpublishRestaurants = async (ids: string[]) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/restaurants/bulk-unpublish`, {
        ids
    });
};
