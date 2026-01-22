import LandingHeader from "@/components/layout/header/LandingHeader";
import LandingCountryNav from "@/components/layout/nav/LandingCountryNav";
import LandingCategoryNav from "@/components/layout/nav/LandingCategoryNav";
import LandingFooter from "@/components/layout/footer/LandingFooter";
import { Categories, Countries } from "@/app/data";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <LandingHeader />
      <LandingCountryNav countries={Countries} />
      <LandingCategoryNav categories={Categories} />
      <main className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
