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
  { name: "Figures & Collectibles", bg: "ede9fe", fg: "5b21b6" },
  { name: "Plushies & Pillows", bg: "fce7f3", fg: "9d174d" },
  { name: "Acrylic Stands & Charms", bg: "cffafe", fg: "155e75" },
  { name: "Apparel & Bags", bg: "e2e8f0", fg: "1e293b" },
  { name: "Desk Mats & Stationery", bg: "fef3c7", fg: "92400e" },
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
  imageLayout?: ImageLayout;
  imageCount?: 2 | 3;
};

const categoryThemeMap: Record<CategoryName, { bg: string; fg: string }> = {
  "Figures & Collectibles": { bg: "ede9fe", fg: "5b21b6" },
  "Plushies & Pillows": { bg: "fce7f3", fg: "9d174d" },
  "Acrylic Stands & Charms": { bg: "cffafe", fg: "155e75" },
  "Apparel & Bags": { bg: "e2e8f0", fg: "1e293b" },
  "Desk Mats & Stationery": { bg: "fef3c7", fg: "92400e" },
};

const productsData: CatalogProduct[] = [
  {
    category: "Figures & Collectibles",
    name: "Collector Figure Deluxe Edition",
    description:
      "A premium scale figure with a sculpted display base, clean paint finish, and retail-style collector packaging for shelf presentation.",
    price: 149.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "LIMITED", "PREMIUM"],
    imageCount: 3,
  },
  {
    category: "Figures & Collectibles",
    name: "Chibi Figure Box Set",
    description:
      "A boxed set of stylized chibi mini figures designed for desk display, casual collecting, and starter merchandise bundles.",
    price: 54.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
  },
  {
    category: "Figures & Collectibles",
    name: "Articulated Hero Figure",
    description:
      "An articulated action figure with multiple pose options, swappable hands, and a compact stand for dynamic posing shots.",
    price: 84.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageCount: 3,
  },
  {
    category: "Figures & Collectibles",
    name: "Premium Resin Bust",
    description:
      "A polished resin bust built for collector shelves, featuring a clean silhouette, display plinth, and limited-run style presentation.",
    price: 129.99,
    isFeatured: false,
    editions: ["DELUXE", "LIMITED", "PREMIUM"],
  },
  {
    category: "Figures & Collectibles",
    name: "Blind Box Mini Figure Set",
    description:
      "A mini collectible figure assortment designed around blind-box style packaging, compact sizing, and impulse-purchase appeal.",
    price: 39.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
  },
  {
    category: "Figures & Collectibles",
    name: "Display Statue Limited Edition",
    description:
      "A decorative display statue focused on silhouette and presentation, ideal for featured product slots and hero banner merchandising.",
    price: 159.99,
    isFeatured: true,
    editions: ["DELUXE", "LIMITED", "PREMIUM"],
    imageCount: 3,
  },
  {
    category: "Plushies & Pillows",
    name: "Character Plush Doll",
    description:
      "A soft plush doll with embroidered facial details, travel-friendly sizing, and an approachable gift-shop presentation.",
    price: 28.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE"],
  },
  {
    category: "Plushies & Pillows",
    name: "Mini Plush Keychain Set",
    description:
      "A set of mini plush mascots with keychain loops, made for bags, ita accessories, and add-on checkout merchandising.",
    price: 18.99,
    isFeatured: false,
    editions: ["STANDARD"],
    imageLayout: "square",
  },
  {
    category: "Plushies & Pillows",
    name: "Sleeping Cushion Pillow",
    description:
      "A soft cushion pillow designed for sofa or bed display, with a printed front panel and matching back panel layout.",
    price: 32.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
  },
  {
    category: "Plushies & Pillows",
    name: "Jumbo Hug Pillow Cover",
    description:
      "A long-format pillow cover designed for display and collection pages, presented as a premium textile merchandise item.",
    price: 59.99,
    isFeatured: true,
    editions: ["STANDARD", "LIMITED", "PREMIUM"],
    imageCount: 3,
  },
  {
    category: "Plushies & Pillows",
    name: "Plush Blanket Gift Bundle",
    description:
      "A cozy merchandise bundle that combines a foldable plush throw with matching packaging designed for seasonal promotions.",
    price: 44.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
  },
  {
    category: "Plushies & Pillows",
    name: "Premium Bolster Pillow",
    description:
      "A cylindrical bolster-style pillow for bedroom styling, built around a clean printed pattern and soft premium fabric finish.",
    price: 39.99,
    isFeatured: false,
    editions: ["DELUXE", "PREMIUM"],
  },
  {
    category: "Acrylic Stands & Charms",
    name: "Anime Acrylic Stand Set",
    description:
      "A tabletop acrylic stand bundle with layered cut pieces and a branded base, suited for desk display and event table layouts.",
    price: 24.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE"],
    imageLayout: "square",
  },
  {
    category: "Acrylic Stands & Charms",
    name: "Double Layer Acrylic Charm Pack",
    description:
      "A charm pack featuring double-layer acrylic pieces with printed backing cards and compact hook hardware for accessories.",
    price: 19.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE", "LIMITED"],
    imageLayout: "square",
  },
  {
    category: "Acrylic Stands & Charms",
    name: "Holographic Character Stand",
    description:
      "A holographic acrylic stand designed for front-facing product shots, with a reflective finish and premium card insert.",
    price: 29.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageLayout: "square",
  },
  {
    category: "Acrylic Stands & Charms",
    name: "Mini Acrylic Clip Collection",
    description:
      "A small-format acrylic clip assortment intended for blind assortments, display trays, and collector binder pages.",
    price: 14.99,
    isFeatured: false,
    editions: ["STANDARD"],
    imageLayout: "square",
  },
  {
    category: "Acrylic Stands & Charms",
    name: "Shaker Charm Blind Pack",
    description:
      "A novelty shaker charm pack with floating insert pieces, compact packaging, and easy add-to-cart gift appeal.",
    price: 16.99,
    isFeatured: false,
    editions: ["STANDARD", "LIMITED"],
    imageLayout: "square",
  },
  {
    category: "Acrylic Stands & Charms",
    name: "Desk Display Stand Bundle",
    description:
      "A multi-piece desk display set combining standees and base parts for storefront showcases and featured grid layouts.",
    price: 34.99,
    isFeatured: true,
    editions: ["DELUXE", "LIMITED", "PREMIUM"],
    imageLayout: "square",
    imageCount: 3,
  },
  {
    category: "Apparel & Bags",
    name: "Graphic Hoodie Premium Print",
    description:
      "A heavyweight hoodie with a large front graphic, drawstring hood, and product photography that reads clearly in apparel grids.",
    price: 69.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "LIMITED", "PREMIUM"],
    imageCount: 3,
  },
  {
    category: "Apparel & Bags",
    name: "Oversized Character Tee",
    description:
      "A relaxed-fit oversized tee styled as a core apparel SKU, ideal for seasonal drops and everyday casual merchandise pages.",
    price: 34.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
  },
  {
    category: "Apparel & Bags",
    name: "Embroidered Canvas Tote Bag",
    description:
      "A canvas tote bag with front embroidery and carry-friendly proportions, photographed as a simple lifestyle accessory item.",
    price: 29.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
    imageLayout: "square",
  },
  {
    category: "Apparel & Bags",
    name: "Crossbody Utility Bag",
    description:
      "A compact crossbody bag with strap hardware, zipper compartments, and a neat product silhouette that works well in catalog pages.",
    price: 46.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageLayout: "square",
  },
  {
    category: "Apparel & Bags",
    name: "Embroidered Snapback Cap",
    description:
      "A structured snapback cap with front embroidery and clean shape retention, designed as a lightweight add-on merchandise item.",
    price: 24.99,
    isFeatured: false,
    editions: ["STANDARD"],
    imageLayout: "square",
  },
  {
    category: "Apparel & Bags",
    name: "Zip Jacket Signature Line",
    description:
      "A zip-front jacket presented as a premium outerwear SKU, with a clear folded view and close-up detail image for texture emphasis.",
    price: 89.99,
    isFeatured: true,
    editions: ["DELUXE", "LIMITED", "PREMIUM"],
    imageCount: 3,
  },
  {
    category: "Desk Mats & Stationery",
    name: "Character Desk Mat XL",
    description:
      "An extra-wide desk mat built for keyboard and mouse setups, using a landscape image treatment that matches the product form factor.",
    price: 32.99,
    isFeatured: true,
    editions: ["STANDARD", "DELUXE", "PREMIUM"],
    imageLayout: "landscape",
    imageCount: 3,
  },
  {
    category: "Desk Mats & Stationery",
    name: "Hardcover Art Notebook",
    description:
      "A hardcover notebook with printed cover artwork, ribbon marker, and stationery-focused details suitable for lifestyle display shots.",
    price: 21.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
  },
  {
    category: "Desk Mats & Stationery",
    name: "Sticker Book Collection",
    description:
      "A collector sticker book with organized sheets and a compact retail presentation aimed at low-friction gift and add-on purchases.",
    price: 14.99,
    isFeatured: false,
    editions: ["STANDARD", "LIMITED"],
    imageLayout: "square",
  },
  {
    category: "Desk Mats & Stationery",
    name: "Memo Pad Desk Set",
    description:
      "A desk-ready memo pad bundle with matching sheets and packaging, positioned as an accessible stationery pick in the catalog.",
    price: 12.99,
    isFeatured: false,
    editions: ["STANDARD"],
    imageLayout: "square",
  },
  {
    category: "Desk Mats & Stationery",
    name: "Monthly Desk Calendar",
    description:
      "A monthly desk calendar with a display stand and print-forward layout, designed to look consistent in hero cards and list views.",
    price: 19.99,
    isFeatured: true,
    editions: ["STANDARD", "LIMITED", "PREMIUM"],
  },
  {
    category: "Desk Mats & Stationery",
    name: "Collector Art File Folder",
    description:
      "A clear file folder set for prints and postcards, packaged as a collectible stationery item with a flat-lay friendly silhouette.",
    price: 17.99,
    isFeatured: false,
    editions: ["STANDARD", "DELUXE"],
  },
];

function createPlaceholderImage({
  label,
  width,
  height,
  bg,
  fg,
}: {
  label: string;
  width: number;
  height: number;
  bg: string;
  fg: string;
}) {
  return `https://placehold.co/${width}x${height}/${bg}/${fg}.png?text=${encodeURIComponent(label)}`;
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
  const theme = categoryThemeMap[name];

  return createPlaceholderImage({
    label: name,
    width: 1200,
    height: 720,
    bg: theme.bg,
    fg: theme.fg,
  });
}

function buildProductImages(product: CatalogProduct) {
  const theme = categoryThemeMap[product.category];
  const { width, height } = getImageDimensions(product.imageLayout ?? "portrait");
  const imageLabels =
    product.imageCount === 3
      ? ["Front View", "Detail View", "Packaging"]
      : ["Front View", "Detail View"];

  return imageLabels.map((view) =>
    createPlaceholderImage({
      label: `${product.name} - ${view}`,
      width,
      height,
      bg: theme.bg,
      fg: theme.fg,
    }),
  );
}

async function seed() {
  console.log("Seeding database...");

  try {
    await db.delete(schema.cartItems);
    await db.delete(schema.orderItems);
    await db.delete(schema.carts);
    await db.delete(schema.images);
    await db.delete(schema.productsToColors);
    await db.delete(schema.productsToSizes);
    await db.delete(schema.products);
    await db.delete(schema.categories);
    await db.delete(schema.colors);
    await db.delete(schema.sizes);
    console.log("Cleared existing data");

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

    if (productsData.length !== 30) {
      throw new Error(`Expected 30 products, received ${productsData.length}.`);
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
      `Inserted ${productsData.length} products with matching image placeholders`,
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
