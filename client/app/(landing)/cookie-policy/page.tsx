import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy | HomesPhNews',
    description: 'Cookie Policy for HomesPhNews.',
};

export default function CookiePolicyPage() {
    return (
        <div className="max-w-[800px] mx-auto px-4 py-16 md:py-24">
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-8 tracking-[-0.5px]">Cookie Policy</h1>

            <div className="prose prose-lg prose-gray max-w-none">
                <p className="text-[#4b5563] text-lg mb-8">
                    This Cookie Policy explains how HomesPhNews uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">1. What are cookies?</h2>
                <p className="text-[#4b5563] mb-6">
                    Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">2. Why do we use cookies?</h2>
                <p className="text-[#4b5563] mb-6">
                    We use first party and third party cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Websites for advertising, analytics and other purposes.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">3. Types of Cookies We Use</h2>
                <ul className="list-disc pl-6 text-[#4b5563] mb-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> These are cookies that are strictly necessary to provide you with services available through our Websites.</li>
                    <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our Websites but are non-essential to their use.</li>
                    <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Websites are being used or how effective our marketing campaigns are.</li>
                    <li><strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you.</li>
                </ul>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">4. How can I control cookies?</h2>
                <p className="text-[#4b5563] mb-6">
                    You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                </p>

                <p className="text-[#6b7280] text-sm mt-12 pt-8 border-t border-gray-200">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </div>
    );
}
