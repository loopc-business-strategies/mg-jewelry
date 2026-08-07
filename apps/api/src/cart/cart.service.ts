import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  private availableStock(inv: { quantity: number; reserved: number } | null) {
    if (!inv) return 0;
    return Math.max(0, inv.quantity - inv.reserved);
  }

  async get(userId: string, locale = "en") {
    const cart = await this.ensureCart(userId);
    const full = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                translations: true,
                media: { where: { isPrimary: true }, take: 1 },
                inventory: true,
              },
            },
          },
        },
      },
    });

    const items =
      full?.items.map((item) => {
        const t =
          item.product.translations.find((x) => x.locale === locale) ||
          item.product.translations[0];
        return {
          id: item.id,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            slug: item.product.slug,
            name: t?.name || item.product.slug,
            priceUsdCents: item.product.priceUsdCents,
            priceUzs: item.product.priceUzs,
            image: item.product.media[0]?.url || null,
            stock: this.availableStock(item.product.inventory),
          },
        };
      }) || [];

    const subtotalUsd = items.reduce(
      (sum, i) => sum + i.product.priceUsdCents * i.quantity,
      0,
    );
    const subtotalUzs = items.reduce(
      (sum, i) => sum + i.product.priceUzs * i.quantity,
      0,
    );

    return { id: cart.id, items, subtotalUsd, subtotalUzs };
  }

  async add(userId: string, productId: string, quantity = 1) {
    if (quantity < 1) throw new BadRequestException("Invalid quantity");
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });
    if (!product?.published) throw new NotFoundException("Product not found");

    const cart = await this.ensureCart(userId);
    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    const nextQty = (existing?.quantity || 0) + quantity;
    const available = this.availableStock(product.inventory);
    if (nextQty > available) {
      throw new BadRequestException("Insufficient stock");
    }

    await this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: { increment: quantity } },
    });
    return this.get(userId);
  }

  async update(userId: string, productId: string, quantity: number) {
    const cart = await this.ensureCart(userId);
    if (quantity <= 0) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id, productId },
      });
    } else {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: { inventory: true },
      });
      if (!product) throw new NotFoundException("Product not found");
      const available = this.availableStock(product.inventory);
      if (quantity > available) {
        throw new BadRequestException("Insufficient stock");
      }
      await this.prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity },
      });
    }
    return this.get(userId);
  }

  async clear(userId: string) {
    const cart = await this.ensureCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.get(userId);
  }
}
