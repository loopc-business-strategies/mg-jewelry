import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async notifyTelegram(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      this.logger.log(`[telegram-skip] ${text}`);
      return { sent: false, reason: "missing_credentials" };
    }

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            disable_web_page_preview: true,
          }),
        },
      );
      if (!res.ok) {
        const body = await res.text();
        this.logger.warn(`Telegram failed: ${res.status} ${body}`);
        return { sent: false, reason: "telegram_error" };
      }
      return { sent: true };
    } catch (e) {
      this.logger.warn(`Telegram error: ${e instanceof Error ? e.message : e}`);
      return { sent: false, reason: "network_error" };
    }
  }

  /** Email stub — logs until SMTP provider is configured */
  async notifyEmail(to: string, subject: string, body: string) {
    this.logger.log(`[email-stub] to=${to} subject=${subject} body=${body}`);
    return { sent: false, reason: "email_stub" };
  }

  async orderCreated(order: {
    orderNumber: string;
    totalMinor: number;
    currency: string;
    status: string;
  }) {
    const text =
      `MG Jewelry — New order\n` +
      `#${order.orderNumber}\n` +
      `${order.currency} ${order.totalMinor}\n` +
      `Status: ${order.status}`;
    await this.notifyTelegram(text);
  }

  async appointmentCreated(appt: {
    name: string;
    phone: string;
    type: string;
    date: string;
    slot: string;
  }) {
    const text =
      `MG Jewelry — New appointment\n` +
      `${appt.name} (${appt.phone})\n` +
      `${appt.type}\n` +
      `${appt.date} ${appt.slot}`;
    await this.notifyTelegram(text);
  }

  async ticketCreated(ticket: {
    type: string;
    subject: string;
    orderNumber?: string;
    userName: string;
    userEmail: string;
  }) {
    const text =
      `MG Jewelry — New ${ticket.type} ticket\n` +
      `${ticket.subject}\n` +
      `${ticket.userName} <${ticket.userEmail}>\n` +
      (ticket.orderNumber ? `Order #${ticket.orderNumber}` : "No order linked");
    await this.notifyTelegram(text);
  }
}
