import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useSnippets } from "../context/SnippetContext";
import SnippetCard from "../components/dashboard/SnippetCard";

const FavoritesPage = () => {
  const { snippets, loading, fetchFavoriteSnippets } = useSnippets();

  useEffect(() => {
    fetchFavoriteSnippets();
  }, [fetchFavoriteSnippets]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart size={28} className="text-red-500" fill="currentColor" />
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            My Favorites
          </h1>
          {!loading && snippets.length > 0 && (
            <span className="ml-2 px-3 py-1 rounded-full bg-red-50 text-red-500 text-sm font-bold border border-red-100">
              {snippets.length}
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
          </div>
        ) : snippets.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={48} className="text-red-200 mb-4" />
            <p className="text-gray-500 font-medium text-lg mb-2">
              No favorites yet
            </p>
            <p className="text-gray-400 text-sm max-w-md">
              Click the{" "}
              <Heart size={16} className="inline text-red-400" fill="currentColor" />{" "}
              heart on any snippet to save it here. Your favorites will sync across all devices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;