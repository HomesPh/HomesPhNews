"use client";

import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

export type LandingCategoryNavProps = {
  categories: {
    id: string;
    label: string;
  }[];
}

export default function LandingCategoryNav({ categories }: LandingCategoryNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // TODO: Supposed to change URL parameter 'country'
  const handleChangeCategoryTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <nav className="w-full border-b sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto flex flex-row justify-center items-center py-2 px-4 sm:px-6 lg:px-8">
        <Tabs
          defaultValue="all"
          //value={ }
          onValueChange={(v) => handleChangeCategoryTab(v)}
        >
          <TabsList className="w-full bg-transparent flex flex-row gap-7">
            {categories.map((c) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className={
                  clsx([
                    // inactive tab
                    "shadow-none border-0 rounded-none py-4",
                    // active tab
                    "data-[state=active]:shadow-none data-[state=active]:rounded-md data-[state=active]:bg-foreground data-[state=active]:text-white"
                  ])
                }
              >
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </nav>
  )
}