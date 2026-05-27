"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Heart } from "lucide-react";
import { useState } from "react";

export function FloatingCTA() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2 }}
      className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
    >
      <button
        onClick={() => router.push("/report")}
        className="btn-premium px-8 py-3.5 rounded-2xl text-white font-semibold flex items-center gap-2 pointer-events-auto shadow-2xl"
        style={{ boxShadow: "0 8px 32px rgba(109,63,245,0.5)" }}
      >
        <Sparkles size={18} />
        Үнэгүй тайлан авах
      </button>
    </motion.div>
  );
}

const ZODIAC_SIGNS = [
  { sign: "Хуц", emoji: "♈", dates: "Мар 21 — Апр 19" },
  { sign: "Буга", emoji: "♉", dates: "Апр 20 — Май 20" },
  { sign: "Ихэр", emoji: "♊", dates: "Май 21 — Июн 20" },
  { sign: "Мэлхий", emoji: "♋", dates: "Июн 21 — Июл 22" },
  { sign: "Арслан", emoji: "♌", dates: "Июл 23 — Авг 22" },
  { sign: "Охин", emoji: "♍", dates: "Авг 23 — Сен 22" },
  { sign: "Жинлүүр", emoji: "♎", dates: "Сен 23 — Окт 22" },
  { sign: "Хилэнц", emoji: "♏", dates: "Окт 23 — Нов 21" },
  { sign: "Нумч", emoji: "♐", dates: "Нов 22 — Дек 21" },
  { sign: "Матар", emoji: "♑", dates: "Дек 22 — Ян 19" },
  { sign: "Дөлийн сав", emoji: "♒", dates: "Ян 20 — Фев 18" },
  { sign: "Загас", emoji: "♓", dates: "Фев 19 — Мар 20" },
];

export function ZodiacQuickCheck() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="px-4 py-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Таны одны орд</h2>
        <p className="text-sm text-purple-400">Өнөөдрийн энергийг шалга</p>
      </motion.div>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {ZODIAC_SIGNS.map((z, i) => (
          <motion.button
            key={z.sign}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            onClick={() => { setSelected(z.sign); router.push("/report"); }}
            className={`flex flex-col items-center py-3 px-1 rounded-xl transition-all ${selected === z.sign ? "bg-purple-600" : "glass"}`}
            style={{ border: `1px solid ${selected === z.sign ? "transparent" : "rgba(109,63,245,0.2)"}` }}
          >
            <span className="text-xl mb-1">{z.emoji}</span>
            <span className="text-xs text-purple-200 font-medium">{z.sign}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Б. Нарантуяа", sign: "♏ Scorpio", text: "Тайлан маань гайхалтай нарийн байсан! Хайрын амьдралын зөгнөл 100% биелсэн.", avatar: "🌸", rating: 5 },
  { name: "Д. Баярсайхан", sign: "♈ Aries", text: "Compatibility check хийгээд гэрлэхийг шийдсэн 😂 ZAYA AI маш зөв зөгнөсөн!", avatar: "⚡", rating: 5 },
  { name: "Х. Мөнхзул", sign: "♓ Pisces", text: "2026 урьдчилсан тайланг авлаа. Санхүүгийн таамаглал биелч байна!", avatar: "💫", rating: 5 },
  { name: "О. Гантулга", sign: "♑ Capricorn", text: "Soulmate тайлан авсан. Зарим зүйл тийм нарийн гэж бодоогүй байсан.", avatar: "🌙", rating: 5 },
];

export function TestimonialSection() {
  return (
    <section className="px-4 py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Хэрэглэгчдийн санал</h2>
        <p className="text-purple-400 text-sm">50,000+ монгол хэрэглэгч итгэдэг</p>
      </motion.div>
      <div className="space-y-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "rgba(109,63,245,0.2)" }}>
                {t.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-white">{t.name}</span>
                  <span className="text-xs text-purple-400">{t.sign}</span>
                </div>
                <div className="flex mb-2">
                  {[...Array(t.rating)].map((_, j) => <span key={j} className="text-yellow-400 text-xs">★</span>)}
                </div>
                <p className="text-sm text-purple-200">{t.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
