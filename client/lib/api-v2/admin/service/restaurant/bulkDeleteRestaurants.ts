import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Delete multiple restaurants at once
 * 
 * @param ids List of restaurant IDs
 * @param hardDelete Whether to permanently delete
 */
export const bulkDeleteRestaurants = async (ids: string[], hardDelete = false) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/restaurants/bulk-delete`, {
        ids,
        hard_delete: hardDelete
    });
};
