import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | HomesTV',
    description: 'Get in touch with the HomesTV team.',
};

export default function ContactPage() {
    return (
        <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-20 text-[#374151] dark:text-gray-300">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-[#030213] dark:text-white mb-6">Get in Touch</h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                    Have questions, feedback, or a story to share? We'd love to hear from you.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a2d3e]">
                    <h2 className="text-2xl font-bold text-[#030213] dark:text-white mb-8">Contact Information</h2>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-[#c10007]">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#030213] dark:text-white mb-1">Email Us</h3>
                                <p className="mb-1">General Inquiries: <a href="mailto:info@homestv.com" className="text-[#c10007] hover:underline">info@homestv.com</a></p>
                                <p>Support: <a href="mailto:support@homestv.com" className="text-[#c10007] hover:underline">support@homestv.com</a></p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-[#c10007]">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#030213] dark:text-white mb-1">Call Us</h3>
                                <p className="mb-1">+1 (555) 123-4567</p>
                                <p className="text-sm text-gray-500">Mon-Fri, 9am - 6pm EST</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-[#c10007]">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#030213] dark:text-white mb-1">Visit Us</h3>
                                <p>
                                    123 News Avenue, Suite 100<br />
                                    New York, NY 10001,<br />
                                    United States
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form Placeholder */}
                <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a2d3e]">
                    <h2 className="text-2xl font-bold text-[#030213] dark:text-white mb-8">Send us a Message</h2>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <div className="h-10 w-full bg-gray-50 dark:bg-[#030213] border border-gray-200 dark:border-gray-700 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <div className="h-10 w-full bg-gray-50 dark:bg-[#030213] border border-gray-200 dark:border-gray-700 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                            <div className="h-32 w-full bg-gray-50 dark:bg-[#030213] border border-gray-200 dark:border-gray-700 rounded-lg" />
                        </div>
                        <button disabled className="w-full bg-[#c10007] text-white font-bold py-3 px-4 rounded-lg opacity-50 cursor-not-allowed">
                            Send Message (Coming Soon)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
