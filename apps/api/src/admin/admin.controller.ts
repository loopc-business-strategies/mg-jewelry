import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("dashboard")
  dashboard() {
    return this.admin.dashboard();
  }

  @Get("products")
  products() {
    return this.admin.listProducts();
  }

  @Get("orders")
  orders() {
    return this.admin.listOrders();
  }

  @Get("customers")
  customers() {
    return this.admin.listCustomers();
  }

  @Patch("inventory/:productId")
  inventory(
    @Param("productId") productId: string,
    @Body() body: { quantity: number },
  ) {
    return this.admin.updateInventory(productId, body.quantity);
  }

  @Patch("orders/:id/status")
  orderStatus(@Param("id") id: string, @Body() body: { status: string }) {
    return this.admin.updateOrderStatus(id, body.status);
  }
}
