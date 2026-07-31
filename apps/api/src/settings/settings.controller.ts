import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("settings")
export class SettingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("public")
  async publicSettings() {
    const keys = ["showroom", "brand", "appointmentSlots", "currencies"];
    const rows = await this.prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }
}
