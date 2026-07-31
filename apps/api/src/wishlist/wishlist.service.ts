import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, locale = "en") {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            translations: true,
            media: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return items.map((item) => {
      const t =
        item.product.translations.find((x) => x.locale === locale) ||
        item.product.translations[0];
      return {
        id: item.id,
        product: {
          id: item.product.id,
          slug: item.product.slug,
          name: t?.name || item.product.slug,
          priceUsdCents: item.product.priceUsdCents,
          priceUzs: item.product.priceUzs,
          image: item.product.media[0]?.url || null,
        },
      };
    });
  }

  async toggle(userId: string, productId: string) {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      await this.prisma.wishlistItem.delete({ where: { id: existing.id } });
      return { wished: false };
    }
    await this.prisma.wishlistItem.create({ data: { userId, productId } });
    return { wished: true };
  }
}
