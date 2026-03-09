import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

/**
 * Delete multiple articles at once
 * 
 * @param ids List of article IDs
 * @param hardDelete Whether to permanently delete from storage
 */
export const bulkDeleteArticles = async (ids: string[], hardDelete: boolean = false) => {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/articles/bulk-delete`, {
        ids,
        hard_delete: hardDelete
    });
};
