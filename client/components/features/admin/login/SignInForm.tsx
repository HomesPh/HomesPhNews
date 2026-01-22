"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignInFormProps {
    fields: {
        email: { label: string; placeholder: string; type: string; };
        password: { label: string; placeholder: string; type: string; };
    };
    submitLabel: string;
    demoCredentials: { email: string; password: string };
}

import { useAuth } from "@/lib/api/auth/store";

export default function SignInForm({ fields, submitLabel, demoCredentials }: SignInFormProps) {
    const router = useRouter();
    const login = useAuth((state) => state.login);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login({ email, password });
            router.push("/admin/analytics"); // Redirect to dashboard
        } catch (error) {
            console.error(error);
            alert("Invalid credentials or server error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-800">
                    {fields.email.label}
                </label>
                <Input
                    id="email"
                    type={fields.email.type}
                    placeholder={fields.email.placeholder}
                    className="h-11 bg-white border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-blue-600 pl-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-800">
                    {fields.password.label}
                </label>
                <Input
                    id="password"
                    type={fields.password.type}
                    placeholder={fields.password.placeholder}
                    className="h-11 bg-white border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-blue-600 pl-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full h-11 bg-[#bf0000] hover:bg-[#a60000] text-white font-semibold text-md rounded-md transition-colors mt-2"
                disabled={isLoading}
            >
                {isLoading ? "Signing in..." : submitLabel}
            </Button>
        </form>
    );
}
