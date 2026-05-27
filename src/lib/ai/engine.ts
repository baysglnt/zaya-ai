import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM
  birthCity: string;
  gender: "FEMALE" | "MALE" | "OTHER";
}

export interface AIReportResult {
  sections: ReportSection[];
  zodiacSign: string;
  chineseZodiac: string;
  auraColor: string;
  luckyNumbers: number[];
  luckyColors: string[];
  overallScore: number;
}

export interface ReportSection {
  id: string;
  title: string;
  emoji: string;
  content: string;
  score?: number;
  isPremium: boolean;
  tags?: string[];
}

function getZodiacSign(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Хуц (Aries) ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Буга (Taurus) ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Ихэр (Gemini) ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Мэлхий (Cancer) ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Арслан (Leo) ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Охин (Virgo) ♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Жинлүүр (Libra) ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Хилэнц (Scorpio) ♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Нумч (Sagittarius) ♐";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Матар (Capricorn) ♑";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Дөлийн сав (Aquarius) ♒";
  return "Загас (Pisces) ♓";
}

function getChineseZodiac(year: number): string {
  const animals = ["Хулгана 🐭", "Үхэр 🐮", "Бар 🐯", "Туулай 🐰", "Луу 🐲", "Могой 🐍", "Морь 🐴", "Хонь 🐑", "Сармагчин 🐵", "Тахиа 🐔", "Нохой 🐕", "Гахай 🐷"];
  return animals[(year - 4) % 12];
}

const PERSONALITY_PROMPT = (profile: UserProfile, zodiac: string, chineseZodiac: string) => `
Чи дэлхийн хамгийн нэрт, мэдрэмжтэй, гүн ухааны астрологич байна. Монгол хэлээр маш эмоциональ, сэтгэлд хүрсэн, яруу найргийн өнгөтэй, premium мэдрэмжтэй астрологи тайлан бич.

ХЭРЭГЛЭГЧИЙН МЭДЭЭЛЭЛ:
- Нэр: ${profile.name}
- Төрсөн: ${profile.birthDate} ${profile.birthTime || ""}
- Хот: ${profile.birthCity}
- Хүйс: ${profile.gender === "FEMALE" ? "Эм" : "Эр"}
- Одны орд: ${zodiac}
- Хятад зурхай: ${chineseZodiac}

ЗААВРУУД:
- Монгол хэлээр, маш мэдрэмжтэй, гүн ухааны, cinematic тон хэрэглэ
- Тухайн хүнд шууд хандан "та" хэлбэрээр бич
- Нэрийг нь ашигла (${profile.name})
- Хүчтэй эмоциональ hook-уудтай байх
- Mysterious, mystical мэдрэмж үүсгэх
- Real астрологийн мэдлэг ашигла
- JSON форматаар буцаа

JSON бүтэц (ЗӨВХӨН JSON, ТАЙЛБАР БИШ):
{
  "personality": {
    "title": "Таны нарийн нууц мөн чанар",
    "content": "300+ үгтэй, мэдрэмжтэй тайлбар...",
    "coreTraits": ["шинж 1", "шинж 2", "шинж 3", "шинж 4"],
    "hiddenStrength": "нууц хүч...",
    "weakness": "сулдал...",
    "score": 87
  },
  "love": {
    "title": "Хайрын энерги ба нууц хэв маяг",
    "content": "300+ үгтэй хайрын тайлбар...",
    "loveStyle": "хайрлах хэв маяг...",
    "soulmatePrediction": "ойрхон байна...",
    "redFlags": ["анхаарал 1", "анхаарал 2"],
    "score": 82,
    "isPremiumHint": "Таны soulmate-ийн нарийн тайлбар LOCKED..."
  },
  "career": {
    "title": "Карьер ба эдийн засгийн эрч хүч",
    "content": "250+ үг...",
    "peakPeriod": "хамгийн оргил үе...",
    "score": 75
  },
  "wealth": {
    "title": "Баялаг ба санхүүгийн цикл",
    "content": "250+ үг...",
    "richPeriod": "Та хэзээ баяжих вэ...",
    "wealthScore": 70,
    "isPremium": true
  },
  "aura": {
    "color": "Хүрэн алт / Deep Purple",
    "meaning": "аурын утга...",
    "energy": "энерги тайлбар..."
  },
  "luckyInfo": {
    "numbers": [7, 14, 21],
    "colors": ["Хөх", "Алтан шар", "Нил ягаан"],
    "days": ["Пүрэв", "Бямба"],
    "months": ["3-р сар", "9-р сар", "11-р сар"]
  },
  "warnings": {
    "dangerousMonths": ["2-р сар", "7-р сар"],
    "content": "анхааруулга...",
    "isPremium": true
  },
  "destiny": {
    "title": "Таны нууц хувь заяа",
    "preview": "Маш ховор энерги илэрлээ... [LOCKED]",
    "isPremium": true
  }
}
`;

const COMPATIBILITY_PROMPT = (person1: UserProfile, person2: { name: string; birthDate: string; gender: string }, zodiac1: string, zodiac2: string) => `
Чи дэлхийн хамгийн алдарт love astrologer байна. Монгол хэлээр 2 хүний compatibility-г маш мэдрэмжтэй, emotional, viral болохуйцаар тайлбарла.

ХҮНИЙ МЭДЭЭЛЭЛ 1:
- Нэр: ${person1.name}
- Төрсөн: ${person1.birthDate}
- Орд: ${zodiac1}

ХҮНИЙ МЭДЭЭЛЭЛ 2:
- Нэр: ${person2.name}
- Төрсөн: ${person2.birthDate}
- Орд: ${zodiac2}

ЗААВРУУД:
- Маш эмоциональ, captivating Монгол хэлтэй
- Хос хүний нэрийг ашигла
- Mystical, cinematic тон хэрэглэ
- ЗӨВХӨН JSON буцаа:

{
  "overallCompatibility": 87,
  "soulmate": 76,
  "toxic": 23,
  "marriage": 84,
  "cheatingRisk": 18,
  "emotionalBond": 91,
  "futureRelationship": 79,
  "verdict": "Маш ховор сансрын хосын холбоо илэрлээ...",
  "analysis": "400+ үгтэй гүн тайлбар...",
  "strengths": ["давуу тал 1", "давуу тал 2", "давуу тал 3"],
  "challenges": ["бэрхшээл 1", "бэрхшээл 2"],
  "lovePrediction": "2026 онд энэ хосын хувь заяа...",
  "warningSign": "анхааруулга...",
  "premiumHint": "Нарийн compatibility тайлбар LOCKED байна..."
}
`;

const DAILY_HOROSCOPE_PROMPT = (zodiacSign: string, date: string) => `
Монгол хэлээр ${zodiacSign} ордны өнөөдрийн (${date}) horoscope-г бич. 
Маш товч, viral болохуйц, TikTok style-д тохирсон.
ЗӨВХӨН JSON:
{
  "energy": "Өнөөдрийн энерги: [нэг өгүүлбэр]",
  "love": "Хайр: [нэг өгүүлбэр]",
  "career": "Карьер: [нэг өгүүлбэр]",
  "warning": "Анхаарал: [нэг өгүүлбэр]",
  "luckyNumber": 7,
  "luckyColor": "Нил ягаан",
  "energyScore": 85,
  "emoji": "🌙✨"
}
`;

export async function generatePersonalityReport(profile: UserProfile): Promise<AIReportResult> {
  const zodiac = getZodiacSign(profile.birthDate);
  const year = new Date(profile.birthDate).getFullYear();
  const chineseZodiac = getChineseZodiac(year);

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-opus-4-5",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: PERSONALITY_PROMPT(profile, zodiac, chineseZodiac),
      },
    ],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  const data = JSON.parse(textContent.text);

  const sections: ReportSection[] = [
    {
      id: "personality",
      title: data.personality.title,
      emoji: "🔮",
      content: data.personality.content,
      score: data.personality.score,
      isPremium: false,
      tags: data.personality.coreTraits,
    },
    {
      id: "love",
      title: data.love.title,
      emoji: "💘",
      content: data.love.content,
      score: data.love.score,
      isPremium: false,
    },
    {
      id: "career",
      title: data.career.title,
      emoji: "⚡",
      content: data.career.content,
      score: data.career.score,
      isPremium: false,
    },
    {
      id: "wealth",
      title: data.wealth.title,
      emoji: "💰",
      content: data.wealth.isPremium ? data.wealth.richPeriod + "... [PREMIUM UNLOCK ШААРДЛАГАТАЙ]" : data.wealth.content,
      score: data.wealth.wealthScore,
      isPremium: true,
    },
    {
      id: "warnings",
      title: "Аюулын үе шатууд",
      emoji: "⚠️",
      content: data.warnings.isPremium ? "Таны аюулын үе илэрлээ... [PREMIUM]" : data.warnings.content,
      isPremium: true,
    },
    {
      id: "destiny",
      title: data.destiny.title,
      emoji: "✨",
      content: data.destiny.preview,
      isPremium: true,
    },
  ];

  return {
    sections,
    zodiacSign: zodiac,
    chineseZodiac,
    auraColor: data.aura?.color || "Гүн нил ягаан",
    luckyNumbers: data.luckyInfo?.numbers || [7, 14, 21],
    luckyColors: data.luckyInfo?.colors || ["Хөх", "Алтан"],
    overallScore: Math.round(
      (data.personality.score + data.love.score + data.career.score + data.wealth.wealthScore) / 4
    ),
  };
}

export async function generateCompatibilityReport(
  person1: UserProfile,
  person2: { name: string; birthDate: string; gender: string }
): Promise<Record<string, unknown>> {
  const zodiac1 = getZodiacSign(person1.birthDate);
  const zodiac2 = getZodiacSign(person2.birthDate);

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-opus-4-5",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: COMPATIBILITY_PROMPT(person1, person2, zodiac1, zodiac2),
      },
    ],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  return JSON.parse(textContent.text);
}

export async function generateDailyHoroscope(
  zodiacSign: string,
  date: string
): Promise<Record<string, unknown>> {
  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-opus-4-5",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: DAILY_HOROSCOPE_PROMPT(zodiacSign, date),
      },
    ],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  return JSON.parse(textContent.text);
}

export async function generateViralContent(
  type: "tiktok_hook" | "love_question" | "cheat_detector" | "2026_prediction",
  profile: UserProfile
): Promise<string> {
  const zodiac = getZodiacSign(profile.birthDate);
  
  const prompts = {
    tiktok_hook: `${zodiac} ордны ${profile.name}-д зориулсан вирал TikTok caption бич. Монгол хэлээр. Маш сэтгэл татам, share хиймээр болгох. Эмоциональ hook-тай. 50-80 үг. Emoji ашигла.`,
    love_question: `"Тэр намайг үнэхээр хайрладаг уу?" гэсэн асуултад ${zodiac} ордны ${profile.name}-д зориулсан mystical Монгол хариулт бич. 100 үг орчим. Mysterious, hopeful байх.`,
    cheat_detector: `${zodiac} ордны хүний relationship-д чин үнэнч байдлын астрологийн шинжилгээ. Монгол хэлээр. Viral болохуйц. 100 үг орчим.`,
    "2026_prediction": `2026 онд ${zodiac} ордны ${profile.name}-ийн амьдрал яаж өөрчлөгдөх вэ? Монгол хэлээр. Оргил цэгтэй, hopeful. 150 үг орчим.`,
  };

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-opus-4-5",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: prompts[type],
      },
    ],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") return "";
  return textContent.text;
}

export async function generateNewsArticle(
  topic: string,
  zodiacSigns: string[]
): Promise<{ title: string; content: string; excerpt: string }> {
  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-opus-4-5",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Монгол хэлээр астрологийн мэдээ нийтлэл бич.
Сэдэв: ${topic}
Холбогдох ордууд: ${zodiacSigns.join(", ")}

Маш viral болохуйц, сонирхолтой, хуваалцмаар байх.
ЗӨВХӨН JSON:
{
  "title": "Гарчиг",
  "excerpt": "Товч тайлбар (50 үг)",
  "content": "Нийтлэлийн бие (300+ үг)"
}`,
      },
    ],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") throw new Error("No content");
  return JSON.parse(textContent.text);
}

export { getZodiacSign, getChineseZodiac };
