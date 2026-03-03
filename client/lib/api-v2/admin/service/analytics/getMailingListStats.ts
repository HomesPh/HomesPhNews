import AXIOS_INSTANCE_ADMIN from "../../axios-instance";

export interface MailingListStats {
    stats: {
        total_broadcasts: number;
        total_recipients: number;
        total_subscribers: number;
    };
    recent_broadcasts: Array<{
        id: string;
        article_ids: string[];
        article_count: number;
        articles: Array<{
            id: string;
            title: string | null;
            category: string | null;
            country: string | null;
            image: string | null;
        }>;
        recipient_count: number;
        recipients: Array<{
            email: string;
            status: string;
        }>;
        status: string;
        type: string | null;
        sent_at: string;
    }>;
}

/**
 * Get mailing list specific analytics
 */
export const getMailingListStats = async () => {
    return AXIOS_INSTANCE_ADMIN.get<MailingListStats>('/v1/admin/analytics/mailing-list');
};
