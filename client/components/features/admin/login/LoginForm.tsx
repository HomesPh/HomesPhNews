"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loginData } from "@/app/admin/login/data";
import LoginHeader from "./LoginHeader";
import SignInForm from "./SignInForm";

export default function LoginForm() {
    return (
        <Card className="w-full max-w-md shadow-lg border-none bg-white">
            <CardHeader>
                <LoginHeader
                    logo={loginData.logo}
                    title={loginData.title}
                    subtitle={loginData.subtitle}
                />
            </CardHeader>

            <CardContent className="space-y-6">


                <SignInForm
                    fields={loginData.fields}
                    submitLabel={loginData.submitButtonLabel}
                    demoCredentials={{
                        email: loginData.demoCredentials.email,
                        password: loginData.demoCredentials.password
                    }}
                />
            </CardContent>
        </Card>
    );
}
