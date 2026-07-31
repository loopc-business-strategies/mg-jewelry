import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("cart")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  get(
    @CurrentUser() user: { userId: string },
    @Query("locale") locale = "en",
  ) {
    return this.cart.get(user.userId, locale);
  }

  @Post("items")
  add(
    @CurrentUser() user: { userId: string },
    @Body() body: { productId: string; quantity?: number },
  ) {
    return this.cart.add(user.userId, body.productId, body.quantity ?? 1);
  }

  @Patch("items")
  update(
    @CurrentUser() user: { userId: string },
    @Body() body: { productId: string; quantity: number },
  ) {
    return this.cart.update(user.userId, body.productId, body.quantity);
  }

  @Delete()
  clear(@CurrentUser() user: { userId: string }) {
    return this.cart.clear(user.userId);
  }
}
