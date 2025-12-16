import { Link } from "@tanstack/react-router";
import {
  Camera,
  Coffee,
  Gamepad2,
  Headphones,
  Package,
  Shirt,
  Star,
  Watch,
} from "lucide-react";

const iconMap: Record<string, any> = {
  electronics: Headphones,
  fashion: Shirt,
  accessories: Watch,
  gaming: Gamepad2,
  photography: Camera,
  lifestyle: Coffee,
  "tech-gear": Package,
  premium: Star,
};

const categories = [
  {
    id: "1",
    title: "Electronics",
    handle: "electronics",
    description: "Latest tech gadgets and electronics",
  },
  {
    id: "2",
    title: "Fashion",
    handle: "fashion",
    description: "Trendy fashion items and accessories",
  },
  {
    id: "3",
    title: "Accessories",
    handle: "accessories",
    description: "Essential accessories for everyday use",
  },
  {
    id: "4",
    title: "Gaming",
    handle: "gaming",
    description: "Gaming gear and peripherals",
  },
  {
    id: "5",
    title: "Photography",
    handle: "photography",
    description: "Professional photography equipment",
  },
  {
    id: "6",
    title: "Lifestyle",
    handle: "lifestyle",
    description: "Products to enhance your lifestyle",
  },
  {
    id: "7",
    title: "Tech Gear",
    handle: "tech-gear",
    description: "Essential tech accessories",
  },
  {
    id: "8",
    title: "Premium",
    handle: "premium",
    description: "Premium quality products",
  },
];

export function Categories() {
  return (
    <section id="categories-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.handle] || Package;

            return (
              <Link
                key={category.id}
                to="/products"
                search={{ category: category.handle }}
                className="group cursor-pointer"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:border-black transition-all duration-300">
                  <IconComponent className="w-12 h-12 mx-auto mb-4 text-black group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold text-lg text-black">
                    {category.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
