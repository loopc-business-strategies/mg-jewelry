import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InquiryStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(input: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    productSlug?: string;
  }) {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const message = input.message?.trim();
    if (!name || !email || !message) {
      throw new BadRequestException("Name, email, and message are required");
    }

    let productId: string | null = null;
    const productSlug = input.productSlug?.trim() || null;
    if (productSlug) {
      const product = await this.prisma.product.findUnique({
        where: { slug: productSlug },
        select: { id: true },
      });
      productId = product?.id || null;
    }

    const inquiry = await this.prisma.inquiry.create({
      data: {
        name,
        email,
        phone: input.phone?.trim() || null,
        message,
        productId,
        productSlug,
      },
      include: {
        product: {
          include: { translations: { where: { locale: "en" }, take: 1 } },
        },
      },
    });

    const productName =
      inquiry.product?.translations[0]?.name || inquiry.productSlug || undefined;

    await this.notifications.inquiryCreated({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || undefined,
      message: inquiry.message,
      productSlug: inquiry.productSlug || undefined,
      productName,
    });

    await this.notifications.notifyEmail(
      inquiry.email,
      "MG Jewelry — We received your inquiry",
      `Hello ${inquiry.name},\n\nThank you for contacting Modern Gold Jewelry Manufacturing (Hearts of Namangan).\nWe received your request${productName ? ` about ${productName}` : ""} and will reply shortly.\n\nShowroom: 242 Girvonbulok Street, Namangan, Uzbekistan\nTelegram: @mgjewelry`,
    );

    return inquiry;
  }

  listAll() {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            sku: true,
            translations: { where: { locale: "en" }, take: 1 },
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: InquiryStatus) {
    const existing = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Inquiry not found");
    return this.prisma.inquiry.update({
      where: { id },
      data: { status },
    });
  }
}
