import Link from "next/link";

interface RestaurantBreadcrumbProps {
    name?: string;
    homeHref?: string;
    homeLabel?: string;
}

export default function RestaurantBreadcrumb({
    name,
    homeHref = "/admin/restaurant",
    homeLabel = "Restaurant",
}: RestaurantBreadcrumbProps) {
    return (
        <p className="font-normal text-[16px] text-[#4b5563] tracking-[-0.5px] leading-[24px] mb-6">
            <Link href={homeHref} className="hover:text-[#c10007] transition-colors">{homeLabel}</Link>
            {name && (
                <>
                    {"  /  "}
                    <span className="text-gray-900 font-medium ml-2">
                        {name}
                    </span>
                </>
            )}
        </p>
    );
}
