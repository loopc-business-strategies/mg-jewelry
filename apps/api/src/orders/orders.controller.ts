import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FulfillmentType, PaymentMethod } from "@prisma/client";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post("checkout")
  checkout(
    @CurrentUser() user: { userId: string },
    @Body()
    body: {
      paymentMethod: PaymentMethod;
      fulfillmentType: FulfillmentType;
      currency: "USD" | "UZS";
      notes?: string;
      shippingAddressId?: string;
      couponCode?: string;
    },
  ) {
    return this.orders.checkout(user.userId, body);
  }

  @Get()
  mine(@CurrentUser() user: { userId: string }) {
    return this.orders.mine(user.userId);
  }

  @Get(":id")
  byId(@CurrentUser() user: { userId: string }, @Param("id") id: string) {
    return this.orders.byId(user.userId, id);
  }

  @Post(":id/shipping-quote/accept")
  acceptQuote(
    @CurrentUser() user: { userId: string },
    @Param("id") id: string,
  ) {
    return this.orders.acceptShippingQuote(user.userId, id);
  }

  @Post(":id/shipping-quote/decline")
  declineQuote(
    @CurrentUser() user: { userId: string },
    @Param("id") id: string,
  ) {
    return this.orders.declineShippingQuote(user.userId, id);
  }
}
