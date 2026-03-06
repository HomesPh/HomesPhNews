import { Suspense } from "react";
import RegisterForm from "@/components/features/admin/register/RegisterForm";

export default function AdminRegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] py-12 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
