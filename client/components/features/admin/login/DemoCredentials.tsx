interface DemoCredentialsProps {
    label: string;
    email: string;
    password?: string;
}

export default function DemoCredentials({ label, email, password }: DemoCredentialsProps) {
    return (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-semibold mb-1">{label}</p>
            <p>Email: <span className="font-medium text-blue-700">{email}</span></p>
            {password && <p>Password: <span className="font-medium text-blue-700">{password}</span></p>}
        </div>
    );
}
