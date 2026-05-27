"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Star, Heart, Eye } from "lucide-react";

const VIRAL_HOOKS = [
  "Таны soulmate маш ойрхон байна…",
  "2026 оны 10 сар таны амьдралыг өөрчилнэ",
  "Нууцлаг энерги таньд илэрлээ",
  "Таны compatibility score маш ховор байна",
  "Аюулын үе дөхөж байна — бэлд",
];

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-20 overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #6d3ff5, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #db2777, transparent)" }} />

      {/* Main hero content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center relative z-10 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass"
          style={{ border: "1px solid rgba(109,63,245,0.3)" }}
        >
          <Sparkles size={14} className="text-purple-300" />
          <span className="text-sm text-purple-200">AI-powered · Монгол хэлээр · Premium</span>
          <Star size={14} className="text-yellow-300" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
        >
          <span className="gradient-text">ZAYA AI</span>
          <br />
          <span className="text-white text-3xl md:text-5xl font-light">
            Таны хувь заяаг нээ
          </span>
        </motion.h1>

        {/* Rotating viral hooks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <RotatingText texts={VIRAL_HOOKS} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-purple-200 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          AI технологи ашиглан таны одны орд, хайрын хувь заяа, 
          soulmate, 2026 оны урьдчилсан тайланг{" "}
          <strong className="text-purple-300">Монгол хэлээр</strong> гаргана.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push("/report")}
            className="btn-premium px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Тайланг үнэгүй эхлүүл
          </button>
          <button
            onClick={() => router.push("/compatibility")}
            className="px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 glass"
            style={{ color: "#e2d9f3", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Heart size={20} className="text-rose-400" />
            Compatibility шалгах
          </button>
        </motion.div>

        {/* Social proof counters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-8 justify-center mt-12"
        >
          {[
            { num: "50,000+", label: "Хэрэглэгч" },
            { num: "200,000+", label: "Тайлан" },
            { num: "4.9★", label: "Үнэлгээ" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.num}</div>
              <div className="text-sm text-purple-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-purple-400/30 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-purple-400/60" />
        </div>
      </motion.div>
    </section>
  );
}

function RotatingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);

  // Rotate every 3 seconds
  if (typeof window !== "undefined") {
    setTimeout(() => setIndex((i) => (i + 1) % texts.length), 3000);
  }

  return (
    <div className="h-10 overflow-hidden relative">
      <motion.p
        key={index}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl text-yellow-300 font-medium text-glow-gold"
      >
        ✨ {texts[index]}
      </motion.p>
    </div>
  );
}
