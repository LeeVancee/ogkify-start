import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCategories } from "@/server/categories";
import { getFeaturedProducts } from "@/server/get-featured-products";

export const Route = createFileRoute("/(shop)/")({
  component: RouteComponent,
  loader: async () => {
    const [featuredProducts, categories] = await Promise.all([
      getFeaturedProducts({ data: 7 }),
      getCategories(),
    ]);

    return {
      featuredProducts,
      categories,
    };
  },
  staleTime: 1000 * 60 * 30,
  gcTime: 1000 * 60 * 60,
});

function RouteComponent() {
  const { featuredProducts, categories } = Route.useLoaderData();
  const featured = featuredProducts.slice(0, 4);
  const newArrivals = featuredProducts.slice(4, 7);

  return (
    <>
      <section className="relative overflow-hidden bg-muted/40">
        <div className="shop-shell flex flex-col items-center gap-8 py-16 sm:py-24 lg:flex-row lg:gap-16 lg:py-32">
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Curated Selection
            </p>
            <h1 className="text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Built for Everyday Play
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Discover standout gear, clean visuals, and a lineup picked for
              your next session.
            </p>
            <Link to="/products" className="shop-pill-button mt-8">
              Explore Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="w-full max-w-lg flex-1">
            <img
              src="/billboard.webp"
              alt="Spring Summer Collection"
              className="w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="shop-shell py-16 sm:py-20">
        <h2 className="mb-10 text-center text-2xl font-light tracking-tight text-foreground">
          Shop By Category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((category) => {
            if (!category.imageUrl) {
              throw new Error(
                `Category image is missing for category ${category.id}`,
              );
            }

            return (
              <Link
                key={category.id}
                to="/products"
                search={{ category: category.name }}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/20 transition-colors group-hover:bg-foreground/30" />
                <span className="absolute bottom-4 left-4 text-sm font-medium tracking-wide text-background">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="shop-shell pb-16 sm:pb-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-light tracking-tight text-foreground">
            Featured Picks
          </h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product) => (
            <Link
              key={product.id}
              to="/product/$id"
              params={{ id: product.id }}
              className="group"
            >
              <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-muted/40">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="truncate text-sm font-medium text-foreground">
                {product.name}
              </h3>
              <div className="mt-1 text-sm text-foreground">
                {formatPrice(product.price)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {newArrivals.length > 0 ? (
        <section className="bg-muted/40">
          <div className="shop-shell py-16 sm:py-20">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-light tracking-tight text-foreground">
                New Arrivals
              </h2>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {newArrivals.map((product) => (
                <Link
                  key={product.id}
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="group flex gap-4 rounded-xl bg-background p-4 transition-shadow hover:shadow-md"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {product.description}
                    </p>
                    <span className="mt-2 block text-sm text-foreground">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
