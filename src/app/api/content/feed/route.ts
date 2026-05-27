import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateNewsArticle } from "@/lib/ai/engine";

const ZODIAC_SIGNS = [
  "Хуц (Aries)", "Буга (Taurus)", "Ихэр (Gemini)", "Мэлхий (Cancer)",
  "Арслан (Leo)", "Охин (Virgo)", "Жинлүүр (Libra)", "Хилэнц (Scorpio)",
  "Нумч (Sagittarius)", "Матар (Capricorn)", "Дөлийн сав (Aquarius)", "Загас (Pisces)",
];

const FEED_TOPICS = [
  { topic: "Хамгийн dangerous zodiac sign-ууд 2026 онд", signs: ["Scorpio", "Aries", "Leo"] },
  { topic: "Хайрын амьдралд хамгийн азтай ордууд", signs: ["Libra", "Taurus", "Cancer"] },
  { topic: "Энэ долоо хоногт баяжих магадлалтай ордууд", signs: ["Capricorn", "Virgo", "Aquarius"] },
  { topic: "Хамгийн toxic хосын нийлэмж", signs: ["Aries", "Cancer", "Scorpio"] },
  { topic: "2026 оны хамгийн их өөрчлөлт туулах ордууд", signs: ["Gemini", "Sagittarius", "Pisces"] },
];

// Seed feed items (pre-generated, fast)
function generateSeedItems(page: number) {
  const items = [
    {
      id: `feed_${page}_1`,
      type: "zodiac_fact",
      zodiacSign: ZODIAC_SIGNS[page % 12],
      title: `${ZODIAC_SIGNS[page % 12]} ордныхны нууц`,
      content: `${ZODIAC_SIGNS[page % 12]} ордны хүмүүс хамгийн нарийн дотоод ертөнцтэй. Тэд гадна тайван харагдсан ч дотроо маш хурц мэдрэмжтэй байдаг.`,
      emoji: "⭐",
      color: "from-purple-900/30 to-blue-900/20",
      likes: Math.floor(Math.random() * 10000) + 1000,
    },
    {
      id: `feed_${page}_2`,
      type: "love_tip",
      title: "Хайрт хүнийхээ хайрыг мэдэх арга",
      content: "Астрологийн дагуу Водолей ордны хүмүүс хайрласандаа зай авдаг — энэ нь тэднийг хайрлахгүй гэсэн үг биш, харин итгэлцэл шаарддаг гэсэн үг.",
      emoji: "💕",
      color: "from-pink-900/30 to-purple-900/20",
      likes: Math.floor(Math.random() * 8000) + 2000,
    },
    {
      id: `feed_${page}_3`,
      type: "cosmic_alert",
      title: "🌟 Сансрын онцгой эрч хүч",
      content: "Одоо Jupiter болон Venus нийлж байгаа тул хайр, аз жаргал, санхүүгийн эрч хүч нэмэгдэж байна. Энэ долоо хоногийг ашигтай зарц.",
      emoji: "🌟",
      color: "from-yellow-900/30 to-orange-900/20",
      likes: Math.floor(Math.random() * 6000) + 3000,
    },
  ];
  return items;
}

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "0");

  try {
    // Try to get from DB first
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dbContent = await prisma.newsArticle.findMany({
      where: { publishedAt: { gte: today } },
      orderBy: { viewCount: "desc" },
      take: 5,
      skip: page * 5,
    });

    if (dbContent.length > 0) {
      const items = dbContent.map((article) => ({
        id: article.id,
        type: article.category,
        title: article.title,
        content: article.excerpt,
        emoji: article.category === "love" ? "💘" : article.category === "cosmic_events" ? "🌙" : "✨",
        color: "from-purple-900/30 to-blue-900/20",
        likes: article.viewCount,
        zodiacSign: article.zodiacSigns[0],
      }));
      return NextResponse.json({ items });
    }

    // Fall back to seed data
    const items = generateSeedItems(page);
    return NextResponse.json({ items });
  } catch {
    const items = generateSeedItems(page);
    return NextResponse.json({ items });
  }
}
