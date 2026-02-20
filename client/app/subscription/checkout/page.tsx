"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan') || 'free';
    const [isLoading, setIsLoading] = useState(false);

    // Mock plan details
    const planDetails = {
        free: {
            name: "Starter",
            price: 0,
            originalPrice: 1208.93,
            credits: 100,
            features: ["100 credits/month", "Limited access", "Ad-supported"]
        },
        pro: {
            name: "Pro",
            price: 2400,
            originalPrice: 3500,
            credits: 500,
            features: ["500 credits/month", "Full access", "No ads"]
        }
    };

    const selectedPlan = planDetails[planId as keyof typeof planDetails] || planDetails.free;

    const handleSubscribe = () => {
        setIsLoading(true);

        // Simulate API call / Payment processing
        setTimeout(() => {
            // Save subscription state to localStorage for simulation
            const subscriptionData = {
                plan: planId,
                credits: selectedPlan.credits,
                status: 'active',
                startDate: new Date().toISOString(),
            };

            // In a real app, this would be saved to the user's profile via API
            localStorage.setItem('user_subscription', JSON.stringify(subscriptionData));

            // Allow access to dashboard (mock)
            // But first, go to onboarding
            router.push('/onboarding');

            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Left Column - Summary */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-800">
                <div className="max-w-md mx-auto w-full space-y-8">
                    <button
                        onClick={() => router.push('/subscriber')}
                        className="flex items-center text-gray-400 hover:text-white transition-colors gap-2 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>

                    <div>
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
                            <span className="text-2xl">💎</span>
                        </div>
                        <h1 className="text-4xl font-light mb-2">Subscribe to <span className="font-semibold text-white">{selectedPlan.name}</span></h1>
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-5xl font-bold">₱0</span>
                            <span className="text-xl text-gray-500 line-through">₱{selectedPlan.originalPrice.toLocaleString()}</span>
                            <span className="text-gray-400 ml-2">per month</span>
                        </div>
                        <p className="text-green-400 mt-2 text-sm font-medium bg-green-400/10 inline-block px-3 py-1 rounded-full">
                            Free Trial Active
                        </p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-800">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Credits Included</span>
                            <span className="font-bold text-white">{selectedPlan.credits} credits/mo</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Billed Today</span>
                            <span className="font-bold text-white">₱0.00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Payment Form (Mock) */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#0a0a0a]">
                <div className="max-w-md mx-auto w-full space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Contact Information</h2>
                        {/* Mock user email from local storage or placeholder */}
                        <div className="p-3 bg-[#1a1a1a] rounded-md border border-gray-800 text-gray-300 text-sm">
                            user@example.com
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Payment Method</h2>

                        {/* Mock Card Input */}
                        <div className="space-y-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCard className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                                    placeholder="Card number"
                                    defaultValue="4242 4242 4242 4242"
                                    readOnly
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1 pointer-events-none">
                                    <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
                                    <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md py-2.5 px-3 text-sm placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                                    placeholder="MM / YY"
                                    defaultValue="12 / 28"
                                    readOnly
                                />
                                <input
                                    type="text"
                                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-md py-2.5 px-3 text-sm placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                                    placeholder="CVC"
                                    defaultValue="123"
                                    readOnly
                                />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500">
                            Payment is simulated. No actual charge will be made.
                        </p>
                    </div>

                    <Button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="w-full bg-white text-black hover:bg-gray-200 h-12 rounded-lg font-semibold text-base transition-colors"
                    >
                        {isLoading ? "Processing..." : "Subscribe"}
                    </Button>

                    <p className="text-xs text-gray-600 text-center">
                        By subscribing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
