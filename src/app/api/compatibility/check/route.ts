import { NextRequest, NextResponse } from "next/server";
import { generateCompatibilityReport, UserProfile } from "@/lib/ai/engine";
import { headers } from "next/headers";

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const ip = (headersList.get("x-forwarded-for") || "unknown").split(",")[0].trim();

    // Rate limit: 5 checks per hour
    const key = `compat_${ip}`;
    const now = Date.now();
    const current = rateLimitStore.get(key);
    if (current && now < current.resetTime && current.count >= 5) {
      return NextResponse.json({ error: "Хэт олон хүсэлт" }, { status: 429 });
    }
    rateLimitStore.set(key, {
      count: (current?.count || 0) + 1,
      resetTime: current?.resetTime || now + 3600000,
    });

    const body = await request.json();
    const { person1, person2 } = body;

    if (!person1?.name || !person1?.birthDate || !person2?.name || !person2?.birthDate) {
      return NextResponse.json({ error: "Мэдээлэл дутуу байна" }, { status: 400 });
    }

    const profile1: UserProfile = {
      name: person1.name,
      birthDate: person1.birthDate,
      birthCity: "Улаанбаатар",
      gender: person1.gender || "FEMALE",
    };

    const result = await generateCompatibilityReport(profile1, {
      name: person2.name,
      birthDate: person2.birthDate,
      gender: person2.gender || "MALE",
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Compatibility error:", error);
    return NextResponse.json({ error: "Шинжилгээ амжилтгүй" }, { status: 500 });
  }
}
