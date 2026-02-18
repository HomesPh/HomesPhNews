import { Suspense } from "react";
import LoginForm from "@/components/features/admin/login/LoginForm";

export default function AdminLoginPage() {
    return (
        <main className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f5f5] p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
