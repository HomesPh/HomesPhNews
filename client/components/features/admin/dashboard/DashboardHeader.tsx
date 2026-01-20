interface DashboardHeaderProps {
    userName: string;
}

/**
 * DashboardHeader component for the admin dashboard
 */
export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    return (
        <div className="mb-8">
            {/* Title */}
            <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-[36px]">Dashboard</h1>

            {/* Subtitle/Welcome Message */}
            <p className="text-[14px] text-[#4b5563] mt-1 tracking-[-0.5px] leading-[20px]">
                Welcome back, {userName}. Here's what's happening today.
            </p>
        </div>
    );
}
