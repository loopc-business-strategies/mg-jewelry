import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UploadService } from "./upload.service";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [OrdersModule],
  controllers: [AdminController],
  providers: [AdminService, UploadService],
})
export class AdminModule {}
