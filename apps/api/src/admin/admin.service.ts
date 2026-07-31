import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [products, orders, customers, revenue] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: "CUSTOMER" } }),
      this.prisma.order.aggregate({
        _sum: { totalMinor: true },
        where: { status: { in: ["PAID", "COMPLETED", "PROCESSING", "SHIPPED"] } },
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
      revenueMinor: revenue._sum.totalMinor || 0,
      recentOrders,
      showroom: {
        city: process.env.SHOWROOM_CITY || "Namangan",
        address: process.env.SHOWROOM_ADDRESS || "Namangan, Uzbekistan",
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
      },
      orderBy: { updatedAt: "desc" },
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
}
