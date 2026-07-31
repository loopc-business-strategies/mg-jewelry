import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Locale } from "@prisma/client";
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

  @Post("products")
  createProduct(
    @Body()
    body: {
      slug: string;
      sku: string;
      metal: string;
      purity?: string;
      weightGrams: number;
      makingChargePct?: number;
      priceUsdCents: number;
      priceUzs: number;
      categoryId?: string;
      collectionId?: string;
      isFeatured?: boolean;
      isBestSeller?: boolean;
      isNewArrival?: boolean;
      shipsInternational?: boolean;
      published?: boolean;
      quantity?: number;
      imageUrl?: string;
      translations: Array<{
        locale: Locale;
        name: string;
        description: string;
        materialNote?: string;
      }>;
    },
  ) {
    return this.admin.createProduct(body);
  }

  @Patch("products/:id")
  updateProduct(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.admin.updateProduct(id, body as never);
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

  @Get("settings")
  settings() {
    return this.admin.getSettings();
  }

  @Put("settings/:key")
  upsertSetting(@Param("key") key: string, @Body() body: { value: unknown }) {
    return this.admin.upsertSetting(key, body.value);
  }
}
