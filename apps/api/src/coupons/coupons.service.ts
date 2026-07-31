import { BadRequestException, Injectable } from "@nestjs/common";
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
}
