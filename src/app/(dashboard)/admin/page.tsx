"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, FileText, TrendingUp, RefreshCw, Star, Gift } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  totalReports: number;
  activeSubscriptions: number;
  todayPayments: number;
  todayUsers: number;
  topZodiac: string;
  conversionRate: number;
  recentPayments: Payment[];
  zodiacStats: ZodiacStat[];
}

interface Payment {
  id: string;
  amount: number;
  description: string;
  paidAt: string;
  userName: string;
}

interface ZodiacStat {
  sign: string;
  count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_KEY || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw size={32} className="text-purple-400 animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      icon: <Users size={20} />,
      label: "Нийт хэрэглэгч",
      value: stats?.totalUsers.toLocaleString() || "0",
      sub: `+${stats?.todayUsers || 0} өнөөдөр`,
      color: "#6d3ff5",
    },
    {
      icon: <DollarSign size={20} />,
      label: "Нийт орлого",
      value: `${(stats?.totalRevenue || 0).toLocaleString()}₮`,
      sub: `${stats?.todayPayments || 0} өнөөдөр`,
      color: "#10b981",
    },
    {
      icon: <FileText size={20} />,
      label: "Нийт тайлан",
      value: stats?.totalReports.toLocaleString() || "0",
      sub: "Бүх тайлан",
      color: "#3b82f6",
    },
    {
      icon: <Star size={20} />,
      label: "Premium захиалга",
      value: stats?.activeSubscriptions.toLocaleString() || "0",
      sub: "Идэвхтэй",
      color: "#f59e0b",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Conversion хувь",
      value: `${stats?.conversionRate || 0}%`,
      sub: "Үнэгүй → Paid",
      color: "#db2777",
    },
    {
      icon: <Gift size={20} />,
      label: "Хамгийн алдартай орд",
      value: stats?.topZodiac || "—",
      sub: "Энэ сард",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-purple-400 text-sm">ZAYA AI — Удирдлагын самбар</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-purple-300"
          style={{ border: "1px solid rgba(109,63,245,0.3)" }}
        >
          <RefreshCw size={14} />
          Шинэчлэх
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-2" style={{ color: card.color }}>
              {card.icon}
              <span className="text-xs text-purple-400">{card.label}</span>
            </div>
            <div className="text-xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-purple-400 mt-0.5">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent payments */}
      <div className="glass-card p-5 mb-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-green-400" />
          Сүүлийн төлбөрүүд
        </h2>
        <div className="space-y-3">
          {stats?.recentPayments?.length ? (
            stats.recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-2 border-b border-purple-800/20 last:border-0"
              >
                <div>
                  <p className="text-sm text-white">{payment.description}</p>
                  <p className="text-xs text-purple-400">{payment.userName} · {new Date(payment.paidAt).toLocaleString("mn-MN")}</p>
                </div>
                <span className="text-green-400 font-semibold text-sm">
                  +{payment.amount.toLocaleString()}₮
                </span>
              </div>
            ))
          ) : (
            <p className="text-purple-400 text-sm">Төлбөр байхгүй</p>
          )}
        </div>
      </div>

      {/* Zodiac popularity */}
      <div className="glass-card p-5">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Star size={16} className="text-yellow-400" />
          Зурхайн ордны статистик
        </h2>
        <div className="space-y-2">
          {stats?.zodiacStats?.map((z) => (
            <div key={z.sign}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-200">{z.sign}</span>
                <span className="text-purple-400">{z.count}</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${Math.min((z.count / (stats.zodiacStats[0]?.count || 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={() => fetch("/api/admin/generate-content", { method: "POST" })}
          className="py-3 rounded-xl glass text-purple-300 text-sm font-medium"
          style={{ border: "1px solid rgba(109,63,245,0.3)" }}
        >
          ✨ Контент үүсгэх
        </button>
        <a
          href="/api/admin/export"
          className="py-3 rounded-xl glass text-purple-300 text-sm font-medium text-center block"
          style={{ border: "1px solid rgba(109,63,245,0.3)" }}
        >
          📊 CSV экспорт
        </a>
      </div>
    </div>
  );
}
