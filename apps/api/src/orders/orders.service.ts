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
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async checkout(
    userId: string,
    input: {
      paymentMethod: PaymentMethod;
      fulfillmentType: FulfillmentType;
      currency: "USD" | "UZS";
      notes?: string;
      shippingAddressId?: string;
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

    for (const item of cart.items) {
      const stock =
        (item.product.inventory?.quantity || 0) -
        (item.product.inventory?.reserved || 0);
      if (stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${item.product.sku}`);
      }
    }

    const useUsd = input.currency === "USD";
    const subtotalMinor = cart.items.reduce(
      (sum, item) =>
        sum +
        (useUsd ? item.product.priceUsdCents : item.product.priceUzs) *
          item.quantity,
      0,
    );

    let status: OrderStatus = OrderStatus.PENDING_PAYMENT;
    if (input.paymentMethod === PaymentMethod.SHOWROOM) {
      status = OrderStatus.AWAITING_PICKUP;
    } else if (input.fulfillmentType === FulfillmentType.INTERNATIONAL_QUOTE) {
      status = OrderStatus.PENDING_SHIPPING_QUOTE;
    }

    const orderNumber = `MG-${Date.now().toString(36).toUpperCase()}`;

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
          totalMinor: subtotalMinor,
          notes: input.notes,
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
              status:
                input.paymentMethod === PaymentMethod.SHOWROOM
                  ? PaymentStatus.PENDING
                  : PaymentStatus.PENDING,
              amountMinor: subtotalMinor,
              currency: input.currency,
            },
          },
        },
        include: { payments: true, items: true },
      });

      for (const item of cart.items) {
        await tx.inventoryItem.update({
          where: { productId: item.productId },
          data: { reserved: { increment: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });

    await this.notifications.orderCreated({
      orderNumber: order.orderNumber,
      totalMinor: order.totalMinor,
      currency: order.currency,
      status: order.status,
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

  async markPaid(orderId: string, providerRef: string, raw?: unknown) {
    return this.prisma.order.update({
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
      include: { payments: true },
    });
  }
}
