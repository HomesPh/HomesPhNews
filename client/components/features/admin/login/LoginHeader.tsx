
interface LoginHeaderProps {
    logo: {
        title: string;
        subtitle: string;
    };
    title?: string;
    subtitle: string;
}

export default function LoginHeader({ logo, title, subtitle }: LoginHeaderProps) {
    return (
        <div className="text-center space-y-3 pb-4">
            <div className="flex items-center justify-center mb-2">
                <img
                    src="/images/HomesLogo.png"
                    alt="Homes.ph News"
                    className="h-7 w-auto object-contain"
                />
            </div>

            <div className="space-y-1">
                {title && <h2 className="text-3xl font-bold text-slate-900">{title}</h2>}
                <p className="text-base text-slate-500">{subtitle}</p>
            </div>
        </div>
    );
}
