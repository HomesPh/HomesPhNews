"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setEmail("");
                onClose();
            }, 2000);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[16px] p-[40px] max-w-[500px] w-full shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-[20px] right-[20px] text-[#6b7280] hover:text-[#111827] transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {!isSubmitted ? (
                    <>
                        <h2 className="font-bold text-[28px] text-[#111827] tracking-[-0.5px] mb-[12px]">
                            Subscribe to Global News
                        </h2>
                        <p className="font-normal text-[16px] text-[#6b7280] tracking-[-0.5px] leading-[24px] mb-[32px]">
                            Get the latest news delivered to your inbox daily. Stay informed with breaking news, in-depth analysis, and exclusive stories.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-[20px]">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block font-medium text-[14px] text-[#111827] tracking-[-0.5px] mb-[8px]"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full border border-[#e5e7eb] rounded-[8px] px-[16px] py-[12px] font-normal text-[16px] text-[#374151] tracking-[-0.5px] focus:outline-none focus:ring-2 focus:ring-[#c10007] focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#c10007] text-white px-[24px] py-[14px] rounded-[8px] font-semibold text-[16px] tracking-[-0.5px] hover:bg-[#a00006] transition-colors"
                            >
                                Subscribe Now
                            </button>

                            <p className="font-normal text-[12px] text-[#6b7280] tracking-[-0.5px] text-center">
                                By subscribing, you agree to our Terms & Privacy Policy
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-[40px]">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-[20px]">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-[24px] text-[#111827] tracking-[-0.5px] mb-[8px]">
                            Successfully Subscribed!
                        </h3>
                        <p className="font-normal text-[16px] text-[#6b7280] tracking-[-0.5px]">
                            Thank you for subscribing to Global News Network.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
