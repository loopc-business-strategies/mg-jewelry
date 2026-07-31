import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SupportTicketStatus, SupportTicketType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  listMine(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      include: {
        order: { select: { id: true, orderNumber: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  listAll() {
    return this.prisma.supportTicket.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, orderNumber: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    userId: string,
    input: {
      type: SupportTicketType;
      subject: string;
      message: string;
      orderId?: string;
    },
  ) {
    if (!input.subject?.trim() || !input.message?.trim()) {
      throw new BadRequestException("Subject and message are required");
    }
    if (input.orderId) {
      const order = await this.prisma.order.findFirst({
        where: { id: input.orderId, userId },
      });
      if (!order) throw new NotFoundException("Order not found");
    }

    const ticket = await this.prisma.supportTicket.create({
      data: {
        userId,
        orderId: input.orderId || null,
        type: input.type,
        subject: input.subject.trim(),
        message: input.message.trim(),
      },
      include: {
        order: { select: { orderNumber: true } },
        user: { select: { name: true, email: true } },
      },
    });

    await this.notifications.ticketCreated({
      type: ticket.type,
      subject: ticket.subject,
      orderNumber: ticket.order?.orderNumber,
      userName: ticket.user.name,
      userEmail: ticket.user.email,
    });

    return ticket;
  }

  async updateStatus(id: string, status: SupportTicketStatus) {
    const existing = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException("Ticket not found");
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        order: { select: { orderNumber: true } },
      },
    });
  }
}
