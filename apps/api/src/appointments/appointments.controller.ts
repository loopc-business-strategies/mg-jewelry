import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AppointmentStatus, AppointmentType, Locale } from "@prisma/client";
import { AppointmentsService } from "./appointments.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  @Get("slots")
  slots(@Query("date") date?: string) {
    if (date) return this.appointments.availableSlots(date);
    return this.appointments.slots();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(
    @Body()
    body: {
      name: string;
      phone: string;
      email?: string;
      type: AppointmentType;
      date: string;
      slot: string;
      notes?: string;
      locale?: Locale;
    },
    @CurrentUser() user?: { userId: string },
  ) {
    return this.appointments.create(body, user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mine")
  mine(@CurrentUser() user: { userId: string }) {
    return this.appointments.listMine(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Get()
  listAll() {
    return this.appointments.listAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: AppointmentStatus },
  ) {
    return this.appointments.updateStatus(id, body.status);
  }
}
