const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type ApiProduct = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  metal: string;
  purity: string | null;
  weightGrams: number;
  makingChargePct: number;
  priceUsdCents: number;
  priceUzs: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  stock: number;
  media: Array<{ url: string; alt: string | null; isPrimary: boolean }>;
  category: { slug: string; name: string } | null;
  collection: { slug: string; name: string } | null;
};

function authHeaders() {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("mg_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  products: (locale: string, query = "") =>
    request<{ items: ApiProduct[]; total: number }>(
      `/products?locale=${locale}${query}`,
    ),
  product: (slug: string, locale: string) =>
    request<ApiProduct>(`/products/${slug}?locale=${locale}`),
  collections: (locale: string) =>
    request<
      Array<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        featured: boolean;
        imageUrl: string | null;
      }>
    >(`/collections?locale=${locale}`),
  categories: (locale: string) =>
    request<Array<{ id: string; slug: string; name: string }>>(
      `/categories?locale=${locale}`,
    ),
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: { id: string; name: string; role: string } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    ),
  register: (name: string, email: string, password: string) =>
    request<{ accessToken: string; user: { id: string; name: string; role: string } }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify({ name, email, password }) },
    ),
  me: () =>
    request<{ id: string; name: string; email: string; role: string }>("/auth/me"),
  cart: (locale: string) => request<Record<string, unknown>>(`/cart?locale=${locale}`),
  addToCart: (productId: string, quantity = 1) =>
    request("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),
  wishlistToggle: (productId: string) =>
    request("/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  checkout: (body: Record<string, unknown>) =>
    request<{ id: string; orderNumber: string }>("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  pay: async (
    method: "stripe" | "payme" | "click" | "mock",
    orderId: string,
  ): Promise<{ url?: string; mode?: string }> => {
    if (method === "mock") {
      await request(`/payments/mock/confirm/${orderId}`, { method: "POST" });
      return { mode: "mock" };
    }
    return request<{ url: string; mode: string }>(`/payments/${method}/${orderId}`, {
      method: "POST",
    });
  },
  orders: () => request<Array<Record<string, unknown>>>("/orders"),
  adminDashboard: () => request<Record<string, unknown>>("/admin/dashboard"),
  adminProducts: () => request<Array<Record<string, unknown>>>("/admin/products"),
  adminOrders: () => request<Array<Record<string, unknown>>>("/admin/orders"),
  adminCreateProduct: (body: Record<string, unknown>) =>
    request("/admin/products", { method: "POST", body: JSON.stringify(body) }),
  adminUpdateProduct: (id: string, body: Record<string, unknown>) =>
    request(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  adminOrderStatus: (id: string, status: string) =>
    request(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  adminInventory: (productId: string, quantity: number) =>
    request(`/admin/inventory/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  adminSettings: () => request<Record<string, unknown>>("/admin/settings"),
  adminSaveSetting: (key: string, value: unknown) =>
    request(`/admin/settings/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    }),
  publicSettings: () => request<Record<string, unknown>>("/settings/public"),
  appointmentSlots: (date?: string) =>
    request<string[]>(
      date ? `/appointments/slots?date=${date}` : "/appointments/slots",
    ),
  createAppointment: (body: Record<string, unknown>) =>
    request("/appointments", { method: "POST", body: JSON.stringify(body) }),
  adminAppointments: () =>
    request<Array<Record<string, unknown>>>("/appointments"),
  adminAppointmentStatus: (id: string, status: string) =>
    request(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  order: (id: string) => request<Record<string, unknown>>(`/orders/${id}`),
  addresses: () => request<Array<Record<string, unknown>>>("/addresses"),
  createAddress: (body: Record<string, unknown>) =>
    request("/addresses", { method: "POST", body: JSON.stringify(body) }),
  updateAddress: (id: string, body: Record<string, unknown>) =>
    request(`/addresses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteAddress: (id: string) =>
    request(`/addresses/${id}`, { method: "DELETE" }),
  wishlist: (locale: string) =>
    request<Array<Record<string, unknown>>>(`/wishlist?locale=${locale}`),
  myAppointments: () =>
    request<Array<Record<string, unknown>>>("/appointments/mine"),
  myTickets: () => request<Array<Record<string, unknown>>>("/support/mine"),
  createTicket: (body: Record<string, unknown>) =>
    request("/support", { method: "POST", body: JSON.stringify(body) }),
  adminTickets: () => request<Array<Record<string, unknown>>>("/support"),
  adminTicketStatus: (id: string, status: string) =>
    request(`/support/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

export function formatUsd(cents: number, locale: string) {
  return new Intl.NumberFormat(
    locale === "ru" ? "ru-RU" : locale === "tr" ? "tr-TR" : locale === "uz" ? "uz-UZ" : "en-US",
    { style: "currency", currency: "USD" },
  ).format(cents / 100);
}

export function formatUzs(soms: number, locale: string) {
  return new Intl.NumberFormat(
    locale === "ru" ? "ru-RU" : locale === "tr" ? "tr-TR" : "uz-UZ",
    { style: "currency", currency: "UZS", maximumFractionDigits: 0 },
  ).format(soms);
}
