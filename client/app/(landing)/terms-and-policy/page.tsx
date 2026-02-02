import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Policy | HomesPhNews',
    description: 'Terms and conditions for using HomesPhNews.',
};

export default function TermsAndPolicyPage() {
    return (
        <div className="max-w-[800px] mx-auto px-4 py-16 md:py-24">
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-8 tracking-[-0.5px]">Terms & Policy</h1>

            <div className="prose prose-lg prose-gray max-w-none">
                <p className="text-[#4b5563] text-lg mb-8">
                    Welcome to HomesPhNews. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions concerning your use of the website.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">1. Acceptance of Terms</h2>
                <p className="text-[#4b5563] mb-6">
                    By accessing and using HomesPhNews, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">2. Intellectual Property</h2>
                <p className="text-[#4b5563] mb-6">
                    All content included on this site, such as text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of HomesPhNews or its content suppliers and protected by international copyright laws.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">3. User Conduct</h2>
                <p className="text-[#4b5563] mb-6">
                    You agree to use the website only for lawful purposes. You are prohibited from posting on or transmitting through the website any unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, sexually explicit, profane, hateful, racially, ethnically, or otherwise objectionable material of any kind.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">4. Disclaimer of Warranties</h2>
                <p className="text-[#4b5563] mb-6">
                    The site is provided on an "as is" and "as available" basis. HomesPhNews makes no representations or warranties of any kind, express or implied, as to the operation of the site or the information, content, materials, or products included on this site.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">5. Limitation of Liability</h2>
                <p className="text-[#4b5563] mb-6">
                    HomesPhNews will not be liable for any damages of any kind arising from the use of this site, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
                </p>

                <h2 className="text-[24px] font-bold text-[#111827] mt-8 mb-4">6. Changes to Terms</h2>
                <p className="text-[#4b5563] mb-6">
                    HomesPhNews reserves the right to modify these terms of use at any time without notice. Please review these terms regularly to ensure you are aware of any changes made by us.
                </p>

                <p className="text-[#6b7280] text-sm mt-12 pt-8 border-t border-gray-200">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>
        </div>
    );
}
