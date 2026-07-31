import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AppointmentStatus, AppointmentType, Locale } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";

const DEFAULT_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async slots() {
    const setting = await this.prisma.siteSetting.findUnique({
      where: { key: "appointmentSlots" },
    });
    const value = setting?.value as { slots?: string[] } | null;
    return value?.slots?.length ? value.slots : DEFAULT_SLOTS;
  }

  async availableSlots(dateStr: string) {
    const date = this.parseDate(dateStr);
    const all = await this.slots();
    const taken = await this.prisma.appointment.findMany({
      where: {
        date,
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      },
      select: { slot: true },
    });
    const takenSet = new Set(taken.map((t) => t.slot));
    return all.filter((s) => !takenSet.has(s));
  }

  async create(
    input: {
      name: string;
      phone: string;
      email?: string;
      type: AppointmentType;
      date: string;
      slot: string;
      notes?: string;
      locale?: Locale;
    },
    userId?: string,
  ) {
    if (!input.name?.trim() || !input.phone?.trim()) {
      throw new BadRequestException("Name and phone are required");
    }
    const date = this.parseDate(input.date);
    const available = await this.availableSlots(input.date);
    if (!available.includes(input.slot)) {
      throw new BadRequestException("Selected time slot is not available");
    }

    const appt = await this.prisma.appointment.create({
      data: {
        userId,
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email?.trim() || null,
        type: input.type,
        date,
        slot: input.slot,
        notes: input.notes?.trim() || null,
        locale: input.locale || Locale.en,
      },
    });

    await this.notifications.appointmentCreated({
      name: appt.name,
      phone: appt.phone,
      type: appt.type,
      date: input.date,
      slot: appt.slot,
    });

    if (appt.email) {
      await this.notifications.notifyEmail(
        appt.email,
        "MG Jewelry appointment received",
        `We received your ${appt.type} request for ${input.date} at ${appt.slot}.`,
      );
    }

    return appt;
  }

  listMine(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: [{ date: "asc" }, { slot: "asc" }],
    });
  }

  listAll() {
    return this.prisma.appointment.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      include: { user: { select: { name: true, email: true } } },
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const existing = await this.prisma.appointment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Appointment not found");
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  private parseDate(dateStr: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new BadRequestException("Date must be YYYY-MM-DD");
    }
    const date = new Date(`${dateStr}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException("Invalid date");
    }
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (date < today) {
      throw new BadRequestException("Date must be today or later");
    }
    return date;
  }
}
