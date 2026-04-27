import { Link } from "@tanstack/react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";

interface CategoryWithImage {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface FeaturedCategoriesProps {
  initialData: Array<CategoryWithImage>;
}

export function FeaturedCategories({ initialData }: FeaturedCategoriesProps) {
  const { t } = useI18n();
  const categories = initialData;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            {t("shop.home.featuredCategories")}
          </h2>
          <p className="mt-2 text-base-content/60">
            {t("shop.home.featuredCategoriesDescription")}
          </p>
        </div>

        {/* category grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/products"
              search={{ category: category.name }}
              className="group relative overflow-hidden rounded-xl bg-base-200"
            >
              {/* image container */}
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={getRequiredFeaturedCategoryImage(
                    category.imageUrl,
                    category.name,
                  )}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* gradient mask */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* category name */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function getRequiredFeaturedCategoryImage(
  imageUrl: string | null,
  categoryName: string,
) {
  if (!imageUrl) {
    throw new Error(`Featured category image is required for ${categoryName}`);
  }

  return imageUrl;
}

export function FeaturedCategoriesLoading() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* title skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* category grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl bg-base-200"
            >
              {/* image container skeleton */}
              <div className="aspect-square w-full overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>

              {/* category name skeleton */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
