import { articleService } from "@/lib/api-new";
import { Suspense } from "react";
import DashboardFeed from "@/components/features/dashboard/DashboardFeed";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Dashboard({ searchParams }: Props) {
  const { country: countryParam, category: categoryParam } = await searchParams;

  const country =
    (Array.isArray(countryParam) ? countryParam[0] : countryParam) || "Global";
  const category =
    (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) || "All";

  const response = articleService.feed({
    country: country !== "Global" ? country : undefined,
    category: category !== "All" ? category : undefined,
  });

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
