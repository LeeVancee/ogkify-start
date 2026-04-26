import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the seed script.");
}

const client = postgres(databaseUrl);
const db = drizzle({ client, schema });

type EditionValue = "STANDARD" | "DELUXE" | "LIMITED" | "PREMIUM";

const editionTypes: Array<{ name: string; value: EditionValue }> = [
  { name: "Standard", value: "STANDARD" },
  { name: "Deluxe", value: "DELUXE" },
  { name: "Limited Edition", value: "LIMITED" },
  { name: "Premium", value: "PREMIUM" },
];

const catalogCategories = [
  { name: "Apparel", imageSeed: "apparel showroom fashion rack" },
  { name: "Toys", imageSeed: "colorful toys shelf" },
  { name: "Merch", imageSeed: "merchandise gift table" },
  { name: "Mobile & Tech", imageSeed: "mobile tech accessories desk" },
  { name: "Sports", imageSeed: "sports gear training floor" },
  { name: "Home & Lifestyle", imageSeed: "modern home lifestyle shelf" },
] as const;

type CategoryName = (typeof catalogCategories)[number]["name"];
type ImageLayout = "portrait" | "square" | "landscape";

type CatalogProduct = {
  category: CategoryName;
  name: string;
  description: string;
  price: number;
  isFeatured: boolean;
  editions: EditionValue[];
  imageSeed: string;
  imageLayout?: ImageLayout;
  imageCount?: 2 | 3;
};

const categoryImageSeedMap = Object.fromEntries(
  catalogCategories.map((category) => [category.name, category.imageSeed]),
) as Record<CategoryName, string>;

const productsData: CatalogProduct[] = [
  {
    category: "Apparel",
    name: "Everyday Fleece Hoodie",
    description:
      "A soft midweight hoodie with a relaxed silhouette, brushed interior, and clean details for daily layering.",
    price: 64.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageSeed: "black fleece hoodie fashion product",
    imageCount: 3,
  },
  {
    category: "Apparel",
    name: "Oversized Cotton Tee",
    description:
      "A heavyweight cotton tee with dropped shoulders, breathable structure, and an easy oversized fit.",
    price: 32.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "oversized cotton t shirt studio",
  },
  {
    category: "Apparel",
    name: "Varsity Jacket",
    description:
      "A structured varsity jacket with contrast trims, snap closure, and a polished streetwear profile.",
    price: 94.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "varsity jacket fashion studio",
    imageCount: 3,
  },
  {
    category: "Apparel",
    name: "Utility Cargo Pants",
    description:
      "Durable cargo pants with roomy pockets, tapered cuffs, and a practical everyday workwear finish.",
    price: 58.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "cargo pants apparel product",
  },
  {
    category: "Apparel",
    name: "Canvas Market Tote",
    description:
      "A sturdy canvas tote with generous capacity, reinforced handles, and a minimal retail-ready shape.",
    price: 24.99,
    isFeatured: false,
    editions: ["STANDARD", "LIMITED"],
    imageSeed: "canvas tote bag lifestyle",
    imageLayout: "square",
  },
  {
    category: "Apparel",
    name: "Classic Snapback Cap",
    description:
      "A structured snapback cap with a curved brim, adjustable strap, and crisp embroidered front panel.",
    price: 22.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageSeed: "snapback cap product photography",
    imageLayout: "square",
  },
  {
    category: "Toys",
    name: "Creative Building Block Set",
    description:
      "A modular building set with colorful pieces, simple instructions, and open-ended play for display or gifting.",
    price: 44.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "building blocks colorful toy",
    imageLayout: "square",
    imageCount: 3,
  },
  {
    category: "Toys",
    name: "Soft Plush Animal",
    description:
      "A cuddly plush companion made with soft fabric, embroidered details, and a friendly rounded shape.",
    price: 27.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "soft plush animal toy",
    imageLayout: "square",
  },
  {
    category: "Toys",
    name: "Remote Racer Car",
    description:
      "A compact remote-control racer with responsive steering, durable wheels, and fast indoor play appeal.",
    price: 39.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageSeed: "remote control toy car",
  },
  {
    category: "Toys",
    name: "Woodland Puzzle Box",
    description:
      "A richly illustrated puzzle box with sturdy pieces, calm artwork, and a satisfying family table activity.",
    price: 18.99,
    isFeatured: false,
    editions: ["STANDARD", "LIMITED"],
    imageSeed: "jigsaw puzzle box toy",
    imageLayout: "square",
  },
  {
    category: "Toys",
    name: "Wooden Train Set",
    description:
      "A timeless wooden train set with track pieces, small cars, and a warm natural finish for imaginative play.",
    price: 49.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "wooden train toy set",
    imageLayout: "landscape",
  },
  {
    category: "Toys",
    name: "Fidget Toy Pack",
    description:
      "A pocketable fidget assortment with tactile textures, bright colors, and easy add-on gift appeal.",
    price: 14.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "fidget toy pack colorful",
    imageLayout: "square",
  },
  {
    category: "Merch",
    name: "Enamel Pin Collector Set",
    description:
      "A polished enamel pin set with metal backing, themed artwork, and a display-ready backing card.",
    price: 16.99,
    isFeatured: true,
    editions: ["STANDARD", "LIMITED", "PREMIUM"],
    imageSeed: "enamel pins merchandise",
    imageLayout: "square",
  },
  {
    category: "Merch",
    name: "Vinyl Sticker Pack",
    description:
      "A durable sticker pack with matte vinyl finish, assorted sizes, and a lightweight envelope presentation.",
    price: 9.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "vinyl sticker pack merch",
    imageLayout: "square",
  },
  {
    category: "Merch",
    name: "Acrylic Keychain Duo",
    description:
      "A pair of acrylic keychains with clear edges, metal clasps, and compact everyday carry styling.",
    price: 12.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageSeed: "acrylic keychain merchandise",
    imageLayout: "square",
  },
  {
    category: "Merch",
    name: "Gallery Poster Bundle",
    description:
      "A rolled poster bundle printed on smooth stock, made for wall displays, dorm rooms, and gift boxes.",
    price: 24.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "poster bundle wall art",
    imageCount: 3,
  },
  {
    category: "Merch",
    name: "Ceramic Logo Mug",
    description:
      "A clean ceramic mug with a comfortable handle, glossy finish, and everyday desk-friendly capacity.",
    price: 15.99,
    isFeatured: false,
    editions: ["STANDARD", "LIMITED"],
    imageSeed: "ceramic mug merchandise",
    imageLayout: "square",
  },
  {
    category: "Merch",
    name: "Badge Lanyard Kit",
    description:
      "A woven lanyard and badge holder kit designed for events, conventions, campuses, and office use.",
    price: 11.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "lanyard badge holder merch",
    imageLayout: "square",
  },
  {
    category: "Mobile & Tech",
    name: "MagSafe Phone Case",
    description:
      "A slim protective phone case with magnetic charging support, raised edges, and a soft-touch finish.",
    price: 29.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageSeed: "phone case mobile accessory",
    imageLayout: "square",
  },
  {
    category: "Mobile & Tech",
    name: "Wireless Charging Pad",
    description:
      "A low-profile wireless charging pad with a non-slip surface, minimal cable routing, and desk-ready design.",
    price: 36.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "wireless charging pad tech",
    imageLayout: "square",
    imageCount: 3,
  },
  {
    category: "Mobile & Tech",
    name: "Padded Tablet Sleeve",
    description:
      "A protective tablet sleeve with soft lining, slim storage space, and a clean travel-friendly profile.",
    price: 34.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "tablet sleeve tech accessory",
  },
  {
    category: "Mobile & Tech",
    name: "Earbuds Travel Case",
    description:
      "A compact earbuds case with durable shell protection, clip hardware, and pocket-friendly proportions.",
    price: 18.99,
    isFeatured: false,
    editions: ["STANDARD", "LIMITED"],
    imageSeed: "earbuds case tech accessory",
    imageLayout: "square",
  },
  {
    category: "Mobile & Tech",
    name: "Cable Organizer Roll",
    description:
      "A tidy cable organizer roll with elastic loops, mesh pockets, and room for chargers, adapters, and cords.",
    price: 21.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "cable organizer roll travel tech",
  },
  {
    category: "Mobile & Tech",
    name: "Adjustable Phone Stand",
    description:
      "A foldable phone stand with adjustable angle, stable base, and a compact footprint for desks and kitchens.",
    price: 17.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "phone stand desk accessory",
    imageLayout: "square",
  },
  {
    category: "Sports",
    name: "Non-Slip Yoga Mat",
    description:
      "A cushioned yoga mat with textured grip, easy roll-up storage, and balanced support for daily movement.",
    price: 42.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "yoga mat fitness product",
    imageLayout: "landscape",
    imageCount: 3,
  },
  {
    category: "Sports",
    name: "Insulated Water Bottle",
    description:
      "A stainless steel bottle with double-wall insulation, leak-resistant cap, and a clean gym bag profile.",
    price: 26.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageSeed: "insulated sports water bottle",
    imageLayout: "square",
  },
  {
    category: "Sports",
    name: "Resistance Band Set",
    description:
      "A portable band set with multiple resistance levels, storage pouch, and versatile training use cases.",
    price: 19.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "resistance bands fitness set",
    imageLayout: "square",
  },
  {
    category: "Sports",
    name: "Indoor Outdoor Basketball",
    description:
      "A durable basketball with reliable grip, consistent bounce, and a surface built for casual indoor or outdoor play.",
    price: 31.99,
    isFeatured: false,
    editions: ["STANDARD", "PREMIUM"],
    imageSeed: "basketball sports product",
    imageLayout: "square",
  },
  {
    category: "Sports",
    name: "Running Waist Pack",
    description:
      "A lightweight waist pack with secure storage, adjustable strap, and low-bounce fit for runs and walks.",
    price: 23.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "running waist pack sports",
  },
  {
    category: "Sports",
    name: "Quick-Dry Training Towel",
    description:
      "A soft quick-dry towel with compact packing, absorbent weave, and reliable post-workout utility.",
    price: 13.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageSeed: "training towel gym product",
    imageLayout: "square",
  },
  {
    category: "Home & Lifestyle",
    name: "Adjustable Desk Lamp",
    description:
      "A modern desk lamp with adjustable arm, warm light output, and a clean workspace-friendly silhouette.",
    price: 48.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "adjustable desk lamp home",
    imageCount: 3,
  },
  {
    category: "Home & Lifestyle",
    name: "Matte Ceramic Vase",
    description:
      "A sculptural ceramic vase with a matte finish, simple proportions, and easy styling for shelves or tables.",
    price: 35.99,
    isFeatured: false,
    editions: ["STANDARD", "LIMITED", "PREMIUM"],
    imageSeed: "matte ceramic vase home decor",
    imageLayout: "square",
  },
  {
    category: "Home & Lifestyle",
    name: "Woven Throw Blanket",
    description:
      "A cozy woven throw with soft texture, neutral styling, and enough weight for sofa or bedroom layering.",
    price: 54.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageSeed: "woven throw blanket lifestyle",
    imageLayout: "landscape",
  },
  {
    category: "Home & Lifestyle",
    name: "Cotton Storage Basket",
    description:
      "A flexible cotton basket for shelves, closets, and living spaces, with handles and a soft structured form.",
    price: 28.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "cotton storage basket home",
    imageLayout: "square",
  },
  {
    category: "Home & Lifestyle",
    name: "Scented Candle Trio",
    description:
      "A three-candle gift set with balanced scents, simple glass vessels, and a calm shelf-ready presentation.",
    price: 29.99,
    isFeatured: true,
    editions: ["STANDARD", "LIMITED", "PREMIUM"],
    imageSeed: "scented candles home lifestyle",
    imageLayout: "square",
  },
  {
    category: "Home & Lifestyle",
    name: "Minimal Wall Clock",
    description:
      "A quiet wall clock with clean markers, slim profile, and neutral styling for kitchens, studios, and offices.",
    price: 39.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageSeed: "minimal wall clock home",
    imageLayout: "square",
  },
];

function createDemoPhoto({
  seed,
  width,
  height,
}: {
  seed: string;
  width: number;
  height: number;
}) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

function getImageDimensions(layout: ImageLayout) {
  if (layout === "square") {
    return { width: 720, height: 720 };
  }

  if (layout === "landscape") {
    return { width: 1200, height: 675 };
  }

  return { width: 720, height: 960 };
}

function buildCategoryImage(name: CategoryName) {
  return createDemoPhoto({
    seed: `category-${categoryImageSeedMap[name]}`,
    width: 1200,
    height: 720,
  });
}

function buildProductImages(product: CatalogProduct) {
  const { width, height } = getImageDimensions(
    product.imageLayout ?? "portrait",
  );
  const imageLabels =
    product.imageCount === 3
      ? ["front", "detail", "lifestyle"]
      : ["front", "detail"];

  return imageLabels.map((view) =>
    createDemoPhoto({
      seed: `${product.imageSeed}-${view}`,
      width,
      height,
    }),
  );
}

async function seed() {
  console.log("Seeding database...");

  try {
    await db.delete(schema.cartItems);
    await db.delete(schema.carts);
    await db.delete(schema.orderItems);
    await db.delete(schema.orders);
    await db.delete(schema.images);
    await db.delete(schema.productsToColors);
    await db.delete(schema.productsToSizes);
    await db.delete(schema.products);
    await db.delete(schema.categories);
    await db.delete(schema.colors);
    await db.delete(schema.sizes);
    console.log("Cleared existing demo commerce data");

    const insertedSizes = await db
      .insert(schema.sizes)
      .values(editionTypes)
      .returning();

    const sizeMap = Object.fromEntries(
      insertedSizes.map((size) => [size.value, size.id]),
    ) as Record<EditionValue, string>;
    console.log("Inserted edition types");

    const insertedCategories = await db
      .insert(schema.categories)
      .values(
        catalogCategories.map((category) => ({
          name: category.name,
          imageUrl: buildCategoryImage(category.name),
        })),
      )
      .returning();

    const categoryMap = Object.fromEntries(
      insertedCategories.map((category) => [category.name, category.id]),
    ) as Record<CategoryName, string>;
    console.log("Inserted categories");

    if (productsData.length !== 36) {
      throw new Error(`Expected 36 products, received ${productsData.length}.`);
    }

    for (const product of productsData) {
      const [insertedProduct] = await db
        .insert(schema.products)
        .values({
          name: product.name,
          description: product.description,
          price: product.price,
          isFeatured: product.isFeatured,
          isArchived: false,
          categoryId: categoryMap[product.category],
        })
        .returning();

      await db.insert(schema.images).values(
        buildProductImages(product).map((url) => ({
          productId: insertedProduct.id,
          url,
        })),
      );

      const sizeRelations = product.editions.map((edition) => ({
        productId: insertedProduct.id,
        sizeId: sizeMap[edition],
      }));

      await db.insert(schema.productsToSizes).values(sizeRelations);
    }

    console.log(
      `Inserted ${productsData.length} products with stable demo photos`,
    );
    console.log("Seed complete");
  } finally {
    await client.end();
  }
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
