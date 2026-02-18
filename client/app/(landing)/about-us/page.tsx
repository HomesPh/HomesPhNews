"use client";

import { Globe, TrendingUp, Users, Clock, Target, Award, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import Image from "next/image";

// Helper component for Images (replacing ImageWithFallback from reference)
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

const teamMembers = [
    {
        initials: "JM",
        name: "Jomari Marson",
        role: "Team Leader & Full Stack Developer",
        description: "Building scalable solutions and driving technical innovation for HomesTV.",
        image: "/images/Marson.png",
    },
    {
        initials: "FK",
        name: "Froillan Kim Edem",
        role: "Full Stack Developer",
        description: "Building scalable solutions and driving technical innovation for HomesTV.",
        image: "/images/Edem.png",
    },
    {
        initials: "AP",
        name: "Angela Postrero",
        role: "Full Stack Developer",
        description: "Building scalable solutions and driving technical innovation for HomesTV.",
        image: "/images/Angela.png",
    },
    {
        initials: "ME",
        name: "Mark Jess Anthony Enfermo",
        role: "Full Stack Developer",
        description: "Building scalable solutions and driving technical innovation for HomesTV.",
        image: "/images/Mark Jess.png",
    },
    {
        initials: "RP",
        name: "Ranidel Padoga",
        role: "Full Stack Developer",
        description: "Building scalable solutions and driving technical innovation for HomesTV.",
        image: "/images/Padoga.jpg",
    },
];

const NextArrow = ({ onClick }: { onClick?: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            aria-label="Next"
        >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
    );
};

const PrevArrow = ({ onClick }: { onClick?: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            aria-label="Previous"
        >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
    );
};

export default function AboutUsPage() {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <section className="relative overflow-hidden py-24 md:py-32">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1650984661525-7e6b1b874e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuZXdzcm9vbSUyMHRlY2hub2xvZ3klMjBnbG9iYWx8ZW58MXx8fHwxNzcxMzc4NDc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Modern newsroom"
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
                            className="space-y-6"
                        >
                            <div className="inline-block">
                                <span className="bg-[#cc0000] text-white px-4 py-2 rounded-full text-sm font-semibold">
                                    About Us
                                </span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                                Empowering Global Perspectives
                            </h1>
                            <p className="text-xl text-gray-200 leading-relaxed">
                                HomesTV connects you with stories that matter. We function as a bridge between local insights and the global stage, bringing you the most relevant and impactful news from around the world.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-background relative">
                <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-950/10" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Globe, value: "5+", label: "Global Regions Covered", color: "bg-blue-500" },
                            { icon: Clock, value: "24/7", label: "Continuous Updates", color: "bg-green-500" },
                            { icon: Users, value: "5", label: "Expert Developers", color: "bg-purple-500" },
                            { icon: TrendingUp, value: "6", label: "News Categories", color: "bg-orange-500" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-[#cc0000] px-4 py-2 rounded-full">
                                <Target className="w-4 h-4" />
                                <span className="text-sm font-semibold">Our Mission</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Delivering News That Matters</h2>
                            <div className="space-y-4 text-lg text-muted-foreground">
                                <p>
                                    At HomesTV, our mission is to provide accurate, timely, and engaging news content that empowers our readers to make informed decisions. Whether you are tracking market trends, planning your next trip, or staying updated on political shifts, we are your reliable source for comprehensive coverage.
                                </p>
                                <p>
                                    We believe in the power of information to transform lives and communities. Our dedicated team works around the clock to bring you stories that not only inform but inspire action and foster understanding across borders and cultures.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
                                <ImageWithFallback
                                    src="https://images.unsplash.com/photo-1570106413982-7f2897b8d0c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMGNvbm5lY3Rpb25zJTIwbmV0d29ya3xlbnwxfHx8fDE3NzEzMTQ4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Global connections"
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-[#cc0000] text-white p-6 rounded-2xl shadow-xl max-w-xs">
                                <p className="font-semibold text-lg">Connecting the World</p>
                                <p className="text-sm opacity-90 mt-2">
                                    Bridging local insights with global perspectives
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-secondary/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            The principles that guide our commitment to excellence in journalism
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                title: "Accuracy",
                                description: "We prioritize truth and precision in every story we publish, ensuring our readers receive reliable information they can trust.",
                                color: "from-red-500 to-red-600",
                            },
                            {
                                icon: Award,
                                title: "Integrity",
                                description: "Our commitment to ethical journalism guides every decision, maintaining the highest standards of professional conduct.",
                                color: "from-blue-500 to-blue-600",
                            },
                            {
                                icon: Heart,
                                title: "Excellence",
                                description: "We continuously strive to improve our craft, delivering compelling stories that engage and inform our global audience.",
                                color: "from-purple-500 to-purple-600",
                            },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                whileHover={{ y: -8 }}
                                className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-background overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-[#cc0000] px-4 py-2 rounded-full mb-4">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-semibold">Our Team</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet The Team</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We are a dedicated team of 5 Full Stack Developers passionate about building modern digital experiences.
                        </p>
                    </motion.div>

                    <div className="team-carousel px-8 pb-12">
                        <Slider {...sliderSettings}>
                            {teamMembers.map((member, index) => (
                                <div key={index} className="px-4 py-4 h-full">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -8 }}
                                        className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full min-h-[350px] flex flex-col justify-between"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-xl ring-4 ring-background mb-4 mx-auto">
                                                <ImageWithFallback
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                                <p className="text-sm text-[#cc0000] font-semibold mb-3">
                                                    {member.role}
                                                </p>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {member.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NzEzNzg0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Team collaboration"
                        className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/85" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto space-y-8"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold">
                            Building the Future of Digital News
                        </h2>
                        <p className="text-xl leading-relaxed opacity-95">
                            Join us on our journey to bring you the most impactful stories from around the globe. Experience news that connects the dots and empowers your perspective.
                        </p>
                        <div className="flex justify-center pt-8">
                            <a
                                href="/"
                                className="bg-[#cc0000] hover:bg-[#a10006] text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg flex items-center gap-2"
                            >
                                Start Exploring
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
