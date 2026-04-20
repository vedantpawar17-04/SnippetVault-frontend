import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnippets } from "../context/SnippetContext";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
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
  Share2,
  History,
} from "lucide-react";
import { motion } from "framer-motion";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ui/ConfirmModal";

const SnippetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { likeSnippet, toggleFavoriteSnippet } = useSnippets();
  const { pushToast } = useToast();

  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedSyntax, setCopiedSyntax] = useState(false);
  void motion;

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [restoreConfirm, setRestoreConfirm] = useState({ open: false, version: null });
  const [restoring, setRestoring] = useState(false);

  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [addingToCollection, setAddingToCollection] = useState(false);


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
        const token = localStorage.getItem("snippetvault_token");
        const { data } = await api.get(
          token ? `/snippets/${id}` : `/public/snippet/${id}`,
        );
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

  const handleShare = async () => {
    if (snippet?.status !== "public") {
      pushToast({ type: "error", message: "Make this snippet public to share" });
      return;
    }

    const url = `${window.location.origin}/snippet/${id}`;
    await navigator.clipboard.writeText(url);
    pushToast({ type: "success", message: "Share link copied" });
  };

  const openHistory = async () => {
    if (!user) {
      pushToast({ type: "error", message: "Login required" });
      return;
    }
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const { data } = await api.get(`/snippets/${id}/history`);
      setVersions(Array.isArray(data) ? data : []);
    } catch (err) {
      pushToast({
        type: "error",
        message: err.response?.data?.message || "Failed to load history",
      });
      setVersions([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const openCollections = async () => {
    if (!user) {
      pushToast({ type: "error", message: "Login required" });
      return;
    }
    setCollectionsOpen(true);
    setCollectionsLoading(true);
    try {
      const { data } = await api.get("/collections");
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      pushToast({
        type: "error",
        message: err.response?.data?.message || "Failed to load collections",
      });
      setCollections([]);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const createCollection = async () => {
    const trimmed = collectionName.trim();
    if (!trimmed) return;
    setCreatingCollection(true);
    try {
      const { data } = await api.post("/collections", { name: trimmed });
      setCollections((prev) => [data, ...prev]);
      setCollectionName("");
      pushToast({ type: "success", message: "Collection created" });
    } catch (err) {
      pushToast({
        type: "error",
        message: err.response?.data?.message || "Failed to create collection",
      });
    } finally {
      setCreatingCollection(false);
    }
  };

  const addToCollection = async (collectionId) => {
    setAddingToCollection(true);
    try {
      await api.post(`/collections/${collectionId}/add`, { snippetId: id });
      pushToast({ type: "success", message: "Saved to collection" });
      setCollectionsOpen(false);
    } catch (err) {
      pushToast({
        type: "error",
        message: err.response?.data?.message || "Failed to add to collection",
      });
    } finally {
      setAddingToCollection(false);
    }
  };

  const restoreVersion = async (versionId) => {
    setRestoring(true);
    try {
      await api.post(`/snippets/${id}/restore/${versionId}`);
      const { data } = await api.get(`/snippets/${id}`);
      setSnippet(data);
      pushToast({ type: "success", message: "Version restored" });
      setRestoreConfirm({ open: false, version: null });
    } catch (err) {
      pushToast({
        type: "error",
        message: err.response?.data?.message || "Failed to restore version",
      });
    } finally {
      setRestoring(false);
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
      <Modal
        open={historyOpen}
        title="Version History"
        onClose={() => setHistoryOpen(false)}
        maxWidthClassName="max-w-2xl"
      >
        {historyLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
          </div>
        ) : versions.length === 0 ? (
          <p className="text-sm font-semibold text-gray-500">No versions yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {versions.map((v) => (
              <div
                key={v._id}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-slate-50/40 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-gray-800 truncate">{v.title}</p>
                  <p className="text-xs font-semibold text-gray-500">
                    {v.language} • {new Date(v.updatedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setRestoreConfirm({ open: true, version: v })}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-extrabold hover:border-teal-200 hover:text-teal-700 transition-colors"
                  type="button"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        open={collectionsOpen}
        title="Save to Collection"
        onClose={() => setCollectionsOpen(false)}
        maxWidthClassName="max-w-2xl"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="New collection name"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500"
            />
            <button
              onClick={createCollection}
              disabled={creatingCollection}
              className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold shadow-lg shadow-teal-100 disabled:opacity-60"
              type="button"
            >
              {creatingCollection ? "Creating..." : "Create"}
            </button>
          </div>

          {collectionsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
            </div>
          ) : collections.length === 0 ? (
            <p className="text-sm font-semibold text-gray-500">
              No collections yet. Create one above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {collections.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-slate-50/40 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-gray-800 truncate">{c.name}</p>
                    <p className="text-xs font-semibold text-gray-500">
                      {c.snippets?.length || 0} snippets
                    </p>
                  </div>
                  <button
                    onClick={() => addToCollection(c._id)}
                    disabled={addingToCollection}
                    className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-extrabold hover:border-teal-200 hover:text-teal-700 transition-colors disabled:opacity-60"
                    type="button"
                  >
                    {addingToCollection ? "Saving..." : "Save"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={restoreConfirm.open}
        title="Restore version?"
        message="This will overwrite the current snippet content. A backup of the current version will be saved automatically."
        confirmText="Restore"
        cancelText="Cancel"
        confirmVariant="primary"
        loading={restoring}
        onClose={() => setRestoreConfirm({ open: false, version: null })}
        onConfirm={() => restoreVersion(restoreConfirm.version?._id)}
      />

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

          {Array.isArray(snippet.tags) && snippet.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {snippet.tags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/search?tags=${encodeURIComponent(tag)}`)}
                  className="text-xs font-extrabold text-gray-700 bg-white border border-gray-200 hover:border-teal-200 hover:text-teal-700 px-3 py-1.5 rounded-full transition-colors"
                  type="button"
                  title={`Search #${tag}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
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

            {user && (
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
            )}

            {user && (
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
            )}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={openCollections}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-teal-200 hover:text-teal-700 font-extrabold text-sm transition-colors"
                type="button"
              >
                Save
              </button>
            )}
            {isOwner && (
              <button
                onClick={openHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-teal-200 hover:text-teal-700 font-extrabold text-sm transition-colors"
                type="button"
              >
                <History size={18} />
                History
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-teal-200 hover:text-teal-700 font-extrabold text-sm transition-colors"
              type="button"
            >
              <Share2 size={18} />
              Share
            </button>

            <button className="flex items-center gap-2 text-gray-400 font-bold text-sm cursor-not-allowed">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SnippetDetailPage;
