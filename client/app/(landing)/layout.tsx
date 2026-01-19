import LandingHeader from "@/components/layout/header/LandingHeader";
import LandingCountryNav from "@/components/layout/nav/LandingCountryNav";
import LandingCategoryNav from "@/components/layout/nav/LandingCategoryNav";
import { Categories, Countries } from "../data";
import LandingFooter from "@/components/layout/footer/LandingFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  return (
    <>
      <LandingHeader />
      <LandingCountryNav countries={Countries} />
      <LandingCategoryNav categories={Categories} />
      <main className="flex-1 w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {children}
        </div>
      </main>
      <LandingFooter />
    </>
  );
}