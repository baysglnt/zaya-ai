"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Smartphone, Copy, RefreshCw } from "lucide-react";
import { PRICING, PricingKey } from "@/lib/qpay/client";
import Image from "next/image";

interface PaymentData {
  paymentId: string;
  invoiceId: string;
  qrCode: string;
  qrText: string;
  amount: number;
  bankUrls: { name: string; description: string; logo: string; link: string }[];
  productName: string;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = (searchParams.get("type") || "YEARLY_REPORT") as PricingKey;

  const [step, setStep] = useState<"confirm" | "qr" | "checking" | "success">("confirm");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");

  const pricing = PRICING[type];

  async function createPayment() {
    setStep("qr");
    setError("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricingKey: type, couponCode }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }

      const data = await res.json();
      setPaymentData(data);
      startPolling(data.paymentId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
      setStep("confirm");
    }
  }

  function startPolling(paymentId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/callback?paymentId=${paymentId}`);
        const data = await res.json();
        if (data.status === "PAID") {
          clearInterval(interval);
          setStep("success");
          setTimeout(() => router.push("/dashboard"), 3000);
        }
      } catch {}
    }, 3000);

    // Stop polling after 10 minutes
    setTimeout(() => clearInterval(interval), 10 * 60 * 1000);
  }

  if (!pricing) {
    return <div className="text-center p-8 text-purple-300">Буруу бүтээгдэхүүн</div>;
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {step === "confirm" && (
          <ConfirmStep
            pricing={pricing}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            onConfirm={createPayment}
            error={error}
          />
        )}

        {step === "qr" && paymentData && (
          <QRStep paymentData={paymentData} />
        )}

        {step === "checking" && (
          <div className="text-center py-20">
            <RefreshCw size={40} className="text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-purple-200">Төлбөрийг шалгаж байна...</p>
          </div>
        )}

        {step === "success" && (
          <SuccessStep productName={pricing.name} />
        )}
      </motion.div>
    </div>
  );
}

function ConfirmStep({
  pricing,
  couponCode,
  setCouponCode,
  onConfirm,
  error,
}: {
  pricing: (typeof PRICING)[PricingKey];
  couponCode: string;
  setCouponCode: (v: string) => void;
  onConfirm: () => void;
  error: string;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold gradient-text mb-1">Захиалга баталгаажуулах</h1>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">✨</div>
          <div>
            <h2 className="font-semibold text-white">{pricing.name}</h2>
            <p className="text-sm text-purple-300">{pricing.description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-t border-purple-800/30">
          <span className="text-purple-300">Үнэ</span>
          <span className="text-2xl font-bold gradient-gold">
            {pricing.amount.toLocaleString()}₮
          </span>
        </div>
      </div>

      {/* Coupon input */}
      <div className="glass-card p-4">
        <label className="block text-sm text-purple-300 mb-2">Купон код (заавал биш)</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ZAYA2026"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 px-3 py-2 rounded-lg glass text-white placeholder-purple-400/40 text-sm outline-none"
            style={{ border: "1px solid rgba(109,63,245,0.3)" }}
          />
          <button
            className="px-4 py-2 rounded-lg text-sm text-purple-300 glass"
            style={{ border: "1px solid rgba(109,63,245,0.3)" }}
          >
            Ашиглах
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <button
        onClick={onConfirm}
        className="btn-premium w-full py-4 rounded-xl text-white font-semibold text-lg"
      >
        💳 QPay-аар төлөх
      </button>

      <p className="text-center text-xs text-purple-400">
        🔒 QPay-ийн найдвартай шифрлэлттэй. Монголын хамгийн найдвартай систем.
      </p>
    </motion.div>
  );
}

function QRStep({ paymentData }: { paymentData: PaymentData }) {
  const [copied, setCopied] = useState(false);

  function copyQR() {
    navigator.clipboard.writeText(paymentData.qrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">QPay QR код</h2>
        <p className="text-sm text-purple-300">
          {paymentData.amount.toLocaleString()}₮ төлнө үү
        </p>
      </div>

      {/* QR Code */}
      <div className="glass-card p-6 flex flex-col items-center">
        <div className="bg-white p-4 rounded-2xl mb-4">
          <img
            src={`data:image/png;base64,${paymentData.qrCode}`}
            alt="QPay QR"
            className="w-48 h-48"
          />
        </div>

        <button
          onClick={copyQR}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm glass"
          style={{ border: "1px solid rgba(109,63,245,0.3)", color: "#c4b0ff" }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Хуулагдлаа!" : "QR текст хуулах"}
        </button>
      </div>

      {/* Bank app buttons */}
      <div className="glass-card p-4">
        <p className="text-sm text-purple-300 mb-3 text-center">
          <Smartphone size={14} className="inline mr-1" />
          Банкны аппаар нээх
        </p>
        <div className="grid grid-cols-2 gap-2">
          {paymentData.bankUrls?.slice(0, 4).map((bank) => (
            <a
              key={bank.name}
              href={bank.link}
              className="glass flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ border: "1px solid rgba(109,63,245,0.2)", color: "#e2d9f3" }}
            >
              {bank.logo && (
                <img src={bank.logo} alt={bank.name} className="w-5 h-5 rounded" />
              )}
              {bank.description || bank.name}
            </a>
          ))}
        </div>
      </div>

      {/* Polling indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-purple-300">
          <RefreshCw size={14} className="animate-spin" />
          Төлбөрийг автоматаар шалгаж байна...
        </div>
      </div>
    </motion.div>
  );
}

function SuccessStep({ productName }: { productName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
      >
        <Check size={40} className="text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-white mb-2">Амжилттай!</h2>
      <p className="text-purple-200 mb-2">{productName} нээгдлээ</p>
      <p className="text-sm text-purple-400">Dashboard руу шилжиж байна...</p>
    </motion.div>
  );
}
