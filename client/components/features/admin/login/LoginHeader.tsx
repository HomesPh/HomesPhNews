import { Globe } from "lucide-react";

interface LoginHeaderProps {
    logo: {
        title: string;
        subtitle: string;
    };
    title: string;
    subtitle: string;
}

export default function LoginHeader({ logo, title, subtitle }: LoginHeaderProps) {
    return (
        <div className="text-center space-y-2 pb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
                <div className="bg-[#bf0000] p-2 rounded-lg text-white">
                    <Globe className="w-6 h-6" />
                </div>
                <div className="text-left leading-tight">
                    <h1 className="text-xl font-bold text-slate-900">{logo.title}</h1>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{logo.subtitle}</p>
                </div>
            </div>

            <div className="space-y-1 mt-4">
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
        </div>
    );
}
