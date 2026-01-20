import { FileText, BarChart3, Calendar, Plus } from 'lucide-react';

/**
 * QuickActions component providing shortcuts to common admin tasks
 */
export default function QuickActions() {
    const actions = [
        { label: "Manage Articles", icon: FileText, href: "/admin/articles" },
        { label: "Create New Article", icon: Plus, href: "/admin/articles/create" },
        { label: "View Analytics", icon: BarChart3, href: "/admin/analytics" },
        { label: "Schedule Event", icon: Calendar, href: "/admin/calendar" },
    ];

    return (
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
            {/* Component Title */}
            <h2 className="text-[18px] font-bold text-[#111827] mb-4 tracking-[-0.5px]">Quick Actions</h2>

            {/* Action Buttons List */}
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-[#f9fafb] transition-colors"
                    >
                        <action.icon className="w-4 h-4 text-[#111827]" />
                        <span className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
