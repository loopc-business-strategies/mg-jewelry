const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

const SHOWROOM = {
  brand: "MG Jewelry",
  fullName: "Modern Gold Jewelry Manufacturing",
  address: "242, Girvonbulok Street",
  district: "Davlatabad District",
  city: "Namangan City",
  region: "Namangan Region",
  country: "Republic of Uzbekistan",
  telegram: "@mgjewelry",
  instagram: "@mgjewelry",
  email: "hello@mgjewelry.uz",
};

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

  const existing = await p.siteSetting.findUnique({ where: { key: "showroom" } });
  const prev = /** @type {Record<string, unknown>} */ (existing?.value || {});
  await p.siteSetting.upsert({
    where: { key: "showroom" },
    create: { key: "showroom", value: SHOWROOM },
    update: {
      value: {
        ...prev,
        ...SHOWROOM,
        telegram: prev.telegram || SHOWROOM.telegram,
        instagram: prev.instagram || SHOWROOM.instagram,
        email: prev.email || SHOWROOM.email,
      },
    },
  });
  console.log("settings ok");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
