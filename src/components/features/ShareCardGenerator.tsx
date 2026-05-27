"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Sparkles } from "lucide-react";

interface ShareCardProps {
  zodiacSign: string;
  auraColor: string;
  overallScore: number;
  luckyNumber: number;
  name: string;
  type: "aura" | "zodiac" | "compatibility" | "destiny";
}

export function ShareCardGenerator({ zodiacSign, auraColor, overallScore, luckyNumber, name, type }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function downloadCard() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0d0520",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `zaya-ai-${type}-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {}
    setDownloading(false);
  }

  async function shareCard() {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0d0520",
        scale: 2,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "zaya-ai-card.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "ZAYA AI — Миний тайлан" });
        } else {
          await navigator.share({ title: "ZAYA AI", url: window.location.href });
        }
      });
    } catch {}
  }

  return (
    <div className="space-y-4">
      {/* Preview card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #1a0a47 0%, #251466 50%, #1a0a47 100%)",
          padding: "32px 24px",
          minHeight: "400px",
          border: "1px solid rgba(163,133,255,0.3)",
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at top left, rgba(109,63,245,0.3) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(219,39,119,0.2) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* Stars decoration */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              borderRadius: "50%",
              background: "white",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.8 + 0.1,
            }}
          />
        ))}

        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Logo */}
          <div style={{ fontSize: "12px", color: "#a78bfa", letterSpacing: "3px", marginBottom: "16px" }}>
            ✦ ZAYA AI ✦
          </div>

          {/* Zodiac sign */}
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>
            {getZodiacEmoji(zodiacSign)}
          </div>

          {/* Name */}
          <div style={{
            fontSize: "22px", fontWeight: "bold", color: "white", marginBottom: "4px",
          }}>
            {name}
          </div>

          {/* Sign */}
          <div style={{ fontSize: "14px", color: "#c4b0ff", marginBottom: "24px" }}>
            {zodiacSign}
          </div>

          {/* Score circle */}
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #6d3ff5, #db2777)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{overallScore}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>/100</div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fbbf24" }}>{luckyNumber}</div>
              <div style={{ fontSize: "11px", color: "#a78bfa" }}>Азтай тоо</div>
            </div>
            <div style={{ width: "1px", background: "rgba(163,133,255,0.3)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#c4b0ff" }}>{auraColor}</div>
              <div style={{ fontSize: "11px", color: "#a78bfa" }}>Аура</div>
            </div>
          </div>

          {/* Watermark */}
          <div style={{
            fontSize: "11px", color: "rgba(163,133,255,0.5)", letterSpacing: "1px",
          }}>
            Generated by ZAYA AI · zaya.mn
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadCard}
          disabled={downloading}
          className="flex items-center justify-center gap-2 py-3 rounded-xl glass text-purple-300 text-sm font-medium"
          style={{ border: "1px solid rgba(109,63,245,0.3)" }}
        >
          <Download size={16} />
          {downloading ? "..." : "Татаж авах"}
        </button>
        <button
          onClick={shareCard}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-medium btn-premium"
        >
          <Share2 size={16} />
          Хуваалцах
        </button>
      </div>
    </div>
  );
}

function getZodiacEmoji(sign: string): string {
  const map: Record<string, string> = {
    "Хуц": "♈", "Буга": "♉", "Ихэр": "♊", "Мэлхий": "♋",
    "Арслан": "♌", "Охин": "♍", "Жинлүүр": "♎", "Хилэнц": "♏",
    "Нумч": "♐", "Матар": "♑", "Дөлийн сав": "♒", "Загас": "♓",
  };
  for (const [key, emoji] of Object.entries(map)) {
    if (sign.includes(key)) return emoji;
  }
  return "⭐";
}
