import { NextRequest, NextResponse } from "next/server";
import { generatePersonalityReport, UserProfile } from "@/lib/ai/engine";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string): string {
  return `report_gen_${ip}`;
}

function checkRateLimit(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3; // 3 free reports per hour per IP

  const current = rateLimitStore.get(key);
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) return false;
  current.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || 
                headersList.get("x-real-ip") || 
                "unknown";
    const cleanIp = ip.split(",")[0].trim();

    // Check rate limit
    if (!checkRateLimit(cleanIp)) {
      return NextResponse.json(
        { error: "Хэт олон хүсэлт. 1 цагийн дараа дахин оролдоно уу." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { profile } = body as { profile: UserProfile };

    // Validate required fields
    if (!profile?.name || !profile?.birthDate || !profile?.birthCity) {
      return NextResponse.json(
        { error: "Шаардлагатай талбаруудыг бөглөнө үү" },
        { status: 400 }
      );
    }

    // Validate date
    const birthDate = new Date(profile.birthDate);
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      return NextResponse.json(
        { error: "Буруу огноо оруулсан байна" },
        { status: 400 }
      );
    }

    // Generate AI report
    const report = await generatePersonalityReport(profile);

    // Save to DB if user is logged in
    const session = await auth();
    if (session?.user?.id) {
      await prisma.report.create({
        data: {
          userId: session.user.id,
          type: "PERSONALITY",
          content: report as unknown as Record<string, unknown>,
          isPremium: false,
        },
      });
    }

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Тайлан үүсгэхэд алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
