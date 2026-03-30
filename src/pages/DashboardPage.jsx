import React, { useEffect } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHero from "../components/dashboard/DashboardHero";
import SnippetCard from "../components/dashboard/SnippetCard";
import EmptyState from "../components/dashboard/EmptyState";
import { motion } from "framer-motion";
import { useSnippets } from "../context/SnippetContext";

const DashboardPage = () => {
  const { snippets, loading, fetchMySnippets } = useSnippets();

  useEffect(() => {
    fetchMySnippets();
  }, [fetchMySnippets]);

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <DashboardHero title="My Snippets" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 py-6 flex flex-col gap-12">

        {/* ── All Snippets ── */}
        <section className="flex flex-col gap-6 pb-20">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
            </div>
          ) : snippets.length > 0 ? (
            <motion.div
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
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </section>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
