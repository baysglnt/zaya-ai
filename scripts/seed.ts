import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌟 Seeding ZAYA AI database...");

  // Seed cosmic events
  const events = [
    {
      name: "Mercury Retrograde",
      description: "Меркурий планет ухарч байна. Харилцаа, технологи, аялал зэрэгт болгоомжтой байх хэрэгтэй.",
      eventType: "mercury_retrograde",
      startDate: new Date("2026-01-13"),
      endDate: new Date("2026-02-03"),
      impact: {
        Aries: "Ярилцлагад болгоомжтой",
        Gemini: "Маш хүчтэй нөлөө — double-check бүгдийг",
        Virgo: "Хамгийн хүчтэй нөлөө — планы хойшлуул",
        Scorpio: "Нууц мэдээлэл илрэх магадлалтай",
      },
      isActive: false,
    },
    {
      name: "Дүүрэн Сар — Cancer",
      description: "Cancer ордонд дүүрэн сар гарч байна. Хайр, гэр бүл, мэдрэмжийн энерги дээд цэгтээ.",
      eventType: "full_moon",
      startDate: new Date("2026-01-13"),
      impact: {
        Cancer: "Мэдрэмж маш хурц болно",
        Capricorn: "Хувийн амьдрал vs карьер — тэнцвэр шаардана",
        Pisces: "Сэтгэлийн гүн нээгдэнэ",
      },
      isActive: true,
    },
  ];

  for (const event of events) {
    await prisma.cosmicEvent.create({ data: event });
  }

  // Seed sample articles
  const articles = [
    {
      title: "2026 онд баяжих хамгийн өндөр магадлалтай 3 орд",
      excerpt: "Астрологийн дагуу 2026 онд Capricorn, Taurus, Virgo ордныхон санхүүгийн томоохон өөрчлөлт туулна.",
      content: "2026 он нь Jupiter планетийн нөлөөгөөр санхүүгийн томоохон боломжуудыг авчирна. Capricorn ордныхон карьерийн оргил цэгтээ хүрэх бол Taurus ордныхон урт хугацааны хөрөнгө оруулалт үр дүнтэй болно...",
      category: "viral",
      zodiacSigns: ["Capricorn", "Taurus", "Virgo"],
      isViral: true,
    },
    {
      title: "Хамгийн toxic хосын нийлэмжүүд — Астрологи хариулт",
      excerpt: "Зарим ордуудын нийлэмж маш хүнд бэрхшээлтэй байдаг. Та ямар хосонд байна?",
      content: "Aries + Cancer: Гал ба Ус — маш хүчтэй тартах ба мөн хамгийн их мэдрэмжийн гэмтэл авдаг хос. Scorpio + Aquarius: Хяналт vs эрх чөлөө — үндсэн ялгаа нь хямралд хүргэдэг...",
      category: "love",
      zodiacSigns: ["Aries", "Cancer", "Scorpio", "Aquarius"],
      isViral: true,
    },
    {
      title: "Скорпио ордныхон яагаад хамгийн нарийн хүмүүс байдаг вэ?",
      excerpt: "Scorpio ордны хүмүүсийн психологийг астрологийн дагуу тайлбарлана.",
      content: "Scorpio ордны хүмүүс гадна хүйтэн, тайван харагддаг ч дотроо дэлхийн хамгийн гүн мэдрэмжтэй. Плутоны нөлөөгөөр тэд хувиралт, нөхөн сэргэлт, хувийн хүч зэрэг сэдвүүдэд маш гүн татагддаг...",
      category: "viral",
      zodiacSigns: ["Scorpio"],
      isViral: false,
    },
  ];

  for (const article of articles) {
    await prisma.newsArticle.create({ data: article });
  }

  // Seed coupon codes
  await prisma.couponCode.createMany({
    data: [
      { code: "ZAYA2026", discount: 20, maxUses: 500, expiresAt: new Date("2026-12-31") },
      { code: "LUNAR30", discount: 30, maxUses: 100, expiresAt: new Date("2026-06-30") },
      { code: "LOVE50", discount: 50, maxUses: 50, expiresAt: new Date("2026-02-14") },
    ],
  });

  console.log("✅ Seed completed!");
  console.log("🎟️ Coupon codes: ZAYA2026 (20%), LUNAR30 (30%), LOVE50 (50%)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
