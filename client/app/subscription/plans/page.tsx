"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Building2, Zap, Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LandingHeader from "@/components/layout/header/LandingHeader";
import LandingFooter from "@/components/layout/footer/LandingFooter";

interface Plan {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    icon: any;
    popular?: boolean;
}

const plans: Plan[] = [
    {
        id: "basic",
        name: "Basic",
        price: 499,
        description: "Essential tools for starters.",
        icon: Building2,
        features: [
            "Daily News Updates",
            "Select up to 3 Countries",
            "Select up to 5 Categories",
            "5 credits per month",
            "Article management",
            "Basic analytics",
            "Email support"
        ]
    },
    {
        id: "professional",
        name: "Professional",
        price: 2499,
        description: "For growing businesses.",
        icon: Zap,
        popular: true,
        features: [
            "Everything in Basic",
            "Unlimited Countries & Categories",
            "20 credits per month",
            "Priority Support",
            "Advanced analytics",
            "Custom branding",
            "API access"
        ]
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 4999,
        description: "Maximum power & scale.",
        icon: Rocket,
        features: [
            "Everything in Professional",
            "50 credits per month",
            "Dedicated account manager",
            "Custom API Access",
            "White-label solution",
            "24/7 phone support",
            "SLA guarantee"
        ]
    }
];

function SubscriptionPlansContent() {
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Get user info from localStorage
        const storedUserInfo = localStorage.getItem('user_info');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const handleSelectPlan = (plan: Plan) => {
        setIsLoading(true);
        // Save selected plan
        localStorage.setItem('pending_plan', plan.id);

        // Check if user is logged in
        const token = localStorage.getItem('auth_token');

        if (token) {
            // Go to checkout
            router.push(`/subscription/checkout?plan=${plan.id}`);
        } else {
            // Go to login/signup
            router.push('/admin/login');
        }
        setIsLoading(false);
    };

    return (
        <>
            <LandingHeader />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 flex flex-col items-center justify-center pt-40 pb-24 px-4 transition-colors duration-300">
                <div className="max-w-6xl mx-auto w-full">
                    {/* Header Content */}
                    <div className="text-center mb-12 mt-8">
                        {userInfo && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Welcome, <span className="font-semibold text-gray-900 dark:text-white">{userInfo.firstName} {userInfo.lastName}</span>!
                                </p>
                            </div>
                        )}

                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Choose Your Plan
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Unlock premium features and grow your business with our tailored solutions.
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
                        {plans.map((plan) => {
                            const Icon = plan.icon;
                            const isEnterprise = plan.id === 'enterprise';

                            return (
                                <div
                                    key={plan.id}
                                    className={`group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col h-full ${plan.popular
                                        ? 'border-gray-200 dark:border-gray-800 hover:border-[#c10007] dark:hover:border-[#c10007]'
                                        : 'border-gray-200 dark:border-gray-800 hover:border-[#c10007] dark:hover:border-[#c10007]'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                            <span className="bg-gradient-to-r from-[#c10007] to-[#a00006] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                                                MOST POPULAR
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col h-full">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gray-50 dark:bg-gray-800 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors`}>
                                            <Icon className={`w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-[#c10007] transition-colors`} />
                                        </div>

                                        {/* Plan Info */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 min-h-[40px]">
                                            {plan.description}
                                        </p>

                                        {/* Price */}
                                        <div className="mb-6">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                ₱{plan.price.toLocaleString()}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">/month</span>
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-3 mb-8 flex-1">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-[#c10007] flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-snug">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Select Button */}
                                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                            {isEnterprise ? (
                                                <Link href="/contact" className="w-full block">
                                                    <Button
                                                        className={`w-full h-10 font-semibold text-sm rounded-lg transition-all shadow-md bg-white dark:bg-gray-800 hover:bg-[#a00006] dark:hover:bg-[#a00006] hover:text-white text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 group-hover:bg-[#c10007] group-hover:text-white group-hover:border-[#c10007] dark:group-hover:border-[#c10007]`}
                                                    >
                                                        Contact Sales
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    onClick={() => handleSelectPlan(plan)}
                                                    disabled={isLoading}
                                                    className={`w-full h-10 font-semibold text-sm rounded-lg transition-all shadow-md bg-white dark:bg-gray-800 hover:bg-[#a00006] dark:hover:bg-[#a00006] hover:text-white text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 group-hover:bg-[#c10007] group-hover:text-white group-hover:border-[#c10007] dark:group-hover:border-[#c10007]`}
                                                >
                                                    {isLoading ? "Processing..." : `Select ${plan.name}`}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <LandingFooter />
        </>
    );
}

export default function SubscriptionPlansPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#c10007] animate-spin" />
                    <p className="text-gray-500 font-medium">Loading subscription plans...</p>
                </div>
            </div>
        }>
            <SubscriptionPlansContent />
        </Suspense>
    );
}
