import { Controller, Get, Logger, OnModuleInit } from "@nestjs/common";
import { SHOWROOM } from "@mg/shared";

@Controller("health")
export class HealthController implements OnModuleInit {
  private readonly logger = new Logger(HealthController.name);
  private alertsConfigured = false;
  private warnedMissingAlerts = false;

  onModuleInit() {
    this.refreshAlertsFlag();
  }

  private refreshAlertsFlag() {
    this.alertsConfigured = Boolean(
      process.env.TELEGRAM_BOT_TOKEN?.trim() ||
        process.env.RESEND_API_KEY?.trim(),
    );
    if (
      process.env.NODE_ENV === "production" &&
      !this.alertsConfigured &&
      !this.warnedMissingAlerts
    ) {
      this.warnedMissingAlerts = true;
      this.logger.error(
        "Ops alerts not configured: set TELEGRAM_BOT_TOKEN and/or RESEND_API_KEY in production",
      );
    }
  }

  @Get()
  check() {
    this.refreshAlertsFlag();
    return {
      ok: true,
      brand: SHOWROOM.brand,
      showroom: SHOWROOM,
      alertsConfigured: this.alertsConfigured,
      time: new Date().toISOString(),
    };
  }
}
