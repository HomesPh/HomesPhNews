import { Suspense } from "react";
export const dynamic = 'force-dynamic';

import { cookies } from "next/headers";
import DashboardFeed from "@/components/features/dashboard/DashboardFeed";
import { getArticlesFeed, getRestaurants } from "@/lib/api-v2";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeletons";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function resolveParam(param: string | string[] | undefined): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

export default async function Dashboard({ searchParams }: Props) {
  const { country: countryParam, category: categoryParam, province: provinceParam, city: cityParam } = await searchParams;

  const country = resolveParam(countryParam) || "Global";
  const category = resolveParam(categoryParam) || "All";
  const province = resolveParam(provinceParam);
  const city = resolveParam(cityParam);

  // Read location cookie as fallback when no province/city is set via URL
  let cookieProvince: string | undefined;
  let cookieCity: string | undefined;
  if (!province && !city) {
    const cookieStore = await cookies();
    const locationCookie = cookieStore.get("user_location")?.value;
    if (locationCookie) {
      try {
        const parsed = JSON.parse(locationCookie);
        cookieProvince = parsed.province;
        cookieCity = parsed.city;
      } catch {
        // ignore malformed cookie
      }
    }
  }

  const activeProvince = province ?? cookieProvince;
  const activeCity = city ?? cookieCity;

  const response = getArticlesFeed({
    country: country !== "Global" ? country : undefined,
    category: (category !== "All" && category !== "Articles") ? category : undefined,
    province: activeProvince,
    city: activeCity,
  });

  const restaurants = getRestaurants({
    country: country !== "Global" ? country : undefined,
    limit: 10,
  });

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardFeed
        country={country}
        category={category}
        province={activeProvince}
        city={activeCity}
        feed={response}
        restaurants={restaurants}
      />
    </Suspense>
  );
}
