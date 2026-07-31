import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("coupons")
export class CouponsController {
  constructor(private readonly coupons: CouponsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("validate")
  validate(
    @Body()
    body: { code: string; currency: "USD" | "UZS"; subtotalMinor: number },
  ) {
    return this.coupons.validate(
      body.code,
      body.currency || "USD",
      Number(body.subtotalMinor) || 0,
    );
  }
}
