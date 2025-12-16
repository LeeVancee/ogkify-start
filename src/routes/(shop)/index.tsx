import { createFileRoute } from "@tanstack/react-router";
import {
  FeaturedCategories,
  FeaturedCategoriesLoading,
} from "@/components/shop/home/featured-categories";
import {
  FeaturedProducts,
  FeaturedProductsLoading,
} from "@/components/shop/home/featured-products";
import HeroSection from "@/components/shop/home/hero-section";
import { getCategories } from "@/server/categories.server";
import { getFeaturedProducts } from "@/server/get-featured-products.server";

export const Route = createFileRoute("/(shop)/")({
  component: RouteComponent,
  pendingComponent: HomePendingComponent,
  loader: async () => {
    const [featuredProducts, categories] = await Promise.all([
      getFeaturedProducts({ data: 4 }),
      getCategories(),
    ]);

    return {
      featuredProducts,
      categories,
    };
  },
  staleTime: 1000 * 60 * 30, // 30 minutes
  gcTime: 1000 * 60 * 60, // 1 hour
});

function HomePendingComponent() {
  return (
    <div>
      <HeroSection />
      <div className="mx-auto px-4 py-12">
        <FeaturedProductsLoading />
        <FeaturedCategoriesLoading />
      </div>
    </div>
  );
}

function RouteComponent() {
  const { featuredProducts, categories } = Route.useLoaderData();

  return (
    <div>
      <HeroSection />
      <div className="mx-auto px-4 py-12">
        <FeaturedProducts initialData={featuredProducts} />
        <FeaturedCategories initialData={categories} />
      </div>
    </div>
  );
}
