export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@ogkify" },
    { name: "twitter:site", content: "@ogkify" },
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
};

// Pre-defined SEO configurations for common pages
export const defaultSEO = {
  siteName: "OGKIFY",
  siteDescription:
    "OGKIFY - Premium fashion shopping platform offering high-quality clothing, accessories and more with convenient shopping experience",
  siteUrl: "https://ogkify.com", // Replace with your actual domain
  defaultImage: "/og-default.jpg", // Make sure this image exists
};

// SEO helper functions for different page types
export const homeSEO = () =>
  seo({
    title: `${defaultSEO.siteName} - Premium Fashion Shopping Platform`,
    description: defaultSEO.siteDescription,
    keywords:
      "fashion shopping,clothing,accessories,online store,OGKIFY,ecommerce platform",
    image: defaultSEO.defaultImage,
  });

export const productSEO = ({
  name,
  description,
  category,
  price,
  image,
}: {
  name: string;
  description: string;
  category: string;
  price: string;
  image?: string;
}) =>
  seo({
    title: `${name} - ${category} | ${defaultSEO.siteName}`,
    description: `${description.substring(0, 150)}... Price: ￥${price}. Shop now for premium quality products.`,
    keywords: `${name},${category},buy,fashion,${defaultSEO.siteName}`,
    image: image || defaultSEO.defaultImage,
  });

export const categorySEO = ({
  categoryName,
  productCount,
}: {
  categoryName: string;
  productCount?: number;
}) =>
  seo({
    title: `${categoryName} - Premium Collection | ${defaultSEO.siteName}`,
    description: `Browse our curated ${categoryName} collection${productCount ? ` with ${productCount} products` : ""}. ${defaultSEO.siteName} offers premium quality ${categoryName} products.`,
    keywords: `${categoryName},product category,shopping,${defaultSEO.siteName}`,
    image: defaultSEO.defaultImage,
  });

export const searchSEO = ({
  query,
  resultCount,
}: {
  query: string;
  resultCount?: number;
}) =>
  seo({
    title: `Search "${query}"${resultCount ? ` - ${resultCount} Results` : ""} | ${defaultSEO.siteName}`,
    description: `Search for "${query}" on ${defaultSEO.siteName}${resultCount ? ` and find ${resultCount} related products` : ""}. Discover more premium products.`,
    keywords: `${query},search,products,${defaultSEO.siteName}`,
    image: defaultSEO.defaultImage,
  });

export const profileSEO = () =>
  seo({
    title: `My Account | ${defaultSEO.siteName}`,
    description: `Manage your personal information, order history and shopping preferences on ${defaultSEO.siteName}.`,
    keywords: `account,profile management,${defaultSEO.siteName}`,
  });

export const cartSEO = () =>
  seo({
    title: `Shopping Cart | ${defaultSEO.siteName}`,
    description: `Review your cart items and continue with the checkout process. ${defaultSEO.siteName} provides secure and convenient shopping experience.`,
    keywords: `shopping cart,checkout,purchase,${defaultSEO.siteName}`,
  });

export const checkoutSEO = () =>
  seo({
    title: `Checkout | ${defaultSEO.siteName}`,
    description: `Complete your order checkout securely and quickly. ${defaultSEO.siteName} supports multiple payment methods.`,
    keywords: `checkout,payment,order,${defaultSEO.siteName}`,
  });
