"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/api-v2";

interface SignInFormProps {
    fields: {
        email: { label: string; placeholder: string; type: string; };
        password: { label: string; placeholder: string; type: string; };
    };
    submitLabel: string;
    demoCredentials: { email: string; password: string };
}

export default function SignInForm({ fields, submitLabel, demoCredentials }: SignInFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = useAuth((state) => state.login);
    const setAuth = useAuth((state) => state.setAuth);

    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<{ first_name: string, last_name: string, avatar?: string | null } | null>(null);

    // Sign In State
    const [email, setEmail] = useState(searchParams.get('email') || "");
    const [password, setPassword] = useState("");

    // Password Visibility State
    const [showSignInPassword, setShowSignInPassword] = useState(false);


    // Check for existing session and redirect
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_info');

        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const userRoles = user.roles || [];

                if (userRoles.includes('ceo')) {
                    router.push("/ceo/articles");
                } else if (userRoles.includes('admin') || userRoles.includes('super-admin')) {
                    router.push("/admin");
                } else if (userRoles.includes('editor')) {
                    router.push("/editor/articles");
                } else if (userRoles.includes('blogger')) {
                    router.push("/blogger/dashboard");
                } else {
                    router.push("/subscriber");
                }
            } catch (e) {
                // Invalid user info, proceed to login
                console.error("Error parsing stored user info", e);
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const emailParam = searchParams.get('email');
            if (emailParam) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                    const response = await fetch(`${apiUrl}/v2/public/user-info?email=${encodeURIComponent(emailParam)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserInfo(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch user info", error);
                }
            }
        };
        fetchUserInfo();
    }, [searchParams]);

    const handleGoogleAuth = async () => {
        alert("Google authentication will be implemented with OAuth");
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login({ email, password });

            // Check roles for redirection
            const userRoles = (result.user?.roles || []).map((r: string) => r.toLowerCase());
            if (userRoles.includes('ceo')) {
                router.push("/ceo/articles");
            } else if (userRoles.includes('admin') || userRoles.includes('super-admin')) {
                router.push("/admin");
            } else if (userRoles.includes('editor')) {
                router.push("/editor/articles");
            } else if (userRoles.includes('blogger')) {
                router.push("/blogger/dashboard");
            } else {
                router.push("/subscriber");
            }
        } catch (error) {
            console.error(error);
            alert("Invalid credentials or server error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                    {userInfo && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg mb-4 animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
                            {userInfo.avatar && (
                                <img
                                    src={userInfo.avatar}
                                    alt={userInfo.first_name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                            )}
                            <div>
                                <p className="text-sm text-red-800">
                                    Welcome back, <span className="font-bold">{userInfo.first_name} {userInfo.last_name}</span>!
                                </p>
                                <p className="text-[12px] text-red-600">Please enter your password to continue.</p>
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-800">
                            {fields.email.label}
                        </label>
                        <Input
                            id="email"
                            type={fields.email.type}
                            placeholder={fields.email.placeholder}
                            className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-slate-800">
                            {fields.password.label}
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showSignInPassword ? "text" : "password"}
                                placeholder={fields.password.placeholder}
                                className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowSignInPassword(!showSignInPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showSignInPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#bf0000] hover:bg-[#a60000] text-white font-semibold text-base rounded-lg transition-colors mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : submitLabel}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
                    </div>
                </div>

                {/* Google Button */}
                <Button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium rounded-lg transition-all flex items-center justify-center gap-3"
                >
                    <Chrome className="w-5 h-5 text-[#4285F4]" />
                    Continue with Google
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-2">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-[#bf0000] hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
