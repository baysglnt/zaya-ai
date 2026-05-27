import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

const ZODIAC_DATA: Record<string, { mn: string; emoji: string; dates: string; element: string; planet: string }> = {
  aries: { mn: "Хуц (Aries)", emoji: "♈", dates: "Мар 21 — Апр 19", element: "Гал", planet: "Марс" },
  taurus: { mn: "Буга (Taurus)", emoji: "♉", dates: "Апр 20 — Май 20", element: "Газар", planet: "Венус" },
  gemini: { mn: "Ихэр (Gemini)", emoji: "♊", dates: "Май 21 — Июн 20", element: "Агаар", planet: "Меркурий" },
  cancer: { mn: "Мэлхий (Cancer)", emoji: "♋", dates: "Июн 21 — Июл 22", element: "Ус", planet: "Сар" },
  leo: { mn: "Арслан (Leo)", emoji: "♌", dates: "Июл 23 — Авг 22", element: "Гал", planet: "Нар" },
  virgo: { mn: "Охин (Virgo)", emoji: "♍", dates: "Авг 23 — Сен 22", element: "Газар", planet: "Меркурий" },
  libra: { mn: "Жинлүүр (Libra)", emoji: "♎", dates: "Сен 23 — Окт 22", element: "Агаар", planet: "Венус" },
  scorpio: { mn: "Хилэнц (Scorpio)", emoji: "♏", dates: "Окт 23 — Нов 21", element: "Ус", planet: "Плутон" },
  sagittarius: { mn: "Нумч (Sagittarius)", emoji: "♐", dates: "Нов 22 — Дек 21", element: "Гал", planet: "Юпитер" },
  capricorn: { mn: "Матар (Capricorn)", emoji: "♑", dates: "Дек 22 — Ян 19", element: "Газар", planet: "Сатурн" },
  aquarius: { mn: "Дөлийн сав (Aquarius)", emoji: "♒", dates: "Ян 20 — Фев 18", element: "Агаар", planet: "Уран" },
  pisces: { mn: "Загас (Pisces)", emoji: "♓", dates: "Фев 19 — Мар 20", element: "Ус", planet: "Нептун" },
};

type Props = { params: { sign: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sign = ZODIAC_DATA[params.sign];
  if (!sign) return { title: "Олдсонгүй" };
  return {
    title: `${sign.mn} — 2026 тайлан, хайр, ирээдүй | ZAYA AI`,
    description: `${sign.mn} ордны 2026 оны хайр, карьер, санхүүгийн бүрэн тайлан. AI технологи ашиглан бэлтгэгдсэн.`,
    openGraph: {
      title: `${sign.emoji} ${sign.mn} — ZAYA AI`,
      description: `${sign.mn} ордны ирээдүйг илчил`,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(ZODIAC_DATA).map((sign) => ({ sign }));
}

export default async function ZodiacSignPage({ params }: Props) {
  const sign = ZODIAC_DATA[params.sign];
  if (!sign) notFound();

  // Get today's horoscope from DB
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const horoscope = await prisma.dailyContent.findFirst({
    where: { zodiacSign: { contains: params.sign, mode: "insensitive" }, date: today },
  }).catch(() => null);

  // Get articles for this sign
  const articles = await prisma.newsArticle.findMany({
    where: { zodiacSigns: { has: params.sign } },
    orderBy: { viewCount: "desc" },
    take: 5,
  }).catch(() => []);

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">{sign.emoji}</div>
        <h1 className="text-3xl font-display font-bold gradient-text mb-2">{sign.mn}</h1>
        <p className="text-purple-300">{sign.dates}</p>
        <div className="flex justify-center gap-4 mt-3">
          <span className="text-xs px-3 py-1 rounded-full glass" style={{ border: "1px solid rgba(109,63,245,0.3)", color: "#c4b0ff" }}>
            {sign.element}
          </span>
          <span className="text-xs px-3 py-1 rounded-full glass" style={{ border: "1px solid rgba(109,63,245,0.3)", color: "#c4b0ff" }}>
            {sign.planet}
          </span>
        </div>
      </div>

      {/* Today's horoscope */}
      {horoscope && (
        <div className="glass-card p-5 mb-6">
          <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
            🌙 Өнөөдрийн хоросхоп
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed">{horoscope.energy}</p>
          <p className="text-purple-200 text-sm mt-2 leading-relaxed">{horoscope.prediction}</p>
          <div className="flex gap-4 mt-3">
            <span className="text-xs text-purple-400">🎨 {horoscope.luckyColor}</span>
            <span className="text-xs text-purple-400">🔢 {horoscope.luckyNumber}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="glass-card p-5 mb-6 text-center" style={{ border: "1px solid rgba(251,191,36,0.3)" }}>
        <h2 className="text-lg font-bold text-white mb-2">
          {sign.mn} ордны бүрэн тайлан
        </h2>
        <p className="text-sm text-purple-300 mb-4">
          Хайр, карьер, 2026 урьдчилсан тайлан авах
        </p>
        <Link
          href="/report"
          className="btn-premium inline-block px-8 py-3 rounded-xl text-white font-semibold"
        >
          ✨ Тайлан авах
        </Link>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <div>
          <h2 className="font-semibold text-white mb-3">📰 Холбогдох нийтлэлүүд</h2>
          <div className="space-y-3">
            {articles.map((article) => (
              <div key={article.id} className="glass-card p-4" style={{ border: "1px solid rgba(109,63,245,0.2)" }}>
                <h3 className="text-sm font-medium text-white mb-1">{article.title}</h3>
                <p className="text-xs text-purple-400 line-clamp-2">{article.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All signs */}
      <div className="mt-8">
        <h2 className="font-semibold text-white mb-3 text-sm">Бусад ордууд</h2>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(ZODIAC_DATA).map(([slug, z]) => (
            <Link
              key={slug}
              href={`/zodiac/${slug}`}
              className={`flex flex-col items-center py-2 rounded-xl text-center glass transition-all ${slug === params.sign ? "bg-purple-600/30" : ""}`}
              style={{ border: "1px solid rgba(109,63,245,0.2)" }}
            >
              <span className="text-lg">{z.emoji}</span>
              <span className="text-xs text-purple-300 mt-0.5">{z.mn.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
