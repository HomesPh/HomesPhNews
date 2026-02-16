"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

// Define Metadata using a separate export or just omit if this is a Client Component page that needs metadata.
// Note: Metadata cannot be exported from a client component.
// Plan: Split into layout/page or just remove metadata for now if it hurts.
// Actually, in Next.js App Router, page.tsx can be client component but metadata export is not supported.
// To fix this proper way: Use page.tsx as server component and import a client component for the list.
// OR: Just keep it simple and lose metadata for this specific page for now, or use layout.
// Let's use a client component wrapper approach if needed, but for now, I will just remove "use client" from top
// and make the FAQ list a separate client component.
// BETTER APPROACH:
// page.tsx (Server Component) -> renders <FAQList /> (Client Component)

// Let's do it in one file by splitting? No, needs two files.
// Simpler: Just make page.tsx a client component and remove metadata export (or move metadata to layout if strictly needed).
// The user request didn't strictly ask for metadata, but it's good practice.
// I'll stick to making page.tsx a client component for the interactive accordion and remove the metadata export to avoid errors.

export default function FAQsPage() {
    const faqs = [
        {
            question: "How do I filter news by country?",
            answer: "You can filter news by selecting a country from the navigation bar at the top of the page, or by clicking on a country name in the footer menu."
        },
        {
            question: "Can I search for specific topics?",
            answer: "Yes! Use the search bar in the header to find articles related to specific keywords, topics, or events."
        },
        {
            question: "How do I simplify the footer links?",
            answer: "The footer displays a curated list of countries. You can click 'View All' to see content from all regions."
        },
        {
            question: "How can I advertise on HomesTV?",
            answer: (
                <span>
                    We offer various advertising packages. Please visit our <Link href="/advertise" className="text-[#c10007] hover:underline">Advertise</Link> page for more information.
                </span>
            )
        },
        {
            question: "How do I contact the HomesTV team?",
            answer: (
                <span>
                    You can reach out to us via our <Link href="/contact" className="text-[#c10007] hover:underline">Contact</Link> page. We'd love to hear from you!
                </span>
            )
        }
    ];

    return (
        <div className="max-w-[800px] mx-auto px-4 py-12 md:py-20 text-[#374151] dark:text-gray-300">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[#030213] dark:text-white mb-4">Frequently Asked Questions</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Find answers to common questions about using HomesTV.
                </p>
            </div>

            <div className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-4 text-left font-semibold text-lg hover:text-[#c10007] transition-colors focus:outline-hidden"
            >
                {question}
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}
