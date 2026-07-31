import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { InquiryStatus } from "@prisma/client";
import { InquiriesService } from "./inquiries.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("inquiries")
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      email: string;
      phone?: string;
      message: string;
      productSlug?: string;
    },
  ) {
    return this.inquiries.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Get()
  listAll() {
    return this.inquiries.listAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: InquiryStatus },
  ) {
    return this.inquiries.updateStatus(id, body.status);
  }
}
