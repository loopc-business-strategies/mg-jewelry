import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { WishlistService } from "./wishlist.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("wishlist")
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  list(
    @CurrentUser() user: { userId: string },
    @Query("locale") locale = "en",
  ) {
    return this.wishlist.list(user.userId, locale);
  }

  @Post("toggle")
  toggle(
    @CurrentUser() user: { userId: string },
    @Body() body: { productId: string },
  ) {
    return this.wishlist.toggle(user.userId, body.productId);
  }
}
