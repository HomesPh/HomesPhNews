import { FileText, BarChart3, Plus, User } from 'lucide-react';
import Link from 'next/link';

/**
 * BloggerQuickActions component providing shortcuts to common blogger tasks
 */
export default function BloggerQuickActions() {
    const actions = [
        { label: "View All Blogs", icon: FileText, href: "/blogger/blogs" },
        { label: "Create New Blog", icon: Plus, href: "/blogger/blogs/create" },
        { label: "View Analytics", icon: BarChart3, href: "/blogger/analytics" },
        { label: "Update Profile", icon: User, href: "/blogger/settings" },
    ];

    return (
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
            {/* Component Title */}
            <h2 className="text-[18px] font-bold text-[#111827] mb-4 tracking-[-0.5px]">Quick Actions</h2>

            {/* Action Buttons List */}
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-[#f9fafb] transition-colors"
                    >
                        <action.icon className="w-4 h-4 text-[#111827]" />
                        <span className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
