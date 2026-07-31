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

  async updateProduct(id: string, input: Partial<ProductInput> & { published?: boolean }) {
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
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as never },
    });
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
}
