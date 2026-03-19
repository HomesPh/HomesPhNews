import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Reject multiple restaurants at once
 * 
 * @param ids List of restaurant IDs
 */
export const bulkRejectRestaurants = async (ids: string[]) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/restaurants/bulk-reject`, {
        ids
    });
};
