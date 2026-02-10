import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EditSubscriptionClient from "./EditSubscriptionClient";
import { Loader2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function EditSubscriptionPage() {
    return (
        <Suspense fallback={
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
                <Skeleton className="h-10 w-64" />
                <div className="bg-white dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-[#2a2d3e] p-6 space-y-6">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        }>
            <EditSubscriptionClient />
        </Suspense>
    );
}
