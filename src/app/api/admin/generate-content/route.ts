import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateNewsArticle, generateDailyHoroscope } from "@/lib/ai/engine";
import { headers } from "next/headers";

const ZODIAC_SIGNS = [
  "Хуц (Aries)", "Буга (Taurus)", "Ихэр (Gemini)", "Мэлхий (Cancer)",
  "Арслан (Leo)", "Охин (Virgo)", "Жинлүүр (Libra)", "Хилэнц (Scorpio)",
  "Нумч (Sagittarius)", "Матар (Capricorn)", "Дөлийн сав (Aquarius)", "Загас (Pisces)",
];

const VIRAL_TOPICS = [
  { topic: "2026 онд баяжих магадлалтай шилдэг 3 орд", signs: ["Capricorn", "Taurus", "Virgo"], category: "viral" },
  { topic: "Хамгийн toxic хосуудын астрологийн жагсаалт", signs: ["Aries", "Cancer", "Scorpio"], category: "love" },
  { topic: "Mercury retrograde-ийн нөлөө 2026", signs: ["Gemini", "Virgo"], category: "cosmic_events" },
  { topic: "Хамгийн үнэнч zodiac signs-ийн жагсаалт", signs: ["Taurus", "Cancer", "Capricorn"], category: "love" },
  { topic: "Relationship-д хамгийн аюулт орд ба яагаад", signs: ["Scorpio", "Aries", "Gemini"], category: "love" },
  { topic: "2026 оны хамгийн азтай ба аз муутай сарууд", signs: ZODIAC_SIGNS.slice(0, 4), category: "viral" },
  { topic: "Юу болох ч мэдэхгүй байдаг: Pisces ба Scorpio-гийн нууц", signs: ["Pisces", "Scorpio"], category: "viral" },
];

function verifyAdmin(request: NextRequest): boolean {
  const headersList = headers();
  const secret = headersList.get("x-admin-secret") || request.cookies.get("admin_secret")?.value;
  return secret === process.env.ADMIN_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { articles: 0, horoscopes: 0, errors: 0 };

  try {
    // Generate 3 random articles
    const shuffled = [...VIRAL_TOPICS].sort(() => Math.random() - 0.5).slice(0, 3);

    for (const topic of shuffled) {
      try {
        const article = await generateNewsArticle(topic.topic, topic.signs);
        await prisma.newsArticle.create({
          data: {
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            category: topic.category,
            zodiacSigns: topic.signs,
            isViral: Math.random() > 0.7,
          },
        });
        results.articles++;
      } catch {
        results.errors++;
      }
    }

    // Generate daily horoscopes for all 12 signs
    const today = new Date().toISOString().split("T")[0];
    for (const sign of ZODIAC_SIGNS) {
      try {
        const existing = await prisma.dailyContent.findUnique({
          where: { date_zodiacSign: { date: new Date(today), zodiacSign: sign } },
        });
        if (existing) continue;

        const horoscope = await generateDailyHoroscope(sign, today) as any;
        await prisma.dailyContent.create({
          data: {
            date: new Date(today),
            zodiacSign: sign,
            energy: horoscope.energy || "",
            prediction: horoscope.love + " " + horoscope.career,
            luckyColor: horoscope.luckyColor || "Хөх",
            luckyNumber: horoscope.luckyNumber || 7,
            warnings: horoscope.warning,
            loveAdvice: horoscope.love,
          },
        });
        results.horoscopes++;
      } catch {
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${results.articles} нийтлэл, ${results.horoscopes} хоросхоп үүсгэлээ`,
      results,
    });
  } catch (error) {
    return NextResponse.json({ error: "Content generation failed" }, { status: 500 });
  }
}
