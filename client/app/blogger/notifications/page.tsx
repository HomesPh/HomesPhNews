"use client";

import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Bell, CheckCircle, MessageSquare, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'success',
        title: 'Blog Published Successfully',
        message: 'Your blog "10 Properties in Manila" is now live on FilipinoHomes.',
        time: '2 hours ago',
        icon: CheckCircle,
        color: 'text-green-600 bg-green-50'
    },
    {
        id: 2,
        type: 'engagement',
        title: 'New Milestone Reached!',
        message: 'Your post "Singapore Condo Living" has reached 1,000 views.',
        time: '5 hours ago',
        icon: TrendingUp,
        color: 'text-blue-600 bg-blue-50'
    },
    {
        id: 3,
        type: 'comment',
        title: 'New Comment',
        message: 'John Doe commented on your recent post.',
        time: '1 day ago',
        icon: MessageSquare,
        color: 'text-purple-600 bg-purple-50'
    },
    {
        id: 4,
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Feb 15th from 2:00 AM to 4:00 AM.',
        time: '2 days ago',
        icon: Info,
        color: 'text-amber-600 bg-amber-50'
    }
];

export default function BloggerNotificationsPage() {
    return (
        <div className="p-8 space-y-8">
            <AdminPageHeader
                title="Notifications"
                description="Stay updated with your blog performance and community activity."
            />

            <div className="max-w-[800px] space-y-4">
                {MOCK_NOTIFICATIONS.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-gray-200 transition-all cursor-pointer group">
                        <div className={cn("p-3 rounded-xl", item.color)}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-[#C10007] transition-colors">{item.title}</h3>
                                <span className="text-xs text-gray-400 font-medium">{item.time}</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{item.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
