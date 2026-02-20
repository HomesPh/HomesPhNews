"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

type AuthMode = 'signin' | 'signup-step1' | 'signup-step2';

export default function SignInForm({ fields, submitLabel, demoCredentials }: SignInFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = useAuth((state) => state.login);
    const setAuth = useAuth((state) => state.setAuth);

    const [mode, setMode] = useState<AuthMode>('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<{ first_name: string, last_name: string, avatar?: string | null } | null>(null);

    // Sign In State
    const [email, setEmail] = useState(searchParams.get('email') || "");
    const [password, setPassword] = useState("");

    // Password Visibility State
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSignInPassword, setShowSignInPassword] = useState(false);


    // Check for existing session and redirect
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_info');

        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const userRoles = user.roles || [];

                if (userRoles.includes('admin') || userRoles.includes('super-admin')) {
                    router.push("/admin");
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

    // Sign Up State
    const [signupData, setSignupData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        verificationCode: "",
    });

    const handleGoogleAuth = async () => {
        alert("Google authentication will be implemented with OAuth");
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login({ email, password });

            // Check roles for redirection
            const userRoles = result.user?.roles || [];
            if (userRoles.includes('admin') || userRoles.includes('super-admin')) {
                router.push("/admin");
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

        if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
            alert("Please fill in all fields");
            return;
        }

        if (signupData.password !== signupData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (signupData.password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        setMode('signup-step2');
    };

    const handleSignUpStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate verification code (mock)
        if (!signupData.verificationCode) {
            alert("Please enter the verification code");
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

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                // If endpoint doesn't exist, we will Mock Success for now as requested
                // "it will create still thbe account succesfully and redirect"
                console.warn('Server returned non-JSON response, mocking success for demo:', text.substring(0, 200));

                // Mock successful login/redirect
                alert("Account created successfully! (Mock)");
                router.push('/subscriber');
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            if (response.ok) {
                // Update auth store (handles localStorage and state sync)
                if (data.token && data.user) {
                    setAuth(data.token, data.user);
                }

                // Redirect to checkout page for subscription flow
                const pendingPlan = localStorage.getItem('pending_plan');
                router.push(`/subscription/checkout?plan=${pendingPlan || 'free'}`);
            } else {
                alert(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Fallback mock success if server is down/not implemented
            alert("Account created successfully! (Mock Fallback)");
            router.push('/admin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Sign In Form */}
            {mode === 'signin' && (
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
                            <button
                                type="button"
                                onClick={() => setMode('signup-step1')}
                                className="font-semibold text-[#bf0000] hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* Sign Up Step 1: Registration Details */}
            {mode === 'signup-step1' && (
                <div className="space-y-6">
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

                        {/* Password Section */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label htmlFor="signup-password" className="text-sm font-medium text-slate-800">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder=""
                                        className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg pr-10"
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirm-password" className="text-sm font-medium text-slate-800">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder=""
                                        className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#bf0000] rounded-lg pr-10"
                                        value={signupData.confirmPassword}
                                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#bf0000] hover:bg-[#a60000] text-white font-semibold text-base rounded-lg transition-colors mt-2"
                        >
                            Continue
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
                </div>
            )}

            {/* Sign Up Step 2: Verification Code */}
            {mode === 'signup-step2' && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900">Verify your email</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            We sent a verification code to <span className="font-medium text-gray-900">{signupData.email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSignUpStep2Submit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="otp-0" className="text-sm font-medium text-slate-800 block text-center">
                                Verification Code
                            </label>
                            <div className="flex justify-center gap-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-lg focus:border-[#bf0000] focus:ring-2 focus:ring-[#bf0000] outline-none transition-all"
                                        value={signupData.verificationCode[index] || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!/^[0-9]*$/.test(value)) return;

                                            const newCode = signupData.verificationCode.split('');
                                            if (value) {
                                                newCode[index] = value;
                                                setSignupData({ ...signupData, verificationCode: newCode.join('') });

                                                // Focus next input
                                                if (index < 5) {
                                                    const nextInput = document.getElementById(`otp-${index + 1}`);
                                                    nextInput?.focus();
                                                }
                                            } else {
                                                // Handle delete/clear if needed, though backspace handles usually
                                                newCode[index] = "";
                                                setSignupData({ ...signupData, verificationCode: newCode.join('') });
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace') {
                                                if (!signupData.verificationCode[index] && index > 0) {
                                                    // Focus previous if current is empty
                                                    const prevInput = document.getElementById(`otp-${index - 1}`);
                                                    prevInput?.focus();
                                                }
                                            }
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
                                            setSignupData({ ...signupData, verificationCode: pastedData });

                                            // Focus appropriate input after paste
                                            const nextIndex = Math.min(pastedData.length, 5);
                                            const nextInput = document.getElementById(`otp-${nextIndex}`);
                                            nextInput?.focus();
                                        }}
                                        required={index === 0} // Only first is strictly required for HTML validation, manual validation checks length
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Continue Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#bf0000] hover:bg-[#a60000] text-white font-semibold text-base rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Verify & Create Account"}
                        </Button>

                        {/* Resend Code (Mock) */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => alert("Code resent!")}
                                className="text-sm text-[#bf0000] hover:underline font-medium"
                            >
                                Resend Code
                            </button>
                        </div>

                        {/* Go Back Button */}
                        <button
                            type="button"
                            onClick={() => setMode('signup-step1')}
                            className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-1 pt-4 border-t border-gray-100"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to details
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
