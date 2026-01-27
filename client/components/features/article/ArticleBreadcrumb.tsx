import Link from "next/link";

interface ArticleBreadcrumbProps {
  category?: string;
  categoryId?: string;
  country?: string;
  countryId?: string;
  homeHref?: string;
  homeLabel?: string;
  categoryHref?: string;
  countryHref?: string;
}

export default function ArticleBreadcrumb({
  category,
  categoryId,
  country,
  countryId,
  homeHref = "/",
  homeLabel = "Home",
  categoryHref,
  countryHref
}: ArticleBreadcrumbProps) {
  const finalCategoryHref = categoryHref || (categoryId ? `/?category=${categoryId}` : "/");
  const finalCountryHref = countryHref || (countryId ? `/?country=${countryId}` : "/");

  return (
    <p className="font-normal text-[16px] text-[#4b5563] tracking-[-0.5px] leading-[24px] mb-6">
      <Link href={homeHref} className="hover:text-[#c10007] transition-colors">{homeLabel}</Link>
      {category && (
        <>
          {"  /  "}
          <Link
            href={finalCategoryHref}
            className="hover:text-[#c10007] transition-colors shadow-none"
          >
            {category}
          </Link>
        </>
      )}
      {country && (
        <>
          {"  /  "}
          <Link
            href={finalCountryHref}
            className="hover:text-[#c10007] transition-colors"
          >
            {country}
          </Link>
        </>
      )}
    </p>
  );
}
