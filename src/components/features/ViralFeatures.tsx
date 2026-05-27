"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, Flame, Eye, Sparkles, Gift, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    id: "love_question",
    emoji: "💘",
    title: "Тэр намайг хайрладаг уу?",
    description: "Zodiac-ийн нууц мессежийг илчил",
    color: "from-pink-900/50 to-rose-900/30",
    border: "rgba(219,39,119,0.3)",
    badge: "🔥 Хамгийн их хуваалцсан",
    action: "/love-checker",
  },
  {
    id: "cheat_detector",
    emoji: "🕵️",
    title: "Тэр намайг хуурч байна уу?",
    description: "Урвалтын эрсдэлийн тайлан",
    color: "from-red-900/50 to-orange-900/30",
    border: "rgba(239,68,68,0.3)",
    badge: "⚡ Super viral",
    action: "/cheat-detector",
  },
  {
    id: "2026_prediction",
    emoji: "🔮",
    title: "2026 онд миний амьдрал",
    description: "Ирэх жилийн бүрэн тайлан",
    color: "from-purple-900/50 to-blue-900/30",
    border: "rgba(109,63,245,0.3)",
    badge: "🌟 TikTok viral",
    action: "/report",
  },
  {
    id: "soulmate",
    emoji: "👥",
    title: "Миний soulmate хэн бэ?",
    description: "Хувь заяаны хань хэзээ ирэх вэ",
    color: "from-indigo-900/50 to-purple-900/30",
    border: "rgba(99,102,241,0.3)",
    badge: "💫 Premium",
    action: "/payment?type=SOULMATE",
  },
];

const SPIN_ITEMS = [
  { label: "Азтай тоо", emoji: "🔢", color: "#6d3ff5" },
  { label: "Азтай өнгө", emoji: "🎨", color: "#db2777" },
  { label: "Хайрын зурвас", emoji: "💌", color: "#10b981" },
  { label: "Нууц тайлан", emoji: "🔮", color: "#f59e0b" },
  { label: "Азтай өдөр", emoji: "📅", color: "#3b82f6" },
  { label: "Soulmate hint", emoji: "💘", color: "#ec4899" },
  { label: "Мөнгөний зөвлөгөө", emoji: "💰", color: "#eab308" },
  { label: "Онцгой тайлан", emoji: "⭐", color: "#8b5cf6" },
];

export function ViralFeatures() {
  const router = useRouter();
  const [spinResult, setSpinResult] = useState<(typeof SPIN_ITEMS)[0] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinDegrees, setSpinDegrees] = useState(0);
  const [showSpin, setShowSpin] = useState(false);

  function handleSpin() {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);

    const randomIndex = Math.floor(Math.random() * SPIN_ITEMS.length);
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const degreesPerItem = 360 / SPIN_ITEMS.length;
    const targetDegree = spinDegrees + extraSpins * 360 + randomIndex * degreesPerItem;

    setSpinDegrees(targetDegree);

    setTimeout(() => {
      setSpinResult(SPIN_ITEMS[randomIndex]);
      setSpinning(false);
    }, 4000);
  }

  return (
    <section className="px-4 py-12 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-purple-500" />
          <h2 className="text-2xl font-bold text-white">Вирал Онцлогууд</h2>
        </div>
        <p className="text-purple-400 text-sm ml-4">TikTok, Facebook-д хамгийн их хуваалцагддаг</p>
      </motion.div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {FEATURES.map((feature, i) => (
          <motion.button
            key={feature.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => router.push(feature.action)}
            className={`w-full text-left p-5 rounded-2xl bg-gradient-to-br ${feature.color} transition-all active:scale-98`}
            style={{ border: `1px solid ${feature.border}` }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{feature.emoji}</span>
                <div>
                  <h3 className="font-semibold text-white mb-0.5">{feature.title}</h3>
                  <p className="text-sm text-purple-300">{feature.description}</p>
                </div>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2"
                style={{ background: "rgba(255,255,255,0.1)", color: "#e2d9f3" }}
              >
                {feature.badge}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Daily Spin section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-6"
        style={{ border: "1px solid rgba(251,191,36,0.3)" }}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Gift size={20} className="text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Өдрийн Азын Дугуй</h3>
          </div>
          <p className="text-sm text-purple-300">Өдөрт 1 удаа эргүүлж азаа шалга</p>
        </div>

        {/* Spin wheel visual */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-4 h-6 clip-triangle"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: "20px solid #fbbf24",
                  filter: "drop-shadow(0 0 4px rgba(251,191,36,0.5))",
                }}
              />
            </div>

            {/* Wheel */}
            <motion.div
              className="w-full h-full rounded-full overflow-hidden"
              style={{
                background: `conic-gradient(
                  #6d3ff5 0deg 45deg,
                  #db2777 45deg 90deg,
                  #10b981 90deg 135deg,
                  #f59e0b 135deg 180deg,
                  #3b82f6 180deg 225deg,
                  #ec4899 225deg 270deg,
                  #eab308 270deg 315deg,
                  #8b5cf6 315deg 360deg
                )`,
                border: "3px solid rgba(255,255,255,0.1)",
              }}
              animate={{ rotate: spinDegrees }}
              transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
            >
              {/* Wheel segments text */}
              {SPIN_ITEMS.map((item, i) => {
                const angle = (i * 360) / SPIN_ITEMS.length + 22.5;
                return (
                  <div
                    key={item.label}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span className="text-xl" style={{ transform: `translateY(-64px)` }}>
                      {item.emoji}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* Center */}
            <div
              className="absolute inset-0 m-auto w-10 h-10 rounded-full flex items-center justify-center text-xl z-10"
              style={{
                background: "linear-gradient(135deg, #1a0a47, #251466)",
                border: "2px solid rgba(251,191,36,0.5)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              ⭐
            </div>
          </div>
        </div>

        {/* Spin result */}
        <AnimatePresence>
          {spinResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-4 p-4 rounded-xl"
              style={{ background: `${spinResult.color}33`, border: `1px solid ${spinResult.color}66` }}
            >
              <span className="text-3xl">{spinResult.emoji}</span>
              <p className="text-white font-semibold mt-1">{spinResult.label} таньд ирлээ!</p>
              <p className="text-sm text-purple-300 mt-1">
                Бүрэн тайланг авахын тулд premium нээх хэрэгтэй
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleSpin}
          disabled={spinning}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all"
          style={{
            background: spinning
              ? "rgba(109,63,245,0.3)"
              : "linear-gradient(135deg, #d97706, #f59e0b)",
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          {spinning ? "🌀 Эргэж байна..." : "🎡 Дугуй эргүүл"}
        </button>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { icon: <Flame size={16} />, value: "12,400+", label: "Өдрийн тайлан" },
          { icon: <Heart size={16} />, value: "8,900+", label: "Compatibility" },
          { icon: <TrendingUp size={16} />, value: "98%", label: "Хэрэглэгч сэтгэл ханасан" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass text-center p-3 rounded-xl"
            style={{ border: "1px solid rgba(109,63,245,0.2)" }}
          >
            <div className="flex justify-center text-purple-400 mb-1">{stat.icon}</div>
            <div className="text-sm font-bold gradient-text">{stat.value}</div>
            <div className="text-xs text-purple-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
