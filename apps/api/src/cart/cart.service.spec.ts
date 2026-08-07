import { BadRequestException } from "@nestjs/common";
import { CartService } from "./cart.service";

describe("CartService stock checks", () => {
  const prisma = {
    cart: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const service = new CartService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.cart.upsert.mockResolvedValue({ id: "cart1", userId: "u1" });
    prisma.cart.findUnique.mockResolvedValue({
      id: "cart1",
      items: [],
    });
  });

  it("rejects add when quantity exceeds available stock", async () => {
    prisma.product.findUnique.mockResolvedValue({
      id: "p1",
      published: true,
      inventory: { quantity: 5, reserved: 3 },
    });
    prisma.cartItem.findUnique.mockResolvedValue({ quantity: 1 });

    await expect(service.add("u1", "p1", 2)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("allows add within available stock", async () => {
    prisma.product.findUnique.mockResolvedValue({
      id: "p1",
      published: true,
      inventory: { quantity: 5, reserved: 1 },
    });
    prisma.cartItem.findUnique.mockResolvedValue(null);
    prisma.cartItem.upsert.mockResolvedValue({});

    await expect(service.add("u1", "p1", 2)).resolves.toBeDefined();
    expect(prisma.cartItem.upsert).toHaveBeenCalled();
  });

  it("rejects update above available stock", async () => {
    prisma.product.findUnique.mockResolvedValue({
      id: "p1",
      published: true,
      inventory: { quantity: 4, reserved: 2 },
    });

    await expect(service.update("u1", "p1", 3)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
