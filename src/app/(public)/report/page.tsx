"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronRight, Lock, Star, Heart, Zap } from "lucide-react";

type Step = "form" | "loading" | "result";

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  gender: "FEMALE" | "MALE" | "OTHER";
}

interface ReportSection {
  id: string;
  title: string;
  emoji: string;
  content: string;
  score?: number;
  isPremium: boolean;
  tags?: string[];
}

interface ReportResult {
  sections: ReportSection[];
  zodiacSign: string;
  chineseZodiac: string;
  auraColor: string;
  luckyNumbers: number[];
  luckyColors: string[];
  overallScore: number;
}

export default function ReportPage() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthCity: "",
    gender: "FEMALE",
  });
  const [report, setReport] = useState<ReportResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Таны одны зурхайг тооцоолж байна...");
  const router = useRouter();

  const LOADING_MESSAGES = [
    "Таны одны зурхайг тооцоолж байна...",
    "Сансрын энергийг уншиж байна...",
    "Таны хувь заяаны хэв загварыг тодорхойлж байна...",
    "AI тайланг бэлтгэж байна...",
    "Бараг болж байна... ✨",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("loading");

    // Cycle through loading messages
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[msgIndex]);
    }, 2000);

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: formData }),
      });

      if (!response.ok) throw new Error("Failed to generate report");
      const data = await response.json();

      clearInterval(msgInterval);
      setReport(data.report);
      setStep("result");
    } catch (error) {
      clearInterval(msgInterval);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
      setStep("form");
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-display font-bold gradient-text mb-2">
          Таны AI Тайлан
        </h1>
        <p className="text-purple-300 text-sm">
          Хувийн мэдээллийн үндсэн дээр гүн тайлан
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === "form" && (
          <FormStep
            key="form"
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
          />
        )}
        {step === "loading" && (
          <LoadingStep key="loading" message={loadingMessage} />
        )}
        {step === "result" && report && (
          <ResultStep
            key="result"
            report={report}
            name={formData.name}
            onBuyPremium={() => router.push("/payment?type=YEARLY_REPORT")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FormStep({
  formData,
  setFormData,
  onSubmit,
}: {
  formData: FormData;
  setFormData: (d: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const inputClass =
    "w-full px-4 py-3 rounded-xl glass text-white placeholder-purple-400/50 outline-none focus:border-purple-400 border transition-all";
  const labelClass = "block text-sm text-purple-300 mb-1.5 font-medium";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={onSubmit}
      className="glass-card p-6 space-y-5"
    >
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🔮</div>
        <p className="text-purple-200 text-sm">
          Та мэдээллээ оруулснаар хувийн тайланг тань бэлтгэнэ
        </p>
      </div>

      <div>
        <label className={labelClass}>Таны нэр</label>
        <input
          type="text"
          required
          placeholder="Жишээ: Сарантуяа"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
          style={{ border: "1px solid rgba(109,63,245,0.3)" }}
        />
      </div>

      <div>
        <label className={labelClass}>Төрсөн огноо</label>
        <input
          type="date"
          required
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className={inputClass}
          style={{ border: "1px solid rgba(109,63,245,0.3)", colorScheme: "dark" }}
        />
      </div>

      <div>
        <label className={labelClass}>Төрсөн цаг (заавал биш)</label>
        <input
          type="time"
          value={formData.birthTime}
          onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
          className={inputClass}
          style={{ border: "1px solid rgba(109,63,245,0.3)", colorScheme: "dark" }}
        />
        <p className="text-xs text-purple-400 mt-1">
          Цаг оруулснаар тайлан нарийн болно
        </p>
      </div>

      <div>
        <label className={labelClass}>Төрсөн хот</label>
        <input
          type="text"
          required
          placeholder="Жишээ: Улаанбаатар"
          value={formData.birthCity}
          onChange={(e) => setFormData({ ...formData, birthCity: e.target.value })}
          className={inputClass}
          style={{ border: "1px solid rgba(109,63,245,0.3)" }}
        />
      </div>

      <div>
        <label className={labelClass}>Хүйс</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "FEMALE", label: "Эм ♀", emoji: "🌸" },
            { value: "MALE", label: "Эр ♂", emoji: "⚡" },
            { value: "OTHER", label: "Бусад", emoji: "✨" },
          ].map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setFormData({ ...formData, gender: g.value as FormData["gender"] })}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                formData.gender === g.value
                  ? "bg-purple-600 text-white"
                  : "glass text-purple-300"
              }`}
              style={{ border: `1px solid ${formData.gender === g.value ? "transparent" : "rgba(109,63,245,0.3)"}` }}
            >
              {g.emoji} {g.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn-premium w-full py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 mt-4"
      >
        <Sparkles size={20} />
        Тайланг гарга
        <ChevronRight size={20} />
      </button>

      <p className="text-center text-xs text-purple-400">
        🔒 Таны мэдээлэл нууцлагдсан. Хэн ч харахгүй.
      </p>
    </motion.form>
  );
}

function LoadingStep({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-64 py-20"
    >
      {/* Cosmic spinner */}
      <div className="relative w-24 h-24 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid transparent", borderTopColor: "#6d3ff5", borderRightColor: "#db2777" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full"
          style={{ border: "2px solid transparent", borderTopColor: "#fbbf24", borderLeftColor: "#6d3ff5" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🔮
        </div>
      </div>

      <motion.p
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-purple-200 text-center text-lg"
      >
        {message}
      </motion.p>

      {/* Progress bar */}
      <div className="mt-8 w-48 score-bar">
        <motion.div
          className="score-fill"
          initial={{ width: "0%" }}
          animate={{ width: "90%" }}
          transition={{ duration: 8, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

function ResultStep({
  report,
  name,
  onBuyPremium,
}: {
  report: ReportResult;
  name: string;
  onBuyPremium: () => void;
}) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overview card */}
      <div className="glass-card p-6 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          🌟
        </motion.div>
        <h2 className="text-2xl font-display font-bold text-white mb-1">
          {name}-ийн тайлан бэлэн боллоо
        </h2>
        <p className="text-purple-300 text-sm mb-4">{report.zodiacSign}</p>

        {/* Overall score ring */}
        <div className="flex justify-center mb-4">
          <ScoreRing score={report.overallScore} />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="glass rounded-xl p-3" style={{ border: "1px solid rgba(109,63,245,0.2)" }}>
            <div className="text-lg font-bold gradient-gold">
              {report.luckyNumbers[0]}
            </div>
            <div className="text-xs text-purple-400">Азтай тоо</div>
          </div>
          <div className="glass rounded-xl p-3" style={{ border: "1px solid rgba(219,39,119,0.2)" }}>
            <div className="text-lg">{report.auraColor.split("/")[0]}</div>
            <div className="text-xs text-purple-400">Аура</div>
          </div>
          <div className="glass rounded-xl p-3" style={{ border: "1px solid rgba(109,63,245,0.2)" }}>
            <div className="text-lg">{report.chineseZodiac.split(" ")[0]}</div>
            <div className="text-xs text-purple-400">Хятад зурхай</div>
          </div>
        </div>
      </div>

      {/* Report sections */}
      {report.sections.map((section, i) => (
        <ReportCard
          key={section.id}
          section={section}
          index={i}
          onUnlock={onBuyPremium}
        />
      ))}

      {/* Premium CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 text-center"
        style={{ border: "1px solid rgba(251,191,36,0.3)" }}
      >
        <div className="text-3xl mb-3">🔑</div>
        <h3 className="text-xl font-bold text-yellow-300 mb-2">
          Premium тайлан нээх
        </h3>
        <p className="text-purple-200 text-sm mb-4">
          Бүх нууцлагдсан хэсгийг нээж, 1 жилийн бүрэн тайлан авна уу
        </p>
        <div className="text-2xl font-bold gradient-gold mb-4">9,900₮</div>
        <button
          onClick={onBuyPremium}
          className="btn-premium w-full py-3 rounded-xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}
        >
          ✨ Бүрэн тайлан авах
        </button>
      </motion.div>

      {/* Share button */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: "ZAYA AI — Миний тайлан",
              text: `${name}-ийн астрологи тайлан: ${report.zodiacSign} | Нийт оноо: ${report.overallScore}/100`,
              url: window.location.href,
            });
          }
        }}
        className="w-full py-3 rounded-xl font-semibold glass flex items-center justify-center gap-2"
        style={{ border: "1px solid rgba(109,63,245,0.3)", color: "#c4b0ff" }}
      >
        <Star size={18} />
        Найздаа хуваалцах
      </button>
    </motion.div>
  );
}

function ReportCard({
  section,
  index,
  onUnlock,
}: {
  section: ReportSection;
  index: number;
  onUnlock: () => void;
}) {
  const [expanded, setExpanded] = useState(index < 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.emoji}</span>
          <div>
            <h3 className="font-semibold text-white">{section.title}</h3>
            {section.score && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${section.score}%` }}
                  />
                </div>
                <span className="text-xs text-purple-400">{section.score}/100</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {section.isPremium && (
            <Lock size={14} className="text-yellow-400" />
          )}
          <ChevronRight
            size={16}
            className={`text-purple-400 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {section.isPremium ? (
                <div className="relative">
                  <p className="text-purple-300 text-sm leading-relaxed blur-sm select-none">
                    {section.content}
                  </p>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Lock size={24} className="text-yellow-400 mb-2" />
                    <p className="text-yellow-300 font-semibold text-sm mb-3">
                      Premium контент
                    </p>
                    <button
                      onClick={onUnlock}
                      className="px-4 py-2 rounded-lg text-xs font-semibold"
                      style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "white" }}
                    >
                      🔑 Нээх — 9,900₮
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    {section.content}
                  </p>
                  {section.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {section.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ background: "rgba(109,63,245,0.2)", color: "#c4b0ff" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="rgba(109,63,245,0.2)"
          strokeWidth="6"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6d3ff5" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold gradient-text">{score}</div>
        <div className="text-xs text-purple-400">/100</div>
      </div>
    </div>
  );
}
