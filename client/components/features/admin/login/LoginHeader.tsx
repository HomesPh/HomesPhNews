
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
                <img
                    src="/images/HomesTV.png"
                    alt="HomesTV"
                    className="h-12 w-auto object-contain rounded-lg"
                />
                <div className="text-left leading-tight">
                    <h1 className="text-xl font-bold text-slate-900">{logo.title}</h1>
                    {logo.subtitle && (
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{logo.subtitle}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1 mt-4">
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
        </div>
    );
}
