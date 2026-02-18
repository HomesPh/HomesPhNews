"use client";

import { Check, ArrowRight, TrendingUp, Users, Target, Megaphone, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Helper component for Images
const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    return (
        <Image
            src={src}
            alt={alt}
            fill
            className={className}
            unoptimized
        />
    );
};

const adPackages = [
    {
        name: "Display Ads",
        description: "Place your banners in high-visibility areas across our homepage and article pages.",
        features: ["Leaderboard Banners", "Sidebar Rectangles"],
        popular: false,
        icon: BarChart3,
        color: "from-blue-500 to-blue-600",
    },
    {
        name: "Sponsored Content",
        description: "Publish articles that resonate with our audience while promoting your brand.",
        features: ["Native Articles", "Newsletter Features"],
        popular: true,
        icon: Megaphone,
        color: "from-red-500 to-red-600",
    },
    {
        name: "Custom Partnerships",
        description: "Tailored campaigns to meet your specific marketing goals and KPIs.",
        features: ["Brand Takeovers", "Event Sponsorships"],
        popular: false,
        icon: Target,
        color: "from-purple-500 to-purple-600",
    },
];

export default function AdvertisePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <section className="relative overflow-hidden py-24 md:py-32">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1763596304804-88291137d7fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlcnRpc2luZyUyMG1hcmtldGluZyUyMGJpbGxib2FyZHxlbnwxfHx8fDE3NzEzNzg0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Advertising and marketing"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6 text-white"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                                <Megaphone className="w-4 h-4" />
                                <span className="text-sm font-semibold">Advertise With Us</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                                Amplify Your Brand's Message
                            </h1>
                            <p className="text-xl leading-relaxed opacity-95">
                                Reach a global audience engaged in Technology, Business, Politics, and more. Partner with HomesTV to connect with decision-makers and industry professionals.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button
                                    size="lg"
                                    className="bg-[#cc0000] hover:bg-[#A10006] text-white"
                                    onClick={() => window.location.href = '/contact'}
                                >
                                    Contact Sales
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                    onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    View Packages
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Advertise Section */}
            <section className="py-20 bg-background relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950/10" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HomesTV?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Partner with a platform that delivers quality content to an engaged, global audience
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Global Reach",
                                description: "Connect with readers from over 5 global regions, spanning diverse markets and demographics.",
                                color: "from-blue-500 to-blue-600",
                                stat: "5+",
                                statLabel: "Regions",
                            },
                            {
                                icon: TrendingUp,
                                title: "Engaged Audience",
                                description: "Our readers are decision-makers and industry professionals actively seeking insights and solutions.",
                                color: "from-green-500 to-green-600",
                                stat: "24/7",
                                statLabel: "Coverage",
                            },
                            {
                                icon: Zap,
                                title: "Brand Trust",
                                description: "Associate your brand with quality journalism and credible content that readers rely on daily.",
                                color: "from-purple-500 to-purple-600",
                                stat: "6",
                                statLabel: "Categories",
                            },
                        ].map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                            >

                                <div className="relative">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                        <benefit.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-3xl font-bold text-foreground">{benefit.stat}</span>
                                        <span className="text-sm text-muted-foreground">{benefit.statLabel}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                    <p className="text-muted-foreground">{benefit.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages Section */}
            <section id="packages" className="py-20 bg-secondary/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Advertising Solutions</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Choose the package that best fits your marketing objectives and budget
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {adPackages.map((pkg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className={`bg-card border-2 rounded-2xl p-8 space-y-6 transition-all relative ${pkg.popular
                                    ? "border-[#cc0000] shadow-2xl scale-105"
                                    : "border-border shadow-lg hover:shadow-xl"
                                    }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-[#cc0000] text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className={`w-16 h-16 bg-gradient-to-br ${pkg.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                    <pkg.icon className="w-8 h-8 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-3">{pkg.name}</h3>
                                    <p className="text-muted-foreground">{pkg.description}</p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    {pkg.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-[#cc0000] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    className={`w-full ${pkg.popular
                                        ? "bg-[#cc0000] hover:bg-[#A10006]"
                                        : "bg-foreground hover:bg-foreground/90"
                                        } text-white`}
                                    size="lg"
                                    onClick={() => window.location.href = '/contact'}
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMG1lZXRpbmclMjBvZmZpY2V8ZW58MXx8fHwxNzcxMzQwNDM0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Team collaboration"
                                className="object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-[#cc0000] px-4 py-2 rounded-full">
                                <Target className="w-4 h-4" />
                                <span className="text-sm font-semibold">Partnership Benefits</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Partner with Excellence</h2>
                            <p className="text-lg text-muted-foreground">
                                When you advertise with HomesTV, you're not just buying ad space—you're partnering with a team committed to your success.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Dedicated account management and strategic consultation",
                                    "Detailed analytics and performance reporting",
                                    "Flexible campaign options tailored to your goals",
                                    "Access to our engaged community of industry professionals",
                                    "Multi-channel promotion across our platform",
                                ].map((benefit, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-6 h-6 bg-[#cc0000] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-muted-foreground">{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold">
                            Ready to Grow Your Brand?
                        </h2>
                        <p className="text-xl leading-relaxed opacity-95 max-w-2xl mx-auto">
                            Contact our sales team today to discuss your advertising needs and discover how HomesTV can help you reach your target audience effectively.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                className="bg-[#cc0000] hover:bg-[#a10006] text-white"
                                onClick={() => window.location.href = '/contact'}
                            >
                                Contact Sales Team
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
