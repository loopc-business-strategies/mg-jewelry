import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { SupportTicketStatus, SupportTicketType } from "@prisma/client";
import { SupportService } from "./support.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("support")
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly support: SupportService) {}

  @Get("mine")
  mine(@CurrentUser() user: { userId: string }) {
    return this.support.listMine(user.userId);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body()
    body: {
      type: SupportTicketType;
      subject: string;
      message: string;
      orderId?: string;
    },
  ) {
    return this.support.create(user.userId, body);
  }

  @UseGuards(RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Get()
  listAll() {
    return this.support.listAll();
  }

  @UseGuards(RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: SupportTicketStatus },
  ) {
    return this.support.updateStatus(id, body.status);
  }
}
