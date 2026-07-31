import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import Stripe from "stripe";
import { createHash } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { OrdersService } from "../orders/orders.service";

@Injectable()
export class PaymentsService {
  private stripe: Stripe | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService,
  ) {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
  }

  async createStripeSession(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true, payments: true },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (!this.stripe) {
      // Dev fallback when Stripe keys are not configured
      return {
        mode: "mock",
        url: `${process.env.CORS_ORIGINS?.split(",")[0] || "http://localhost:3000"}/en/checkout/success?orderId=${order.id}&mock=1`,
        sessionId: `mock_${order.id}`,
      };
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.CORS_ORIGINS?.split(",")[0]}/en/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.CORS_ORIGINS?.split(",")[0]}/en/checkout/cancel?orderId=${order.id}`,
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: order.currency.toLowerCase(),
          unit_amount: item.unitPriceMinor,
          product_data: { name: item.productName },
        },
      })),
      metadata: { orderId: order.id },
    });

    await this.prisma.payment.updateMany({
      where: { orderId: order.id, method: PaymentMethod.STRIPE },
      data: { providerRef: session.id },
    });

    return { mode: "stripe", url: session.url, sessionId: session.id };
  }

  async createPaymeInvoice(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.currency !== "UZS") {
      throw new BadRequestException("Payme expects UZS orders");
    }

    const merchantId = process.env.PAYME_MERCHANT_ID || "demo-merchant";
    // Payme expects tiyins; our UZS orders store whole soms
    const amount = order.totalMinor * 100;
    const params = Buffer.from(
      `m=${merchantId};ac.order_id=${order.id};a=${amount}`,
    ).toString("base64");

    return {
      mode: process.env.PAYME_MERCHANT_ID ? "payme" : "mock",
      url: `https://checkout.paycom.uz/${params}`,
      orderId: order.id,
    };
  }

  async createClickInvoice(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.currency !== "UZS") {
      throw new BadRequestException("Click expects UZS orders");
    }

    const merchantId = process.env.CLICK_MERCHANT_ID || "0";
    const serviceId = process.env.CLICK_SERVICE_ID || "0";
    const returnUrl = `${process.env.CORS_ORIGINS?.split(",")[0] || "http://localhost:3000"}/uz/checkout/success?orderId=${order.id}`;

    const url =
      `https://my.click.uz/services/pay?service_id=${serviceId}` +
      `&merchant_id=${merchantId}&amount=${order.totalMinor.toFixed(2)}` +
      `&transaction_param=${order.id}&return_url=${encodeURIComponent(returnUrl)}`;

    return {
      mode: process.env.CLICK_MERCHANT_ID ? "click" : "mock",
      url,
      orderId: order.id,
    };
  }

  async confirmMock(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        "Order is not ready for payment (accept shipping quote first if needed)",
      );
    }
    return this.orders.markPaid(orderId, `mock_${Date.now()}`, { mock: true });
  }

  verifyClickSign(payload: {
    click_trans_id: string;
    service_id: string;
    merchant_trans_id: string;
    amount: string;
    action: string;
    sign_time: string;
    sign_string: string;
  }) {
    const secret = process.env.CLICK_SECRET_KEY || "";
    const raw = `${payload.click_trans_id}${payload.service_id}${secret}${payload.merchant_trans_id}${payload.amount}${payload.action}${payload.sign_time}`;
    const expected = createHash("md5").update(raw).digest("hex");
    return expected === payload.sign_string;
  }
}
