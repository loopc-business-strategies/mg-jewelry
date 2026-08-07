import { Injectable, NotFoundException } from "@nestjs/common";
import { Locale, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { OrdersService } from "../orders/orders.service";

type ProductInput = {
  slug: string;
  sku: string;
  metal: string;
  purity?: string;
  weightGrams: number;
  makingChargePct?: number;
  priceUsdCents: number;
  priceUzs: number;
  categoryId?: string;
  collectionId?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  shipsInternational?: boolean;
  published?: boolean;
  quantity?: number;
  imageUrl?: string;
  translations: Array<{
    locale: Locale;
    name: string;
    description: string;
    materialNote?: string;
  }>;
};

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService,
  ) {}

  async dashboard() {
    const [products, orders, customers, appointments, revenue] =
      await Promise.all([
        this.prisma.product.count(),
        this.prisma.order.count(),
        this.prisma.user.count({ where: { role: "CUSTOMER" } }),
        this.prisma.appointment.count({
          where: { status: "PENDING" },
        }),
        this.prisma.order.aggregate({
          _sum: { totalMinor: true },
          where: {
            status: { in: ["PAID", "COMPLETED", "PROCESSING", "SHIPPED"] },
          },
        }),
      ]);

    const recentOrders = await this.prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    return {
      products,
      orders,
      customers,
      pendingAppointments: appointments,
      revenueMinor: revenue._sum.totalMinor || 0,
      recentOrders,
      showroom: {
        city: process.env.SHOWROOM_CITY || "Namangan City",
        address:
          process.env.SHOWROOM_ADDRESS ||
          "242, Girvonbulok Street, Davlatabad District, Namangan City, Namangan Region, Republic of Uzbekistan",
      },
    };
  }

  listProducts() {
    return this.prisma.product.findMany({
      include: {
        translations: true,
        inventory: true,
        category: true,
        collection: true,
        media: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async createProduct(input: ProductInput) {
    return this.prisma.product.create({
      data: {
        slug: input.slug,
        sku: input.sku,
        metal: input.metal,
        purity: input.purity,
        weightGrams: input.weightGrams,
        makingChargePct: input.makingChargePct ?? 0,
        priceUsdCents: input.priceUsdCents,
        priceUzs: input.priceUzs,
        categoryId: input.categoryId,
        collectionId: input.collectionId,
        isFeatured: input.isFeatured ?? false,
        isBestSeller: input.isBestSeller ?? false,
        isNewArrival: input.isNewArrival ?? true,
        shipsInternational: input.shipsInternational ?? true,
        published: input.published ?? true,
        translations: {
          create: input.translations.map((t) => ({
            locale: t.locale,
            name: t.name,
            description: t.description,
            materialNote: t.materialNote,
          })),
        },
        media: input.imageUrl
          ? {
              create: [
                {
                  url: input.imageUrl,
                  type: "image",
                  alt: input.translations[0]?.name || input.sku,
                  isPrimary: true,
                  sortOrder: 0,
                },
              ],
            }
          : undefined,
        inventory: {
          create: { quantity: input.quantity ?? 0, reserved: 0, lowStockAt: 2 },
        },
      },
      include: { translations: true, inventory: true, media: true },
    });
  }

  async updateProduct(
    id: string,
    input: Partial<Omit<ProductInput, "categoryId" | "collectionId">> & {
      published?: boolean;
      categoryId?: string | null;
      collectionId?: string | null;
    },
  ) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Product not found");

    const data: Prisma.ProductUpdateInput = {};
    if (input.slug != null) data.slug = input.slug;
    if (input.sku != null) data.sku = input.sku;
    if (input.metal != null) data.metal = input.metal;
    if (input.purity != null) data.purity = input.purity;
    if (input.weightGrams != null) data.weightGrams = input.weightGrams;
    if (input.makingChargePct != null) data.makingChargePct = input.makingChargePct;
    if (input.priceUsdCents != null) data.priceUsdCents = input.priceUsdCents;
    if (input.priceUzs != null) data.priceUzs = input.priceUzs;
    if (input.isFeatured != null) data.isFeatured = input.isFeatured;
    if (input.isBestSeller != null) data.isBestSeller = input.isBestSeller;
    if (input.isNewArrival != null) data.isNewArrival = input.isNewArrival;
    if (input.shipsInternational != null) {
      data.shipsInternational = input.shipsInternational;
    }
    if (input.published != null) data.published = input.published;
    if (input.categoryId !== undefined) {
      data.category = input.categoryId
        ? { connect: { id: input.categoryId } }
        : { disconnect: true };
    }
    if (input.collectionId !== undefined) {
      data.collection = input.collectionId
        ? { connect: { id: input.collectionId } }
        : { disconnect: true };
    }

    if (input.translations?.length) {
      await this.prisma.productTranslation.deleteMany({ where: { productId: id } });
      await this.prisma.productTranslation.createMany({
        data: input.translations.map((t) => ({
          productId: id,
          locale: t.locale,
          name: t.name,
          description: t.description,
          materialNote: t.materialNote,
        })),
      });
    }

    if (input.imageUrl) {
      await this.prisma.productMedia.deleteMany({ where: { productId: id } });
      await this.prisma.productMedia.create({
        data: {
          productId: id,
          url: input.imageUrl,
          type: "image",
          isPrimary: true,
          sortOrder: 0,
          alt: input.translations?.[0]?.name || existing.sku,
        },
      });
    }

    if (input.quantity != null) {
      await this.prisma.inventoryItem.upsert({
        where: { productId: id },
        create: { productId: id, quantity: input.quantity },
        update: { quantity: input.quantity },
      });
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: { translations: true, inventory: true, media: true },
    });
  }

  listOrders() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  listCustomers() {
    return this.prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateInventory(productId: string, quantity: number) {
    return this.prisma.inventoryItem.upsert({
      where: { productId },
      create: { productId, quantity },
      update: { quantity },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const existing = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!existing) throw new NotFoundException("Order not found");
    const previous = existing.status;
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as never },
    });
    await this.orders.applyStatusInventory(orderId, status, previous);
    return updated;
  }

  setShippingQuote(orderId: string, shippingMinor: number) {
    return this.orders.setShippingQuote(orderId, shippingMinor);
  }

  async getSettings() {
    const rows = await this.prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async upsertSetting(key: string, value: unknown) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: value as Prisma.InputJsonValue },
      update: { value: value as Prisma.InputJsonValue },
    });
  }

  listCategories() {
    return this.prisma.category.findMany({
      include: { translations: true, _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    });
  }

  async createCategory(input: {
    slug: string;
    sortOrder?: number;
    name: string;
    description?: string;
  }) {
    const slug = input.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const locales: Locale[] = ["en", "uz", "ru", "tr"];
    return this.prisma.category.create({
      data: {
        slug,
        sortOrder: input.sortOrder ?? 0,
        translations: {
          create: locales.map((locale) => ({
            locale,
            name: input.name,
            description: input.description,
          })),
        },
      },
      include: { translations: true },
    });
  }

  async updateCategory(
    id: string,
    input: {
      slug?: string;
      sortOrder?: number;
      name?: string;
      description?: string | null;
    },
  ) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Category not found");
    if (input.name != null || input.description !== undefined) {
      const locales: Locale[] = ["en", "uz", "ru", "tr"];
      for (const locale of locales) {
        await this.prisma.categoryTranslation.upsert({
          where: { categoryId_locale: { categoryId: id, locale } },
          create: {
            categoryId: id,
            locale,
            name: input.name || existing.slug,
            description: input.description ?? null,
          },
          update: {
            ...(input.name != null ? { name: input.name } : {}),
            ...(input.description !== undefined
              ? { description: input.description }
              : {}),
          },
        });
      }
    }
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(input.slug != null
          ? {
              slug: input.slug
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
            }
          : {}),
        ...(input.sortOrder != null ? { sortOrder: input.sortOrder } : {}),
      },
      include: { translations: true },
    });
  }

  listCollections() {
    return this.prisma.collection.findMany({
      include: { translations: true, _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    });
  }

  async createCollection(input: {
    slug: string;
    sortOrder?: number;
    featured?: boolean;
    imageUrl?: string;
    name: string;
    description?: string;
  }) {
    const slug = input.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const locales: Locale[] = ["en", "uz", "ru", "tr"];
    return this.prisma.collection.create({
      data: {
        slug,
        sortOrder: input.sortOrder ?? 0,
        featured: input.featured ?? false,
        imageUrl: input.imageUrl,
        translations: {
          create: locales.map((locale) => ({
            locale,
            name: input.name,
            description: input.description,
          })),
        },
      },
      include: { translations: true },
    });
  }

  async updateCollection(
    id: string,
    input: {
      slug?: string;
      sortOrder?: number;
      featured?: boolean;
      imageUrl?: string | null;
      name?: string;
      description?: string | null;
    },
  ) {
    const existing = await this.prisma.collection.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException("Collection not found");
    if (input.name != null || input.description !== undefined) {
      const locales: Locale[] = ["en", "uz", "ru", "tr"];
      for (const locale of locales) {
        await this.prisma.collectionTranslation.upsert({
          where: { collectionId_locale: { collectionId: id, locale } },
          create: {
            collectionId: id,
            locale,
            name: input.name || existing.slug,
            description: input.description ?? null,
          },
          update: {
            ...(input.name != null ? { name: input.name } : {}),
            ...(input.description !== undefined
              ? { description: input.description }
              : {}),
          },
        });
      }
    }
    return this.prisma.collection.update({
      where: { id },
      data: {
        ...(input.slug != null
          ? {
              slug: input.slug
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
            }
          : {}),
        ...(input.sortOrder != null ? { sortOrder: input.sortOrder } : {}),
        ...(input.featured != null ? { featured: input.featured } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      },
      include: { translations: true },
    });
  }

  listReviews() {
    return this.prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: {
          select: {
            id: true,
            sku: true,
            slug: true,
            translations: { where: { locale: "en" }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateReview(id: string, published: boolean) {
    const existing = await this.prisma.review.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Review not found");
    return this.prisma.review.update({
      where: { id },
      data: { published },
    });
  }
}
