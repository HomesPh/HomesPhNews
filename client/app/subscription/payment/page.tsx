"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentPage() {
    const router = useRouter();
    const [planDetails, setPlanDetails] = useState<any>(null);

    useEffect(() => {
        const storedPlan = localStorage.getItem('selected_plan');
        if (storedPlan) {
            setPlanDetails(JSON.parse(storedPlan));
        }
    }, []);

    const handleProceedToDashboard = () => {
        router.push('/admin');
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="max-w-[500px] w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Brand Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/images/HomesTV.png"
                        alt="HomesTV"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* Main Icon */}
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-900 border border-gray-100 shadow-sm">
                    <CreditCard className="w-10 h-10" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Secure Payment
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Redirecting to our secure payment gateway to finalize your subscription for the <span className="font-bold text-gray-900">{planDetails?.plan || 'Selected'} Plan</span>.
                    </p>
                </div>

                {/* Plan Summary Card */}
                {planDetails && (
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between text-left">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Due Now</p>
                            <p className="text-2xl font-black text-gray-900">₱{planDetails.price?.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium">Subscription ID</p>
                            <p className="text-[10px] font-mono text-gray-500 break-all max-w-[150px]">{planDetails.sub_Id}</p>
                        </div>
                    </div>
                )}

                <div className="pt-4 space-y-4">
                    <Button
                        onClick={handleProceedToDashboard}
                        className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 group transition-all active:scale-95"
                    >
                        Proceed to Dashboard
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Secure SSL</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Encrypted</span>
                        </div>
                    </div>
                </div>

                <p className="text-gray-400 text-xs">
                    Need help? <Link href="/" className="text-gray-900 font-bold hover:underline">Contact Support</Link>
                </p>
            </div>
        </main>
    );
}
