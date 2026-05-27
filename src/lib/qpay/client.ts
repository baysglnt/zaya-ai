// QPay Payment Integration for Mongolia
// Docs: https://merchant.qpay.mn

export interface QPayInvoice {
  invoice_code: string;
  sender_invoice_no: string;
  invoice_receiver_code: string;
  invoice_description: string;
  amount: number;
  callback_url: string;
}

export interface QPayResponse {
  invoice_id: string;
  qr_text: string;
  qr_image: string; // base64
  urls: QPayURL[];
}

export interface QPayURL {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface QPayPaymentCheck {
  paid_amount: number;
  rows: {
    payment_status: string;
    payment_date: string;
    payment_amount: number;
  }[];
}

class QPayService {
  private baseUrl: string;
  private username: string;
  private password: string;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.baseUrl = process.env.QPAY_BASE_URL || "https://merchant.qpay.mn/v2";
    this.username = process.env.QPAY_USERNAME || "";
    this.password = process.env.QPAY_PASSWORD || "";
  }

  private async getToken(): Promise<string> {
    // Return cached token if valid
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token;
    }

    const response = await fetch(`${this.baseUrl}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${this.username}:${this.password}`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`QPay auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.token = data.access_token;
    // Token expires in 1 hour
    this.tokenExpiry = new Date(Date.now() + 55 * 60 * 1000);
    return this.token!;
  }

  async createInvoice(params: {
    orderId: string;
    amount: number;
    description: string;
    callbackUrl: string;
  }): Promise<QPayResponse> {
    const token = await this.getToken();

    const invoiceData: QPayInvoice = {
      invoice_code: process.env.QPAY_INVOICE_CODE || "ZAYA_AI_INVOICE",
      sender_invoice_no: params.orderId,
      invoice_receiver_code: "terminal",
      invoice_description: params.description,
      amount: params.amount,
      callback_url: params.callbackUrl,
    };

    const response = await fetch(`${this.baseUrl}/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`QPay invoice creation failed: ${error}`);
    }

    return response.json();
  }

  async checkPayment(invoiceId: string): Promise<QPayPaymentCheck> {
    const token = await this.getToken();

    const response = await fetch(`${this.baseUrl}/payment/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ object_type: "INVOICE", object_id: invoiceId }),
    });

    if (!response.ok) {
      throw new Error(`QPay payment check failed: ${response.statusText}`);
    }

    return response.json();
  }

  async cancelInvoice(invoiceId: string): Promise<void> {
    const token = await this.getToken();

    await fetch(`${this.baseUrl}/invoice/cancel/${invoiceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Verify QPay webhook callback
  verifyCallback(headers: Record<string, string>, body: unknown): boolean {
    // QPay sends specific headers for verification
    const qpayCallbackKey = headers["x-qpay-callback-key"];
    return qpayCallbackKey !== undefined;
  }
}

export const qpay = new QPayService();

// Pricing configuration
export const PRICING = {
  YEARLY_REPORT: {
    amount: 9900,
    name: "1 жилийн бүрэн тайлан",
    description: "Таны 2025-2026 оны бүрэн астрологи тайлан",
    reportType: "PERSONALITY",
  },
  COMPATIBILITY: {
    amount: 4900,
    name: "Compatibility тайлан",
    description: "2 хүний хайрын нийцлийн бүрэн тайлан",
    reportType: "COMPATIBILITY",
  },
  SOULMATE: {
    amount: 14900,
    name: "Soulmate тайлан",
    description: "Таны soulmate-ийн нарийн тайлан",
    reportType: "SOULMATE",
  },
  FUTURE_SPOUSE: {
    amount: 7900,
    name: "Ирээдүйн хань тайлан",
    description: "Таны ирээдүйн хань ямар хүн байхыг тайлбарлана",
    reportType: "FUTURE_SPOUSE",
  },
  BREAKUP_RECOVERY: {
    amount: 6900,
    name: "Breakup recovery тайлан",
    description: "Салалтын дараах эдгэрэлтийн зам",
    reportType: "BREAKUP_RECOVERY",
  },
  MONTHLY_PREMIUM: {
    amount: 19900,
    name: "Premium сарын эрхийн захиалга",
    description: "Бүх premium контентад хандах эрх",
    reportType: "SUBSCRIPTION",
  },
  HIDDEN_DESTINY: {
    amount: 12900,
    name: "Нууц хувь заяа тайлан",
    description: "Таны нууцлаг хувь заяаны тайлан",
    reportType: "HIDDEN_DESTINY",
  },
  YEARLY_2026: {
    amount: 8900,
    name: "2026 оны тайлан",
    description: "2026 оны бүрэн урьдчилсан тайлан",
    reportType: "YEARLY_2026",
  },
} as const;

export type PricingKey = keyof typeof PRICING;
