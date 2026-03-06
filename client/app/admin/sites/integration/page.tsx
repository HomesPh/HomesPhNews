"use client";

import { useState, useEffect, useMemo } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { getAdminSites } from "@/lib/api-v2/admin/service/sites/getAdminSites";
import { SiteResource } from "@/lib/api-v2/types/SiteResource";
import { Copy, Check, Code, Globe, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function IntegrationPage() {
    const [sites, setSites] = useState<SiteResource[]>([]);
    const [selectedSite, setSelectedSite] = useState<SiteResource | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const res = await getAdminSites({ status: 'active' });
                setSites(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedSite(res.data.data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch sites for integration", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSites();
    }, []);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const integrationCode = useMemo(() => {
        if (!selectedSite) return '';

        return `<!-- HomesTV News Subscription Widget -->
<div id="homestv-subscription-container">
    <form id="homestv-subscription-form" style="max-width: 400px; padding: 20px; border: 1px solid #e5e7eb; rounded: 8px;">
        <h3 style="margin-top: 0;">Subscribe to News</h3>
        <div style="margin-bottom: 15px;">
            <input type="email" id="sub-email" placeholder="Email Address" required 
                   style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
        </div>
        <button type="submit" id="sub-btn" 
                style="width: 100%; padding: 10px; background: #C10007; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Subscribe Now
        </button>
        <p id="sub-message" style="margin-top: 10px; font-size: 14px;"></p>
    </form>
</div>

<script>
document.getElementById('homestv-subscription-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('sub-btn');
    const msg = document.getElementById('sub-message');
    
    btn.disabled = true;
    btn.innerText = 'Subscribing...';

    const payload = {
        email: document.getElementById('sub-email').value,
        categories: ${JSON.stringify(selectedSite.categories)},
        countries: ["Philippines"], // Default
        time: "08:00 AM",
        frequency: "Daily"
    };

    try {
        const response = await fetch('${apiUrl}/api/external/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Site-Key': '${selectedSite.apiKey}'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            msg.innerText = 'Success! Welcome email sent.';
            msg.style.color = '#059669';
        } else {
            msg.innerText = result.message || 'Something went wrong';
            msg.style.color = '#dc2626';
        }
    } catch (error) {
        msg.innerText = 'Could not connect to the newsletter server.';
        msg.style.color = '#dc2626';
    } finally {
        btn.disabled = false;
        btn.innerText = 'Subscribe Now';
    }
});
</script>`;
    }, [selectedSite, apiUrl]);

    const handleCopy = () => {
        navigator.clipboard.writeText(integrationCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="API Integration Manager"
                description="Generate and manage subscription widgets for external partner sites"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Site Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Select Partner Site
                    </h2>
                    <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-sm">
                        <div className="divide-y divide-[#f3f4f6]">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="p-4 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    </div>
                                ))
                            ) : sites.map((site) => (
                                <button
                                    key={site.id}
                                    onClick={() => setSelectedSite(site)}
                                    className={cn(
                                        "w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group",
                                        selectedSite?.id === site.id ? "bg-blue-50/50 border-r-4 border-blue-600" : ""
                                    )}
                                >
                                    <div>
                                        <p className={cn(
                                            "text-[14px] font-semibold",
                                            selectedSite?.id === site.id ? "text-blue-700" : "text-[#374151]"
                                        )}>
                                            {site.name}
                                        </p>
                                        <p className="text-[12px] text-[#6b7280]">{site.domain}</p>
                                    </div>
                                    <ShieldCheck className={cn(
                                        "w-4 h-4 transition-opacity",
                                        selectedSite?.id === site.id ? "opacity-100 text-blue-600" : "opacity-0"
                                    )} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-[12px] text-amber-800 leading-relaxed">
                            <strong>Security Note:</strong> Widgets generated here use the site's unique API Key. Ensure the destination site is whitelisted in your server's CORS settings.
                        </p>
                    </div>
                </div>

                {/* Integration Details */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedSite ? (
                        <>
                            {/* Site Overview */}
                            <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-[18px] font-bold text-[#111827]">{selectedSite.name} Integration</h3>
                                    <p className="text-[14px] text-[#6b7280]">
                                        Assigned Categories: <span className="font-semibold text-[#374151]">{selectedSite.categories.join(', ')}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Code Generator */}
                            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-[#f3f4f6] flex items-center justify-between bg-gray-50/50">
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4 text-[#111827]" />
                                        <span className="text-[14px] font-bold text-[#111827]">Embed Code Snippet</span>
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-md text-[13px] font-medium text-[#374151] hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-600" />
                                                <span className="text-green-600">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>Copy Code</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="p-0 bg-[#1e293b] font-mono text-[13px] overflow-x-auto">
                                    <pre className="p-6 text-gray-300 leading-relaxed">
                                        <code>{integrationCode}</code>
                                    </pre>
                                </div>
                            </div>

                            {/* Implementation Instructions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-white rounded-xl border border-[#e5e7eb] shadow-sm">
                                    <h4 className="text-[14px] font-bold text-[#111827] mb-2">1. Paste HTML</h4>
                                    <p className="text-[13px] text-[#6b7280]">
                                        Place the container div exactly where you want the subscription form to appear on the partner site.
                                    </p>
                                </div>
                                <div className="p-5 bg-white rounded-xl border border-[#e5e7eb] shadow-sm">
                                    <h4 className="text-[14px] font-bold text-[#111827] mb-2">2. Load Script</h4>
                                    <p className="text-[13px] text-[#6b7280]">
                                        Ensure the script tag is included below the HTML or before the closing body tag of the destination page.
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white p-20 rounded-xl border border-dashed border-[#d1d5db] flex flex-col items-center justify-center text-center">
                            <Globe className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Please select a site to generate integration code.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
