import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import Stripe from "stripe";
import { createHash, timingSafeEqual } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { OrdersService } from "../orders/orders.service";

function appBaseUrl() {
  return (
    process.env.APP_PUBLIC_URL ||
    process.env.CORS_ORIGINS?.split(",")[0] ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function mockPaymentsAllowed() {
  if (process.env.ALLOW_MOCK_PAYMENTS === "1") return true;
  if (process.env.ALLOW_MOCK_PAYMENTS === "0") return false;
  return process.env.NODE_ENV !== "production";
}

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

  mockAllowed() {
    return mockPaymentsAllowed();
  }

  async createStripeSession(orderId: string, userId: string, locale = "en") {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true, payments: true },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (!this.stripe) {
      if (!mockPaymentsAllowed()) {
        throw new ServiceUnavailableException(
          "Stripe is not configured. Set STRIPE_SECRET_KEY or ALLOW_MOCK_PAYMENTS=1 for demos.",
        );
      }
      return {
        mode: "mock",
        url: `${appBaseUrl()}/${locale}/checkout/success?orderId=${order.id}&mock=1`,
        sessionId: `mock_${order.id}`,
      };
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appBaseUrl()}/${locale}/checkout/success?orderId=${order.id}`,
      cancel_url: `${appBaseUrl()}/${locale}/checkout/cancel?orderId=${order.id}`,
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

  async handleStripeWebhook(rawBody: Buffer, signature: string | undefined) {
    if (!this.stripe) {
      throw new ServiceUnavailableException("Stripe is not configured");
    }
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new ServiceUnavailableException("STRIPE_WEBHOOK_SECRET is not set");
    }
    if (!signature) {
      throw new BadRequestException("Missing stripe-signature header");
    }
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      secret,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await this.orders.markPaid(orderId, session.id, {
          type: event.type,
          sessionId: session.id,
        });
      }
    }
    return { received: true };
  }

  async createPaymeInvoice(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.currency !== "UZS") {
      throw new BadRequestException("Payme expects UZS orders");
    }
    if (!process.env.PAYME_MERCHANT_ID) {
      if (!mockPaymentsAllowed()) {
        throw new ServiceUnavailableException(
          "Payme is not configured. Set PAYME_MERCHANT_ID or ALLOW_MOCK_PAYMENTS=1.",
        );
      }
      return {
        mode: "mock",
        url: `${appBaseUrl()}/uz/checkout/success?orderId=${order.id}&mock=1`,
        orderId: order.id,
      };
    }

    const merchantId = process.env.PAYME_MERCHANT_ID;
    const amount = order.totalMinor * 100;
    const params = Buffer.from(
      `m=${merchantId};ac.order_id=${order.id};a=${amount}`,
    ).toString("base64");

    return {
      mode: "payme",
      url: `https://checkout.paycom.uz/${params}`,
      orderId: order.id,
    };
  }

  verifyPaymeAuth(authorization?: string) {
    const key = process.env.PAYME_KEY;
    if (!key) return false;
    if (!authorization?.startsWith("Basic ")) return false;
    try {
      const decoded = Buffer.from(authorization.slice(6), "base64").toString(
        "utf8",
      );
      const expected = `Paycom:${key}`;
      const a = Buffer.from(decoded);
      const b = Buffer.from(expected);
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  async createClickInvoice(orderId: string, userId: string, locale = "uz") {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.currency !== "UZS") {
      throw new BadRequestException("Click expects UZS orders");
    }
    if (!process.env.CLICK_MERCHANT_ID || !process.env.CLICK_SERVICE_ID) {
      if (!mockPaymentsAllowed()) {
        throw new ServiceUnavailableException(
          "Click is not configured. Set CLICK_MERCHANT_ID/SERVICE_ID or ALLOW_MOCK_PAYMENTS=1.",
        );
      }
      return {
        mode: "mock",
        url: `${appBaseUrl()}/${locale}/checkout/success?orderId=${order.id}&mock=1`,
        orderId: order.id,
      };
    }

    const merchantId = process.env.CLICK_MERCHANT_ID;
    const serviceId = process.env.CLICK_SERVICE_ID;
    const returnUrl = `${appBaseUrl()}/${locale}/checkout/success?orderId=${order.id}`;

    const url =
      `https://my.click.uz/services/pay?service_id=${serviceId}` +
      `&merchant_id=${merchantId}&amount=${order.totalMinor.toFixed(2)}` +
      `&transaction_param=${order.id}&return_url=${encodeURIComponent(returnUrl)}`;

    return {
      mode: "click",
      url,
      orderId: order.id,
    };
  }

  async confirmMock(orderId: string, userId: string) {
    if (!mockPaymentsAllowed()) {
      throw new ServiceUnavailableException(
        "Mock payments are disabled in this environment",
      );
    }
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
    if (!secret) return false;
    const raw = `${payload.click_trans_id}${payload.service_id}${secret}${payload.merchant_trans_id}${payload.amount}${payload.action}${payload.sign_time}`;
    const expected = createHash("md5").update(raw).digest("hex");
    try {
      return timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(payload.sign_string),
      );
    } catch {
      return false;
    }
  }
}
