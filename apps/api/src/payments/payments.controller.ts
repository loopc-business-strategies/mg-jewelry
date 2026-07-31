import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
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
  ) {
    return this.payments.createStripeSession(orderId, user.userId);
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
  ) {
    return this.payments.createClickInvoice(orderId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("mock/confirm/:orderId")
  mockConfirm(
    @CurrentUser() user: { userId: string },
    @Param("orderId") orderId: string,
  ) {
    return this.payments.confirmMock(orderId, user.userId);
  }

  /** Payme Merchant API style callback stub */
  @Post("webhooks/payme")
  async paymeWebhook(@Body() body: { method?: string; params?: { id?: string; account?: { order_id?: string } } }) {
    if (body.method === "PerformTransaction" && body.params?.account?.order_id) {
      await this.orders.markPaid(
        body.params.account.order_id,
        body.params.id || `payme_${Date.now()}`,
        body,
      );
      return { result: { perform_time: Date.now(), transaction: body.params.id } };
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
    if (process.env.CLICK_SECRET_KEY && !this.payments.verifyClickSign(body)) {
      return { error: -1, error_note: "Invalid sign" };
    }
    if (body.action === "1") {
      await this.orders.markPaid(
        body.merchant_trans_id,
        body.click_trans_id,
        body,
      );
    }
    return { click_trans_id: body.click_trans_id, merchant_trans_id: body.merchant_trans_id, error: 0, error_note: "Success" };
  }
}
