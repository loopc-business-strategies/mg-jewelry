import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Get()
  listAll() {
    return this.coupons.listAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Post()
  create(
    @Body()
    body: {
      code: string;
      percentOff?: number | null;
      amountOffMinor?: number | null;
      currency?: string | null;
      active?: boolean;
      startsAt?: string | null;
      endsAt?: string | null;
    },
  ) {
    return this.coupons.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body()
    body: {
      percentOff?: number | null;
      amountOffMinor?: number | null;
      currency?: string | null;
      active?: boolean;
      startsAt?: string | null;
      endsAt?: string | null;
    },
  ) {
    return this.coupons.update(id, body);
  }
}
