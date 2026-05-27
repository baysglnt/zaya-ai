"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, AlertTriangle, Star, Lock } from "lucide-react";

interface Person {
  name: string;
  birthDate: string;
  gender: "FEMALE" | "MALE" | "OTHER";
}

interface CompatibilityResult {
  overallCompatibility: number;
  soulmate: number;
  toxic: number;
  marriage: number;
  cheatingRisk: number;
  emotionalBond: number;
  futureRelationship: number;
  verdict: string;
  analysis: string;
  strengths: string[];
  challenges: string[];
  lovePrediction: string;
  warningSign: string;
  premiumHint: string;
}

type Step = "form" | "loading" | "result";

export default function CompatibilityPage() {
  const [step, setStep] = useState<Step>("form");
  const [person1, setPerson1] = useState<Person>({ name: "", birthDate: "", gender: "FEMALE" });
  const [person2, setPerson2] = useState<Person>({ name: "", birthDate: "", gender: "MALE" });
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("loading");

    try {
      const res = await fetch("/api/compatibility/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person1, person2 }),
      });
      const data = await res.json();
      setResult(data.result);
      setStep("result");
    } catch {
      setStep("form");
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-3">💘</div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Compatibility Шалгагч
        </h1>
        <p className="text-purple-300">
          2 хүний хайрын нийцэл, soulmate %, аюул болон ирээдүйг илчилнэ
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Person 1 */}
            <PersonCard
              label="🌸 Нэгдүгээр хүн (Та)"
              person={person1}
              setPerson={setPerson1}
              color="purple"
            />

            {/* VS divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-purple-800/30" />
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #6d3ff5, #db2777)" }}>
                VS
              </div>
              <div className="flex-1 h-px bg-purple-800/30" />
            </div>

            {/* Person 2 */}
            <PersonCard
              label="💙 Хоёрдугаар хүн (Crush / Хань)"
              person={person2}
              setPerson={setPerson2}
              color="rose"
            />

            <button
              type="submit"
              className="btn-premium w-full py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Heart size={20} fill="white" />
              Compatibility шалгах
            </button>
          </motion.form>
        )}

        {step === "loading" && (
          <CompatibilityLoader key="loading" />
        )}

        {step === "result" && result && (
          <CompatibilityResult
            key="result"
            result={result}
            person1Name={person1.name}
            person2Name={person2.name}
            onReset={() => setStep("form")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PersonCard({
  label,
  person,
  setPerson,
  color,
}: {
  label: string;
  person: Person;
  setPerson: (p: Person) => void;
  color: "purple" | "rose";
}) {
  const borderColor = color === "purple" ? "rgba(109,63,245,0.3)" : "rgba(219,39,119,0.3)";

  return (
    <div className="glass-card p-5" style={{ border: `1px solid ${borderColor}` }}>
      <h3 className="font-semibold text-white mb-4">{label}</h3>
      <div className="space-y-3">
        <input
          type="text"
          required
          placeholder="Нэр"
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl glass text-white placeholder-purple-400/50 outline-none text-sm"
          style={{ border: `1px solid ${borderColor}` }}
        />
        <input
          type="date"
          required
          value={person.birthDate}
          onChange={(e) => setPerson({ ...person, birthDate: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl glass text-white outline-none text-sm"
          style={{ border: `1px solid ${borderColor}`, colorScheme: "dark" }}
        />
        <div className="flex gap-2">
          {(["FEMALE", "MALE", "OTHER"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setPerson({ ...person, gender: g })}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                person.gender === g ? "text-white" : "glass text-purple-300"
              }`}
              style={{
                background: person.gender === g
                  ? color === "purple" ? "#6d3ff5" : "#db2777"
                  : undefined,
                border: person.gender === g ? "none" : `1px solid ${borderColor}`,
              }}
            >
              {g === "FEMALE" ? "🌸 Эм" : g === "MALE" ? "⚡ Эр" : "✨ Бусад"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompatibilityLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="relative w-32 h-32 mx-auto mb-8">
        <motion.div
          className="absolute left-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ background: "linear-gradient(135deg, #6d3ff5, #7c3aed)", top: "50%", marginTop: -28 }}
        >
          🌸
        </motion.div>
        <motion.div
          className="absolute right-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          animate={{ x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ background: "linear-gradient(135deg, #db2777, #be185d)", top: "50%", marginTop: -28 }}
        >
          ⚡
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          💘
        </motion.div>
      </div>
      <p className="text-purple-200">Хайрын энергийг тооцоолж байна...</p>
    </motion.div>
  );
}

function CompatibilityResult({
  result,
  person1Name,
  person2Name,
  onReset,
}: {
  result: CompatibilityResult;
  person1Name: string;
  person2Name: string;
  onReset: () => void;
}) {
  const scores = [
    { label: "Нийцэл", value: result.overallCompatibility, color: "#6d3ff5", emoji: "💫" },
    { label: "Soulmate %", value: result.soulmate, color: "#db2777", emoji: "💘" },
    { label: "Гэрлах магадлал", value: result.marriage, color: "#10b981", emoji: "💍" },
    { label: "Эмоциональ холбоо", value: result.emotionalBond, color: "#f59e0b", emoji: "🌙" },
    { label: "Ирээдүйн хамт байдал", value: result.futureRelationship, color: "#8b5cf6", emoji: "⭐" },
  ];

  const risks = [
    { label: "Toxic байдал", value: result.toxic, color: "#ef4444", emoji: "⚠️", danger: result.toxic > 50 },
    { label: "Урвалт эрсдэл", value: result.cheatingRisk, color: "#f97316", emoji: "💔", danger: result.cheatingRisk > 40 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main score */}
      <div className="glass-card p-6 text-center">
        <p className="text-purple-300 text-sm mb-2">
          {person1Name} & {person2Name}
        </p>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg width="128" height="128" className="-rotate-90">
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(109,63,245,0.2)" strokeWidth="8" />
            <motion.circle
              cx="64" cy="64" r="56" fill="none"
              stroke="url(#compGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 56}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - result.overallCompatibility / 100) }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="compGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6d3ff5" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold gradient-text">{result.overallCompatibility}%</span>
            <span className="text-xs text-purple-400">нийцэл</span>
          </div>
        </div>

        <p className="text-purple-200 text-sm leading-relaxed italic">
          "{result.verdict}"
        </p>
      </div>

      {/* Score breakdown */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-4">Нарийвчилсан үзүүлэлт</h3>
        <div className="space-y-3">
          {scores.map((score) => (
            <div key={score.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-300">{score.emoji} {score.label}</span>
                <span className="font-semibold" style={{ color: score.color }}>{score.value}%</span>
              </div>
              <div className="score-bar">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${score.value}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  style={{ background: `linear-gradient(90deg, ${score.color}88, ${score.color})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk scores */}
      <div className="glass-card p-5" style={{ border: "1px solid rgba(239,68,68,0.2)" }}>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          Эрсдэлийн үзүүлэлт
        </h3>
        <div className="space-y-3">
          {risks.map((risk) => (
            <div key={risk.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-300">{risk.emoji} {risk.label}</span>
                <span className={`font-semibold ${risk.danger ? "text-red-400" : "text-green-400"}`}>
                  {risk.value}%
                </span>
              </div>
              <div className="score-bar">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${risk.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ background: `linear-gradient(90deg, ${risk.color}66, ${risk.color})` }}
                />
              </div>
            </div>
          ))}
        </div>
        {result.warningSign && (
          <p className="text-red-300 text-xs mt-3 italic">⚠️ {result.warningSign}</p>
        )}
      </div>

      {/* Analysis */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-3">Гүн шинжилгээ</h3>
        <p className="text-purple-200 text-sm leading-relaxed">{result.analysis}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-xs font-semibold text-green-400 mb-2">✅ Давуу талууд</h4>
            {result.strengths?.map((s) => (
              <p key={s} className="text-xs text-purple-300 mb-1">• {s}</p>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-red-400 mb-2">⚠️ Бэрхшээлүүд</h4>
            {result.challenges?.map((c) => (
              <p key={c} className="text-xs text-purple-300 mb-1">• {c}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Premium section */}
      <div className="glass-card p-5 relative overflow-hidden" style={{ border: "1px solid rgba(251,191,36,0.3)" }}>
        <div className="blur-sm">
          <p className="text-purple-200 text-sm">{result.premiumHint}</p>
          <p className="text-purple-200 text-sm mt-2">{result.lovePrediction}</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Lock size={24} className="text-yellow-400 mb-2" />
          <p className="text-yellow-300 font-semibold text-sm mb-3">2026 оны хайрын тайлан</p>
          <a
            href="/payment?type=COMPATIBILITY"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}
          >
            🔑 Нээх — 4,900₮
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onReset}
          className="py-3 rounded-xl glass text-purple-300 font-medium text-sm"
          style={{ border: "1px solid rgba(109,63,245,0.3)" }}
        >
          Дахин шалгах
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "ZAYA AI Compatibility",
                text: `${person1Name} & ${person2Name}: ${result.overallCompatibility}% нийцэл! 💘`,
                url: window.location.href,
              });
            }
          }}
          className="py-3 rounded-xl text-white font-medium text-sm btn-premium"
        >
          ❤️ Хуваалцах
        </button>
      </div>
    </motion.div>
  );
}
