import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ReturnRequestStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class ReturnsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(
    userId: string,
    input: { orderId: string; reason: string; message: string },
  ) {
    const reason = input.reason?.trim();
    const message = input.message?.trim();
    if (!reason || !message) {
      throw new BadRequestException("Reason and message are required");
    }
    const order = await this.prisma.order.findFirst({
      where: { id: input.orderId, userId },
    });
    if (!order) throw new NotFoundException("Order not found");

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const rmaNumber = `RMA-${Date.now().toString(36).toUpperCase()}`;
    const ret = await this.prisma.returnRequest.create({
      data: {
        rmaNumber,
        userId,
        orderId: order.id,
        reason,
        message,
      },
      include: { order: { select: { orderNumber: true } } },
    });

    await this.notifications.returnRequested({
      rmaNumber: ret.rmaNumber,
      orderNumber: ret.order.orderNumber,
      userName: user?.name || "Customer",
      userEmail: user?.email || "",
      reason: ret.reason,
    });

    return ret;
  }

  listMine(userId: string) {
    return this.prisma.returnRequest.findMany({
      where: { userId },
      include: { order: { select: { orderNumber: true, status: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  listAll() {
    return this.prisma.returnRequest.findMany({
      include: {
        user: { select: { name: true, email: true } },
        order: { select: { orderNumber: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(
    id: string,
    input: { status: ReturnRequestStatus; adminNotes?: string },
  ) {
    const existing = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!existing) throw new NotFoundException("Return request not found");

    const updated = await this.prisma.returnRequest.update({
      where: { id },
      data: {
        status: input.status,
        ...(input.adminNotes !== undefined
          ? { adminNotes: input.adminNotes?.trim() || null }
          : {}),
      },
      include: {
        user: { select: { name: true, email: true } },
        order: { select: { orderNumber: true } },
      },
    });

    await this.notifications.returnUpdated({
      rmaNumber: updated.rmaNumber,
      status: updated.status,
      userEmail: updated.user.email,
      userName: updated.user.name,
      adminNotes: updated.adminNotes || undefined,
    });

    return updated;
  }
}
