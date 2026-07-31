import { PrismaClient, Locale, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const locales: Locale[] = ["en", "uz", "ru", "tr"];

function t(
  en: string,
  uz: string,
  ru: string,
  tr: string,
): Record<Locale, string> {
  return { en, uz, ru, tr };
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.productTranslation.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.categoryTranslation.deleteMany();
  await prisma.collectionTranslation.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.coupon.deleteMany();

  const passwordHash = await bcrypt.hash("Admin123!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@mgjewelry.uz",
      name: "MG Super Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
      locale: Locale.en,
      cart: { create: {} },
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Demo Customer",
      passwordHash: await bcrypt.hash("Customer123!", 12),
      role: Role.CUSTOMER,
      locale: Locale.ru,
      phone: "+998901234567",
      cart: { create: {} },
    },
  });

  const categories = [
    {
      slug: "gold",
      names: t("Gold", "Oltin", "Золото", "Altın"),
    },
    {
      slug: "diamond",
      names: t("Diamond", "Olmos", "Бриллианты", "Elmas"),
    },
    {
      slug: "bridal",
      names: t("Bridal", "Kelinlik", "Свадебные", "Gelinlik"),
    },
    {
      slug: "men",
      names: t("Men", "Erkaklar", "Мужские", "Erkek"),
    },
  ];

  for (const [i, c] of categories.entries()) {
    await prisma.category.create({
      data: {
        slug: c.slug,
        sortOrder: i,
        translations: {
          create: locales.map((locale) => ({
            locale,
            name: c.names[locale],
          })),
        },
      },
    });
  }

  const collections = [
    {
      slug: "namangan-heritage",
      featured: true,
      names: t(
        "Namangan Heritage",
        "Namangan Merosi",
        "Наследие Намангана",
        "Namangan Mirası",
      ),
      desc: t(
        "Crafted in Namangan with timeless Central Asian elegance.",
        "Namanganda yaratilgan abadiy Markaziy Osiyo nafosati.",
        "Создано в Намангане с вневременной центральноазиатской элегантностью.",
        "Namangan'da zamansız Orta Asya zarafetiyle üretildi.",
      ),
    },
    {
      slug: "modern-gold",
      featured: true,
      names: t("Modern Gold", "Zamonaviy Oltin", "Современное золото", "Modern Altın"),
      desc: t(
        "Sculptural gold for the global wardrobe.",
        "Global garderob uchun haykaltarosh oltin.",
        "Скульптурное золото для мирового гардероба.",
        "Küresel gardırop için heykelsi altın.",
      ),
    },
    {
      slug: "bridal-atelier",
      featured: false,
      names: t("Bridal Atelier", "Kelinlik Atelier", "Свадебный ателье", "Gelinlik Atölyesi"),
      desc: t(
        "Ceremony pieces made to be remembered.",
        "Esdan chiqmaydigan marosim bezaklari.",
        "Свадебные изделия, которые запоминаются.",
        "Hatırlanacak tören parçaları.",
      ),
    },
  ];

  for (const [i, c] of collections.entries()) {
    await prisma.collection.create({
      data: {
        slug: c.slug,
        featured: c.featured,
        sortOrder: i,
        imageUrl: `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80`,
        translations: {
          create: locales.map((locale) => ({
            locale,
            name: c.names[locale],
            description: c.desc[locale],
          })),
        },
      },
    });
  }

  const gold = await prisma.category.findUniqueOrThrow({ where: { slug: "gold" } });
  const diamond = await prisma.category.findUniqueOrThrow({ where: { slug: "diamond" } });
  const bridal = await prisma.category.findUniqueOrThrow({ where: { slug: "bridal" } });
  const heritage = await prisma.collection.findUniqueOrThrow({
    where: { slug: "namangan-heritage" },
  });
  const modern = await prisma.collection.findUniqueOrThrow({
    where: { slug: "modern-gold" },
  });
  const bridalCol = await prisma.collection.findUniqueOrThrow({
    where: { slug: "bridal-atelier" },
  });

  const products = [
    {
      slug: "aurora-gold-necklace",
      sku: "MG-NK-001",
      metal: "Gold",
      purity: "585",
      weightGrams: 12.4,
      makingChargePct: 18,
      priceUsdCents: 185000,
      priceUzs: 23500000,
      categoryId: gold.id,
      collectionId: modern.id,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      names: t(
        "Aurora Gold Necklace",
        "Aurora Oltin Marjon",
        "Золотое колье Aurora",
        "Aurora Altın Kolye",
      ),
      descriptions: t(
        "A luminous 14k gold necklace with a soft sculptural curve — made for evening light.",
        "Kechki yorug‘lik uchun yumshoq haykaltarosh egri chiziqli 14k oltin marjon.",
        "Сияющее золотое колье 585 пробы с мягкой скульптурной линией.",
        "Akşam ışığı için yumuşak heykelsi kavisli 14 ayar altın kolye.",
      ),
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80",
    },
    {
      slug: "silk-road-diamond-ring",
      sku: "MG-RG-014",
      metal: "Gold",
      purity: "750",
      weightGrams: 4.8,
      makingChargePct: 22,
      priceUsdCents: 320000,
      priceUzs: 40600000,
      categoryId: diamond.id,
      collectionId: heritage.id,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      names: t(
        "Silk Road Diamond Ring",
        "Ipak Yo‘li Olmos Uzuk",
        "Кольцо Silk Road с бриллиантом",
        "İpek Yolu Elmas Yüzük",
      ),
      descriptions: t(
        "A brilliant-cut diamond set in warm gold — bridging Namangan craft and global luxury.",
        "Issiq oltinda yaltiroq olmos — Namangan hunarmandchiligi va global hashamat bog‘lanishi.",
        "Бриллиант в тёплом золоте — мост между наманганским мастерством и мировой роскошью.",
        "Sıcak altın üzerinde brilyan kesim elmas — Namangan zanaatı ve küresel lüks.",
      ),
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=80",
    },
    {
      slug: "namangan-bridal-set",
      sku: "MG-BR-220",
      metal: "Gold",
      purity: "585",
      weightGrams: 48.2,
      makingChargePct: 20,
      priceUsdCents: 540000,
      priceUzs: 68500000,
      categoryId: bridal.id,
      collectionId: bridalCol.id,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      names: t(
        "Namangan Bridal Set",
        "Namangan Kelinlik To‘plami",
        "Свадебный комплект Наманган",
        "Namangan Gelinlik Seti",
      ),
      descriptions: t(
        "Necklace, earrings, and bracelet composed for the modern bride.",
        "Zamonaviy kelin uchun marjon, sirg‘a va bilaguzuk majmuasi.",
        "Колье, серьги и браслет для современной невесты.",
        "Modern gelin için kolye, küpe ve bilezik takımı.",
      ),
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=80",
    },
    {
      slug: "obsidian-cuff",
      sku: "MG-CF-077",
      metal: "Gold",
      purity: "585",
      weightGrams: 22.1,
      makingChargePct: 16,
      priceUsdCents: 210000,
      priceUzs: 26600000,
      categoryId: gold.id,
      collectionId: modern.id,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      names: t(
        "Obsidian Cuff",
        "Obsidian Bilakuzuk",
        "Браслет Obsidian",
        "Obsidian Kelepçe",
      ),
      descriptions: t(
        "Bold architectural cuff in polished gold with a satin inner finish.",
        "Jilo qilingan oltinda jasoratli me’moriy bilakuzuk.",
        "Смелый архитектурный браслет из полированного золота.",
        "Cilalı altından cesur mimari kelepçe.",
      ),
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=80",
    },
    {
      slug: "fergana-pearl-earrings",
      sku: "MG-ER-033",
      metal: "Gold",
      purity: "585",
      weightGrams: 6.3,
      makingChargePct: 19,
      priceUsdCents: 98000,
      priceUzs: 12400000,
      categoryId: gold.id,
      collectionId: heritage.id,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      names: t(
        "Fergana Pearl Earrings",
        "Farg‘ona Marvarid Sirg‘alari",
        "Серьги Fergana с жемчугом",
        "Fergana İnci Küpeler",
      ),
      descriptions: t(
        "Drop earrings balancing cultured pearls with fine gold detailing.",
        "Madaniy marvarid va nozik oltin tafsilotlar bilan muvozanatlangan sirg‘alar.",
        "Серьги-капли с культивированным жемчугом и тонкой золотой отделкой.",
        "Kültür incisi ve ince altın detaylarla dengelenmiş küpeler.",
      ),
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1400&q=80",
    },
    {
      slug: "royal-solitaire",
      sku: "MG-RG-090",
      metal: "Platinum",
      purity: "950",
      weightGrams: 5.1,
      makingChargePct: 25,
      priceUsdCents: 610000,
      priceUzs: 77400000,
      categoryId: diamond.id,
      collectionId: bridalCol.id,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      names: t(
        "Royal Solitaire",
        "Qirollik Solitaire",
        "Кольцо Royal Solitaire",
        "Royal Solitaire",
      ),
      descriptions: t(
        "A platinum solitaire with quiet brilliance — proposal-ready.",
        "Sokin yorqinlikdagi platin solitaire — taklif uchun tayyor.",
        "Платиновый солитер со спокойным сиянием.",
        "Sakin ışıltılı platin solitaire — nişan için hazır.",
      ),
      image:
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1400&q=80",
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        sku: p.sku,
        metal: p.metal,
        purity: p.purity,
        weightGrams: p.weightGrams,
        makingChargePct: p.makingChargePct,
        priceUsdCents: p.priceUsdCents,
        priceUzs: p.priceUzs,
        categoryId: p.categoryId,
        collectionId: p.collectionId,
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival,
        shipsInternational: true,
        translations: {
          create: locales.map((locale) => ({
            locale,
            name: p.names[locale],
            description: p.descriptions[locale],
            materialNote: `${p.metal} ${p.purity}`,
          })),
        },
        media: {
          create: [
            {
              url: p.image,
              type: "image",
              alt: p.names.en,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        inventory: { create: { quantity: 8, reserved: 0, lowStockAt: 2 } },
      },
    });
  }

  await prisma.siteSetting.createMany({
    data: [
      {
        key: "showroom",
        value: {
          brand: "MG Jewelry",
          fullName: "Modern Gold Jewelry",
          city: "Namangan",
          country: "Uzbekistan",
          address: "Namangan, Uzbekistan",
          telegram: "@mgjewelry",
        },
      },
      {
        key: "currencies",
        value: { base: ["USD", "UZS"], display: ["USD", "UZS"] },
      },
    ],
  });

  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      percentOff: 10,
      active: true,
    },
  });

  await prisma.review.create({
    data: {
      productId: (await prisma.product.findFirstOrThrow()).id,
      userId: customer.id,
      rating: 5,
      title: "Exceptional craft",
      body: "The finish and weight feel truly luxury. Collected from Namangan showroom.",
    },
  });

  console.log("Seed complete");
  console.log("Admin:", admin.email, "Admin123!");
  console.log("Customer:", customer.email, "Customer123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
