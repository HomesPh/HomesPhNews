"use client";

import { Suspense } from "react";
import SignUpForm from "@/components/features/admin/register/SignUpForm";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <Suspense fallback={<div>Loading...</div>}>
          {/* Re-using SignUpForm which has the OTP step builtin */}
          {/* In a real scenario we might want a more specialized component, 
              but SignUpForm handles the OTP state well. 
              The SignUpForm needs to be in 'signup-step2' mode to show OTP.
              Wait, SignUpForm manages its own mode state locally.
              I should probably create a simpler OtpForm or modify SignUpForm to accept an initial mode.
          */}
          <VerificationContent />
        </Suspense>
      </div>
    </div>
  );
}

function VerificationContent() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Verify Registration
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please enter the 6-digit code sent to your email.
        </p>
      </div>
      <SignUpForm initialMode="signup-step2" />
    </div>
  );
}
