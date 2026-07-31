import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(code: string, currency: "USD" | "UZS", subtotalMinor: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
    if (!coupon || !coupon.active) {
      throw new BadRequestException("Invalid or expired coupon");
    }
    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BadRequestException("Invalid or expired coupon");
    }
    if (coupon.endsAt && coupon.endsAt < now) {
      throw new BadRequestException("Invalid or expired coupon");
    }
    if (coupon.currency && coupon.currency !== currency) {
      throw new BadRequestException("Coupon not valid for this currency");
    }

    let discountMinor = 0;
    if (coupon.percentOff != null) {
      discountMinor = Math.round((subtotalMinor * coupon.percentOff) / 100);
    } else if (coupon.amountOffMinor != null) {
      discountMinor = coupon.amountOffMinor;
    }
    discountMinor = Math.min(discountMinor, subtotalMinor);

    return {
      code: coupon.code,
      percentOff: coupon.percentOff,
      amountOffMinor: coupon.amountOffMinor,
      discountMinor,
      totalMinor: Math.max(0, subtotalMinor - discountMinor),
    };
  }

  listAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  }

  async create(input: {
    code: string;
    percentOff?: number | null;
    amountOffMinor?: number | null;
    currency?: string | null;
    active?: boolean;
    startsAt?: string | null;
    endsAt?: string | null;
  }) {
    const code = input.code?.trim().toUpperCase();
    if (!code) throw new BadRequestException("Code is required");
    if (input.percentOff == null && input.amountOffMinor == null) {
      throw new BadRequestException("percentOff or amountOffMinor is required");
    }
    return this.prisma.coupon.create({
      data: {
        code,
        percentOff:
          input.percentOff != null ? Number(input.percentOff) : null,
        amountOffMinor:
          input.amountOffMinor != null ? Number(input.amountOffMinor) : null,
        currency: input.currency?.trim() || null,
        active: input.active !== false,
        startsAt: input.startsAt ? new Date(input.startsAt) : null,
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
      },
    });
  }

  async update(
    id: string,
    input: {
      percentOff?: number | null;
      amountOffMinor?: number | null;
      currency?: string | null;
      active?: boolean;
      startsAt?: string | null;
      endsAt?: string | null;
    },
  ) {
    const existing = await this.prisma.coupon.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Coupon not found");
    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...(input.percentOff !== undefined
          ? { percentOff: input.percentOff }
          : {}),
        ...(input.amountOffMinor !== undefined
          ? { amountOffMinor: input.amountOffMinor }
          : {}),
        ...(input.currency !== undefined
          ? { currency: input.currency?.trim() || null }
          : {}),
        ...(input.active !== undefined ? { active: input.active } : {}),
        ...(input.startsAt !== undefined
          ? { startsAt: input.startsAt ? new Date(input.startsAt) : null }
          : {}),
        ...(input.endsAt !== undefined
          ? { endsAt: input.endsAt ? new Date(input.endsAt) : null }
          : {}),
      },
    });
  }
}
