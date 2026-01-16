"use client";

import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

export type LandingCountryNavProps = {
  countries: {
    id: string;
    label: string;
  }[];
}

export default function LandingCountryNav({ countries }: LandingCountryNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // change search parameter 'country'
  const handleChangeCountryTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("country", value);
    } else {
      params.delete("country");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <nav className="w-full border-b sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto flex flex-row justify-center items-center py-2 px-4 sm:px-6 lg:px-8">
        <Tabs
          defaultValue="all"
          value={searchParams.get("country") || "all"}
          onValueChange={(v) => handleChangeCountryTab(v)}
        >
          <TabsList className="w-full bg-transparent flex flex-row gap-7">
            {countries.map((c) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className={
                  clsx([
                    // inactive tab
                    "shadow-none border-0 rounded-none",
                    // active tab
                    "data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500"
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