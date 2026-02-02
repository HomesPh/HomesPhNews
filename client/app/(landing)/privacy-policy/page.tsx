import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | HomesPhNews',
    description: 'Privacy Policy for HomesPhNews.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-[800px] mx-auto px-4 py-16 md:py-24">
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-8 tracking-[-0.5px]">Privacy Policy</h1>

            <div className="prose prose-lg prose-gray max-w-none">
                <p className="text-[#4b5563] text-lg mb-8">
                    At HomesPhNews, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">1. Information We Collect</h2>
                <p className="text-[#4b5563] mb-6">
                    We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features or resources we make available on our Site.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">2. How We Use Collected Information</h2>
                <p className="text-[#4b5563] mb-6">
                    HomesPhNews may collect and use Users personal information for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-[#4b5563] mb-6 space-y-2">
                    <li>To improve customer service</li>
                    <li>To personalize user experience</li>
                    <li>To improve our Site</li>
                    <li>To process payments</li>
                    <li>To send periodic emails</li>
                </ul>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">3. Web Browser Cookies</h2>
                <p className="text-[#4b5563] mb-6">
                    Our Site may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">4. Sharing Your Personal Information</h2>
                <p className="text-[#4b5563] mb-6">
                    We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">5. Third Party Websites</h2>
                <p className="text-[#4b5563] mb-6">
                    Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site.
                </p>

                <p className="text-[#6b7280] text-sm mt-12 pt-8 border-t border-gray-200">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </div>
    );
}
