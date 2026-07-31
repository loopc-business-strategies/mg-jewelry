import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ReturnRequestStatus } from "@prisma/client";
import { ReturnsService } from "./returns.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("returns")
@UseGuards(JwtAuthGuard)
export class ReturnsController {
  constructor(private readonly returns: ReturnsService) {}

  @Get("mine")
  mine(@CurrentUser() user: { userId: string }) {
    return this.returns.listMine(user.userId);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() body: { orderId: string; reason: string; message: string },
  ) {
    return this.returns.create(user.userId, body);
  }

  @UseGuards(RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Get()
  listAll() {
    return this.returns.listAll();
  }

  @UseGuards(RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() body: { status: ReturnRequestStatus; adminNotes?: string },
  ) {
    return this.returns.update(id, body);
  }
}
