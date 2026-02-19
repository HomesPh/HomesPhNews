"use client";

import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Ensure this path is correct based on project structure
import { Textarea } from "@/components/ui/textarea"; // Ensure this path is correct based on project structure
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

export default function ContactPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <section className="relative overflow-hidden py-24 md:py-32">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1653212883731-4d5bc66e0181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHN1cHBvcnQlMjBjb250YWN0JTIwaGVscHxlbnwxfHx8fDE3NzEzNzg0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Customer support"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl text-white space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-semibold">Contact Us</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                            Get in Touch
                        </h1>
                        <p className="text-xl leading-relaxed opacity-95">
                            Have questions, feedback, or a story to share? We'd love to hear from you. Our team is here to help and respond to your inquiries.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Information Cards */}
            <section className="py-20 bg-background relative">
                <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-950/10" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                icon: Mail,
                                title: "Email Us",
                                details: [
                                    { label: "General Inquiries", value: "info@homestv.com" },
                                    { label: "Support", value: "support@homestv.com" },
                                ],
                                color: "from-blue-500 to-blue-600",
                            },
                            {
                                icon: Phone,
                                title: "Call Us",
                                details: [
                                    { label: "Phone", value: "+1 (555) 123-4567" },
                                    { label: "Hours", value: "Mon-Fri, 9am - 6pm EST" },
                                ],
                                color: "from-green-500 to-green-600",
                            },
                            {
                                icon: MapPin,
                                title: "Visit Us",
                                details: [
                                    { label: "Address", value: "Manila, Philippines" },
                                    { label: "City", value: "Metro Manila" },
                                ],
                                color: "from-purple-500 to-purple-600",
                            },
                        ].map((contact, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                    <contact.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{contact.title}</h3>
                                <div className="space-y-3">
                                    {contact.details.map((detail, idx) => (
                                        <div key={idx}>
                                            <p className="text-sm text-muted-foreground mb-1">{detail.label}</p>
                                            <p className="font-medium text-foreground">{detail.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-card border border-border rounded-2xl p-8 shadow-xl"
                        >
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                                <p className="text-muted-foreground">
                                    Fill out the form below and we'll get back to you within 24 hours.
                                </p>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-semibold">
                                        Full Name <span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        className="w-full focus:ring-2 focus:ring-[#cc0000]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-semibold">
                                        Email Address <span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        className="w-full focus:ring-2 focus:ring-[#cc0000]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block mb-2 text-sm font-semibold">
                                        Subject
                                    </label>
                                    <Input
                                        id="subject"
                                        placeholder="How can we help you?"
                                        className="w-full focus:ring-2 focus:ring-[#cc0000]"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block mb-2 text-sm font-semibold">
                                        Message <span className="text-red-600">*</span>
                                    </label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                        className="w-full resize-none focus:ring-2 focus:ring-[#cc0000]"
                                    />
                                </div>

                                <Button
                                    type="button"
                                    className="w-full bg-[#cc0000] hover:bg-[#a10006] text-white"
                                    size="lg"
                                    disabled
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message (Coming Soon)
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    By submitting this form, you agree to our Privacy Policy and Terms of Service.
                                </p>
                            </form>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-8">
                                <h3 className="text-xl font-bold mb-4">Why Contact Us?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Get personalized assistance from our support team",
                                        "Report technical issues or bugs",
                                        "Submit story ideas or press releases",
                                        "Inquire about partnership opportunities",
                                        "Request advertising information",
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-[#cc0000] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>



                            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                                <ImageWithFallback
                                    src="https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMG1lZXRpbmclMjBvZmZpY2V8ZW58MXx8fHwxNzcxMzQwNDM0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Team collaboration"
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold">
                            We're Here to Help
                        </h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Whether you have a question, feedback, or just want to say hello, our team is ready to assist you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                className="bg-[#cc0000] hover:bg-[#a10006] text-white"
                                onClick={() => window.location.href = 'mailto:support@homestv.com'}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Email Support
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                onClick={() => window.location.href = 'tel:+15551234567'}
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Call Us
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
