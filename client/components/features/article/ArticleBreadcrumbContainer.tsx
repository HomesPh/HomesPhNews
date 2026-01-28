import { articleService } from "@/lib/api-new";
import ArticleBreadcrumb from "./ArticleBreadcrumb";
import { Categories, Countries } from "@/app/data";

interface ArticleBreadcrumbContainerProps {
  id: string;
}

export default async function ArticleBreadcrumbContainer({ id }: ArticleBreadcrumbContainerProps) {
  let article;
  try {
    const { data } = await articleService.getById(id);
    article = data;
  } catch (error) {
    return null;
  }

  if (!article) return null;

  const getCategoryLabel = (cat: string) =>
    Categories.find(
      (c) =>
        c.id.toLowerCase() === cat.toLowerCase() ||
        c.label.toLowerCase() === cat.toLowerCase()
    )?.label || cat;

  const getCountryLabel = (country: string) =>
    Countries.find(
      (c) =>
        c.id.toLowerCase() === country.toLowerCase() ||
        c.label.toLowerCase() === country.toLowerCase()
    )?.label || country;

  return (
    <ArticleBreadcrumb
      category={getCategoryLabel(article.category)}
      categoryId={article.category}
      country={getCountryLabel(article.country)}
      countryId={article.country}
    />
  );
}
