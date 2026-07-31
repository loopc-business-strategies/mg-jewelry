import { Controller, Get } from "@nestjs/common";
import { SHOWROOM } from "@mg/shared";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      ok: true,
      brand: SHOWROOM.brand,
      showroom: SHOWROOM,
      time: new Date().toISOString(),
    };
  }
}
