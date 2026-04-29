import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";

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

type CategoryName = string;
type ImageLayout = "portrait" | "square" | "landscape";

type CatalogProduct = {
  category: CategoryName;
  name: string;
  description: string;
  price: number;
  isFeatured: boolean;
  editions: EditionValue[];
  imageSeed?: string;
  directImageUrl?: string;
  imageLayout?: ImageLayout;
  imageCount?: 2 | 3;
};

// Removed hardcoded categoryImageSeedMap

const productsData: CatalogProduct[] = [];

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

function buildCategoryImage(name: CategoryName, imageUrl?: string) {
  if (imageUrl) return imageUrl;
  return createDemoPhoto({
    seed: `category-${name}`,
    width: 1200,
    height: 720,
  });
}

function buildProductImages(product: CatalogProduct) {
  if (product.directImageUrl) {
    return [product.directImageUrl];
  }

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

    const scrapedProducts = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src/db/scraped_products.json"), "utf-8"),
    ) as CatalogProduct[];

    // 动态提取分类
    const uniqueCategoryNames = [...new Set(scrapedProducts.map(p => p.category))];
    
    const insertedCategories = await db
      .insert(schema.categories)
      .values(
        uniqueCategoryNames.map((name) => {
          // 寻找该分类下的第一个商品，用它的图片作为分类封面
          const firstProductInCat = scrapedProducts.find(p => p.category === name);
          return {
            name: name,
            imageUrl: buildCategoryImage(name, firstProductInCat?.directImageUrl),
          };
        })
      )
      .returning();

    const categoryMap = Object.fromEntries(
      insertedCategories.map((category) => [category.name, category.id]),
    ) as Record<string, string>;

    console.log(`Inserted ${insertedCategories.length} dynamic categories`);
    console.log(`Total products to insert: ${scrapedProducts.length}`);

    for (const product of scrapedProducts) {
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
