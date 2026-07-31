import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });
  }

  async create(
    userId: string,
    input: {
      label?: string;
      fullName: string;
      phone: string;
      line1: string;
      line2?: string;
      city: string;
      region?: string;
      country: string;
      postalCode?: string;
      isDefault?: boolean;
    },
  ) {
    if (!input.fullName?.trim() || !input.phone?.trim() || !input.line1?.trim()) {
      throw new BadRequestException("fullName, phone, and line1 are required");
    }
    if (input.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    const count = await this.prisma.address.count({ where: { userId } });
    return this.prisma.address.create({
      data: {
        userId,
        label: input.label?.trim() || "Home",
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        line1: input.line1.trim(),
        line2: input.line2?.trim() || null,
        city: input.city.trim(),
        region: input.region?.trim() || null,
        country: input.country.trim(),
        postalCode: input.postalCode?.trim() || null,
        isDefault: input.isDefault ?? count === 0,
      },
    });
  }

  async update(
    userId: string,
    id: string,
    input: Partial<{
      label: string;
      fullName: string;
      phone: string;
      line1: string;
      line2: string | null;
      city: string;
      region: string | null;
      country: string;
      postalCode: string | null;
      isDefault: boolean;
    }>,
  ) {
    const existing = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException("Address not found");

    if (input.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data: {
        ...(input.label != null ? { label: input.label } : {}),
        ...(input.fullName != null ? { fullName: input.fullName } : {}),
        ...(input.phone != null ? { phone: input.phone } : {}),
        ...(input.line1 != null ? { line1: input.line1 } : {}),
        ...(input.line2 !== undefined ? { line2: input.line2 } : {}),
        ...(input.city != null ? { city: input.city } : {}),
        ...(input.region !== undefined ? { region: input.region } : {}),
        ...(input.country != null ? { country: input.country } : {}),
        ...(input.postalCode !== undefined
          ? { postalCode: input.postalCode }
          : {}),
        ...(input.isDefault != null ? { isDefault: input.isDefault } : {}),
      },
    });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException("Address not found");
    await this.prisma.address.delete({ where: { id } });
    return { ok: true };
  }
}
