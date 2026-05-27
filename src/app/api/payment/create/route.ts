import { NextRequest, NextResponse } from "next/server";
import { qpay, PRICING, PricingKey } from "@/lib/qpay/client";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

// POST /api/payment/create - Create QPay invoice
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Нэвтрэх шаардлагатай" }, { status: 401 });
    }

    const body = await request.json();
    const { pricingKey, couponCode } = body as { pricingKey: PricingKey; couponCode?: string };

    const pricing = PRICING[pricingKey];
    if (!pricing) {
      return NextResponse.json({ error: "Буруу бүтээгдэхүүн" }, { status: 400 });
    }

    let finalAmount = pricing.amount;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await prisma.couponCode.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (coupon && coupon.usedCount < coupon.maxUses) {
        finalAmount = Math.round(finalAmount * (1 - coupon.discount / 100));
      }
    }

    // Create payment record
    const orderId = uuidv4();
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: finalAmount,
        status: "PENDING",
        description: pricing.name,
        reportType: pricing.reportType === "SUBSCRIPTION" ? undefined : pricing.reportType as any,
      },
    });

    // Create QPay invoice
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`;
    const qpayResponse = await qpay.createInvoice({
      orderId: payment.id,
      amount: finalAmount,
      description: `ZAYA AI - ${pricing.name}`,
      callbackUrl,
    });

    // Update payment with QPay invoice ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        qpayInvoiceId: qpayResponse.invoice_id,
        qpayQrCode: qpayResponse.qr_image,
      },
    });

    return NextResponse.json({
      paymentId: payment.id,
      invoiceId: qpayResponse.invoice_id,
      qrCode: qpayResponse.qr_image,
      qrText: qpayResponse.qr_text,
      amount: finalAmount,
      bankUrls: qpayResponse.urls,
      productName: pricing.name,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Төлбөр үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
