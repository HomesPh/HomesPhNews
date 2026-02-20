"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    CreditCard, Calendar, CheckCircle2, ArrowRight, Download, XCircle,
    Globe, Layers, Shield, AlertTriangle, ChevronRight
} from "lucide-react";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Categories, Countries } from "@/app/data";
import Link from "next/link";

// ─── Data ──────────────────────────────────────────────────────────────────

const getCountryLabel = (id: string) => Countries.find(c => c.id === id)?.label ?? id;
const getCategoryLabel = (id: string) => Categories.find(c => c.id === id)?.label ?? id;

const MOCK_BILLING: { id: string; date: string; description: string; originalPrice: string; amount: string }[] = [
    {
        id: "INV-2026-0001",
        date: "Feb 20, 2026",
        description: "Pro Plan — Monthly",
        originalPrice: "₱4,999",
        amount: "₱0",
    },
    {
        id: "INV-2026-0002",
        date: "Jan 20, 2026",
        description: "Pro Plan — Monthly",
        originalPrice: "₱4,999",
        amount: "₱0",
    },
];

// ─── Plan map (mirrors /subscription/plans data) ─────────────────────────

const PLAN_MAP: Record<string, { name: string; price: number; credits: number }> = {
    basic: { name: 'Basic', price: 499, credits: 5 },
    professional: { name: 'Professional', price: 2499, credits: 20 },
    enterprise: { name: 'Enterprise', price: 4999, credits: 500 },
    free: { name: 'Starter', price: 0, credits: 100 },
    pro: { name: 'Pro', price: 2499, credits: 20 },
};

const FREE_CREDITS = 100; // promotional override

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
    const router = useRouter();
    const [prefs, setPrefs] = useState<{ countries: string[]; categories: string[] }>({ countries: [], categories: [] });
    const [companyName, setCompanyName] = useState("");
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelDone, setCancelDone] = useState(false);

    // Plan data from checkout
    const [planId, setPlanId] = useState('professional');
    const [startDate, setStartDate] = useState('');

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user_preferences");
            if (stored) {
                const parsed = JSON.parse(stored);
                setPrefs({ countries: parsed.countries || [], categories: parsed.categories || [] });
                setCompanyName(parsed.customization?.companyName || "");
            }
        } catch { }

        try {
            const sub = localStorage.getItem("user_subscription");
            if (sub) {
                const parsed = JSON.parse(sub);
                setPlanId(parsed.plan || 'professional');
                setStartDate(parsed.startDate ? new Date(parsed.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');
            }
        } catch { }
    }, []);

    const plan = PLAN_MAP[planId] || PLAN_MAP.professional;
    const renewsAt = startDate ? (() => {
        const d = new Date(startDate); d.setMonth(d.getMonth() + 1);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    })() : 'Mar 20, 2026';

    const handleDownloadInvoice = (inv: typeof MOCK_BILLING[0]) => {
        const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${inv.id}</title>
<style>body{font-family:Arial,sans-serif;max-width:600px;margin:40px auto;color:#111827}h1{color:#C10007}
table{width:100%;border-collapse:collapse;margin-top:24px}th{text-align:left;padding:10px;background:#f9fafb;border:1px solid #e5e7eb;font-size:13px;color:#6b7280}
td{padding:12px 10px;border-bottom:1px solid #f3f4f6;font-size:14px}.total{font-weight:bold;font-size:16px}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af}
s{color:#9ca3af}</style></head><body>
<div style="font-size:22px;font-weight:900">🏠 HomesTV</div>
<h1>Invoice</h1>
<p style="color:#6b7280;font-size:13px">Invoice #: ${inv.id}<br/>Date: ${inv.date}<br/>Company: ${companyName || "Subscriber"}</p>
<table><tr><th>Description</th><th>Original</th><th>Amount</th></tr>
<tr><td>${inv.description}</td><td><s>${inv.originalPrice}</s></td><td>${inv.amount}</td></tr>
<tr><td colspan="2" class="total">Total</td><td class="total">${inv.amount}</td></tr></table>
<div class="footer">HomesTV Systems © 2026 · support@homestv.com<br/>Computer-generated document — no signature required.</div>
</body></html>`;
        const win = window.open("", "_blank");
        if (win) { win.document.write(html); win.document.close(); win.print(); }
    };

    const handleConfirmCancel = () => {
        setIsCancelling(true);
        setTimeout(() => { setIsCancelling(false); setCancelDone(true); setShowCancelConfirm(false); }, 1500);
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="My Subscription"
                description="View your plan, preferences, billing history, and manage your subscription."
            />

            <div className="space-y-6">

                {/* ── Plan Card ─────────────────────────────────────────── */}
                <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <p className="text-[12px] text-[#9ca3af] uppercase tracking-wider font-semibold mb-1">Current Plan</p>
                            <h2 className="text-[22px] font-bold text-[#111827] tracking-[-0.5px]">{plan.name}</h2>
                        </div>
                        {/* Price: crossed-out real price → ₱0 promo */}
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-[16px] text-[#9ca3af] line-through">₱{plan.price.toLocaleString()}</span>
                                <span className="text-[28px] font-black text-[#111827] tracking-tight">₱0</span>
                            </div>
                            <p className="text-[12px] text-[#6b7280]">/ month <span className="text-green-600 font-semibold">(Free promo)</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                        <div className="bg-[#f9fafb] rounded-[8px] p-3 border border-[#f3f4f6]">
                            <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider font-semibold mb-1">Started</p>
                            <p className="text-[14px] font-semibold text-[#111827]">{startDate || 'Feb 20, 2026'}</p>
                        </div>
                        <div className="bg-[#f9fafb] rounded-[8px] p-3 border border-[#f3f4f6]">
                            <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider font-semibold mb-1">Next Renewal</p>
                            <p className="text-[14px] font-semibold text-[#111827]">{renewsAt}</p>
                        </div>
                        <div className="bg-[#f9fafb] rounded-[8px] p-3 border border-[#f3f4f6]">
                            <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider font-semibold mb-1">Billing</p>
                            <p className="text-[14px] font-semibold text-[#111827]">Monthly</p>
                        </div>
                        {/* Credits: crossed-out plan amount → 100 free */}
                        <div className="bg-[#f9fafb] rounded-[8px] p-3 border border-[#f3f4f6]">
                            <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider font-semibold mb-1">Credits</p>
                            <p className="text-[14px] font-semibold text-[#111827] flex items-center gap-1.5">
                                <span className="text-[#9ca3af] line-through text-[12px]">{plan.credits}</span>
                                <span>{FREE_CREDITS} / month</span>
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-[#f3f4f6] pt-4 flex flex-wrap gap-3">
                        <Link
                            href="/subscription/plans"
                            className="flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-[#3b82f6] border border-[#3b82f6] rounded-[8px] hover:bg-blue-50 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />Change Plan
                        </Link>
                        {!cancelDone && (
                            <button
                                onClick={() => setShowCancelConfirm(v => !v)}
                                className="flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-[#ef4444] border border-[#fecaca] rounded-[8px] hover:bg-red-50 transition-colors"
                            >
                                <XCircle className="w-4 h-4" />Cancel Plan
                            </button>
                        )}
                    </div>

                    {/* Cancel confirmation */}
                    {showCancelConfirm && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-[10px] p-4 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <p className="text-[14px] font-semibold text-red-800 mb-1">Cancel your plan?</p>
                                <p className="text-[13px] text-red-700 mb-3">Access continues until <strong>{renewsAt}</strong>. This cannot be undone.</p>
                                <div className="flex gap-2">
                                    <button onClick={handleConfirmCancel} disabled={isCancelling}
                                        className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white rounded-[6px] text-[13px] font-semibold hover:bg-red-700 disabled:opacity-50">
                                        {isCancelling && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />}
                                        {isCancelling ? "Cancelling..." : "Yes, Cancel"}
                                    </button>
                                    <button onClick={() => setShowCancelConfirm(false)}
                                        className="px-4 py-1.5 border border-red-200 rounded-[6px] text-[13px] font-semibold text-red-700 hover:bg-red-100">
                                        Keep Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {cancelDone && (
                        <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-[8px] text-[13px] text-amber-800 font-medium">
                            ✓ Cancellation scheduled. Access active until <strong>{renewsAt}</strong>.
                        </div>
                    )}
                </div>

                {/* ── Preferences (read-only) ────────────────────────────── */}
                <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-[16px] font-bold text-[#111827] tracking-[-0.5px]">Content Preferences</h3>
                            <p className="text-[13px] text-[#6b7280]">Set during onboarding — contact support to update.</p>
                        </div>
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-[11px] font-semibold uppercase tracking-wide">
                            <Shield className="w-3 h-3" />Read-only
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-[#C10007]" />
                                <span className="text-[14px] font-semibold text-[#111827]">Countries ({prefs.countries.length})</span>
                            </div>
                            {prefs.countries.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {prefs.countries.map(c => (
                                        <span key={c} className="px-2.5 py-1 bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] text-[12px] font-semibold rounded-full">
                                            {getCountryLabel(c)}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[13px] text-[#9ca3af] italic">All countries</p>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Layers className="w-4 h-4 text-[#C10007]" />
                                <span className="text-[14px] font-semibold text-[#111827]">Categories ({prefs.categories.length})</span>
                            </div>
                            {prefs.categories.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {prefs.categories.map(c => (
                                        <span key={c} className="px-2.5 py-1 bg-[#fef2f2] border border-[#fecaca] text-[#C10007] text-[12px] font-semibold rounded-full">
                                            {getCategoryLabel(c)}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[13px] text-[#9ca3af] italic">All categories</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Billing History Table ─────────────────────────────── */}
                <div className="bg-white rounded-[12px] border border-[#e5e7eb] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#f3f4f6]">
                        <h3 className="text-[16px] font-bold text-[#111827] tracking-[-0.5px]">Billing History</h3>
                    </div>
                    <table className="w-full text-[14px]">
                        <thead className="bg-[#f9fafb] border-b border-[#f3f4f6]">
                            <tr>
                                <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">Invoice</th>
                                <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">Description</th>
                                <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f3f4f6]">
                            {MOCK_BILLING.map(inv => (
                                <tr key={inv.id} className="hover:bg-[#f9fafb] transition-colors">
                                    <td className="px-6 py-4 font-mono text-[13px] text-[#374151]">{inv.id}</td>
                                    <td className="px-6 py-4 text-[#374151]">{inv.date}</td>
                                    <td className="px-6 py-4 text-[#374151]">{inv.description}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[#9ca3af] line-through mr-2 text-[13px]">{inv.originalPrice}</span>
                                        <span className="font-bold text-[#111827]">{inv.amount}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDownloadInvoice(inv)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#C10007] border border-[#fecaca] rounded-[6px] hover:bg-red-50 transition-colors ml-auto"
                                        >
                                            <Download className="w-3.5 h-3.5" />Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
