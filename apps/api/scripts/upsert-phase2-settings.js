const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  await p.siteSetting.upsert({
    where: { key: "brand" },
    create: {
      key: "brand",
      value: {
        logoUrl: "",
        heroImageUrl:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=80",
      },
    },
    update: {},
  });
  await p.siteSetting.upsert({
    where: { key: "appointmentSlots" },
    create: {
      key: "appointmentSlots",
      value: {
        slots: ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"],
      },
    },
    update: {},
  });
  const show = await p.siteSetting.findUnique({ where: { key: "showroom" } });
  if (show) {
    const v = /** @type {Record<string, unknown>} */ (show.value || {});
    await p.siteSetting.update({
      where: { key: "showroom" },
      data: {
        value: {
          brand: "MG Jewelry",
          fullName: "Modern Gold Jewelry",
          city: "Namangan",
          country: "Uzbekistan",
          address: "Namangan, Uzbekistan",
          telegram: "@mgjewelry",
          instagram: "@mgjewelry",
          email: "hello@mgjewelry.uz",
          ...v,
        },
      },
    });
  }
  console.log("settings ok");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
