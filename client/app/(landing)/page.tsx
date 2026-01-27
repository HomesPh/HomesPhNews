import { getArticlesList } from "@/lib/api";
import getQueryClient from "@/lib/getQueryClient";
import DashboardFeed from "@/components/features/dashboard/DashboardFeed";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "@/components/providers/Hydrate";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Dashboard({ searchParams }: Props) {
  const { country: countryParam, category: categoryParam } = await searchParams;

  const country =
    (Array.isArray(countryParam) ? countryParam[0] : countryParam) || "Global";
  const category =
    (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) || "All";

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["articles", country, category],
    queryFn: () =>
      getArticlesList({
        mode: "feed",
        country: country !== "Global" ? country : undefined,
        category: category !== "All" ? category : undefined,
      }),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <DashboardFeed country={country} category={category} />
    </Hydrate>
  );
}
