"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/api-v2";
import { useRegister } from "@/hooks/useRegister";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SignUpFormProps {
  initialMode?: SignUpMode;
}

type SignUpMode = 'signup-step1' | 'signup-step2';

export default function SignUpForm({ initialMode = 'signup-step1' }: SignUpFormProps) {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const setAuth = useAuth((state) => state.setAuth);

  const [mode, setMode] = useState<SignUpMode>(initialMode);
  const { isLoading, error, handleRegister, handleVerifyOTP } = useRegister();

  // Sign Up State
  const [signupData, setSignupData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoogleAuth = async () => {
    alert("Google authentication will be implemented with OAuth");
  };

  const handleSignUpStep1Continue = async (e: React.FormEvent) => {
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

    try {
      await handleRegister({
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
      });

      setMode('signup-step2');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleSignUpStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupData.verificationCode) {
      alert("Please enter the verification code");
      return;
    }

    if (signupData.verificationCode.length !== 6) {
      alert("Verification code must be 6 digits");
      return;
    }

    try {
      await handleVerifyOTP({
        email: signupData.email,
        otp: signupData.verificationCode,
      });

      // After successful verification, redirect to checkout page for subscription flow
      const pendingPlan = localStorage.getItem('pending_plan');
      router.push(`/subscription/checkout?plan=${pendingPlan || 'free'}`);
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  return (
    <div className="space-y-6">
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
                  className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#1428AE] rounded-lg"
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
                  className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#1428AE] rounded-lg"
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
                className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#1428AE] rounded-lg"
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
                    className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#1428AE] rounded-lg pr-10"
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
                    className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#1428AE] rounded-lg pr-10"
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

            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#1428AE] hover:bg-[#000785] text-white font-semibold text-base rounded-lg transition-colors mt-2"
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
              <Link
                href="/login"
                className="font-semibold text-[#1428AE] hover:underline"
              >
                Log in
              </Link>
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
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1428AE] focus:ring-2 focus:ring-[#1428AE] outline-none transition-all"
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

            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Continue Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#1428AE] hover:bg-[#000785] text-white font-semibold text-base rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Verify & Create Account"}
            </Button>

            {/* Resend Code (Mock) */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => alert("Code resent!")}
                className="text-sm text-[#1428AE] hover:underline font-medium"
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
