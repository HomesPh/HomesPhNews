"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome, Github, Apple } from "lucide-react";

interface SignInFormProps {
    fields: {
        email: { label: string; placeholder: string; type: string; };
        password: { label: string; placeholder: string; type: string; };
    };
    submitLabel: string;
    demoCredentials: { email: string; password: string };
}

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/api-v2";
import { useEffect } from "react";

type AuthMode = 'signin' | 'signup-step1' | 'signup-step2';

export default function SignInForm({ fields, submitLabel, demoCredentials }: SignInFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = useAuth((state) => state.login);

    const [mode, setMode] = useState<AuthMode>('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<{ first_name: string, last_name: string, avatar?: string | null } | null>(null);

    // Sign In State
    const [email, setEmail] = useState(searchParams.get('email') || "");
    const [password, setPassword] = useState("");

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

    // Sign Up State
    const [signupData, setSignupData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleGoogleAuth = async () => {
        alert("Google authentication will be implemented with OAuth");
    };

    const handleGithubAuth = async () => {
        alert("GitHub authentication will be implemented with OAuth");
    };

    const handleAppleAuth = async () => {
        alert("Apple authentication will be implemented with OAuth");
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login({ email, password });

            // Check roles for redirection
            const userRoles = (result.user?.roles || []).map((r: string) => r.toLowerCase());
            if (userRoles.includes('admin') || userRoles.includes('super-admin')) {
                router.push("/admin");
            } else if (userRoles.includes('ceo')) {
                router.push("/admin/mailing-list");
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

    const handleSignUpStep1Continue = (e: React.FormEvent) => {
        e.preventDefault();

        if (!signupData.firstName || !signupData.lastName || !signupData.email) {
            alert("Please fill in all fields");
            return;
        }

        setMode('signup-step2');
    };

    const handleSignUpStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (signupData.password !== signupData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (signupData.password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const registerUrl = `${apiUrl}/v1/auth/register`;

            console.log('Attempting registration at:', registerUrl);

            const response = await fetch(registerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    first_name: signupData.firstName,
                    last_name: signupData.lastName,
                    email: signupData.email,
                    password: signupData.password,
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Server returned non-JSON response:', text.substring(0, 200));
                alert(`Server error: The registration endpoint is not available yet. Please create the /auth/register API endpoint first.\n\nExpected: ${registerUrl}`);
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            if (response.ok) {
                // Store auth token if provided
                if (data.token) {
                    localStorage.setItem('auth_token', data.token);
                }

                // Store user info
                localStorage.setItem('user_info', JSON.stringify({
                    firstName: signupData.firstName,
                    lastName: signupData.lastName,
                    email: signupData.email,
                    roles: data.user?.roles || [],
                }));

                // Redirect to subscription plans page
                router.push('/subscription/plans?plans=free');
            } else {
                alert(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(`Failed to connect to the server.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease ensure:\n1. The backend server is running\n2. The /auth/register endpoint exists\n3. CORS is configured correctly`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
                <Button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 font-semibold rounded-lg transition-all flex items-center justify-center gap-3"
                >
                    <Chrome className="w-5 h-5 text-[#4285F4]" />
                    Continue with Google
                </Button>

                <Button
                    type="button"
                    onClick={handleGithubAuth}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 font-semibold rounded-lg transition-all flex items-center justify-center gap-3"
                >
                    <Github className="w-5 h-5 text-gray-900" />
                    Continue with GitHub
                </Button>

                <Button
                    type="button"
                    onClick={handleAppleAuth}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 font-semibold rounded-lg transition-all flex items-center justify-center gap-3"
                >
                    <Apple className="w-5 h-5 text-gray-900" />
                    Continue with Apple
                </Button>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
                </div>
            </div>

            {/* Sign In Form */}
            {mode === 'signin' && (
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
                        <Input
                            id="password"
                            type={fields.password.type}
                            placeholder={fields.password.placeholder}
                            className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#bf0000] hover:bg-[#a60000] text-white font-semibold text-base rounded-lg transition-colors mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : submitLabel}
                    </Button>

                    {/* Toggle to Sign Up */}
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setMode('signup-step1')}
                                className="font-semibold text-[#bf0000] hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </form>
            )}

            {/* Sign Up Step 1: Name and Email */}
            {mode === 'signup-step1' && (
                <form onSubmit={handleSignUpStep1Continue} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium text-slate-800">
                                First name
                            </label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="Your first name"
                                className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg"
                                value={signupData.firstName}
                                onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium text-slate-800">
                                Last name
                            </label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Your last name"
                                className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg"
                                value={signupData.lastName}
                                onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="signup-email" className="text-sm font-medium text-slate-800">
                            Email
                        </label>
                        <Input
                            id="signup-email"
                            type="email"
                            placeholder="Your email address"
                            className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#bf0000] hover:bg-[#a60000] text-white font-semibold text-base rounded-lg transition-colors mt-2"
                    >
                        Continue
                    </Button>

                    {/* Toggle back to Sign In */}
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setMode('signin')}
                                className="font-semibold text-[#bf0000] hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </form>
            )}

            {/* Sign Up Step 2: Create Password */}
            {mode === 'signup-step2' && (
                <form onSubmit={handleSignUpStep2Submit} className="space-y-4">
                    {/* Email Display */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">
                            Email
                        </label>
                        <p className="text-base font-normal text-slate-900">
                            {signupData.email}
                        </p>
                    </div>

                    {/* Continue with Email Code Option */}
                    <Button
                        type="button"
                        onClick={() => alert("Email verification code will be sent")}
                        className="w-full h-12 bg-[#bf0000] hover:bg-[#a60000] text-white font-semibold text-base rounded-lg transition-colors"

                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Continue with email code
                    </Button>

                    {/* Password Section */}
                    <div className="space-y-2">
                        <label htmlFor="signup-password" className="text-sm font-medium text-slate-500">
                            Password
                        </label>
                        <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            className="h-12 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg text-base"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            required
                            minLength={8}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium text-slate-500">
                            Confirm Password
                        </label>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            className="h-12 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg text-base"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                            required
                            minLength={8}
                        />
                    </div>

                    {/* Continue Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#bf0000] hover:bg-[#a60000] text-white font-semibold text-base rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Continue"}
                    </Button>

                    {/* Go Back Button */}
                    <button
                        type="button"
                        onClick={() => setMode('signup-step1')}
                        className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Go back
                    </button>

                    {/* Toggle back to Sign In */}
                    <div className="text-center pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setMode('signin')}
                                className="font-semibold text-[#bf0000] hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
}
