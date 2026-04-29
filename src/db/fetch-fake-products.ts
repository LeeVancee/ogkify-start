import fs from 'fs';
import path from 'path';

const STORES = [
  { url: 'https://kith.com', defaultCategory: 'Apparel' },
  { url: 'https://www.nativeunion.com', defaultCategory: 'Mobile & Tech' },
  { url: 'https://allbirds.com', defaultCategory: 'Sports' },
  { url: 'https://www.brooklinen.com', defaultCategory: 'Home & Lifestyle' }
];

async function fetchDiverseProducts() {
  let allFormattedProducts: any[] = [];

  for (const store of STORES) {
    console.log(`Fetching data from ${store.url}...`);
    try {
      // Fetch 40 products from each store to ensure diversity
      const response = await fetch(`${store.url}/products.json?limit=40`);
      const data = await response.json();

      const formatted = data.products.map((p: any) => {
        const price = p.variants && p.variants[0] ? parseFloat(p.variants[0].price) : 0;
        return {
          name: p.title,
          price: price,
          description: p.body_html ? p.body_html.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...' : 'No description available.',
          category: mapCategory(p.product_type, store.defaultCategory),
          isFeatured: Math.random() > 0.8,
          editions: ["STANDARD", "DELUXE"],
          directImageUrl: p.images && p.images[0] ? p.images[0].src : ''
        };
      }).filter((p: any) => p.directImageUrl !== '' && p.price > 0);

      allFormattedProducts = [...allFormattedProducts, ...formatted];
      console.log(`Successfully fetched ${formatted.length} products from ${store.url}`);
    } catch (error) {
      console.error(`Failed to fetch data from ${store.url}:`, error);
    }
  }

  const outputPath = path.join(process.cwd(), 'src/db/scraped_products.json');
  fs.writeFileSync(outputPath, JSON.stringify(allFormattedProducts, null, 2));
  
  console.log(`\n🎉 Success! Collected ${allFormattedProducts.length} diverse products in total!`);
}

function mapCategory(type: string, defaultCat: string) {
  const t = type.toLowerCase();
  if (t.includes('shoe') || t.includes('sneaker') || t.includes('footwear') || t.includes('run')) return 'Sports';
  if (t.includes('apparel') || t.includes('hoodie') || t.includes('pant') || t.includes('shirt') || t.includes('jacket') || t.includes('clothing')) return 'Apparel';
  if (t.includes('case') || t.includes('cable') || t.includes('tech') || t.includes('charger') || t.includes('adapter')) return 'Mobile & Tech';
  if (t.includes('bed') || t.includes('sheet') || t.includes('home') || t.includes('candle') || t.includes('living')) return 'Home & Lifestyle';
  if (t.includes('accessory') || t.includes('bag') || t.includes('hat')) return 'Merch';
  return defaultCat;
}

fetchDiverseProducts();
