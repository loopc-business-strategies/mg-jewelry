export type GuestCartItem = {
  productId: string;
  slug: string;
  name: string;
  priceUsdCents: number;
  image: string | null;
  quantity: number;
};

const KEY = "mg_guest_cart";

function read(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: GuestCartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("mg-cart-changed"));
}

export const guestCart = {
  get(): GuestCartItem[] {
    return read();
  },
  count(): number {
    return read().reduce((n, i) => n + i.quantity, 0);
  },
  add(
    item: Omit<GuestCartItem, "quantity">,
    quantity = 1,
  ): GuestCartItem[] {
    const items = read();
    const existing = items.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ ...item, quantity });
    }
    write(items);
    return items;
  },
  update(productId: string, quantity: number): GuestCartItem[] {
    let items = read();
    if (quantity <= 0) {
      items = items.filter((i) => i.productId !== productId);
    } else {
      const row = items.find((i) => i.productId === productId);
      if (row) row.quantity = quantity;
    }
    write(items);
    return items;
  },
  clear() {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("mg-cart-changed"));
  },
};
