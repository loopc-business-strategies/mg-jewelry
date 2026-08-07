import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  FulfillmentType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CouponsService } from "../coupons/coupons.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly coupons: CouponsService,
  ) {}

  async checkout(
    userId: string,
    input: {
      paymentMethod: PaymentMethod;
      fulfillmentType: FulfillmentType;
      currency: "USD" | "UZS";
      notes?: string;
      shippingAddressId?: string;
      couponCode?: string;
    },
  ) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { translations: true, inventory: true } },
          },
        },
      },
    });
    if (!cart?.items.length) throw new BadRequestException("Cart is empty");

    const useUsd = input.currency === "USD";
    const subtotalMinor = cart.items.reduce(
      (sum, item) =>
        sum +
        (useUsd ? item.product.priceUsdCents : item.product.priceUzs) *
          item.quantity,
      0,
    );

    let discountMinor = 0;
    let couponNote = "";
    if (input.couponCode?.trim()) {
      const applied = await this.coupons.validate(
        input.couponCode,
        input.currency,
        subtotalMinor,
      );
      discountMinor = applied.discountMinor;
      couponNote = `Coupon ${applied.code} (−${discountMinor})`;
    }
    const totalMinor = Math.max(0, subtotalMinor - discountMinor);

    let status: OrderStatus = OrderStatus.PENDING_PAYMENT;
    if (input.fulfillmentType === FulfillmentType.INTERNATIONAL_QUOTE) {
      status = OrderStatus.PENDING_SHIPPING_QUOTE;
    } else if (input.paymentMethod === PaymentMethod.SHOWROOM) {
      status = OrderStatus.AWAITING_PICKUP;
    }

    const orderNumber = `MG-${Date.now().toString(36).toUpperCase()}`;
    const notes = [input.notes?.trim(), couponNote].filter(Boolean).join(" · ") || null;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status,
          fulfillmentType: input.fulfillmentType,
          currency: input.currency,
          subtotalMinor,
          shippingMinor: 0,
          totalMinor,
          notes,
          shippingAddressId: input.shippingAddressId,
          items: {
            create: cart.items.map((item) => {
              const unit = useUsd
                ? item.product.priceUsdCents
                : item.product.priceUzs;
              const name =
                item.product.translations.find((t) => t.locale === "en")
                  ?.name || item.product.sku;
              return {
                productId: item.productId,
                productName: name,
                quantity: item.quantity,
                unitPriceMinor: unit,
                lineTotalMinor: unit * item.quantity,
              };
            }),
          },
          payments: {
            create: {
              method: input.paymentMethod,
              status: PaymentStatus.PENDING,
              amountMinor: totalMinor,
              currency: input.currency,
            },
          },
        },
        include: { payments: true, items: true },
      });

      for (const item of cart.items) {
        // Conditional reserve: fail the race if available stock is insufficient.
        const reserved = await tx.$executeRaw`
          UPDATE "InventoryItem"
          SET reserved = reserved + ${item.quantity}
          WHERE "productId" = ${item.productId}
            AND quantity - reserved >= ${item.quantity}
        `;
        if (Number(reserved) === 0) {
          throw new BadRequestException(
            `Insufficient stock for ${item.product.sku}`,
          );
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    await this.notifications.orderCreated({
      orderNumber: order.orderNumber,
      totalMinor: order.totalMinor,
      currency: order.currency,
      status: order.status,
      customerEmail: user?.email,
      customerName: user?.name,
    });

    return order;
  }

  async mine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true, payments: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async byId(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: true,
        payments: true,
        shippingAddress: true,
      },
    });
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async findByIdInternal(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
  }

  /** Convert reserved stock into sold quantity. */
  private async finalizeSale(
    tx: Prisma.TransactionClient,
    items: Array<{ productId: string; quantity: number }>,
  ) {
    for (const item of items) {
      const inv = await tx.inventoryItem.findUnique({
        where: { productId: item.productId },
      });
      if (!inv) continue;
      const release = Math.min(inv.reserved, item.quantity);
      await tx.inventoryItem.update({
        where: { productId: item.productId },
        data: {
          reserved: { decrement: release },
          quantity: { decrement: Math.min(inv.quantity, item.quantity) },
        },
      });
    }
  }

  private async releaseReservation(
    tx: Prisma.TransactionClient,
    items: Array<{ productId: string; quantity: number }>,
  ) {
    for (const item of items) {
      const inv = await tx.inventoryItem.findUnique({
        where: { productId: item.productId },
      });
      if (!inv) continue;
      const release = Math.min(inv.reserved, item.quantity);
      if (release > 0) {
        await tx.inventoryItem.update({
          where: { productId: item.productId },
          data: { reserved: { decrement: release } },
        });
      }
    }
  }

  private async restockSold(
    tx: Prisma.TransactionClient,
    items: Array<{ productId: string; quantity: number }>,
  ) {
    for (const item of items) {
      await tx.inventoryItem.update({
        where: { productId: item.productId },
        data: { quantity: { increment: item.quantity } },
      });
    }
  }

  async markPaid(orderId: string, providerRef: string, raw?: unknown) {
    const existing = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payments: true },
    });
    if (!existing) throw new NotFoundException("Order not found");
    if (existing.status === OrderStatus.PAID || existing.status === OrderStatus.COMPLETED) {
      return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      if (
        existing.status === OrderStatus.PENDING_PAYMENT ||
        existing.status === OrderStatus.AWAITING_PICKUP
      ) {
        await this.finalizeSale(tx, existing.items);
      }
      return tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          payments: {
            updateMany: {
              where: { orderId },
              data: {
                status: PaymentStatus.SUCCEEDED,
                providerRef,
                rawPayload: raw as object | undefined,
              },
            },
          },
        },
        include: { payments: true, items: true },
      });
    });
  }

  async applyStatusInventory(
    orderId: string,
    nextStatus: string,
    previousStatus: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return;

    const soldStates = new Set<string>([
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.COMPLETED,
    ]);
    const reservedOnlyStates = new Set<string>([
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.AWAITING_PICKUP,
      OrderStatus.PENDING_SHIPPING_QUOTE,
    ]);

    await this.prisma.$transaction(async (tx) => {
      if (
        nextStatus === OrderStatus.CANCELLED ||
        nextStatus === OrderStatus.REFUNDED
      ) {
        if (soldStates.has(previousStatus)) {
          await this.restockSold(tx, order.items);
        } else if (reservedOnlyStates.has(previousStatus)) {
          await this.releaseReservation(tx, order.items);
        }
      }
      if (
        (nextStatus === OrderStatus.PAID ||
          nextStatus === OrderStatus.COMPLETED) &&
        reservedOnlyStates.has(previousStatus)
      ) {
        await this.finalizeSale(tx, order.items);
      }
    });
  }

  async setShippingQuote(orderId: string, shippingMinor: number) {
    const shipping = Math.max(0, Math.round(Number(shippingMinor) || 0));
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true, name: true } }, payments: true },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.status !== OrderStatus.PENDING_SHIPPING_QUOTE) {
      throw new BadRequestException("Order is not awaiting a shipping quote");
    }
    if (order.fulfillmentType !== FulfillmentType.INTERNATIONAL_QUOTE) {
      throw new BadRequestException("Order is not an international quote order");
    }

    const goodsMinor = order.totalMinor - order.shippingMinor;
    const totalMinor = goodsMinor + shipping;

    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.order.update({
        where: { id: orderId },
        data: { shippingMinor: shipping, totalMinor },
        include: { payments: true, user: { select: { email: true, name: true } } },
      });
      await tx.payment.updateMany({
        where: { orderId, status: PaymentStatus.PENDING },
        data: { amountMinor: totalMinor },
      });
      return next;
    });

    await this.notifications.shippingQuoteReady({
      orderNumber: updated.orderNumber,
      shippingMinor: shipping,
      totalMinor,
      currency: updated.currency,
      customerEmail: updated.user.email,
      customerName: updated.user.name,
    });

    return updated;
  }

  async acceptShippingQuote(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.status !== OrderStatus.PENDING_SHIPPING_QUOTE) {
      throw new BadRequestException("Order is not awaiting a shipping quote");
    }
    if (order.shippingMinor <= 0) {
      throw new BadRequestException("Shipping quote has not been set yet");
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PENDING_PAYMENT },
      include: { items: true, payments: true, shippingAddress: true },
    });
  }

  async declineShippingQuote(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.status !== OrderStatus.PENDING_SHIPPING_QUOTE) {
      throw new BadRequestException("Order is not awaiting a shipping quote");
    }

    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.inventoryItem.update({
          where: { productId: item.productId },
          data: { reserved: { decrement: item.quantity } },
        });
      }
      return tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
        include: { items: true, payments: true, shippingAddress: true },
      });
    });
  }
}
