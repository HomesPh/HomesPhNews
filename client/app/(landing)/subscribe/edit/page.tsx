import { Suspense } from "react";
import EditSubscriptionClient from "./EditSubscriptionClient";
import { Loader2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function EditSubscriptionPage() {
    return (
        <Suspense fallback={<div>Loading Subscription...</div>}>
            <EditSubscriptionClient />
        </Suspense>
    );
}
