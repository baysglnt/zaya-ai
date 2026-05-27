import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

function verifyAdmin(request: NextRequest): boolean {
  const headersList = headers();
  const adminSecret = headersList.get("x-admin-secret");
  const cookieSecret = request.cookies.get("admin_secret")?.value;
  return adminSecret === process.env.ADMIN_SECRET || cookieSecret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      todayUsers,
      paidPayments,
      todayPayments,
      totalReports,
      activeSubscriptions,
      recentPayments,
      zodiacCounts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: { status: "PAID", paidAt: { gte: today } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.report.count(),
      prisma.subscription.count({ where: { status: "ACTIVE", endDate: { gte: new Date() } } }),
      prisma.payment.findMany({
        where: { status: "PAID" },
        orderBy: { paidAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      }),
      prisma.user.groupBy({
        by: ["zodiacSign"],
        _count: { zodiacSign: true },
        where: { zodiacSign: { not: null } },
        orderBy: { _count: { zodiacSign: "desc" } },
        take: 12,
      }),
    ]);

    const totalRevenue = paidPayments._sum.amount || 0;
    const totalPaid = paidPayments._count;
    const conversionRate = totalUsers > 0 ? Math.round((totalPaid / totalUsers) * 100) : 0;

    const zodiacStats = zodiacCounts.map((z) => ({
      sign: z.zodiacSign || "Тодорхойгүй",
      count: z._count.zodiacSign,
    }));

    const topZodiac = zodiacStats[0]?.sign || "—";

    const formattedPayments = recentPayments.map((p) => ({
      id: p.id,
      amount: p.amount,
      description: p.description,
      paidAt: p.paidAt?.toISOString() || "",
      userName: p.user.name || "Зочин",
    }));

    return NextResponse.json({
      totalUsers,
      todayUsers,
      totalRevenue,
      todayPayments: todayPayments._sum.amount || 0,
      totalReports,
      activeSubscriptions,
      conversionRate,
      topZodiac,
      recentPayments: formattedPayments,
      zodiacStats,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
