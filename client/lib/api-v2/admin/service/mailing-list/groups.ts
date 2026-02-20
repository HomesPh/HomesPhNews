import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

export interface MailingListGroup {
    id: string;
    name: string;
    description?: string;
    subscribers_count: number;
    subscribers?: Array<{
        sub_Id: string;
        email: string;
    }>;
    created_at: string;
}

export const getMailingListGroups = async () => {
    return AXIOS_INSTANCE_ADMIN.get<{ data: MailingListGroup[] }>('/v1/admin/mailing-list-groups');
};

export const createMailingListGroup = async (data: { name: string; description?: string; subscriber_ids: string[] }) => {
    return AXIOS_INSTANCE_ADMIN.post<{ message: string; data: MailingListGroup }>('/v1/admin/mailing-list-groups', data);
};

export const getMailingListGroupDetails = async (id: string) => {
    return AXIOS_INSTANCE_ADMIN.get<{ data: MailingListGroup }>(`/v1/admin/mailing-list-groups/${id}`);
};

export const deleteMailingListGroup = async (id: string) => {
    return AXIOS_INSTANCE_ADMIN.delete(`/v1/admin/mailing-list-groups/${id}`);
};
