import { Suspense } from "react";
import LoginForm from "@/components/features/admin/login/LoginForm";

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] py-12 px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
