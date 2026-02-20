import { cn } from "@/lib/utils";

export type StatusType = 'published' | 'pending' | 'pending review' | 'rejected' | 'active' | 'inactive' | 'suspended' | 'deleted';

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

/**
 * StatusBadge component for consistent status labels across the admin panel
 */
export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const statusConfig = {
        published: {
            label: 'Published',
            bgColor: '#d1fae5',
            textColor: '#065f46',
            borderColor: '#b9f6ca',
        },
        active: {
            label: 'Active',
            bgColor: '#d1fae5',
            textColor: '#065f46',
            borderColor: '#b9f6ca',
        },
        pending: {
            label: 'Pending Review',
            bgColor: '#fef9c3', // Soft Yellow
            textColor: '#9a3412', // Deep Orange
            borderColor: '#fef08a',
        },
        'pending review': {
            label: 'Pending Review',
            bgColor: '#fef9c3',
            textColor: '#9a3412',
            borderColor: '#fef08a',
        },
        rejected: {
            label: 'Rejected',
            bgColor: '#fee2e2',
            textColor: '#991b1b',
            borderColor: '#fecaca',
        },
        deleted: {
            label: 'Deleted',
            bgColor: '#f3f4f6',
            textColor: '#6b7280',
            borderColor: '#e5e7eb',
        },
        inactive: {
            label: 'Inactive',
            bgColor: '#f3f4f6',
            textColor: '#374151',
            borderColor: '#e5e7eb',
        },
        draft: {
            label: 'Pending Review',
            bgColor: '#fef9c3', // Soft Yellow (Match pending)
            textColor: '#9a3412', // Deep Orange
            borderColor: '#fef08a',
        },
        suspended: {
            label: 'Suspended',
            bgColor: '#fee2e2',
            textColor: '#991b1b',
            borderColor: '#fecaca',
        },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-[4px] text-[12px] font-medium tracking-[-0.5px] border",
                className
            )}
            style={{
                backgroundColor: config.bgColor,
                color: config.textColor,
                borderColor: config.borderColor,
            }}
        >
            {config.label}
        </span>
    );
}
