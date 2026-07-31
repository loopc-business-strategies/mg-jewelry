import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { CartModule } from "./cart/cart.module";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { AdminModule } from "./admin/admin.module";
import { WishlistModule } from "./wishlist/wishlist.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { AddressesModule } from "./addresses/addresses.module";
import { SupportModule } from "./support/support.module";
import { CouponsModule } from "./coupons/coupons.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { InquiriesModule } from "./inquiries/inquiries.module";
import { ReturnsModule } from "./returns/returns.module";
import { HealthController } from "./health.controller";
import { SettingsController } from "./settings/settings.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    NotificationsModule,
    AuthModule,
    ProductsModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    PaymentsModule,
    AdminModule,
    AppointmentsModule,
    AddressesModule,
    SupportModule,
    CouponsModule,
    ReviewsModule,
    InquiriesModule,
    ReturnsModule,
  ],
  controllers: [HealthController, SettingsController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
