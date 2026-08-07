import { OrderStatus } from "@prisma/client";
import { OrdersService } from "./orders.service";

describe("OrdersService inventory", () => {
  const notifications = { orderCreated: jest.fn() };
  const coupons = { validate: jest.fn() };

  function makeService(prisma: Record<string, unknown>) {
    return new OrdersService(
      prisma as never,
      notifications as never,
      coupons as never,
    );
  }

  it("markPaid finalizes sale (decrements qty and reserved)", async () => {
    const inv = { productId: "p1", quantity: 10, reserved: 2 };
    const tx = {
      inventoryItem: {
        findUnique: jest.fn().mockResolvedValue({ ...inv }),
        update: jest.fn().mockResolvedValue({}),
      },
      order: {
        update: jest.fn().mockResolvedValue({
          id: "o1",
          status: OrderStatus.PAID,
          items: [{ productId: "p1", quantity: 2 }],
          payments: [],
        }),
      },
    };

    const prisma = {
      order: {
        findUnique: jest.fn().mockResolvedValue({
          id: "o1",
          status: OrderStatus.PENDING_PAYMENT,
          items: [{ productId: "p1", quantity: 2 }],
          payments: [],
        }),
      },
      $transaction: jest.fn(async (fn: (t: typeof tx) => Promise<unknown>) =>
        fn(tx),
      ),
    };

    const service = makeService(prisma);
    await service.markPaid("o1", "ref-1");

    expect(tx.inventoryItem.update).toHaveBeenCalledWith({
      where: { productId: "p1" },
      data: {
        reserved: { decrement: 2 },
        quantity: { decrement: 2 },
      },
    });
  });

  it("cancel from reserved-only releases reservation", async () => {
    const inv = { productId: "p1", quantity: 10, reserved: 3 };
    const tx = {
      inventoryItem: {
        findUnique: jest.fn().mockResolvedValue({ ...inv }),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    const prisma = {
      order: {
        findUnique: jest.fn().mockResolvedValue({
          id: "o1",
          items: [{ productId: "p1", quantity: 3 }],
        }),
      },
      $transaction: jest.fn(async (fn: (t: typeof tx) => Promise<unknown>) =>
        fn(tx),
      ),
    };

    const service = makeService(prisma);
    await service.applyStatusInventory(
      "o1",
      OrderStatus.CANCELLED,
      OrderStatus.PENDING_PAYMENT,
    );

    expect(tx.inventoryItem.update).toHaveBeenCalledWith({
      where: { productId: "p1" },
      data: { reserved: { decrement: 3 } },
    });
  });

  it("admin PAID from reserved-only finalizes sale", async () => {
    const inv = { productId: "p1", quantity: 8, reserved: 1 };
    const tx = {
      inventoryItem: {
        findUnique: jest.fn().mockResolvedValue({ ...inv }),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    const prisma = {
      order: {
        findUnique: jest.fn().mockResolvedValue({
          id: "o1",
          items: [{ productId: "p1", quantity: 1 }],
        }),
      },
      $transaction: jest.fn(async (fn: (t: typeof tx) => Promise<unknown>) =>
        fn(tx),
      ),
    };

    const service = makeService(prisma);
    await service.applyStatusInventory(
      "o1",
      OrderStatus.PAID,
      OrderStatus.AWAITING_PICKUP,
    );

    expect(tx.inventoryItem.update).toHaveBeenCalledWith({
      where: { productId: "p1" },
      data: {
        reserved: { decrement: 1 },
        quantity: { decrement: 1 },
      },
    });
  });
});
