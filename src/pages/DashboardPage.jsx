import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHero from "../components/dashboard/DashboardHero";
import SnippetCard from "../components/dashboard/SnippetCard";
import EmptyState from "../components/dashboard/EmptyState";
import { motion } from "framer-motion";
import { useSnippets } from "../context/SnippetContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage = () => {
  const { snippets, loading, fetchMySnippets } = useSnippets();
  const { pushToast } = useToast();
  const MotionDiv = motion.div;
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSnippets: 0,
    totalFavorites: 0,
    mostUsedLanguage: null,
  });

  useEffect(() => {
    fetchMySnippets();
  }, [fetchMySnippets]);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const { data } = await api.get("/dashboard/stats");
        setStats(data);
      } catch (err) {
        pushToast({
          type: "error",
          message: err.response?.data?.message || "Failed to load dashboard stats",
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [pushToast]);

  const languageData = useMemo(() => {
    const map = new Map();
    for (const s of snippets || []) {
      const key = s?.language || "Unknown";
      map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [snippets]);

  const recentSnippets = useMemo(() => {
    return [...(snippets || [])]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);
  }, [snippets]);

  const pieColors = [
    "#14b8a6",
    "#f97316",
    "#60a5fa",
    "#f43f5e",
    "#a78bfa",
    "#22c55e",
    "#eab308",
    "#64748b",
  ];

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <DashboardHero title="My Snippets" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 py-6 flex flex-col gap-12">

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Snippets", value: stats.totalSnippets },
            { label: "Total Favorites", value: stats.totalFavorites },
            { label: "Most Used Language", value: stats.mostUsedLanguage || "—" },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5"
            >
              <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-black text-gray-900">
                {statsLoading ? <span className="text-gray-300">…</span> : card.value}
              </p>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-gray-800 mb-4">
              Snippets by Language
            </h3>
            {languageData.length === 0 ? (
              <p className="text-sm font-semibold text-gray-500">No snippets yet.</p>
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-10} height={50} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-gray-800 mb-4">
              Language Share
            </h3>
            {languageData.length === 0 ? (
              <p className="text-sm font-semibold text-gray-500">No snippets yet.</p>
            ) : (
              <div className="h-[280px] flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="h-full w-full sm:w-[60%]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languageData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {languageData.map((entry, index) => (
                          <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full sm:w-[40%] max-h-[240px] overflow-auto pr-1">
                  <div className="flex flex-col gap-2">
                    {languageData.map((entry, index) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <span
                          className="h-3 w-3 rounded-sm shrink-0"
                          style={{ backgroundColor: pieColors[index % pieColors.length] }}
                        />
                        <span className="truncate" title={entry.name}>
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* All Snippets */}
        <section className="flex flex-col gap-6 pb-20">
           <h3 className="text-lg font-extrabold text-gray-900">All Snippets</h3>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
            </div>
          ) : snippets.length > 0 ? (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {snippets.map((snippet, index) => (
                <SnippetCard
                  key={snippet._id || index}
                  snippet={snippet}
                  index={index}
                />
              ))}
            </MotionDiv>
          ) : (
            <EmptyState />
          )}
        </section>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
