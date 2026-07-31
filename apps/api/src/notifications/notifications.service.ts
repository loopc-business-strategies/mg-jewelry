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

  /** Email stub — logs until SMTP/Resend is configured */
  async notifyEmail(to: string, subject: string, body: string) {
    this.logger.log(`[email-stub] to=${to} subject=${subject} body=${body}`);
    return { sent: false, reason: "email_stub" };
  }

  async orderCreated(order: {
    orderNumber: string;
    totalMinor: number;
    currency: string;
    status: string;
    customerEmail?: string;
    customerName?: string;
  }) {
    const text =
      `MG Jewelry — New order\n` +
      `#${order.orderNumber}\n` +
      `${order.currency} ${order.totalMinor}\n` +
      `Status: ${order.status}` +
      (order.customerEmail ? `\n${order.customerName || ""} <${order.customerEmail}>` : "");
    await this.notifyTelegram(text);

    if (order.customerEmail) {
      await this.notifyEmail(
        order.customerEmail,
        `MG Jewelry — Order ${order.orderNumber} received`,
        `Hello ${order.customerName || "there"},\n\nWe received your order ${order.orderNumber}.\nTotal: ${order.currency} ${order.totalMinor}\nStatus: ${order.status}\n\nThank you for choosing Modern Gold Jewelry Manufacturing — Hearts of Namangan.\nShowroom: 242 Girvonbulok Street, Namangan, Uzbekistan`,
      );
    }
  }

  async appointmentCreated(appt: {
    name: string;
    phone: string;
    type: string;
    date: string;
    slot: string;
    email?: string;
  }) {
    const text =
      `MG Jewelry — New appointment\n` +
      `${appt.name} (${appt.phone})\n` +
      `${appt.type}\n` +
      `${appt.date} ${appt.slot}`;
    await this.notifyTelegram(text);

    if (appt.email) {
      await this.notifyEmail(
        appt.email,
        "MG Jewelry — Appointment request received",
        `Hello ${appt.name},\n\nWe received your ${appt.type.replace(/_/g, " ").toLowerCase()} request for ${appt.date} at ${appt.slot}.\nOur team will confirm shortly.\n\nShowroom: 242 Girvonbulok Street, Namangan, Uzbekistan\nTelegram: @mgjewelry`,
      );
    }
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

  async inquiryCreated(inquiry: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    productSlug?: string;
    productName?: string;
  }) {
    const text =
      `MG Jewelry — New inquiry\n` +
      `${inquiry.name} <${inquiry.email}>\n` +
      (inquiry.phone ? `${inquiry.phone}\n` : "") +
      (inquiry.productName || inquiry.productSlug
        ? `Product: ${inquiry.productName || inquiry.productSlug}\n`
        : "") +
      inquiry.message.slice(0, 400);
    await this.notifyTelegram(text);
  }

  async shippingQuoteReady(quote: {
    orderNumber: string;
    shippingMinor: number;
    totalMinor: number;
    currency: string;
    customerEmail?: string;
    customerName?: string;
  }) {
    const text =
      `MG Jewelry — Shipping quote sent\n` +
      `#${quote.orderNumber}\n` +
      `Shipping: ${quote.currency} ${quote.shippingMinor}\n` +
      `Total: ${quote.currency} ${quote.totalMinor}`;
    await this.notifyTelegram(text);
    if (quote.customerEmail) {
      await this.notifyEmail(
        quote.customerEmail,
        `MG Jewelry — Shipping quote for ${quote.orderNumber}`,
        `Hello ${quote.customerName || "there"},\n\nWe prepared a shipping quote for order ${quote.orderNumber}.\nShipping: ${quote.currency} ${quote.shippingMinor}\nNew total: ${quote.currency} ${quote.totalMinor}\n\nPlease sign in to your account to accept or decline the quote.\n\nModern Gold Jewelry Manufacturing — Hearts of Namangan`,
      );
    }
  }

  async returnRequested(ret: {
    rmaNumber: string;
    orderNumber: string;
    userName: string;
    userEmail: string;
    reason: string;
  }) {
    const text =
      `MG Jewelry — Return request\n` +
      `${ret.rmaNumber}\n` +
      `Order #${ret.orderNumber}\n` +
      `${ret.userName} <${ret.userEmail}>\n` +
      ret.reason;
    await this.notifyTelegram(text);
    await this.notifyEmail(
      ret.userEmail,
      `MG Jewelry — Return request ${ret.rmaNumber}`,
      `Hello ${ret.userName},\n\nWe received your return request ${ret.rmaNumber} for order ${ret.orderNumber}.\nReason: ${ret.reason}\n\nOur team will review and reply with next steps.\n\nModern Gold Jewelry Manufacturing — Hearts of Namangan`,
    );
  }

  async returnUpdated(ret: {
    rmaNumber: string;
    status: string;
    userEmail: string;
    userName: string;
    adminNotes?: string;
  }) {
    await this.notifyTelegram(
      `MG Jewelry — Return ${ret.rmaNumber} → ${ret.status}`,
    );
    await this.notifyEmail(
      ret.userEmail,
      `MG Jewelry — Return ${ret.rmaNumber} updated`,
      `Hello ${ret.userName},\n\nYour return ${ret.rmaNumber} is now ${ret.status}.\n${ret.adminNotes ? `\nNotes from our team:\n${ret.adminNotes}\n` : ""}\nModern Gold Jewelry Manufacturing — Hearts of Namangan`,
    );
  }
}
