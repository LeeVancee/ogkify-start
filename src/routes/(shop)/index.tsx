import { createFileRoute } from "@tanstack/react-router";
import { Categories } from "@/components/shop/home/categories";
import {
  FeaturedCategories,
  FeaturedCategoriesLoading,
} from "@/components/shop/home/featured-categories";
import {
  FeaturedProducts,
  FeaturedProductsLoading,
} from "@/components/shop/home/featured-products";
import { Hero } from "@/components/shop/home/hero";
import HeroSection from "@/components/shop/home/hero-section";
import { Newsletter } from "@/components/shop/home/newsletter";
import { getCategories } from "@/server/categories";
import { getFeaturedProducts } from "@/server/get-featured-products";

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
      <Hero />
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
      <Hero />
      <Categories />

      <FeaturedProducts initialData={featuredProducts} />
      <Newsletter />
    </div>
  );
}
