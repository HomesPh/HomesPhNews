export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="force-light min-h-screen bg-[#f9fafb]">
      {children}
    </div>
  );
}
