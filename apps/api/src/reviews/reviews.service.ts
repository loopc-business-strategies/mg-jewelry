import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    productId: string,
    input: { rating: number; title?: string; body: string },
  ) {
    if (!input.body?.trim()) {
      throw new BadRequestException("Review body is required");
    }
    const rating = Number(input.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException("Rating must be 1–5");
    }
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || !product.published) {
      throw new NotFoundException("Product not found");
    }
    try {
      return await this.prisma.review.create({
        data: {
          userId,
          productId,
          rating: Math.round(rating),
          title: input.title?.trim() || null,
          body: input.body.trim(),
          published: true,
        },
        include: { user: { select: { name: true } } },
      });
    } catch {
      throw new ConflictException("You already reviewed this product");
    }
  }
}
