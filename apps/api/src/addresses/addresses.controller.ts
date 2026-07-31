import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AddressesService } from "./addresses.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("addresses")
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addresses: AddressesService) {}

  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.addresses.list(user.userId);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body()
    body: {
      label?: string;
      fullName: string;
      phone: string;
      line1: string;
      line2?: string;
      city: string;
      region?: string;
      country: string;
      postalCode?: string;
      isDefault?: boolean;
    },
  ) {
    return this.addresses.create(user.userId, body);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: { userId: string },
    @Param("id") id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.addresses.update(user.userId, id, body as never);
  }

  @Delete(":id")
  remove(@CurrentUser() user: { userId: string }, @Param("id") id: string) {
    return this.addresses.remove(user.userId, id);
  }
}
