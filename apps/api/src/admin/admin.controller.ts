import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Locale } from "@prisma/client";
import { AdminService } from "./admin.service";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN", "MANAGER", "SALES_EXECUTIVE")
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly uploads: UploadService,
  ) {}

  @Get("dashboard")
  dashboard() {
    return this.admin.dashboard();
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    this.uploads.requireConfigured();
    return this.uploads.uploadImage(file);
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

  @Patch("orders/:id/shipping-quote")
  shippingQuote(
    @Param("id") id: string,
    @Body() body: { shippingMinor: number },
  ) {
    return this.admin.setShippingQuote(id, body.shippingMinor);
  }

  @Get("categories")
  categories() {
    return this.admin.listCategories();
  }

  @Post("categories")
  createCategory(
    @Body()
    body: {
      slug: string;
      sortOrder?: number;
      name: string;
      description?: string;
    },
  ) {
    return this.admin.createCategory(body);
  }

  @Patch("categories/:id")
  updateCategory(
    @Param("id") id: string,
    @Body()
    body: {
      slug?: string;
      sortOrder?: number;
      name?: string;
      description?: string | null;
    },
  ) {
    return this.admin.updateCategory(id, body);
  }

  @Get("collections")
  collections() {
    return this.admin.listCollections();
  }

  @Post("collections")
  createCollection(
    @Body()
    body: {
      slug: string;
      sortOrder?: number;
      featured?: boolean;
      imageUrl?: string;
      name: string;
      description?: string;
    },
  ) {
    return this.admin.createCollection(body);
  }

  @Patch("collections/:id")
  updateCollection(
    @Param("id") id: string,
    @Body()
    body: {
      slug?: string;
      sortOrder?: number;
      featured?: boolean;
      imageUrl?: string | null;
      name?: string;
      description?: string | null;
    },
  ) {
    return this.admin.updateCollection(id, body);
  }

  @Get("reviews")
  reviews() {
    return this.admin.listReviews();
  }

  @Patch("reviews/:id")
  updateReview(
    @Param("id") id: string,
    @Body() body: { published: boolean },
  ) {
    return this.admin.updateReview(id, Boolean(body.published));
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
