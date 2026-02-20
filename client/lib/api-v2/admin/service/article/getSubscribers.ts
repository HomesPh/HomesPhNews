import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

export interface Subscriber {
    sub_Id: string;
    email: string;
    category: string[] | string;
    country: string[] | string;
}

/**
 * Get all subscribers for manual newsletter selection
 */
export const getSubscribersList = async () => {
    return AXIOS_INSTANCE_ADMIN.get<{ data: Subscriber[] }>('/v1/admin/subscribers');
};
