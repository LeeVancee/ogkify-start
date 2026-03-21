import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  // Get dynamic store name for the hero title

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Simplified container to match other components */}
      <div className="container mx-auto px-4 h-screen flex items-center">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left content - simplified */}
            <div className="space-y-8">
              {/* Simplified badge */}
              <Badge
                variant="outline"
                className="border-black text-black bg-transparent px-4 py-2 w-fit"
              >
                <Star className="w-4 h-4 mr-2 fill-black" />
                "Demo Store"
              </Badge>

              {/* Dynamic hero title */}
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
                  <>
                    Welcome to
                    <span className="block">{"Demo Store"}</span>
                  </>
                </h1>

                <p className="text-xl text-black/70 mb-8 max-w-lg leading-relaxed">
                  "Discover amazing products that blend style, innovation, and
                  quality."
                </p>
              </div>

              {/* Functional buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-black text-white hover:bg-black/90 text-lg px-8 py-6 border-0"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white text-lg px-8 py-6 bg-transparent"
                  >
                    Explore Collections
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right content - show placeholder or real product */}
            <div>
              <img src="/billboard.webp" alt="Demo Store" />
            </div>
          </div>

          {/* Bottom stats - show real or placeholder data */}
          {/*    <div className="mt-20 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-black">10K+</p>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-black"> "50+"</p>
                <p className="text-gray-600 text-sm">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">99%</p>
                <p className="text-gray-600 text-sm">Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">24/7</p>
                <p className="text-gray-600 text-sm">Support</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
