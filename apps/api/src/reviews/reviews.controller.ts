import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("products")
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(":productId/reviews")
  create(
    @CurrentUser() user: { userId: string },
    @Param("productId") productId: string,
    @Body() body: { rating: number; title?: string; body: string },
  ) {
    return this.reviews.create(user.userId, productId, body);
  }
}
