import Link from "next/link";

interface ArticleBreadcrumbProps {
  category: string;
  categoryId?: string;
  country: string;
  countryId?: string;
}

export default function ArticleBreadcrumb({ category, categoryId, country, countryId }: ArticleBreadcrumbProps) {
  return (
    <p className="font-normal text-[16px] text-[#4b5563] tracking-[-0.5px] leading-[24px] mb-6">
      <Link href="/" className="hover:text-[#c10007] transition-colors">Home</Link>
      {"  /  "}
      <Link
        href={categoryId ? `/?category=${categoryId}` : "/"}
        className="hover:text-[#c10007] transition-colors"
      >
        {category}
      </Link>
      {"  /  "}
      <Link
        href={countryId ? `/?country=${countryId}` : "/"}
        className="hover:text-[#c10007] transition-colors"
      >
        {country}
      </Link>
    </p>
  );
}
