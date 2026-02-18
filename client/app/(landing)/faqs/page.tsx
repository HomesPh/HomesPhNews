"use client";

import { HelpCircle, Search, Filter, Globe, Mail, Clock, ArrowRight, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const faqCategories = [
    {
        icon: Filter,
        title: "How do I filter news by country?",
        description: "Learn about filtering and customizing your news feed by region and country.",
    },
    {
        icon: Search,
        title: "Can I search for specific topics?",
        description: "Discover our powerful search features and advanced topic filtering options.",
    },
    {
        icon: Globe,
        title: "How do I simplify the footer links?",
        description: "Navigate our footer organization and find what you need quickly.",
    },
    {
        icon: HelpCircle,
        title: "How can I advertise on HomesTV?",
        description: "Explore advertising packages and partnership opportunities with us.",
    },
    {
        icon: Mail,
        title: "How do I contact the HomesTV team?",
        description: "Multiple ways to reach our support team for personalized assistance.",
    },
    {
        icon: Clock,
        title: "How often is content updated?",
        description: "Learn about our 24/7 content updates and real-time news coverage.",
    },
];

const detailedFaqs = [
    {
        question: "How do I filter news by country?",
        answer: "You can filter news by country using our advanced search filters located at the top of the homepage. Simply select your preferred region or country from the dropdown menu to view localized content. Our system automatically curates stories relevant to your selected location.",
    },
    {
        question: "Can I search for specific topics?",
        answer: "Yes! Use our powerful search feature to find articles on specific topics. Enter keywords related to Technology, Business, Politics, Economy, Tourism, or Real Estate in the search bar. You can also use our category filters to narrow down results to your areas of interest.",
    },
    {
        question: "How do I simplify the footer links?",
        answer: "The footer is organized into logical sections for easy navigation. You can quickly access Company information, Support resources, and Legal documents. If you're using our mobile app, the footer automatically condenses to show only the most relevant links based on your browsing history.",
    },
    {
        question: "How can I advertise on HomesTV?",
        answer: "We offer various advertising opportunities including display ads, sponsored content, and custom partnerships. Visit our Advertise page to learn more about our packages and reach. You can also contact our sales team directly at sales@homestv.com to discuss tailored solutions for your brand.",
    },
    {
        question: "How do I contact the HomesTV team?",
        answer: "There are several ways to reach us: Email us at info@homestv.com for general inquiries or support@homestv.com for technical assistance. You can also call us at +1 (555) 123-4567 during business hours (Mon-Fri, 9am-6pm EST), or visit our Contact page to submit a message through our online form.",
    },
];

export default function FAQsPage() {
    const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-950/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-6"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950/30 rounded-2xl mb-4">
                            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                            Welcome to HomesTV Help!
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Get help for your projects, services, account management and so much more.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Choose by Service Section */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-2">Choose by Service</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {faqCategories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="group cursor-pointer"
                                onClick={() => setSelectedFaq(index)} // Simple scrolling or linking logic could be added here
                            >
                                <div className="bg-card border border-border rounded-xl p-6 h-full transition-all hover:shadow-lg hover:border-[#cc0000]/30">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
                                            <category.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-[#cc0000] transition-colors" />
                                    </div>
                                    <h3 className="font-semibold text-base mb-2 group-hover:text-[#cc0000] transition-colors">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still Need Help Section */}
            <section className="py-20 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-3">Still Need Help?</h2>
                        <p className="text-muted-foreground">
                            Contact our support team for personalized assistance.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-card border border-border rounded-xl p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Email Support</h3>
                            <p className="text-sm text-muted-foreground">support@homestv.com</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-card border border-border rounded-xl p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Response Time</h3>
                            <p className="text-sm text-muted-foreground">Within 24 hours</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-card border border-border rounded-xl p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Business Hours</h3>
                            <p className="text-sm text-muted-foreground">9 AM - 6 PM (GMT+0)</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                    >
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => window.location.href = '/contact'}
                        >
                            Contact Support
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Detailed FAQs Section */}
            <section className="py-20 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Find detailed answers to the most frequently asked questions
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {detailedFaqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors"
                                >
                                    <span className="font-semibold pr-4">{faq.question}</span>
                                    <motion.div
                                        animate={{ rotate: selectedFaq === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <svg
                                            className="w-5 h-5 text-muted-foreground"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {selectedFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 text-muted-foreground">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
