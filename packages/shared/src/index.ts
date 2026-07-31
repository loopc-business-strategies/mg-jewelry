import { z } from "zod";

export const LOCALES = ["en", "uz", "ru", "tr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const ROLES = [
  "SUPER_ADMIN",
  "MANAGER",
  "SALES_EXECUTIVE",
  "CUSTOMER",
] as const;
export type Role = (typeof ROLES)[number];

export const PAYMENT_METHODS = [
  "STRIPE",
  "PAYME",
  "CLICK",
  "SHOWROOM",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "AWAITING_PICKUP",
  "PENDING_SHIPPING_QUOTE",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(120),
  phone: z.string().optional(),
});

export const productFilterSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  metal: z.string().optional(),
  purity: z.string().optional(),
  minPriceUsd: z.coerce.number().optional(),
  maxPriceUsd: z.coerce.number().optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "popular"])
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export type ProductFilter = z.infer<typeof productFilterSchema>;

export function formatMoney(
  amount: number,
  currency: "USD" | "UZS",
  locale: Locale = "en",
): string {
  // USD stored as cents; UZS stored as whole soms
  const value = currency === "USD" ? amount / 100 : amount;
  return new Intl.NumberFormat(
    locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : locale === "tr" ? "tr-TR" : "en-US",
    { style: "currency", currency, maximumFractionDigits: currency === "UZS" ? 0 : 2 },
  ).format(value);
}

export const SHOWROOM = {
  city: "Namangan",
  country: "Uzbekistan",
  address: "Namangan, Uzbekistan",
  brand: "MG Jewelry",
  fullName: "Modern Gold Jewelry",
} as const;
