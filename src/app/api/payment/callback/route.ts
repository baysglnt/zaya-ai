import { NextRequest, NextResponse } from "next/server";
import { qpay } from "@/lib/qpay/client";
import { prisma } from "@/lib/db";

// POST /api/payment/callback - QPay webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoice_id, payment_status } = body;

    if (!invoice_id) {
      return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
    }

    // Find payment by QPay invoice ID
    const payment = await prisma.payment.findFirst({
      where: { qpayInvoiceId: invoice_id },
      include: { user: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Verify with QPay API
    const paymentCheck = await qpay.checkPayment(invoice_id);
    const isPaid = paymentCheck.rows?.some(
      (r) => r.payment_status === "PAID" || r.payment_status === "APPROVED"
    );

    if (isPaid || payment_status === "PAID") {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      // Unlock report/subscription based on report type
      if (payment.reportType) {
        await prisma.report.create({
          data: {
            userId: payment.userId,
            type: payment.reportType,
            content: { unlocked: true, paymentId: payment.id },
            isPremium: true,
            paymentId: payment.id,
          },
        });
      } else {
        // Subscription
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        await prisma.subscription.upsert({
          where: { userId: payment.userId },
          create: {
            userId: payment.userId,
            status: "ACTIVE",
            planName: "premium_monthly",
            price: payment.amount,
            startDate: new Date(),
            endDate,
            paymentId: payment.id,
          },
          update: {
            status: "ACTIVE",
            endDate,
            paymentId: payment.id,
          },
        });
      }

      // Award referral if applicable
      const user = await prisma.user.findUnique({
        where: { id: payment.userId },
        include: { referrer: true },
      });

      if (user?.referredBy && user.referrer) {
        await prisma.user.update({
          where: { id: user.referredBy },
          data: { luckyPoints: { increment: 500 } },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}

// GET /api/payment/callback?paymentId=xxx - Check payment status
export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { status: true, paidAt: true, amount: true },
  });

  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}
