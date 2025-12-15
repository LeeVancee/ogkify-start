import { Link } from "@tanstack/react-router";
import { ShoppingBag, Star, TrendingUp, Truck } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      <section className="relative">
        <div className=" px-4 py-16 md:px-6 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Shop the Latest Trends
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover our curated collection of premium products at
                  unbeatable prices.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 h-11 px-8 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-square">
              <img
                src="/billboard.webp"
                alt="Hero Image"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  On orders over $25
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Quality Products</h3>
                <p className="text-sm text-muted-foreground">
                  Curated selection
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Latest Trends</h3>
                <p className="text-sm text-muted-foreground">
                  Updated regularly
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">
                  Safe transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
