"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, Building2, Zap, Rocket, PartyPopper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PlanConfigurationModal, { ConfigurationData } from "@/components/features/subscription/PlanConfigurationModal";

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
        description: "Essential tools for starters",
        icon: Building2,
        features: [
            "Daily News Updates",
            "5 credits per month",
            "Article management",
            "Email support",
            "Basic analytics"
        ]
    },
    {
        id: "professional",
        name: "Professional",
        price: 2499,
        description: "For growing businesses",
        icon: Zap,
        popular: true,
        features: [
            "Everything in Basic",
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
        description: "Maximum power & scale",
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

export default function SubscriptionPlansPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isFreePlan = searchParams.get('plans') === 'free';

    const [userInfo, setUserInfo] = useState<any>(null);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [planToConfigure, setPlanToConfigure] = useState<Plan | null>(null);

    useEffect(() => {
        // Get user info from localStorage
        const storedUserInfo = localStorage.getItem('user_info');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }

        // Check if there's a pre-selected plan
        const storedPlan = localStorage.getItem('selected_plan');
        if (storedPlan) {
            const planData = JSON.parse(storedPlan);
            setSelectedPlanId(planData.plan.toLowerCase());
        }
    }, []);

    const handleSelectPlan = (plan: Plan) => {
        setPlanToConfigure(plan);
        setIsConfigModalOpen(true);
    };

    const handleConfirmSubscription = async (config: ConfigurationData) => {
        if (!planToConfigure) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const storedUserInfo = localStorage.getItem('user_info');
            const user = storedUserInfo ? JSON.parse(storedUserInfo) : null;

            if (!user?.email) {
                alert("User session not found. Please log in again.");
                router.push('/admin/login');
                return;
            }

            // Create FormData for the request (needed for logo upload)
            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('plan_name', planToConfigure.name); // Updated to plan_name
            formData.append('price', planToConfigure.price.toString());
            formData.append('company_name', config.companyName);

            // Add categories and countries
            config.categories.forEach((cat: string) => formData.append('categories[]', cat));
            config.countries.forEach((country: string) => formData.append('countries[]', country));

            if (config.logo) {
                formData.append('logo', config.logo);
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const response = await fetch(`${apiUrl}/plans/subscribe`, { // Updated endpoint
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Store subscription info in localStorage
                localStorage.setItem('selected_plan', JSON.stringify({
                    plan: planToConfigure.name,
                    price: planToConfigure.price,
                    sub_Id: data.data?.sub_Id
                }));

                alert(`Successfully subscribed to the ${planToConfigure.name} plan! Redirecting to payment...`);
                router.push('/subscription/payment');
            } else {
                alert(data.message || 'Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to connect to the server. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSkip = () => {
        // Clear selected plan
        localStorage.removeItem('selected_plan');
        router.push('/admin');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4">
            {isFreePlan ? (
                <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
                    <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
                        {/* Status Header */}
                        <div className="bg-gradient-to-r from-[#c10007] to-[#a00006] p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                                    <PartyPopper className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-2xl font-black text-white tracking-tight uppercase">Congratulations!</h1>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center bg-white">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                                    Exclusive Free Access
                                </h2>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    You will access the subscriber's dashboard <span className="text-[#c10007] font-bold">free of charge</span>.
                                    Enjoy full access to all premium news features and real estate insights.
                                </p>
                            </div>

                            <button
                                onClick={() => router.push('/subscriber')}
                                className="group w-full bg-[#c10007] hover:bg-[#a00006] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_8px_25px_rgba(193,0,7,0.3)] hover:shadow-[0_12px_30px_rgba(193,0,7,0.4)] active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                Continue to Dashboard
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="mt-6 text-xs text-gray-400 font-medium uppercase tracking-widest">
                                Welcome to News HomesPH Platform
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>

                        <div className="flex items-center justify-center mb-6">
                            <img
                                src="/images/HomesTV.png"
                                alt="HomesTV"
                                className="h-12 w-auto object-contain"
                            />
                        </div>

                        {userInfo && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    Welcome, <span className="font-semibold text-gray-900">{userInfo.firstName} {userInfo.lastName}</span>!
                                </p>
                            </div>
                        )}

                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Choose Your Plan
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Unlock premium features and grow your business with our tailored solutions.
                        </p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {plans.map((plan) => {
                            const Icon = plan.icon;
                            const isSelected = selectedPlanId === plan.id;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-2xl ${plan.popular
                                        ? 'border-[#c10007] scale-105'
                                        : isSelected
                                            ? 'border-[#c10007]'
                                            : 'border-gray-200 hover:border-[#c10007]'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-[#c10007] to-[#a00006] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                                MOST POPULAR
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-8">
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${plan.popular ? 'bg-red-50' : 'bg-gray-50'
                                            }`}>
                                            <Icon className={`w-7 h-7 ${plan.popular ? 'text-[#c10007]' : 'text-gray-700'}`} />
                                        </div>

                                        {/* Plan Info */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-6">
                                            {plan.description}
                                        </p>

                                        {/* Price */}
                                        <div className="mb-8">
                                            <span className="text-5xl font-bold text-gray-900">
                                                ₱{plan.price.toLocaleString()}
                                            </span>
                                            <span className="text-gray-600 text-lg">/month</span>
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-4 mb-8">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-[#c10007] flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Select Button */}
                                        <Button
                                            onClick={() => handleSelectPlan(plan)}
                                            disabled={isLoading}
                                            className={`w-full h-12 font-semibold text-base rounded-xl transition-all shadow-md ${plan.popular
                                                ? 'bg-[#c10007] hover:bg-[#a00006] text-white'
                                                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200'
                                                }`}
                                        >
                                            {isLoading ? "Processing..." : `Select ${plan.name}`}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Skip Option */}
                    <div className="text-center">
                        <button
                            onClick={handleSkip}
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                        >
                            Skip for now, I'll choose later
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need a custom plan?{" "}
                            <a href="#" className="text-[#c10007] font-semibold hover:underline">
                                Contact our sales team
                            </a>
                        </p>
                    </div>
                </div>
            )}

            {/* Configuration Modal */}
            <PlanConfigurationModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                plan={planToConfigure}
                userInfo={userInfo}
                onConfirm={handleConfirmSubscription}
            />
        </main>
    );
}
