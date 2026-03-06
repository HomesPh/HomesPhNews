"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loginData } from "@/app/(auth)/login/data";
import RegisterHeader from "./RegisterHeader";
import SignUpForm from "./SignUpForm";

export default function RegisterForm() {
  return (
    <Card className="w-full max-w-md shadow-lg border-none bg-white gap-0">
      <CardHeader>
        <RegisterHeader
          logo={loginData.logo}
          title="Create Account"
          subtitle="Join HomesTV to explore more real estate news"
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
