import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { RawBodyRequest } from "@nestjs/common";
import type { Request } from "express";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { OrdersService } from "../orders/orders.service";

@Controller("payments")
export class PaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly orders: OrdersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("stripe/:orderId")
  stripe(
    @CurrentUser() user: { userId: string },
    @Param("orderId") orderId: string,
    @Query("locale") locale = "en",
  ) {
    return this.payments.createStripeSession(orderId, user.userId, locale);
  }

  @UseGuards(JwtAuthGuard)
  @Post("payme/:orderId")
  payme(
    @CurrentUser() user: { userId: string },
    @Param("orderId") orderId: string,
  ) {
    return this.payments.createPaymeInvoice(orderId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("click/:orderId")
  click(
    @CurrentUser() user: { userId: string },
    @Param("orderId") orderId: string,
    @Query("locale") locale = "uz",
  ) {
    return this.payments.createClickInvoice(orderId, user.userId, locale);
  }

  @UseGuards(JwtAuthGuard)
  @Post("mock/confirm/:orderId")
  mockConfirm(
    @CurrentUser() user: { userId: string },
    @Param("orderId") orderId: string,
  ) {
    return this.payments.confirmMock(orderId, user.userId);
  }

  @Post("webhooks/stripe")
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers("stripe-signature") signature?: string,
  ) {
    const raw = req.rawBody;
    if (!raw) {
      throw new UnauthorizedException("Missing raw body for Stripe webhook");
    }
    return this.payments.handleStripeWebhook(raw, signature);
  }

  @Post("webhooks/payme")
  async paymeWebhook(
    @Headers("authorization") authorization: string | undefined,
    @Body()
    body: {
      method?: string;
      params?: { id?: string; account?: { order_id?: string }; amount?: number };
    },
  ) {
    if (!this.payments.verifyPaymeAuth(authorization)) {
      throw new UnauthorizedException("Invalid Payme credentials");
    }
    if (
      body.method === "PerformTransaction" &&
      body.params?.account?.order_id
    ) {
      await this.orders.markPaid(
        body.params.account.order_id,
        body.params.id || `payme_${Date.now()}`,
        body,
      );
      return {
        result: { perform_time: Date.now(), transaction: body.params.id },
      };
    }
    return { result: { allow: true } };
  }

  @Post("webhooks/click")
  async clickWebhook(
    @Body()
    body: {
      click_trans_id: string;
      service_id: string;
      merchant_trans_id: string;
      amount: string;
      action: string;
      sign_time: string;
      sign_string: string;
    },
  ) {
    if (!process.env.CLICK_SECRET_KEY) {
      return { error: -1, error_note: "CLICK_SECRET_KEY not configured" };
    }
    if (!this.payments.verifyClickSign(body)) {
      return { error: -1, error_note: "Invalid sign" };
    }
    if (body.action === "1") {
      const order = await this.orders.findByIdInternal(body.merchant_trans_id);
      if (order && String(order.totalMinor) !== String(Math.round(Number(body.amount)))) {
        // allow float amounts that match when truncated
        const amountOk =
          Math.abs(Number(body.amount) - order.totalMinor) < 0.01;
        if (!amountOk) {
          return { error: -2, error_note: "Amount mismatch" };
        }
      }
      await this.orders.markPaid(
        body.merchant_trans_id,
        body.click_trans_id,
        body,
      );
    }
    return {
      click_trans_id: body.click_trans_id,
      merchant_trans_id: body.merchant_trans_id,
      error: 0,
      error_note: "Success",
    };
  }
}
