import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Advertise | HomesTV',
    description: 'Advertise with HomesTV and reach a global audience.',
};

export default function AdvertisePage() {
    return (
        <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-20 text-[#374151] dark:text-gray-300">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-[#030213] dark:text-white mb-6">Advertise with HomesTV</h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                    Reach a global audience engaged in Technology, Business, Politics, and more. Partner with us to amplify your brand's message.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a2d3e]">
                    <h3 className="text-2xl font-bold text-[#030213] dark:text-white mb-4">Display Ads</h3>
                    <p className="mb-6">
                        Place your banners in high-visibility areas across our homepage and article pages.
                    </p>
                    <ul className="space-y-2 mb-8">
                        <li className="flex items-center gap-2">
                            <span className="text-[#c10007] font-bold">✓</span> Leaderboard Banners
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-[#c10007] font-bold">✓</span> Sidebar Rectangles
                        </li>
                    </ul>
                </div>
                <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a2d3e] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#c10007] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                    <h3 className="text-2xl font-bold text-[#030213] dark:text-white mb-4">Sponsored Content</h3>
                    <p className="mb-6">
                        Publish articles that resonate with our audience while promoting your brand.
                    </p>
                    <ul className="space-y-2 mb-8">
                        <li className="flex items-center gap-2">
                            <span className="text-[#c10007] font-bold">✓</span> Native Articles
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-[#c10007] font-bold">✓</span> Newsletter Features
                        </li>
                    </ul>
                </div>
                <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-[#2a2d3e]">
                    <h3 className="text-2xl font-bold text-[#030213] dark:text-white mb-4">Custom Partnerships</h3>
                    <p className="mb-6">
                        Tailored campaigns to meet your specific marketing goals and KPIs.
                    </p>
                    <ul className="space-y-2 mb-8">
                        <li className="flex items-center gap-2">
                            <span className="text-[#c10007] font-bold">✓</span> Brand Takeovers
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-[#c10007] font-bold">✓</span> Event Sponsorships
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center bg-gray-100 dark:bg-[#1a1d2e] p-12 rounded-2xl">
                <h2 className="text-3xl font-bold text-[#030213] dark:text-white mb-6">Ready to grow your brand?</h2>
                <p className="text-lg mb-8">Contact our sales team to discuss your advertising needs.</p>
                <a href="mailto:ads@homestv.com" className="inline-block bg-[#c10007] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#a00006] transition-colors">
                    Contact Sales
                </a>
            </div>
        </div>
    );
}
