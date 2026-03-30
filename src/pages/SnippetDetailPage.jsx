import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnippets } from "../context/SnippetContext";
import api from "../services/api";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Edit,
  Download,
  Copy,
  ThumbsUp,
  ChevronLeft,
  Heart,
  Terminal,
} from "lucide-react";
import { motion } from "framer-motion";

const SnippetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { likeSnippet, toggleFavoriteSnippet } = useSnippets();

  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedSyntax, setCopiedSyntax] = useState(false);

  // Language Normalizer
  const getLanguage = (lang) => {
    if (!lang) return "javascript";

    const map = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      "c++": "cpp",
      c: "c",
      html: "html",
      css: "css",
      json: "json",
    };

    return map[lang.toLowerCase()] || lang.toLowerCase();
  };

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const { data } = await api.get(`/snippets/${id}`);
        setSnippet(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load snippet");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id]);

  const handleLike = async () => {
    const result = await likeSnippet(id);
    if (result?.success) {
      setSnippet((prev) => ({ ...prev, likes: result.likes }));
    }
  };

  const handleFavorite = async () => {
    const result = await toggleFavoriteSnippet(id);
    if (result?.success) {
      setSnippet((prev) => ({ ...prev, isFavorite: result.isFavorite }));
    }
  };

  const handleCopy = async (text, type) => {
    await navigator.clipboard.writeText(text);

    if (type === "main") {
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 1500);
    }

    if (type === "syntax") {
      setCopiedSyntax(true);
      setTimeout(() => setCopiedSyntax(false), 1500);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f5f6f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error || !snippet)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-[#f5f6f8]">
        <p className="text-red-500 font-bold">
          {error || "Snippet not found"}
        </p>
        <button
          onClick={() => navigate("/search")}
          className="text-blue-600 underline"
        >
          Back to Search
        </button>
      </div>
    );

  const isOwner = user?._id === (snippet.user?._id || snippet.user);

  return (
    <div className="min-h-screen bg-[#f5f6f8]">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Search
        </button>

        <div className="hidden md:flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            {snippet.user?.username?.charAt(0) || "U"}
          </div>
          <span className="text-gray-700 font-semibold text-sm">
            {snippet.user?.username || "Unknown"}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24 flex flex-col gap-14">

        {/* Title */}
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">
            {snippet.title}
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed font-medium">
            {snippet.description || "No description provided."}
          </p>
        </div>

        {/* MAIN CODE EDITOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden shadow-2xl bg-[#1e1e1e] border border-gray-800"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-[#252526] border-b border-[#3c3c3c]">

            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
            </div>

            <div className="text-gray-400 text-sm font-mono bg-[#1e1e1e] px-3 py-1 rounded-md border border-[#3c3c3c]">
              snippet.{getLanguage(snippet.language)}
            </div>

            <button
              onClick={() => handleCopy(snippet.code, "main")}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <Copy size={16} />
              <span className="text-xs">
                {copiedMain ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>

          <div className="max-h-[600px] overflow-auto">
            <SyntaxHighlighter
              language={getLanguage(snippet.language)}
              style={vscDarkPlus}
              showLineNumbers
              customStyle={{
                margin: 0,
                padding: "24px",
                fontSize: "14px",
                backgroundColor: "transparent",
              }}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
        </motion.div>

        {/* SYNTAX / USAGE EDITOR */}
        {snippet.syntaxCode?.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden shadow-2xl bg-[#1e1e1e] border border-gray-800"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-[#252526] border-b border-[#3c3c3c]">

              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm font-mono bg-[#1e1e1e] px-3 py-1 rounded-md border border-[#3c3c3c]">
                <Terminal size={14} />
                usage.{getLanguage(snippet.language)}
              </div>

              <button
                onClick={() => handleCopy(snippet.syntaxCode, "syntax")}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <Copy size={16} />
                <span className="text-xs">
                  {copiedSyntax ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>

            <div className="max-h-[400px] overflow-auto">
              <SyntaxHighlighter
                language={getLanguage(snippet.language)}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: "24px",
                  fontSize: "14px",
                  backgroundColor: "transparent",
                }}
              >
                {snippet.syntaxCode}
              </SyntaxHighlighter>
            </div>
          </motion.div>
        )}

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-5 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap items-center gap-6">

            {isOwner && (
              <button
                onClick={() => navigate(`/edit-snippet/${id}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold text-sm"
              >
                <Edit size={18} />
                Edit Snippet
              </button>
            )}

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 font-bold text-sm ${
                snippet.isFavorite
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart
                size={18}
                fill={snippet.isFavorite ? "currentColor" : "none"}
              />
              {snippet.isFavorite ? "Saved" : "Favorite"}
            </button>

            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <button
                onClick={handleLike}
                className="text-gray-500 hover:text-teal-500"
              >
                <ThumbsUp size={16} />
              </button>
              <span className="text-sm font-bold text-gray-700">
                {snippet.likes}
              </span>
            </div>
          </div>

          <button className="flex items-center gap-2 text-gray-400 font-bold text-sm cursor-not-allowed">
            <Download size={18} />
            Export
          </button>
        </div>
      </main>
    </div>
  );
};

export default SnippetDetailPage;