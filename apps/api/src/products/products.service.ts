import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { productFilterSchema, type Locale } from "@mg/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: unknown, locale: Locale = "en") {
    const filters = productFilterSchema.parse(query);
    const where: Prisma.ProductWhereInput = {
      published: true,
      AND: [
        filters.q
          ? {
              OR: [
                {
                  translations: {
                    some: {
                      name: { contains: filters.q, mode: "insensitive" },
                    },
                  },
                },
                {
                  translations: {
                    some: {
                      description: {
                        contains: filters.q,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                { sku: { contains: filters.q, mode: "insensitive" } },
                { metal: { contains: filters.q, mode: "insensitive" } },
              ],
            }
          : {},
        filters.category ? { category: { slug: filters.category } } : {},
        filters.collection
          ? { collection: { slug: filters.collection } }
          : {},
        filters.metal
          ? { metal: { equals: filters.metal, mode: "insensitive" } }
          : {},
        filters.purity ? { purity: filters.purity } : {},
        filters.minPriceUsd != null
          ? { priceUsdCents: { gte: Math.round(filters.minPriceUsd * 100) } }
          : {},
        filters.maxPriceUsd != null
          ? { priceUsdCents: { lte: Math.round(filters.maxPriceUsd * 100) } }
          : {},
      ],
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      filters.sort === "price_asc"
        ? { priceUsdCents: "asc" }
        : filters.sort === "price_desc"
          ? { priceUsdCents: "desc" }
          : filters.sort === "popular"
            ? { isBestSeller: "desc" }
            : { createdAt: "desc" };

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
        include: {
          translations: { where: { locale } },
          media: { orderBy: { sortOrder: "asc" } },
          category: { include: { translations: { where: { locale } } } },
          collection: { include: { translations: { where: { locale } } } },
          inventory: true,
        },
      }),
    ]);

    return {
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      items: items.map((p) => this.mapProduct(p, locale)),
    };
  }

  async bySlug(slug: string, locale: Locale = "en") {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        translations: true,
        media: { orderBy: { sortOrder: "asc" } },
        category: { include: { translations: true } },
        collection: { include: { translations: true } },
        inventory: true,
        reviews: {
          where: { published: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!product || !product.published) {
      throw new NotFoundException("Product not found");
    }
    return this.mapProduct(product, locale);
  }

  async categories(locale: Locale = "en") {
    const rows = await this.prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { translations: { where: { locale } } },
    });
    return rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.translations[0]?.name || c.slug,
      description: c.translations[0]?.description || null,
    }));
  }

  async collections(locale: Locale = "en") {
    const rows = await this.prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: { translations: { where: { locale } } },
    });
    return rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      featured: c.featured,
      imageUrl: c.imageUrl,
      name: c.translations[0]?.name || c.slug,
      description: c.translations[0]?.description || null,
    }));
  }

  private mapProduct(
    product: {
      id: string;
      slug: string;
      sku: string;
      metal: string;
      purity: string | null;
      weightGrams: Prisma.Decimal | number;
      makingChargePct: Prisma.Decimal | number;
      priceUsdCents: number;
      priceUzs: number;
      isFeatured: boolean;
      isBestSeller: boolean;
      isNewArrival: boolean;
      shipsInternational: boolean;
      translations: Array<{
        locale: string;
        name: string;
        description: string;
        materialNote: string | null;
      }>;
      media: Array<{
        id: string;
        url: string;
        type: string;
        alt: string | null;
        isPrimary: boolean;
      }>;
      inventory: { quantity: number; reserved: number } | null;
      category?: {
        slug: string;
        translations: Array<{ name: string; locale: string }>;
      } | null;
      collection?: {
        slug: string;
        translations: Array<{ name: string; locale: string }>;
      } | null;
      reviews?: Array<{
        id: string;
        rating: number;
        title: string | null;
        body: string;
        user: { name: string };
        createdAt: Date;
      }>;
    },
    locale: Locale,
  ) {
    const t =
      product.translations.find((x) => x.locale === locale) ||
      product.translations.find((x) => x.locale === "en") ||
      product.translations[0];

    return {
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      metal: product.metal,
      purity: product.purity,
      weightGrams: Number(product.weightGrams),
      makingChargePct: Number(product.makingChargePct),
      priceUsdCents: product.priceUsdCents,
      priceUzs: product.priceUzs,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      shipsInternational: product.shipsInternational,
      name: t?.name || product.slug,
      description: t?.description || "",
      materialNote: t?.materialNote || null,
      media: product.media,
      stock: Math.max(
        0,
        (product.inventory?.quantity || 0) - (product.inventory?.reserved || 0),
      ),
      category: product.category
        ? {
            slug: product.category.slug,
            name:
              product.category.translations.find((x) => x.locale === locale)
                ?.name ||
              product.category.translations[0]?.name ||
              product.category.slug,
          }
        : null,
      collection: product.collection
        ? {
            slug: product.collection.slug,
            name:
              product.collection.translations.find((x) => x.locale === locale)
                ?.name ||
              product.collection.translations[0]?.name ||
              product.collection.slug,
          }
        : null,
      reviews: product.reviews || [],
    };
  }
}
