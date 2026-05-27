"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Star, Lock, Sparkles } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Үнэгүй",
    price: 0,
    emoji: "🌙",
    color: "rgba(109,63,245,0.15)",
    border: "rgba(109,63,245,0.3)",
    features: [
      "Үндсэн зурхай тайлан",
      "Өдрийн энерги",
      "Compatibility preview",
      "Daily spin (1 удаа)",
      "Нийгэмлэгт нэвтрэх",
    ],
    locked: ["Бүрэн personality тайлан", "Soulmate тайлан", "2026 урьдчилсан тайлан"],
    cta: "Үнэгүй эхлэх",
    action: "/report",
    popular: false,
  },
  {
    id: "monthly",
    name: "Premium",
    price: 19900,
    emoji: "⭐",
    color: "rgba(109,63,245,0.25)",
    border: "rgba(163,133,255,0.5)",
    features: [
      "Бүх тайлан хязгааргүй",
      "1 жилийн бүрэн тайлан",
      "Compatibility тайлан",
      "Soulmate шинжилгээ",
      "2026 урьдчилсан тайлан",
      "Нууц хувь заяа тайлан",
      "Daily premium horoscope",
      "Ad-free туршлага",
      "Тэргүүлэх дэмжлэг",
    ],
    locked: [],
    cta: "Premium эхлүүлэх",
    action: "/payment?type=MONTHLY_PREMIUM",
    popular: true,
  },
];

const ONE_TIME = [
  { name: "1 жилийн тайлан", price: 9900, emoji: "📜", key: "YEARLY_REPORT" },
  { name: "Compatibility", price: 4900, emoji: "💘", key: "COMPATIBILITY" },
  { name: "Soulmate тайлан", price: 14900, emoji: "👥", key: "SOULMATE" },
  { name: "Ирээдүйн хань", price: 7900, emoji: "💍", key: "FUTURE_SPOUSE" },
  { name: "Breakup recovery", price: 6900, emoji: "💔", key: "BREAKUP_RECOVERY" },
  { name: "2026 урьдчилсан", price: 8900, emoji: "🔮", key: "YEARLY_2026" },
];

export function PricingSection() {
  const router = useRouter();

  return (
    <section className="px-4 py-16 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4"
          style={{ border: "1px solid rgba(251,191,36,0.3)" }}>
          <Sparkles size={14} className="text-yellow-400" />
          <span className="text-sm text-yellow-300">QPay-аар хялбархан төл</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Хувь заяагаа нээ
        </h2>
        <p className="text-purple-300">Монгол банкнаас шууд QPay-аар</p>
      </motion.div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative glass-card p-6"
            style={{ background: plan.color, border: `1px solid ${plan.border}` }}
          >
            {plan.popular && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6d3ff5, #db2777)" }}
              >
                ⭐ Хамгийн алдартай
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-3xl mb-1">{plan.emoji}</div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              </div>
              <div className="text-right">
                {plan.price === 0 ? (
                  <div className="text-2xl font-bold text-green-400">Үнэгүй</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold gradient-gold">
                      {plan.price.toLocaleString()}₮
                    </div>
                    <div className="text-xs text-purple-400">/ сар</div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-purple-200">
                  <Check size={14} className="text-green-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
              {plan.locked.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-purple-500">
                  <Lock size={14} className="flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push(plan.action)}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                plan.popular ? "btn-premium" : "glass"
              }`}
              style={!plan.popular ? { border: "1px solid rgba(109,63,245,0.3)" } : {}}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      {/* One-time purchases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 text-center">
          Нэг удаагийн тайлан
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {ONE_TIME.map((item) => (
            <button
              key={item.key}
              onClick={() => router.push(`/payment?type=${item.key}`)}
              className="glass p-4 rounded-xl text-left transition-all"
              style={{ border: "1px solid rgba(109,63,245,0.2)" }}
            >
              <div className="text-2xl mb-2">{item.emoji}</div>
              <div className="text-sm font-medium text-white mb-1">{item.name}</div>
              <div className="text-sm font-bold gradient-gold">{item.price.toLocaleString()}₮</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Trust badges */}
      <div className="flex justify-center gap-6 mt-8 text-center">
        {[
          { emoji: "🔒", label: "Найдвартай" },
          { emoji: "💳", label: "QPay" },
          { emoji: "⚡", label: "Шууд нээгддэг" },
        ].map((badge) => (
          <div key={badge.label} className="text-center">
            <div className="text-xl mb-1">{badge.emoji}</div>
            <div className="text-xs text-purple-400">{badge.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
