import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Grid,
  Layout,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExploreSnippetCard from "../components/explore/ExploreSnippetCard";
import api from "../services/api";

const SnippetSearchPage = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Code Snippets");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const { data } = await api.get("/snippets");
        setSnippets(data);
      } catch (error) {
        console.error("Error fetching snippets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

  // Filter snippets based on search query and public status
  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      // Only show public snippets
      if (snippet.status !== "public") return false;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        snippet.title.toLowerCase().includes(searchLower) ||
        (snippet.description &&
          snippet.description.toLowerCase().includes(searchLower)) ||
        snippet.language.toLowerCase().includes(searchLower)
      );
    });
  }, [snippets, searchQuery]);

  // Handle pagination calculation
  const totalPages = Math.ceil(filteredSnippets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSnippets = filteredSnippets.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on change
  };

  const handleReset = () => {
    setSearchQuery("");
    setItemsPerPage(5);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden bg-gradient-to-b from-teal-50/50 to-transparent">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight"
          >
            Snippet Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 font-medium"
          >
            Find ready-to-use snippets in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl mt-4 relative group"
          >
            <input
              type="text"
              placeholder="Search for a Snippet..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-6 pr-16 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-gray-700 font-medium"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors shadow-md shadow-teal-100">
              <Search size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 border-b border-gray-100 flex justify-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex gap-12">
          {["Code Snippets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-5 text-sm font-bold tracking-wide transition-all relative ${
                activeTab === tab
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layout size={18} />
                {tab}
              </div>
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Results */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-bold transition-colors"
            >
              Reset
            </button>
            <div className="relative group">
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 appearance-none focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={20}>20 per page</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              paginatedSnippets.map((snippet, index) => (
                <ExploreSnippetCard
                  key={snippet._id}
                  snippet={snippet}
                  index={index}
                />
              ))
            )}
          </AnimatePresence>
          {!loading && paginatedSnippets.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-medium">
                No snippets found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all ${
                  currentPage === 1
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-600 border-gray-200 hover:border-teal-500 hover:text-teal-600 bg-white"
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      currentPage === i + 1
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-100"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-all ${
                  currentPage === totalPages
                    ? "text-gray-300 border-gray-100 cursor-not-allowed"
                    : "text-gray-600 border-gray-200 hover:border-teal-500 hover:text-teal-600 bg-white"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default SnippetSearchPage;
