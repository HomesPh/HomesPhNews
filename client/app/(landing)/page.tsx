import { Suspense } from "react";
export const dynamic = 'force-dynamic';

import DashboardFeed from "@/components/features/dashboard/DashboardFeed";
import { getArticlesFeed } from "@/lib/api-v2";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Dashboard({ searchParams }: Props) {
  const { country: countryParam, category: categoryParam } = await searchParams;

  const country =
    (Array.isArray(countryParam) ? countryParam[0] : countryParam) || "Global";
  const category =
    (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) || "All";

  const response = getArticlesFeed({
    country: country !== "Global" ? country : undefined,
    category: (category !== "All" && category !== "Articles") ? category : undefined,
  }).then((res) => res.data);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardFeed
        country={country}
        category={category}
        feed={response}
      />
    </Suspense>
  );
}
