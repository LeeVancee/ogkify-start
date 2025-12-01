import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/db";

const productFormSchema = z.object({
  name: z.string().min(1, {
    message: "Product name must be at least 1 character.",
  }),
  description: z.string().min(1, {
    message: "Product description must be at least 1 character.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number.",
  }),
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
  colorIds: z.array(z.string()).default([]),
  sizeIds: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, {
    message: "Please upload at least one product image.",
  }),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export type ProductFormType = z.infer<typeof productFormSchema>;

// Get single product
export const getProduct = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const product = await prisma.products.findUnique({
        where: { id },
        include: {
          categories: true,
          images: true,
          products_to_colors: {
            include: {
              colors: true,
            },
          },
          products_to_sizes: {
            include: {
              sizes: true,
            },
          },
        },
      });

      if (!product) {
        return null;
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.category_id,
        isFeatured: product.is_featured,
        isArchived: product.is_archived,
        category: product.categories,
        colorIds: product.products_to_colors.map((pc) => pc.colors.id),
        sizeIds: product.products_to_sizes.map((ps) => ps.sizes.id),
        images: product.images.map((image) => image.url),
        colors: product.products_to_colors.map((pc) => pc.colors),
        sizes: product.products_to_sizes.map((ps) => ps.sizes),
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      };
    } catch (error) {
      console.error("Failed to get product:", error);
      return null;
    }
  });

// Update product
export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((params: { id: string; data: ProductFormType }) => {
    const validatedFields = productFormSchema.safeParse(params.data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return params;
  })
  .handler(async ({ data: { id, data } }) => {
    try {
      const {
        name,
        description,
        price,
        categoryId,
        colorIds,
        sizeIds,
        images: imageUrls,
        isFeatured,
        isArchived,
      } = data;

      // Find existing images
      const existingImages = await prisma.images.findMany({
        where: { product_id: id },
      });

      // Delete unused images
      const imagesToDelete = existingImages.filter(
        (image) => !imageUrls.includes(image.url),
      );

      if (imagesToDelete.length > 0) {
        await prisma.images.deleteMany({
          where: {
            id: {
              in: imagesToDelete.map((img) => img.id),
            },
          },
        });
      }

      // Add new images
      const existingUrls = existingImages.map((image) => image.url);
      const newImages = imageUrls.filter((url) => !existingUrls.includes(url));

      // Update product basic information
      const updatedProduct = await prisma.products.update({
        where: { id },
        data: {
          name,
          description,
          price: parseFloat(price),
          category_id: categoryId,
          is_featured: isFeatured,
          is_archived: isArchived,
        },
      });

      // Update color associations
      await prisma.products_to_colors.deleteMany({
        where: { product_id: id },
      });
      if (colorIds.length > 0) {
        await prisma.products_to_colors.createMany({
          data: colorIds.map((colorId) => ({
            product_id: id,
            color_id: colorId,
          })),
        });
      }

      // Update size associations
      await prisma.products_to_sizes.deleteMany({
        where: { product_id: id },
      });
      if (sizeIds.length > 0) {
        await prisma.products_to_sizes.createMany({
          data: sizeIds.map((sizeId) => ({
            product_id: id,
            size_id: sizeId,
          })),
        });
      }

      // Add new images
      if (newImages.length > 0) {
        await prisma.images.createMany({
          data: newImages.map((url) => ({
            product_id: id,
            url,
          })),
        });
      }

      return { success: true, data: updatedProduct };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update product. Please try again later.",
      };
    }
  });

// Get all products
export const getProducts = createServerFn().handler(async () => {
  try {
    const productsList = await prisma.products.findMany({
      include: {
        categories: true,
        images: true,
        products_to_colors: {
          include: {
            colors: true,
          },
        },
        products_to_sizes: {
          include: {
            sizes: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Format return data
    return productsList.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.categories,
      colors: product.products_to_colors.map((pc) => pc.colors),
      sizes: product.products_to_sizes.map((ps) => ps.sizes),
      images: product.images,
      isFeatured: product.is_featured,
      isArchived: product.is_archived,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));
  } catch (error) {
    console.error("Failed to get products list:", error);
    return [];
  }
});

// Create product
export const createProduct = createServerFn({ method: "POST" })
  .inputValidator((data: ProductFormType) => {
    const validatedFields = productFormSchema.safeParse(data);
    if (!validatedFields.success) {
      throw new Error("Form validation failed");
    }
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const {
        name,
        description,
        price,
        categoryId,
        colorIds,
        sizeIds,
        images: imageUrls,
        isFeatured,
        isArchived,
      } = data;

      // Create product
      const product = await prisma.products.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          category_id: categoryId,
          is_featured: isFeatured,
          is_archived: isArchived,
        },
      });

      // Create color associations
      if (colorIds.length > 0) {
        await prisma.products_to_colors.createMany({
          data: colorIds.map((colorId) => ({
            product_id: product.id,
            color_id: colorId,
          })),
        });
      }

      // Create size associations
      if (sizeIds.length > 0) {
        await prisma.products_to_sizes.createMany({
          data: sizeIds.map((sizeId) => ({
            product_id: product.id,
            size_id: sizeId,
          })),
        });
      }

      // Create images
      if (imageUrls.length > 0) {
        await prisma.images.createMany({
          data: imageUrls.map((url) => ({
            product_id: product.id,
            url,
          })),
        });
      }

      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: "Failed to create product" };
    }
  });

// Delete product
export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await prisma.products.delete({
        where: { id },
      });

      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      console.error("Failed to delete product:", error);
      return {
        success: false,
        message: "Failed to delete product, please try again later",
      };
    }
  });

// Get product count
export const getProductsCount = createServerFn().handler(async () => {
  try {
    const count = await prisma.products.count();
    return count;
  } catch (error) {
    console.error("Failed to get product count:", error);
    return 0;
  }
});

// Get popular products
export const getPopularProducts = createServerFn()
  .inputValidator((limit?: number) => limit || 5)
  .handler(async ({ data: limit }) => {
    try {
      const productsList = await prisma.products.findMany({
        include: {
          images: true,
          categories: true,
          order_items: true,
        },
        take: limit,
      });

      // Sort by order count and format return data
      const sortedProducts = productsList
        .map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0]?.url || null,
          category: product.categories.name || "",
          orderCount: product.order_items.length,
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, limit);

      return sortedProducts;
    } catch (error) {
      console.error("Failed to get popular products:", error);
      return [];
    }
  });

// Get all product form data in a single request for better performance
export const getProductFormData = createServerFn().handler(async () => {
  try {
    const [categoriesRaw, colors, sizes] = await Promise.all([
      prisma.categories.findMany({
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          name: true,
          image_url: true,
        },
      }),
      prisma.colors.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          value: true,
        },
      }),
      prisma.sizes.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          value: true,
        },
      }),
    ]);

    // Map image_url to imageUrl for frontend compatibility
    const categories = categoriesRaw.map((category) => ({
      id: category.id,
      name: category.name,
      imageUrl: category.image_url,
    }));

    return {
      categories,
      colors,
      sizes,
    };
  } catch (error) {
    console.error("Failed to get product form data:", error);
    return {
      categories: [],
      colors: [],
      sizes: [],
    };
  }
});
