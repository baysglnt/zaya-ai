"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, Bookmark, Zap, Moon, Star } from "lucide-react";

interface FeedItem {
  id: string;
  type: "daily_energy" | "zodiac_fact" | "love_tip" | "cosmic_alert" | "meme" | "warning";
  zodiacSign?: string;
  title: string;
  content: string;
  emoji: string;
  color: string;
  likes: number;
  isLiked?: boolean;
}

const SEED_FEED: FeedItem[] = [
  {
    id: "1",
    type: "cosmic_alert",
    title: "🌕 Дүүрэн сар эхэллээ",
    content: "Өнөөдрийн дүүрэн сар таны хайрын амьдралд маш хүчтэй нөлөө үзүүлж байна. Scorpio, Cancer, Pisces ордныхон онцгой анхаарал хандуулах хэрэгтэй.",
    emoji: "🌕",
    color: "from-yellow-900/40 to-orange-900/30",
    likes: 2841,
  },
  {
    id: "2",
    type: "zodiac_fact",
    zodiacSign: "Scorpio ♏",
    title: "Scorpio хүмүүсийн нууц",
    content: "♏ Scorpio ордныхон гаднаа хүйтэн харагдсан ч дотроо дэлхийн хамгийн гүн хайраар хайрлах чадвартай хүмүүс. Тэд хайрласан хүнийхээ төлөө бүгдийг хийнэ — хамгийн том давуу тал нь мөн хамгийн том дутагдал нь.",
    emoji: "♏",
    color: "from-red-900/40 to-purple-900/30",
    likes: 5621,
  },
  {
    id: "3",
    type: "love_tip",
    title: "Тэр чамайг үнэхээр хайрладаг уу?",
    content: "Астрологийн дагуу Aries болон Capricorn ордныхон хайрласан хүнийхээ зан авирыг өөрчилдөг. Хэрэв тэр чинь гэнэт илүү анхаарал тавьж эхэлсэн бол... энэ нь тэмдэг юм.",
    emoji: "💘",
    color: "from-pink-900/40 to-rose-900/30",
    likes: 8934,
  },
  {
    id: "4",
    type: "warning",
    title: "⚠️ Mercury Retrograde анхааруулга",
    content: "Энэ долоо хоногт Mercury retrograde дуусч байна. Ex-тэйгээ холбоо барих, чухал шийдвэр гаргах, гэрээ байгуулахаас болгоомжил. Ялангуяа Gemini, Virgo ордныхон.",
    emoji: "⚠️",
    color: "from-orange-900/40 to-red-900/30",
    likes: 3456,
  },
  {
    id: "5",
    type: "meme",
    zodiacSign: "Gemini ♊",
    title: "Gemini starter pack 😭",
    content: "• 3 өөр personality нэгэн зэрэг\n• Бүх зүйлийг мэддэг шиг ярьдаг\n• Reply хийхэд 3 хоног болдог\n• Гэтэл хамгийн재미있ен хүн\n• Хоёр нүүр гэж буруугаар ойлгодог — үнэндээ олон dimensional хүн юм",
    emoji: "♊",
    color: "from-yellow-900/30 to-green-900/30",
    likes: 12400,
  },
  {
    id: "6",
    type: "daily_energy",
    title: "Өнөөдрийн эрч хүч",
    content: "Venus планет Taurus ордонд орж ирэснээр хайрын энерги дээд цэгтээ хүрч байна. Өнөөдөр feelings-оо илэрхийлэхэд тохиромжтой өдөр. Хайрт хүндээ юу хэлэхийг хүссэнийхээ хэлж чадна.",
    emoji: "✨",
    color: "from-purple-900/40 to-blue-900/30",
    likes: 4521,
  },
  {
    id: "7",
    type: "zodiac_fact",
    zodiacSign: "Pisces ♓",
    title: "Pisces-ийн хамгийн аюулта зуршил",
    content: "♓ Pisces хүмүүс дэлхийн хамгийн нарийн overthinker. Тэд ганцаардсандаа, нэгийг сонгосондоо, ярьсандаа, ярьгаагүйдаа, байснаа, байгаагүйдаа — бүгдэд нь дахин дахин бодно. Гэтэл хэн ч ойлгодоггүй.",
    emoji: "♓",
    color: "from-blue-900/40 to-cyan-900/30",
    likes: 9870,
  },
];

export function DailyFeed() {
  const [items, setItems] = useState<FeedItem[]>(SEED_FEED);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch("/api/content/feed?page=" + Math.floor(items.length / 7));
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [...prev, ...data.items]);
      }
    } catch {}
    setLoading(false);
  }

  function toggleLike(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
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
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
          <h2 className="text-2xl font-bold text-white">Өдрийн Feed</h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(109,63,245,0.3)", color: "#c4b0ff" }}>
            LIVE
          </span>
        </div>
        <p className="text-purple-400 text-sm ml-4">TikTok style астрологи контент</p>
      </motion.div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <FeedCard key={item.id} item={item} index={i} onLike={() => toggleLike(item.id)} />
        ))}

        {/* Loader */}
        <div ref={loaderRef} className="py-8 flex justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-purple-400 text-sm">
              <Star size={16} className="animate-spin" />
              Илүү контент ачаалж байна...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeedCard({ item, index, onLike }: { item: FeedItem; index: number; onLike: () => void }) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05 }}
      className={`glass-card p-5 bg-gradient-to-br ${item.color}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{item.emoji}</span>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">{item.title}</h3>
            {item.zodiacSign && (
              <span className="text-xs text-purple-400">{item.zodiacSign}</span>
            )}
          </div>
        </div>
        <TypeBadge type={item.type} />
      </div>

      {/* Content */}
      <p className="text-purple-200 text-sm leading-relaxed whitespace-pre-line">
        {item.content}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-800/20">
        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: item.isLiked ? "#fb7185" : "#a78bfa" }}
          >
            <Heart size={16} fill={item.isLiked ? "#fb7185" : "none"} />
            <span>{item.likes.toLocaleString()}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: item.title, text: item.content, url: window.location.href });
              }
            }}
            className="flex items-center gap-1.5 text-sm text-purple-400"
          >
            <Share2 size={16} />
            <span>Хуваалцах</span>
          </button>
        </div>

        <button
          onClick={() => setSaved(!saved)}
          style={{ color: saved ? "#fbbf24" : "#a78bfa" }}
        >
          <Bookmark size={16} fill={saved ? "#fbbf24" : "none"} />
        </button>
      </div>
    </motion.div>
  );
}

function TypeBadge({ type }: { type: FeedItem["type"] }) {
  const config = {
    daily_energy: { label: "Энерги", color: "rgba(109,63,245,0.4)", text: "#c4b0ff" },
    zodiac_fact: { label: "Зурхай", color: "rgba(37,99,235,0.4)", text: "#93c5fd" },
    love_tip: { label: "Хайр", color: "rgba(219,39,119,0.4)", text: "#f9a8d4" },
    cosmic_alert: { label: "Сансар", color: "rgba(245,158,11,0.4)", text: "#fcd34d" },
    meme: { label: "Meme", color: "rgba(16,185,129,0.4)", text: "#6ee7b7" },
    warning: { label: "Анхааруулга", color: "rgba(239,68,68,0.4)", text: "#fca5a5" },
  };

  const c = config[type];
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ background: c.color, color: c.text }}
    >
      {c.label}
    </span>
  );
}
