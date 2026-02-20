import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

export interface MailingListStats {
    stats: {
        total_broadcasts: number;
        total_recipients: number;
        total_subscribers: number;
    };
    recent_broadcasts: Array<{
        id: string;
        article_count: number;
        recipient_count: number;
        status: string;
        sent_at: string;
    }>;
}

/**
 * Get mailing list specific analytics
 */
export const getMailingListStats = async () => {
    return AXIOS_INSTANCE_ADMIN.get<MailingListStats>('/v1/admin/analytics/mailing-list');
};
